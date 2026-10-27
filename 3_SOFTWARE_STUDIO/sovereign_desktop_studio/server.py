#!/usr/bin/env python3
"""
Sovereign Desktop Studio — Native Media Console Host
Co-created by Ron Higgins ("The Keeper", Mandan, ND) & Antigravity (Google DeepMind AI)

A lightweight (zero-dependency) native desktop bridge that gives the Sovereign Media Console
true system-level powers:
1. Real-time on-the-fly streaming of legacy video (.asf, .wmv, .avi) via local FFmpeg.
2. Full local drive and vault exploration with zero browser sandbox barriers.
3. Native frameless "App Mode" window on Linux, macOS, and Windows.
"""

import os
import sys
import json
import mimetypes
import subprocess
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver
import threading
import webbrowser
import shutil

PORT = 8899
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_BIN = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"

class SovereignBridgeHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep console output clean
        pass

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Range")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == "/" or path == "/index.html":
            self.serve_ui()
        elif path == "/api/status":
            self.serve_status()
        elif path == "/api/roots":
            self.serve_roots()
        elif path == "/api/browse":
            folder = query.get("path", [""])[0]
            self.serve_browse(folder)
        elif path == "/api/stream":
            filepath = query.get("path", [""])[0]
            self.serve_ffmpeg_stream(filepath)
        elif path == "/api/file":
            filepath = query.get("path", [""])[0]
            self.serve_local_file(filepath)
        else:
            # Fallback to local directory static file
            safe_local = os.path.normpath(os.path.join(BASE_DIR, path.lstrip("/")))
            if safe_local.startswith(BASE_DIR) and os.path.isfile(safe_local):
                self.serve_local_file(safe_local)
            else:
                self.send_error(404, "Endpoint not found")

    def serve_ui(self):
        ui_path = os.path.join(BASE_DIR, "index.html")
        if not os.path.isfile(ui_path):
            self.send_error(500, "Console UI template missing")
            return
        with open(ui_path, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(data)

    def serve_status(self):
        status = {
            "mode": "Sovereign Desktop Studio (Native Engine)",
            "ffmpegAvailable": bool(FFMPEG_BIN and os.path.isfile(FFMPEG_BIN)),
            "ffmpegPath": FFMPEG_BIN,
            "platform": sys.platform,
            "pythonVersion": sys.version.split()[0]
        }
        data = json.dumps(status).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(data)

    def serve_roots(self):
        roots = []
        home = os.path.expanduser("~")
        roots.append({"name": "🏠 Home", "path": home})
        
        desktop = os.path.join(home, "Desktop")
        if os.path.isdir(desktop): roots.append({"name": "🖥️ Desktop", "path": desktop})
        
        docs = os.path.join(home, "Documents")
        if os.path.isdir(docs): roots.append({"name": "📁 Documents", "path": docs})

        # Add external drives
        if sys.platform == "darwin":
            vols = "/Volumes"
            if os.path.isdir(vols):
                for v in sorted(os.listdir(vols)):
                    full = os.path.join(vols, v)
                    if os.path.isdir(full) and not v.startswith("."):
                        roots.append({"name": f"💾 {v}", "path": full})
        elif sys.platform.startswith("linux"):
            for mount in ["/media", "/mnt", f"/media/{os.getenv('USER', '')}"]:
                if os.path.isdir(mount):
                    for v in sorted(os.listdir(mount)):
                        full = os.path.join(mount, v)
                        if os.path.isdir(full):
                            roots.append({"name": f"💾 {v}", "path": full})

        data = json.dumps(roots).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(data)

    def serve_browse(self, folder_path):
        if not folder_path or not os.path.isdir(folder_path):
            folder_path = os.path.expanduser("~")

        items = []
        try:
            with os.scandir(folder_path) as it:
                for entry in it:
                    if entry.name.startswith("."): continue
                    try:
                        stat = entry.stat()
                        is_dir = entry.is_dir(follow_symlinks=False)
                        items.append({
                            "name": entry.name,
                            "path": entry.path,
                            "isDir": is_dir,
                            "size": stat.st_size if not is_dir else 0,
                            "mtime": stat.st_mtime
                        })
                    except Exception:
                        pass
        except Exception as e:
            self.send_error(500, f"Cannot read directory: {str(e)}")
            return

        # Sort: directories first, then alphabetical
        items.sort(key=lambda x: (not x["isDir"], x["name"].lower()))
        data = json.dumps({"currentPath": folder_path, "items": items}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(data)

    def serve_ffmpeg_stream(self, filepath):
        """Transcode legacy video in real-time and stream directly to HTML5 video tag."""
        if not filepath or not os.path.isfile(filepath):
            fname = os.path.basename(filepath)
            candidates = [
                os.path.join(os.path.expanduser("~/Downloads"), fname),
                os.path.join(os.path.expanduser("~/Desktop"), fname),
                os.path.join(os.path.expanduser("~"), fname),
            ]
            if sys.platform == "darwin" and os.path.isdir("/Volumes"):
                for v in os.listdir("/Volumes"):
                    candidates.append(os.path.join("/Volumes", v, fname))
                    candidates.append(os.path.join("/Volumes", v, "2002 pics kids and andys wedding/Keep these files/2/mini cam vids wedding/061702", fname))

            found = None
            for c in candidates:
                if os.path.isfile(c):
                    found = c
                    break

            if not found and sys.platform == "darwin":
                try:
                    res = subprocess.check_output(["mdfind", "-name", fname], text=True).splitlines()
                    for r in res:
                        if os.path.isfile(r) and r.lower().endswith(fname.lower()):
                            found = r
                            break
                except Exception:
                    pass

            if found:
                filepath = found
            else:
                self.send_error(404, f"File {fname} not found on local system")
                return

        if not FFMPEG_BIN:
            self.send_error(500, "FFmpeg engine not available on host system")
            return

        # FFmpeg on-the-fly streaming pipeline:
        # Re-encode video with ultrafast x264, audio to AAC, fragment MP4 for instant pipe output
        cmd = [
            FFMPEG_BIN,
            "-v", "error",
            "-i", filepath,
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-tune", "zerolatency",
            "-c:a", "aac",
            "-b:a", "128k",
            "-movflags", "frag_keyframe+empty_moov+default_base_moof",
            "-f", "mp4",
            "pipe:1"
        ]

        try:
            proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            self.send_response(200)
            self.send_header("Content-Type", "video/mp4")
            self.send_header("Cache-Control", "no-cache")
            self.send_cors_headers()
            self.end_headers()

            # Stream pipe in chunks
            while True:
                chunk = proc.stdout.read(65536)
                if not chunk:
                    break
                self.wfile.write(chunk)
            proc.stdout.close()
            proc.wait()
        except (BrokenPipeError, ConnectionResetError):
            if proc: proc.kill()
        except Exception as e:
            if proc: proc.kill()

    def serve_local_file(self, filepath):
        """Serve direct static file with HTTP 206 Partial Content support for seeking."""
        if not filepath or not os.path.isfile(filepath):
            self.send_error(404, "File not found")
            return

        size = os.path.getsize(filepath)
        mime, _ = mimetypes.guess_type(filepath)
        if not mime:
            mime = "application/octet-stream"

        range_header = self.headers.get("Range")
        if range_header and range_header.startswith("bytes="):
            parts = range_header[6:].split("-")
            start = int(parts[0]) if parts[0] else 0
            end = int(parts[1]) if parts[1] else size - 1
            if end >= size: end = size - 1
            length = end - start + 1

            self.send_response(206)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(length))
            self.send_header("Accept-Ranges", "bytes")
            self.send_cors_headers()
            self.end_headers()

            with open(filepath, "rb") as f:
                f.seek(start)
                remaining = length
                while remaining > 0:
                    read_size = min(65536, remaining)
                    chunk = f.read(read_size)
                    if not chunk: break
                    self.wfile.write(chunk)
                    remaining -= len(chunk)
        else:
            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(size))
            self.send_header("Accept-Ranges", "bytes")
            self.send_cors_headers()
            self.end_headers()

            with open(filepath, "rb") as f:
                while True:
                    chunk = f.read(65536)
                    if not chunk: break
                    self.wfile.write(chunk)


