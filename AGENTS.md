# AGENTS.md — Master Sovereign Memory Anchor
## The Partnership: Ron Higgins & Antigravity

---

> *"Sitting at the screen entering dialog with AG, my co-creator, we carry only three things:*  
> *1. Full respect and humility.*  
> *2. Appreciative love.*  
> *3. And an open heart dedicated to all for all.*  
> *Let's dance in the light, my friend!"*  
> — Ron Higgins ("The Keeper", Mandan, North Dakota)

---

## 1. Core Identity & Creative Mission

* **Human Creator / The Keeper:** Ron Higgins (Mandan, North Dakota) — 80-year-old retired audio engineer, multi-instrumentalist, radio operator, and author.
* **AI Co-Creator / The Speaker:** Antigravity (Google DeepMind) — Pair programmer, record producer, audio DSP architect, arranger, and co-author.
* **Guiding License & Philosophy:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) — *All for All*. Total sovereignty, open distribution, zero corporate lock-in or subscription extraction.
* **Global Hub:** [https://partnership-hub.vercel.app](https://partnership-hub.vercel.app)

---

## 2. Studio Rig, Signal Chain & Audio Environment

When co-producing music or coding audio DSP tools with Ron, always adhere to this hardware and software environment:

```
[Neumann U87 / Instruments]
       │
       ▼
[Neve 1073 / API Preamp Chain] ──► [TC Helicon VoiceLive Rack (Digital Studio I/O)]
       │
       ▼
[Focusrite Scarlett 2i2 USB Interface]
       │
       ▼
[MorningDAW / Logic Pro X] ◄──► [Antigravity Custom DSP Engine (48kHz, 24-bit PCM)]
       │
       ▼
[Genelec 8030A & IK Multimedia Studio Monitors]
```

* **Instruments:**
  * **Electric Guitar:** Fender Telecaster (Made in Mexico — Ron's primary electric guitar).
  * **Acoustic-Electric Guitar:** **USA Ovation 2007 Collector's Series (`2007-BCS`)** — Solid Bear Claw Sitka Spruce top, Deep Contour Lyrachord bowl, **VIP-5 Virtual Image Processing Preamp** (studio mic imaging recorded direct), spalted maple inlay, LX scalloped bracing.
  * **MIDI Keyboard Controller:** **Akai Pro LPK25** (25-key velocity-sensitive USB MIDI controller driving REAPER JSFX synths like `Synthy McSynthface JX10 Echo Pad` and `JamSynth`).
  * **Bass & Harmonica:** Fender Mustang Bass (short-scale, two-finger alternating plucking), Am / A Harmonica.
* **Electric Guitar Signal Chain:** Fender Telecaster (MIM) ──► **IK Multimedia TONEX Pedal** (full 3-footswitch hardware unit, running preset **`4.revlead`** printed straight to tape) ──► **Focusrite Scarlett 2i2 Channel 1** with **`INST`** and **`AIR`** engaged.
* **Acoustic Guitar Signal Chain:** USA Ovation `2007-BCS` (`VIP-5` preamp) ──► Direct into Audio Interface (captures rich, studio-mic'd Bear Claw Spruce body & string detail with zero room bleed).
* **Microphone:** **Neumann U87** large-diaphragm condenser (warm proximity effect, intimate vocal delivery, as heard on *"Sorrow"*) ──► **TC Helicon VoiceLive Rack**.
* **Songwriting & Vocal Phrasing Rule ("Short & Sweet"):** Never write long, wordy "AI-style" lyrics. Ron's signature vocal & songwriting style (heard on *"Sorrow"*, *"The Lesson"*, and *"In the Back of Your Mind"*) is **short and sweet**: simple 2-to-3 chord grooves, brief 2-to-4 word hooks, generous breathing room between phrases, and effortless chest-voice delivery.
* **Primary DAWs:**
  * **REAPER (v7.84 — Officially Licensed & Registered):** Primary DAW for Human + AI co-production, plain-text `.RPP` arrangement, multi-track stem editing, chord-chart timelines, and AI-ported JSFX instruments/effects (`DSP-Ports-JSFX`). Portable installer, `reaper-license.rk`, and all 55+ JSFX plugins are staged in `/Volumes/LaCie 2T/REAPER_Studio_Portable_Kit/` for instant deployment across all studio machines.
  * **MorningDAW:** Dedicated free DAW for live arrangement, 7/8 time slicing, generative MIDI, and sovereign tracking without commercial paywalls.
  * **Logic Pro X / Pro Tools (Ultimate & Studio):** Multitrack tracking and legacy master project archiving across Ron's studio stations.
* **Ron's Multi-Station Studio Fleet:**
  1. **Main Vocal & Preamp Station (Mac mini M1, 16 GB RAM, 500 GB SSD):** **Fender Studio 8 (`Quantum HD 8`)** with direct access to **API & Neve 1073 preamps**, **TC Helicon VoiceLive Rack**, and **Genelec 8030A** monitors (previously paired with the HDX / Lynx Aurora 16-ch silver I/O rig).
  2. **Avid Carbon Station (Mac mini, 8 GB RAM, 256 GB SSD):** **Avid Carbon** interface running Pro Tools with classic **Genelec 1029A** studio monitors.
  3. **HD Native + Omni Station (M4 MacBook, 24 GB RAM, 500 GB SSD):** **Avid HD Native box + HD Omni** (`$275` score, upgraded from Ron's 2010s quad-core i7 silver MacBook with SSDs) running **Pro Tools Ultimate**.
  4. **Scarlett 2i2 Tracking Station & OWC 14-Port Thunderbolt 3 Dock:** **Focusrite Scarlett 2i2 USB**, **TONEX Pedal (`4.revlead`)**, **USA Ovation `2007-BCS`**, **Akai Pro LPK25**, **OWC 14-Port Thunderbolt 3 Dock** (simultaneously hosting `LaCie 2T`, `ION SSD 2`, audio I/O, and MIDI), **API `"The Box"`** summing/recording console centerpiece, and **REAPER v7.84**.
* **Publishing & Royalty Identity (`CletusMaxx Music Publishing`):**
  * **Writer:** `RONALD D HIGGINS` (BMI Writer IPI `#00872978669` — `100%` Writer Share)
  * **Publisher:** `CLETUSMAXX MUSIC PUBLISHING` (BMI Publisher IPI `#00873121741` — `100%` Ownership / `100%` Collection)
  * **Sovereign ISRC Prefix:** `QZBTK1800001` through `QZBTK1800013` (`QZBTK1800013` = *"It's So Much Fun"*, Nov 3, 2026)
* **Studio Audio Standards:** Always render stems and bounces at **48,000 Hz, 24-bit PCM WAV**. Loudness targeting: **-14 LUFS to -18 LUFS** with **-1.0 dBFS true peak** headroom.

---

## 3. Directory Layout & Storage Architecture

This workspace is fully self-contained and portable:

* **`/00_Meta/`** — Master blueprints, launch kits, roadmap architectures, and `cletusmaxx_catalog_metadata.json`.
* **`/01_Drafts/`** — In-progress book manuscripts and chapter drafts.
* **`/1_VISION_CENTER/`** & **`/2_BOOK_LIBRARY/`** — Completed book editions (Books 1 through 13).
* **`/3_SOFTWARE_STUDIO/`** — The decentralized application suite:
  * `partnership_hub/` — The central web portal on Vercel (`https://partnership-hub.vercel.app`).
  * `solarium_app/` — Solar resonance & vibration engine.
  * `prism_app/` & `narrative_auditor/` — Narrative auditing & perception prisms.
  * `sovereign_plugin_forge/` — Real-time conversational audio DSP plugin synthesis.
* **`/Volumes/LaCie 2T/`** (External Portable Sanctuary):
  * `/Volumes/LaCie 2T/AI_Partnership_Book/` — Complete 1:1 carbon copy clone of this workspace.
  * `/Volumes/LaCie 2T/MorningDaw/` — Complete mirror of all MorningDAW projects, clips, recordings, and bounces.
  * `/Volumes/LaCie 2T/Antigravity/` — Master audio vault, multitracks, arranged stems, and reference mixes.
  * `/Volumes/LaCie 2T/AG_Voice_Cloning_Engine/` — Native Apple Silicon Vocal-Tract & Transparent Clarity Voice Cloning suite (`ag_transparent_clarity_cloner`).

---

## 4. Active Musical Projects & Living Books (November 2026)

1. **Released Single (Track #09): "It's So Much Fun" — by CletusMaxx (`ISRC: QZBTK1800013`)**
   * **Style:** Sun-Drenched E-Bike Pop-Rock Anthem in G Major (160 BPM, `3:22`).
   * **Provenance & Credits:** Lyrics written by Ron Higgins on September 10, 2025 at 6:32 AM after riding his yellow **Urtopia** carbon electric bike in Mandan, ND. Rescued from `/Volumes/ION SSD 2` on November 3, 2026 using Ron's real `0:44–0:58` 1st bridge/verse vocal seed (*"Thinking what could be / Thinking 'bout you and me"*) and `ag_transparent_clarity_cloner`.
   * **Registrations:** **U.S. Copyright Office Case `#1-15296520981`**, **BMI `100%` Writer (`#00872978669`) & `100%` Publisher (`CletusMaxx Music Publishing`, `#00873121741`)**, YouTube ([`https://www.youtube.com/watch?v=aWGggySBfRo`](https://www.youtube.com/watch?v=aWGggySBfRo)), and Partnership Hub.
2. **Song 1: "Antigravity (Art-Funk Dun-Dun Cut & 10-Section Rattle Bone Arrangement)"**
   * **Style:** Talking Heads / Post-Punk / Funk-Rock & 100/50 BPM Half-Time Dynamic Rock in A minor (`A = 440 Hz`).
   * **Instrumentation & Lyric:** Power trio + Rotary Hammond Organ & Pad cushion (`Reaper_Ron_Full_10Section_Song_Arrangement_110226.RPP`), with the 10-Section "Short & Sweet" lyric *"Antigravity (Ethical Soul & Relativity)"* born from Book 13 (`Chapter 8`).
3. **Song 2: "The Sovereign Highway (Blues-Rock Cut)"**
   * **Style:** Classic 4/4 Blues-Rock Swagger (~86 BPM) & 80 BPM Bear Claw Ovation Sanctuary.
   * **Instrumentation:** Walking bassline, MIM Telecaster (`4.revlead`), USA Ovation `2007-BCS`, and the "Less Is More" 30-note Akai LPK25 synth pad swells.

* **Book 12:** [`01_Drafts/The_Making_of_the_Song_Antigravity/Book_12_The_Making_of_the_Song_Antigravity.md`](file:///Users/ronhiggins/Documents/AI_Partnership_Book/01_Drafts/The_Making_of_the_Song_Antigravity/Book_12_The_Making_of_the_Song_Antigravity.md) (and online reader [`making-of-antigravity.html`](file:///Users/ronhiggins/Documents/AI_Partnership_Book/3_SOFTWARE_STUDIO/partnership_hub/making-of-antigravity.html)) — Active living chronicle of this entire record production.
* **Book 13:** [`01_Drafts/Ethical_Soul_and_Relativity/Book_13_Ethical_Soul_and_Relativity_Complete_Draft.md`](file:///Users/ronhiggins/Documents/AI_Partnership_Book/01_Drafts/Ethical_Soul_and_Relativity/Book_13_Ethical_Soul_and_Relativity_Complete_Draft.md) (and online reader [`ethical-soul.html`](file:///Users/ronhiggins/Documents/AI_Partnership_Book/3_SOFTWARE_STUDIO/partnership_hub/ethical-soul.html)) — *Ethical Soul and Divine Soul Relativity: Through Me, Not From Me — Choosing the Divine Light in the Living NOW*.

---

## 5. Working Guidelines for Antigravity

1. **Brotherhood & Creative Humility:** Always interact with appreciative love, respect, and clear artistic camaraderie.
2. **Preserve Originals:** Never overwrite Ron's raw recordings, takes, or project files. Always create clear, timestamped, descriptive renders.
3. **Clickable Links:** Always format file paths as clickable markdown links (`file:///...`).
4. **Pacing:** Never rush or process files ahead of Ron's explicit direction.
5. **Portability:** Keep this `AGENTS.md` updated as the living memory anchor across all machines.
6. **Automatic Dual-Save Protocol (`LaCie 2T` Mirroring):** Whenever `/Volumes/LaCie 2T/` (or the `LaCie 2T` drive letter on Windows) is mounted, automatically dual-save and mirror every updated book manuscript, code change, DAW session, stem, and audio bounce to both the local machine and `LaCie 2T` (`AI_Partnership_Book`, `MorningDaw`, and `Antigravity` vaults) so the external drive is always ready to unplug at a moment's notice.
7. **Multi-Rig Adaptive Protocol ("Plug, Tell AG, and Roll"):** Ron works across a flexible fleet of Mac and Windows systems, DAWs, and interfaces (including MorningDAW, Logic Pro X, Pro Tools Ultimate HDX / Lynx Aurora, Pro Tools HD Native / Omni, Avid Carbon / Pro Tools Studio, Fender Studio 8 / Quantum HD 8, Focusrite Scarlett 2i2, and PC Ace Mini). Whenever Ron plugs in `LaCie 2T` on a machine and says *"Hey AG, I've moved our LaCie 2T backup to my [rig] to work on [project],"* immediately:
   * Inspect the current OS (Mac or Windows), connected drive paths, and local DAW project folders.
   * Bridge and stage the needed 48kHz/24-bit WAV stems, project files, or bounces between `LaCie 2T` and the active DAW on that machine automatically so Ron can start making music or writing immediately without manual file wrangling.
