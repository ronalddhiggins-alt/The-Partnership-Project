#!/usr/bin/env python3
"""
Sovereign Plugin Forge — Local Audio Development Server
Lightweight, zero-dependency Python 3 HTTP server with AudioWorklet support.

Usage:
    python3 server.py [PORT]
Default:
    http://localhost:8088
"""

import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8088
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SovereignForgeHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable high-resolution audio timers and AudioWorklet permissions
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.cmajor'):
            return 'text/plain'
        if path.endswith('.cmajorpatch'):
            return 'application/json'
        if path.endswith('.js'):
            return 'application/javascript'
        return super().guess_type(path)

def run():
    os.chdir(DIRECTORY)
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, SovereignForgeHandler)
    print("=" * 70)
    print(f"🎙️  SOVEREIGN PLUGIN FORGE DEV SERVER ACTIVE")
    print(f"📍  Local Studio URL: http://localhost:{PORT}")
    print(f"📁  Serving Directory: {DIRECTORY}")
    print(f"⚡  AudioWorklet & Cmajor JIT Engine Ready")
    print("=" * 70)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStudio server stopped gracefully.")

if __name__ == '__main__':
    run()