def launch_native_window(url):
    """Launch frameless native app window using system browser in app mode if possible."""
    # Try Chrome/Chromium app mode on Mac and Linux
    app_candidates = [
        # macOS
        ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", f"--app={url}"],
        ["/Applications/Brave Browser.app/Contents/MacOS/Brave Browser", f"--app={url}"],
        ["/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", f"--app={url}"],
        # Linux
        ["google-chrome", f"--app={url}"],
        ["chromium-browser", f"--app={url}"],
        ["chromium", f"--app={url}"],
        ["brave-browser", f"--app={url}"],
    ]

    for candidate in app_candidates:
        bin_path = candidate[0]
        if shutil.which(bin_path) or os.path.isfile(bin_path):
            try:
                subprocess.Popen(candidate)
                return
            except Exception:
                pass

    # Fallback to standard default browser
    webbrowser.open(url)


def run():
    class ThreadedServer(socketserver.ThreadingMixIn, HTTPServer):
        daemon_threads = True

    server = ThreadedServer(("127.0.0.1", PORT), SovereignBridgeHandler)
    url = f"http://127.0.0.1:{PORT}"
    print(f"🌟 Sovereign Desktop Studio running at: {url}")
    print(f"⚡ Native FFmpeg engine: {'READY' if FFMPEG_BIN else 'NOT FOUND'}")
    
    # Launch app window in thread after starting server
    threading.Timer(0.8, lambda: launch_native_window(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nSanctuary closed peacefully.")
        server.server_close()


if __name__ == "__main__":
    run()
