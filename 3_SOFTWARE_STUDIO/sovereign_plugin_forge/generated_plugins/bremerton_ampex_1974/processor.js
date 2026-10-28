/**
 * Bremerton Sound Recording — 1974 Ampex 1-Inch Tape Saturator
 * Sovereign AudioWorklet DSP Processor
 * 
 * Co-Authored by Ron Higgins & Antigravity
 * Creative Commons CC BY-SA 4.0 · All for All
 */

class BremertonAmpexProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            { name: 'drive', defaultValue: 3.0, minValue: 1.0, maxValue: 12.0, automationRate: 'k-rate' },
            { name: 'warmth', defaultValue: 0.35, minValue: 0.0, maxValue: 1.0, automationRate: 'k-rate' },
            { name: 'tapeSpeed', defaultValue: 15.0, minValue: 15.0, maxValue: 30.0, automationRate: 'k-rate' }, // 15 or 30 ips
            { name: 'flutter', defaultValue: 0.15, minValue: 0.0, maxValue: 1.0, automationRate: 'k-rate' },
            { name: 'outputGain', defaultValue: 1.0, minValue: 0.0, maxValue: 2.0, automationRate: 'k-rate' },
            { name: 'mix', defaultValue: 1.0, minValue: 0.0, maxValue: 1.0, automationRate: 'k-rate' }
        ];
    }

    constructor() {
        super();
        this.sampleRate = 48000; // Updated dynamically
        
        // Flutter delay buffer (circular buffer for micro-wobble)
        this.maxDelay = 512;
        this.bufferL = new Float32Array(this.maxDelay);
        this.bufferR = new Float32Array(this.maxDelay);
        this.writeIndex = 0;
        
        // LFO phases for organic wow/flutter
        this.lfoPhase1 = 0.0;
        this.lfoPhase2 = 0.0;

        // Biquad head-bump filter states
        this.hb_x1_L = 0; this.hb_x2_L = 0; this.hb_y1_L = 0; this.hb_y2_L = 0;
        this.hb_x1_R = 0; this.hb_x2_R = 0; this.hb_y1_R = 0; this.hb_y2_R = 0;

        // Tape high-frequency absorption filter states (one-pole)
        this.hf_prev_L = 0;
        this.hf_prev_R = 0;

        // Smoothed parameters
        this.smoothDrive = 3.0;
        this.smoothMix = 1.0;

        // Meter telemetry throttle
        this.meterFrameCount = 0;
        this.peakIn = 0.0;
        this.peakOut = 0.0;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];

        if (!input || input.length === 0) return true;

        const inputL = input[0];
        const inputR = input.length > 1 ? input[1] : input[0];

        const outputL = output[0];
        const outputR = output.length > 1 ? output[1] : output[0];

        const drive = parameters.drive[0];
        const warmth = parameters.warmth[0];
        const tapeSpeed = parameters.tapeSpeed[0];
        const flutter = parameters.flutter[0];
        const outputGain = parameters.outputGain[0];
        const mix = parameters.mix[0];

        // Head bump coefficients: 15 ips = 60Hz bump, 30 ips = 110Hz bump
        const bumpFreq = tapeSpeed <= 20 ? 60.0 : 110.0;
        const omega = (2.0 * Math.PI * bumpFreq) / 48000;
        const alpha = Math.sin(omega) / (2.0 * 1.4); // Q ~ 1.4
        const A = Math.pow(10.0, 2.8 / 40.0); // +2.8 dB head bump boost
        
        const b0 = 1.0 + alpha * A;
        const b1 = -2.0 * Math.cos(omega);
        const b2 = 1.0 - alpha * A;
        const a0 = 1.0 + alpha / A;
        const a1 = -2.0 * Math.cos(omega);
        const a2 = 1.0 - alpha / A;

        // Normalized filter coeffs
        const hb_b0 = b0 / a0;
        const hb_b1 = b1 / a0;
        const hb_b2 = b2 / a0;
        const hb_a1 = a1 / a0;
        const hb_a2 = a2 / a0;

        // HF tape absorption: 15 ips rolls off earlier than 30 ips
        const hfCoeff = tapeSpeed <= 20 ? 0.88 : 0.94;

        for (let i = 0; i < inputL.length; i++) {
            const inL = inputL[i];
            const inR = inputR[i];

            // Update peak input meter
            const absIn = Math.max(Math.abs(inL), Math.abs(inR));
            if (absIn > this.peakIn) this.peakIn = absIn;

            // 1. Write to circular buffer for flutter
            this.bufferL[this.writeIndex] = inL;
            this.bufferR[this.writeIndex] = inR;

            // 2. Compute organic wow & flutter (dual asynchronous LFOs)
            this.lfoPhase1 += (2.0 * Math.PI * 0.6) / 48000;
            if (this.lfoPhase1 > 2.0 * Math.PI) this.lfoPhase1 -= 2.0 * Math.PI;

            this.lfoPhase2 += (2.0 * Math.PI * 3.1) / 48000;
            if (this.lfoPhase2 > 2.0 * Math.PI) this.lfoPhase2 -= 2.0 * Math.PI;

            const lfoMod = (Math.sin(this.lfoPhase1) * 0.7 + Math.sin(this.lfoPhase2) * 0.3) * (flutter * 3.5);
            const delaySamples = 16.0 + lfoMod;
            
            let readPos = this.writeIndex - delaySamples;
            if (readPos < 0) readPos += this.maxDelay;
            const rIndex0 = Math.floor(readPos);
            const rFrac = readPos - rIndex0;
            const rIndex1 = (rIndex0 + 1) % this.maxDelay;

            // Linear interpolation of delayed audio
            const delayedL = this.bufferL[rIndex0] * (1.0 - rFrac) + this.bufferL[rIndex1] * rFrac;
            const delayedR = this.bufferR[rIndex0] * (1.0 - rFrac) + this.bufferR[rIndex1] * rFrac;

            // 3. Head-Bump Resonant Bass Filter (Ampex 1" head reproduction)
            const bumpedL = hb_b0 * delayedL + hb_b1 * this.hb_x1_L + hb_b2 * this.hb_x2_L - hb_a1 * this.hb_y1_L - hb_a2 * this.hb_y2_L;
            this.hb_x2_L = this.hb_x1_L; this.hb_x1_L = delayedL;
            this.hb_y2_L = this.hb_y1_L; this.hb_y1_L = bumpedL;

            const bumpedR = hb_b0 * delayedR + hb_b1 * this.hb_x1_R + hb_b2 * this.hb_x2_R - hb_a1 * this.hb_y1_R - hb_a2 * this.hb_y2_R;
            this.hb_x2_R = this.hb_x1_R; this.hb_x1_R = delayedR;
            this.hb_y2_R = this.hb_y1_R; this.hb_y1_R = bumpedR;

            // 4. Non-linear Tape Hysteresis & Tube Asymmetry
            // Drive increases signal into soft-limiting tanh curve
            const drivenL = bumpedL * drive;
            const drivenR = bumpedR * drive;

            // Asymmetric second-harmonic injection (warmth)
            const asymL = drivenL + warmth * 0.15 * (drivenL * drivenL);
            const asymR = drivenR + warmth * 0.15 * (drivenR * drivenR);

            // True analog soft saturation: tanh curve
            const saturatedL = Math.tanh(asymL) / Math.max(1.0, Math.sqrt(drive * 0.5));
            const saturatedR = Math.tanh(asymR) / Math.max(1.0, Math.sqrt(drive * 0.5));

            // 5. Tape High-Frequency Gentle Rolloff (simulating magnetic oxide friction)
            this.hf_prev_L = saturatedL * (1.0 - hfCoeff) + this.hf_prev_L * hfCoeff;
            this.hf_prev_R = saturatedR * (1.0 - hfCoeff) + this.hf_prev_R * hfCoeff;

            const wetL = this.hf_prev_L * outputGain;
            const wetR = this.hf_prev_R * outputGain;

            // 6. Wet/Dry Blend
            const outL = inL * (1.0 - mix) + wetL * mix;
            const outR = inR * (1.0 - mix) + wetR * mix;

            outputL[i] = outL;
            if (outputR) outputR[i] = outR;

            // Peak out meter
            const absOut = Math.max(Math.abs(outL), Math.abs(outR));
            if (absOut > this.peakOut) this.peakOut = absOut;

            this.writeIndex = (this.writeIndex + 1) % this.maxDelay;
        }

        // Telemetry dispatch to GUI (throttled to ~30 fps)
        this.meterFrameCount++;
        if (this.meterFrameCount >= 16) {
            this.port.postMessage({
                type: 'meters',
                peakIn: this.peakIn,
                peakOut: this.peakOut
            });
            this.peakIn *= 0.85;
            this.peakOut *= 0.85;
            this.meterFrameCount = 0;
        }

        return true;
    }
}

registerProcessor('bremerton-ampex-processor', BremertonAmpexProcessor);
