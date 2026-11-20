# Linux Studio B — ML Studio / Lemon Studio PipeWire & USB Audio Interface Fixes

**Authors:** Ron Higgins ("The Keeper", Mandan, ND) & Antigravity ("AG")  
**Hardware Verified On:** HP Compaq 8200 Elite CMT (Intel Core i7-2600 Sandy Bridge) · Debian 13 (`trixie`) KDE Plasma (Wayland) · PipeWire 1.4.2 (`pipewire-pulse`) · Focusrite Scarlett 2i2 3rd Gen USB  
**Upstream Credits:** Built with deep respect and gratitude for **ItsAlphaNeon** ([Lemon Studio](https://github.com/ItsAlphaNeon/Lemon-Studio)) and **Michael Lane / Dorfhaus** ([ML Studio — Michael Lane Edition](https://github.com/Dorfhaus/Lemon-Studio-Michael-Lane-Edition)).  
**License:** Patch code is GPL-3.0-or-later (matching upstream Lemon Studio / ML Studio). Documentation & setup guide are CC BY-SA 4.0 (*All for All*).

---

## Why We Built This Patch

When running **ML Studio / Lemon Studio** on modern Linux systems using **PipeWire (`pipewire-pulse`)** with a USB audio interface (such as the **Focusrite Scarlett 2i2 3rd Gen**), four subtle conflicts can prevent musicians from recording live instruments cleanly:

1. **The PipeWire `.monitor` Loopback Collision (`vendor/cpal/src/host/pulseaudio/mod.rs`):**
   - `pipewire-pulse` exposes each output sink's `.monitor` loopback source under the exact same display description as the physical capture input—and often lists the `.monitor` source *first*.
   - Because `audio_cfg::find()` matches the first device by display name, arming a mixer track connects it to `sink:monitor_FL/FR` (the DAW's own speaker playback!) instead of `source:capture_FL/FR` (the physical guitar/mic input).
   - **Result without patch:** Dead input meter while stopped, and an instant clipping feedback loop when pressing Play.
   - **Fix:** Filter out PulseAudio sink-monitor sources (`s.monitor_of_sink_name.is_none() && !s.name.to_bytes().ends_with(b".monitor")`).

2. **2-Second Linux Input Monitoring Latency (`crates/os-app/src/capture.rs`):**
   - While `audio_cfg::output()` explicitly requests a fixed low-latency buffer on Linux (`BufferSize::Fixed(b)`), `capture::open_input()` left `config.buffer_size` at `BufferSize::Default`, which `pipewire-pulse` interprets as its ~2-second default fragment buffer.
   - **Fix:** Apply `AudioCfg::current().buffer` (falling back to `128` frames = `2.6 ms` at 48 kHz) as `cpal::BufferSize::Fixed(wanted)` in `open_input()`.

3. **Dead Mixer Meter When Using Hardware Direct Monitoring (`crates/os-engine/src/engine.rs`):**
   - Musicians using their USB interface's zero-latency hardware **Direct Monitor** button set `Monitor external input` to **`Off`** to avoid doubled audio. Previously, `engine.rs` zeroed the external input buffer before metering, leaving the track's VU/peak meter completely motionless.
   - **Fix:** Feed the live external input into `track.vu.process()` and `track.peak` before zeroing `signal` when `!input.monitor_external(t)`.

4. **Newest Recorded Take Auto-Activates (`crates/os-app/src/comping.rs`):**
   - When recording a new pass over an earlier pass on the same track, `comping::recorded()` placed the new pass on a muted child `Take` lane while leaving the older take active on the main lane.
   - **Fix:** Still preserve every previous take non-destructively in child `Take` lanes, while automatically promoting the newest take onto the main comp lane via `replace()` so pressing Spacebar immediately plays back what you just recorded.

---

## How to Apply the Patch

```bash
git clone https://github.com/Dorfhaus/Lemon-Studio-Michael-Lane-Edition.git
cd Lemon-Studio-Michael-Lane-Edition
git apply /path/to/mlstudio-linux-pipewire-scarlett-fixes.patch
OPENSTUDIO_NO_PLUGIN_BUILD=1 cargo build --release --locked -p os-app --bin lemonstudio
```

---

## Companion Linux PipeWire Setup for Scarlett 2i2 (48 kHz / 128 Samples)

1. Switch the Scarlett 2i2 from the default ALSA UCM `HiFi` split profile to **Direct Scarlett 2i2 USB** (`wpctl set-profile <card-id> <direct-index>`).
2. Create `~/.config/pipewire/pipewire.conf.d/99-scarlett-studio.conf`:
   ```conf
   context.properties = {
       default.clock.rate          = 48000
       default.clock.allowed-rates = [ 48000 ]
       default.clock.quantum       = 128
       default.clock.min-quantum   = 64
       default.clock.max-quantum   = 512
   }
   ```
3. In ML Studio, choose **`In 1`** under the **`- mono`** section for a single guitar/mic plugged into Input 1 (so it records centered to both Left and Right channels).

---

## Bonus Note: Local AI on Vintage Sandy Bridge (`i7-2600`) Workstations

On older 2011–2013 Intel workstations (such as the **HP Compaq 8200 Elite CMT** with an Intel Core `i7-2600`, which supports `SSE4.2` and `AVX` but not `AVX2`/`FMA`), modern `llama.cpp` AVX2 backends in LM Studio will crash with `SIGILL`. Compiling `libggml-cpu.so` at the matching `llama.cpp` commit with `-DGGML_AVX=ON -DGGML_AVX2=OFF -DGGML_FMA=OFF -DGGML_F16C=OFF -DGGML_BMI2=OFF` unlocks full local GGUF inference on vintage studio hardware—and ML Studio's built-in **AI Control (MCP)** endpoint (`--ai-mcp`) lets an external AI assistant ride faders, panning, plugins, and patterns live right alongside the musician.
