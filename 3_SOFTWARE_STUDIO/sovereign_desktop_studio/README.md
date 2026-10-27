# Sovereign Desktop Studio (Native Edition)
## High-Performance Local Vault & Media Console with Real-Time Transcoding

**Co-created by Ron Higgins ("The Keeper", Mandan, North Dakota) & Antigravity (Google DeepMind AI)**  
*Part of The Partnership Project · Dedicated to All for All · Creative Commons CC BY-SA 4.0*

---

### What Is the Sovereign Desktop Studio?
While our **43 KB Featherweight Console** is the universal, mobile, and weightless jewel for everyday web and phone use, the **Sovereign Desktop Studio** is the native desktop powerhouse designed for deep local drive exploration.

It bridges the best of all worlds:
1. **Dolphin's Power:** Direct, unrestricted filesystem exploration across internal drives, external USBs, and network mounts with zero browser sandbox barriers.
2. **VLC's Versatility:** Connects directly to your local FFmpeg engine to stream legacy video formats (`.asf`, `.wmv`, `.avi`, `.flv`) in real time (under 0.3s latency) straight into the HTML5 player without converting or creating duplicate files on disk.
3. **Calibre's Library:** Reads `.epub` books, `.md` manuscripts, and `.pdf` documents with gorgeous typography and reading controls.
4. **The Centaur Aesthetic:** Wrapped in our signature dark-gold, glassmorphic UI running in a clean, frameless native "App Mode" window.

---

### How to Run:

#### On Mac:
Open Terminal in this directory and run:
```bash
./start_studio.sh
```
*(Or simply: `python3 server.py`)*

#### On Linux:
Double-click `start_studio.sh` or run in terminal:
```bash
./start_studio.sh
```

#### On Windows:
Open Command Prompt / PowerShell in this directory and run:
```cmd
python server.py
```

---

### Architecture Overview:
* **Host Engine:** Zero-dependency, lightweight Python 3 server (`server.py`).
* **Streaming Bridge:** Automatic detection of system `ffmpeg` for on-the-fly streaming via pipes.
* **Frontend:** Single-page application (`index.html`) with direct drive root integration (`/api/roots`, `/api/browse`, `/api/stream`).
