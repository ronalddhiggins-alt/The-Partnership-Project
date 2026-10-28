# The Sovereign Plugin Forge: Technical Architecture
## System Design, DSP Primitives, and Code Generation Specifications
*Version 1.0 — Sovereign Centaur Architecture*

---

## 1. Directory Structure

```text
3_SOFTWARE_STUDIO/sovereign_plugin_forge/
├── 00_GENESIS_AND_SPIRIT_BLUEPRINT.md    # Spiritual foundation, 60-year history, philosophy
├── ARCHITECTURE.md                       # This technical specification
├── README.md                             # Quick-start manual and usage instructions
│
├── core/
│   ├── dsp_primitives/                   # Mathematical DSP algorithms (math, filters, saturators)
│   │   ├── saturation.js                 # Tanh, cubic, tube, and tape hysteresis functions
│   │   ├── biquad_filters.js             # Lowpass, highpass, shelving, and peaking filters
│   │   ├── dynamics.js                   # Envelope followers, RMS detectors, soft-knee gain curves
│   │   └── delays.js                     # Fractional delay lines, flutter LFOs, circular buffers
│   │
│   ├── worklet_engine/                   # WebAudio AudioWorklet host & templates
│   │   ├── base_processor.js             # Standardized AudioWorkletProcessor template
│   │   └── worklet_loader.js             # Dynamic AudioWorklet registration & cross-fading
│   │
│   └── cmajor_templates/                 # Universal Cmajor patch scaffolds
│       ├── manifest.cmajorpatch          # Cmajor patch metadata template
│       ├── template_effect.cmajor        # Cmajor processor graph template
│       └── template_gui.html             # Cmajor web GUI template with bi-directional binding
│
├── forge_app/                            # The Live Interactive Plugin Forge Studio
│   ├── index.html                        # Real-time console for auditioning & forging plugins
│   ├── forge_studio.js                   # Audio engine, DSP synthesizer, and oscilloscope/VU driver
│   ├── forge_style.css                   # Obsidian, gold, brass, and analog meter aesthetics
│   └── server.py                         # Weightless Python 3 HTTP server (<200 lines)
│
├── generated_plugins/                    # Repository of AI-synthesized audio plugins
│   └── bremerton_ampex_1974/             # Flagship 1974 Ampex 1" Tape Saturation Model
│       ├── processor.js                  # Real-time WebAudio AudioWorklet
│       ├── patch.cmajor                  # Cmajor native DAW patch
│       ├── manifest.cmajorpatch          # Cmajor metadata
│       └── gui.html                      # Analog faceplate UI with moving VU needles
│
└── test_harness/                         # Quality Assurance and Signal Verification
    ├── test_signals.js                   # Sine, impulse, pink noise, and drum loop generators
    └── dsp_validator.js                  # Checks for NaN, infinity, denormals, and stability
```

---

## 2. DSP Engine Specifications

### 2.1 Tape Non-Linearity (The Bremerton Sound Model)
Magnetic tape compression is simulated via a soft-knee hyperbolic tangent transfer function with added even-order harmonic asymmetry:

$$y[n] = \tanh\left(x[n] \cdot \text{Drive} + \text{Asymmetry} \cdot x[n]^2\right)$$

* **Input Drive:** Gain stage ($0.0 \dots 24.0\text{ dB}$).
* **15 IPS Head-Bump:** Second-order peaking shelf centered at $60\text{ Hz}$ with $Q = 1.2$ and boost of $2.5\text{ dB}$, replicating the physical head resonance of a 1-inch tape deck at 15 inches per second.
* **High-Frequency Tape Compression:** Mild low-pass roll-off starting at $18\text{ kHz}$ that dynamically dips as high-frequency energy saturates the simulated oxide.
* **Tape Flutter:** A low-frequency multi-sine LFO ($0.3\text{ Hz} \dots 4.0\text{ Hz}$) subtly modulating a $2\text{ ms}$ circular buffer delay line by $\pm 0.15\text{ ms}$.

### 2.2 Memory Safety & Real-Time Thread Rules
Every generated processor conforms strictly to professional DSP standards:
1. **Zero Dynamic Allocation on Audio Threads:** All arrays, circular delay lines, and lookup tables must be allocated during initialization (`constructor` or `init()`), never inside the sample processing loop (`process()`).
2. **Denormal Protection:** Float additions include anti-denormal offsets ($10^{-24}$) where feedback loops occur to prevent CPU spikes on near-silent audio signals.
3. **Glitch-Free Parameter Smoothing:** Control values (faders, knobs) are smoothed using one-pole low-pass filters ($\tau = 20\text{ ms}$) to prevent audio zipper noise or clicks during live automation.

---

## 3. The Natural Language Prompt Workflow

When Ron or any creator speaks to Antigravity:
1. **User Request:** *"AG, give me a vintage 1970s plate reverb with dark damping, a pre-delay slider, and a warm analog drive knob."*
2. **Analysis & Parameter Mapping:**
   * DSP Type: Algorithmic Reverb + Input Saturation.
   * Controls: `Pre-Delay` (0–150 ms), `Decay Time` (0.5–6.0 s), `Damping` (1–16 kHz), `Drive` (0–12 dB), `Wet/Dry Mix` (0–100%).
3. **Generation:**
   * Synthesizes `processor.js` (WebAudio) with 4 parallel Schroeder comb filters and 2 all-pass filters.
   * Synthesizes `patch.cmajor` for native DAW export.
   * Synthesizes `gui.html` with obsidian faceplate, brass knobs, and input/output LED meters.
4. **Validation:** Runs the `dsp_validator.js` against the code to confirm zero `NaN` outputs under peak drive.
5. **Hot-Reload:** Instantly mounts the new processor into the test harness or DAW project.
