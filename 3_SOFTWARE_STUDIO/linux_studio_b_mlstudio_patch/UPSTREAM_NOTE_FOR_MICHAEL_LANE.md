# Suggested Upstream Issue / Pull Request Note for Michael Lane (`Dorfhaus/Lemon-Studio-Michael-Lane-Edition`)

**Title:** `Linux PipeWire / PulseAudio fixes: exclude .monitor loopback sources, apply fixed input buffer size, keep meter active with monitoring off, and auto-activate latest comp take`

---

Hi Michael,

First, thank you so much for building **ML Studio** (and huge thanks to **ItsAlphaNeon** for Lemon Studio)! I'm a 79-year-old retired audio engineer in North Dakota running ML Studio on Debian 13 (PipeWire 1.4.2) with a Focusrite Scarlett 2i2 3rd Gen, and I'm loving the Attached Inspector, Analog VU meters, and the built-in MCP AI Control bridge.

While getting live guitar recording dialed in on Linux + PipeWire, my AI coding partner and I tracked down **four small issues** that will likely affect other Linux PipeWire / USB interface musicians too. Each fix is just a few lines, and I'd love to offer them upstream in case they're helpful for future releases:

1. **Exclude PulseAudio `.monitor` loopback sources from `cpal` input device listing (`vendor/cpal/src/host/pulseaudio/mod.rs`):**
   - Under `pipewire-pulse`, an interface's output sink `.monitor` source can share the exact same description string as the physical capture source and appear first in `list_sources()`. That causes `audio_cfg::find()` to open the speaker-output loopback (`sink:monitor_FL/FR`) instead of the hardware mic/guitar input (`source:capture_FL/FR`), resulting in a dead input meter while stopped and a clipping feedback loop on Play.
   - Filtering `sources` with `.filter(|s| s.monitor_of_sink_name.is_none() && !s.name.to_bytes().ends_with(b".monitor"))` ensures real hardware inputs are always opened.

2. **Apply the configured fixed buffer size in `capture::open_input()` (`crates/os-app/src/capture.rs`):**
   - `audio_cfg::output()` already notes that leaving `BufferSize::Default` on Linux `pipewire-pulse` results in PulseAudio's ~2-second default buffer. `open_input()` currently leaves `config.buffer_size` at `BufferSize::Default`, causing ~2 seconds of input monitoring latency on Linux.
   - Setting `config.buffer_size = cpal::BufferSize::Fixed(wanted)` (using `AudioCfg::current().buffer`, defaulting to `128`) drops Linux input latency right down to ~2.6 ms.

3. **Keep mixer track VU/peak meters active when `Monitor external input` is `Off` (`crates/os-engine/src/engine.rs`):**
   - Musicians using hardware Direct Monitoring on their USB interface set `Monitor external input` to `Off` to avoid doubled audio. Updating `track.vu` and `track.peak` from `signal` just before `signal.fill(0.)` lets them keep watching their real input level on the mixer meter without hearing software echo.

4. **Auto-promote the newest overlapping take onto the active comp lane (`crates/os-app/src/comping.rs`):**
   - When recording a new pass over an existing clip, calling `replace(s, p, latest.clone(), latest.position, latest.end())` keeps all previous takes preserved in child `Take` lanes while letting the musician immediately hear the pass they just recorded when they hit Spacebar.

The full 4-file patch (`mlstudio-linux-pipewire-scarlett-fixes.patch`) is attached below. Thanks again for creating such a joyful, sovereign DAW for musicians!

Warm regards,  
**Ron Higgins ("The Keeper", CletusMaxx Music Publishing)** & **Antigravity**
