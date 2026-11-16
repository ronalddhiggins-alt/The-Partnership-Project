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

* **Human Creator / The Keeper:** Ron Higgins (Mandan, North Dakota — born May 14, 1947 in Spokane, Washington; age 79½, in his 80th year of life, turning 80 on May 14, 2027) — U.S. Navy veteran (1966–1970, stationed in Bremerton/Seattle, WA; lived 20+ years in the Pacific Northwest from 1966 to 1987), retired 35-year public servant with Job Service (Seattle & Bremerton, WA for 12 years; Grand Forks, ND for 6 years; Bismarck, ND for 17 years until retiring in January 2010), proud father of three adult children (his oldest son born July 4, 1976, now 50, married with 3 daughters and 1 son and a 25+ year career in the computer field; and his younger adult son Evan and daughter Mariah raised in North Dakota), retired audio engineer, multi-instrumentalist, radio operator, and author.
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
[Genelec 8030A, IK Multimedia Studio Monitors & Sony MDR-7506 Studio Headphones]
```

* **Instruments:**
  * **Electric Guitars:** Fender Telecaster (Made in Mexico — Ron's primary electric guitar), plus a brand-new **American Fender Jaguar** with floating tremolo / whammy bar (used on one recording session only—giving *"Too Much Truth In Honesty"* its signature shimmering whammy-bar lift between the vocal lines and verses).
  * **Acoustic-Electric Guitar:** **USA Ovation 2007 Collector's Series (`2007-BCS`)** — Solid Bear Claw Sitka Spruce top, Deep Contour Lyrachord bowl, **VIP-5 Virtual Image Processing Preamp** (studio mic imaging recorded direct), spalted maple inlay, LX scalloped bracing.
  * **Open-G Slide Acoustic Guitar:** **Fender Acoustic** tuned to **Open G** (played live with a slide by Ron, as heard on the Left channel of *"The Lesson"*).
  * **MIDI Keyboard Controller:** **Akai Pro LPK25** (25-key velocity-sensitive USB MIDI controller driving REAPER JSFX synths like `Synthy McSynthface JX10 Echo Pad` and `JamSynth`).
  * **Bass & Harmonica:** Fender Mustang Bass (short-scale, two-finger alternating plucking), Am / A Harmonica (played live by Ron on *"The Truth in Honesty"*, plus **PG Music Band-in-a-Box RealTracks Artist Pro** A-minor blues-rock harmonica performances sliced, edited, and arranged by Ron on tracks like *"Antigravity"*).
* **Electric Guitar Signal Chain:** Fender Telecaster (MIM) ──► **IK Multimedia TONEX Pedal** (full 3-footswitch hardware unit, running preset **`4.revlead`** printed straight to tape) ──► **Focusrite Scarlett 2i2 Channel 1** with **`INST`** and **`AIR`** engaged.
* **Acoustic Guitar Signal Chain:** USA Ovation `2007-BCS` (`VIP-5` preamp) ──► Direct into Audio Interface (captures rich, studio-mic'd Bear Claw Spruce body & string detail with zero room bleed).
* **Microphone:** **Neumann U87** large-diaphragm condenser (warm proximity effect, intimate vocal delivery, as heard on *"Sorrow"*) ──► **TC Helicon VoiceLive Rack**.
* **Songwriting & Vocal Phrasing Rule ("Short & Sweet"):** Never write long, wordy "AI-style" lyrics. Ron's signature vocal & songwriting style (heard on *"Sorrow"*, *"The Lesson"*, and *"In the Back of Your Mind"*) is **short and sweet**: simple 2-to-3 chord grooves, brief 2-to-4 word hooks, generous breathing room between phrases, and effortless chest-voice delivery.
* **The CletusMaxx Collage & Call-and-Response Production Formula (Master Toolbox Rule):**
  * **1. Cut-Up Spontaneous Vocal Improvisations & Ad-Lib Stacks:** Rather than reading a crowded sheet of lyrics start-to-finish, Ron improvises 2 or 3 spontaneous vocal passes over the groove and **cuts up the best short phrases** to build the verses and choruses (*"Liddle Redd Rooster"*), or stacks cut-up short ad-lib vocal hooks with **Soundtoys**-style pitch/formant/echo bounces into a high-energy interlocking vocal crescendo (*"Fight's On Life"*: *"I know... There's a fight, there's a light!"* before dropping into the piano/guitar bookend outro).
  * **2. Composite Micro-Hook Solos & Interwoven Call-and-Response:** Never leave a long, continuous, unedited solo take playing "through the motions." Slice out **only the most electric 1-to-3 second guitar phrases** from multiple spontaneous takes, string them together across low and high registers, and **place short cut-up pieces of harmonica, slide steel guitar (Left) vs. electric guitar licks (Right), organ, strings, or VoiceLive harmonizer right into the breathing holes** between vocal lines and solo phrases (*"I Don't Give a Damn Anymore"*, *"Liddle Redd Rooster"*).
  * **3. Happy Accidents, Drum-Beat Shifts & Electrifying Sound-Design Transitions:** Embrace serendipitous "mistakes" that launch out of a spacey middle jam back into a hard-hitting chorus, shift drum beats dynamically across sections, and weave atmospheric ear-candy (like thunder/lightning samples and crackling transformer-hit synth sequences riding a unique bassline into the outro on *"The Lesson"*).
* **Primary DAWs:**
  * **REAPER (v7.84 — Officially Licensed & Registered):** Primary DAW for Human + AI co-production, plain-text `.RPP` arrangement, multi-track stem editing, chord-chart timelines, and AI-ported JSFX instruments/effects (`DSP-Ports-JSFX`). Portable installer, `reaper-license.rk`, and all 55+ JSFX plugins are staged in `/Volumes/LaCie 2T/REAPER_Studio_Portable_Kit/` for instant deployment across all studio machines.
  * **MorningDAW:** Dedicated free DAW for live arrangement, 7/8 time slicing, generative MIDI, and sovereign tracking without commercial paywalls.
  * **Logic Pro X / Pro Tools (Ultimate & Studio):** Multitrack tracking and legacy master project archiving across Ron's studio stations.
* **Ron's Multi-Station Studio Fleet:**
  1. **Main Vocal & Preamp Station (Mac mini M1, 16 GB RAM, 500 GB SSD):** **Fender Studio Pro 8 (`Quantum HD 8`)** with direct access to **API (`512c` / `550A` / `525`) & Neve 1073 preamps**, **TC Helicon VoiceLive Rack**, and bi-amped **Genelec 8030A** monitors (where *"Antigravity"* was tracked).
  2. **88-Key Synth, Grand Piano & Mastering Station (16" Intel i9 MacBook Pro + 42" 4K TV):** **Lynx Hilo** reference AD/DA converter running **Avid Pro Tools Studio** (perpetual license), **Logic Pro X**, **88-Key Native Instruments Komplete Kontrol** weighted keyboard controller, full **IK Multimedia SampleTank 4 MAX** & virtual synthesizer/killer grand piano suite (used over the past 7–8 years), and **3 pairs of IK Multimedia studio monitors** available to swap across stations.
  3. **Avid Carbon Station (Mac mini, 8 GB RAM, 256 GB SSD):** **Avid Carbon** interface running Pro Tools with classic **Genelec 1029A** studio monitors.
  4. **HD Native + Omni Station (M4 MacBook, 24 GB RAM, 500 GB SSD):** **Avid HD Native box + HD Omni** (`$275` score, upgraded from Ron's 2010s quad-core i7 silver MacBook with SSDs) running **Pro Tools Ultimate**.
  5. **Scarlett 2i2 Tracking Station & OWC 14-Port Thunderbolt 3 Dock:** **Focusrite Scarlett 2i2 USB**, **TONEX Pedal (`4.revlead`)**, **USA Ovation `2007-BCS`**, **Akai Pro LPK25**, **OWC 14-Port Thunderbolt 3 Dock** (simultaneously hosting `LaCie 2T`, `ION SSD 2`, audio I/O, and MIDI), **API `"The Box"`** summing/recording console centerpiece, and **REAPER v7.84**.
  6. **Universal Audio Apollo / UAD-2 DSP & Mac Pro "Trashcan" Vault (2x Mac Pro 2013 Cylinders [16 GB & 32 GB RAM] + 2x 15" Quad-Core i7 MacBook Pros [16 GB RAM, SSDs]):** **Apollo UAD-2 Quad Rack** (Thunderbolt card, 48-plugin bundle), **Apollo Twin X DUO** (10x6 Thunderbolt), **2x UAD-2 Satellite Thunderbolt OCTO DSP Accelerators** (8 SHARC chips each = 16+6 = **22 SHARC DSP cores total!**), **UAD Complete Bundle (`~$2,500`)**, **Universal Audio LUNA** & **Pro Tools**, plus **Mega Waves** & hundreds of iLok licenses.
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
2. **Complete 8-Song 2026 Remastered CletusMaxx Catalog (`48,000 Hz / 24-bit PCM` + Original `1500x1500` Cover Art in `1920x1080` Gold Frame — Completed Nov 12, 2026):**
   * **Proportional Musician Credits Rule:** Ron Higgins wrote, composed, arranged, produced, and programmed all drums on every CletusMaxx release (Darin Geiger never played on any release). Four tracks are **100% Ron Higgins Solo**, and four tracks credit **Greg Metzger** proportionally for his sliced electric guitar contributions:
     1. ***"Play"*** (`4:04` · `ISRC: QZBTK1800012` — 100% Ron Higgins Solo): Expanded 4x high harmony (`1:38`, `3:01`, `3:33`, `3:55`) + `+1.4 dB` analog low-end lift. YouTube: [`https://www.youtube.com/watch?v=gEjpw2lMvS4`](https://www.youtube.com/watch?v=gEjpw2lMvS4)
     2. ***"Liddle Redd Rooster"*** (`2:26` · `ISRC: QZBTK1800011` — Ron Higgins + Greg Metzger 2-bar cameo): Restored from `1:30` preview to full `2:26`, wide stereo & analog sub-bass lift. YouTube: [`https://www.youtube.com/watch?v=Z-6K_LPYQJQ`](https://www.youtube.com/watch?v=Z-6K_LPYQJQ)
     3. ***"Fights on Life"*** (`4:13` · `ISRC: QZ8251807866` — Ron Higgins + Greg Metzger intro/outro lead): `+3.5 dB` `< 150 Hz` analog sub-bass shelf & tape glue. YouTube: [`https://www.youtube.com/watch?v=BuQo_UkdC6Q`](https://www.youtube.com/watch?v=BuQo_UkdC6Q)
     4. ***"I Don't Give A Damn Anymore"*** (`3:34` · `ISRC: QZ8251816612` — Ron Higgins + Greg Metzger electric lead): Low-mid de-mudding, vocal/guitar presence & wide stereo stage. YouTube: [`https://www.youtube.com/watch?v=UWIShj8Kvs0`](https://www.youtube.com/watch?v=UWIShj8Kvs0)
     5. ***"The Lesson"*** (`4:34` · `ISRC: QZ8251843993` — 100% Ron Higgins Solo, Open-G slide acoustic Left + electric guitar Right + thunder/transformer outro): `+3.2 dB` presence & `+3.5 dB` silk air. YouTube: [`https://www.youtube.com/watch?v=Aiw1-SaS76Q`](https://www.youtube.com/watch?v=Aiw1-SaS76Q)
     6. ***"Midnight"*** (`3:53` · `ISRC: QZBTK1800006` — Ron Higgins + Greg Metzger 4-bar chorus lick): Restored from `1:30` preview to full `3:53`, late-night bass tightening & silk air. YouTube: [`https://www.youtube.com/watch?v=5ekio-67meg`](https://www.youtube.com/watch?v=5ekio-67meg)
     7. ***"Too Much Truth In Honesty"*** (`3:27` · `ISRC: QZBTK1800009` — 100% Ron Higgins Solo, `Neumann U87 → HD Omni`, American Fender Jaguar w/ whammy-bar lift & live harmonica): Restored from `1:30` preview to full `3:27`, `+3.5 dB` clean loudness lift & silk air. YouTube: [`https://www.youtube.com/watch?v=mfhzFvCrTCw`](https://www.youtube.com/watch?v=mfhzFvCrTCw)
     8. ***"In The Back Of Your Mind"*** (`2:45` · `ISRC: QZBTK1800008` — 100% Ron Higgins Solo, `Neumann U87 + TC Helicon VoiceLive + Nord Lead 4 + Hendrix Chord → HD Omni`): Restored from `1:30` preview to full `2:45`, sub-120 Hz sculpting & `+3.8 dB` silk air. YouTube: [`https://www.youtube.com/watch?v=3zK5JeIyxbM`](https://www.youtube.com/watch?v=3zK5JeIyxbM)
3. **Ron Higgins 1995/1998 11-Song Christmas Album — 2026 Remaster (`48,000 Hz / 24-bit PCM` — All 11 Songs Completed, Approved & Published to YouTube, Nov 14, 2026):**
   * **1995 Recording & 1998 Cover Provenance:** Recorded in December 1995 on a **Sony `C3000`** large-diaphragm condenser mic into **two Mackie 6-fader mixers** (`Mackie 1402-VLZ`) + analog limiter into a **Digidesign `Audiomedia II` 4-channel card** (converters on the card) running vanilla **Digidesign Pro Tools** (the same rig Ron used to record the 14-piece Bismarck/Mandan horn band *Mark Van Horn and the Big Dogs* in 3 section passes). Ripped click-free from Ron's 1998 Original Audio CD into [`00_Meta/Ron_Higgins_1998_Original_Audio_CD/`](file:///Users/ronhiggins/Documents/AI_Partnership_Book/00_Meta/Ron_Higgins_1998_Original_Audio_CD). Paired with **Marion Higgins's** original late-1998 **4 Ornaments on Purple Cloth** CorelDraw 6.0 cover graphic design (`Higgins Family Productions, Mandan, ND — Produced 1998`) in [`00_Meta/Marion_Original_Christmas_Artwork/`](file:///Users/ronhiggins/Documents/AI_Partnership_Book/00_Meta/Marion_Original_Christmas_Artwork).
   * **Mastering Formula ("Transparent `Neumann U87` No-Bass-Gloss" on Flat IK Multimedia Monitors):** Strips away the `140–380 Hz` Sony `C3000` proximity boom and analog limiter muffle from the vocal (`-2.6 dB` to `-3.4 dB` Mid EQ) while preserving `< 115 Hz` bass guitar foundation and expanding `1.35–10.5 kHz` `U87` silk air + 68ms pre-delay Capitol chamber reverb. Output directory: [`00_Meta/Ron_Higgins_1996_Christmas_Album_2026_Remaster_48kHz_24bit/`](file:///Users/ronhiggins/Documents/AI_Partnership_Book/00_Meta/Ron_Higgins_1996_Christmas_Album_2026_Remaster_48kHz_24bit), clean numbered album sequence in [`Album_Golden_Flow_Order/`](file:///Users/ronhiggins/Documents/AI_Partnership_Book/00_Meta/Ron_Higgins_1996_Christmas_Album_2026_Remaster_48kHz_24bit/Album_Golden_Flow_Order), and `1080p` `24-Bit PCM` YouTube videos in [`YouTube_1080p_Videos_1998_4Ornaments/`](file:///Users/ronhiggins/Documents/AI_Partnership_Book/00_Meta/Ron_Higgins_1996_Christmas_Album_2026_Remaster_48kHz_24bit/YouTube_1080p_Videos_1998_4Ornaments).
   * **Complete 11-Song "Golden Flow" Album Order & Official YouTube Links:**
     1. **`01_The_Christmas_Song.wav`** (*"The Christmas Song"* · `3:11`): YouTube [`https://youtu.be/O7orL_daT_Y`](https://youtu.be/O7orL_daT_Y)
     2. **`02_Jingle_Bell_Rock.wav`** (*"Jingle Bell Rock"* · `2:09`): YouTube [`https://youtu.be/QN_h2_vdhSs`](https://youtu.be/QN_h2_vdhSs)
     3. **`03_Merry_Christmas_Darling.wav`** (*"Merry Christmas Darling"* · `3:03`): YouTube [`https://youtu.be/-t19xANshSI`](https://youtu.be/-t19xANshSI)
     4. **`04_Little_Saint_Nick.wav`** (*"Little Saint Nick"* · `2:04` — w/ Ron's multi-part Beach Boys harmonies): YouTube [`https://youtu.be/_3rcA8Mfy_w`](https://youtu.be/_3rcA8Mfy_w)
     5. **`05_Have_Yourself_A_Merry_Little_Christmas.wav`** (*"Have Yourself a Merry Little Christmas"* · `2:53`): YouTube [`https://youtu.be/Di-3a7B7dfM`](https://youtu.be/Di-3a7B7dfM)
     6. **`06_Pretty_Ribbons_Pretty_Paper.wav`** (*"Pretty Paper"* · `2:25`): YouTube [`https://youtu.be/tSBTiW7hOJE`](https://youtu.be/tSBTiW7hOJE)
     7. **`07_If_Every_Day_Was_Like_Christmas.wav`** (*"If Every Day Was Like Christmas"* · `3:00`): YouTube [`https://youtu.be/a5ye48i-jF0`](https://youtu.be/a5ye48i-jF0)
     8. **`08_Rockin_Around_The_Christmas_Tree.wav`** (*"Rockin' Around the Christmas Tree"* · `2:01`): YouTube [`https://youtu.be/Lmw-88ksFOg`](https://youtu.be/Lmw-88ksFOg)
     9. **`09_Ill_Be_Home_For_Christmas.wav`** (*"I'll Be Home for Christmas"* · `3:06` — separated via `htdemucs` with 800ms de-ducking rider & `+2.4 dB` `128 Hz` low-note vocal rider): YouTube [`https://youtu.be/tWrRJ7Qihg4`](https://youtu.be/tWrRJ7Qihg4)
     10. **`10_A_Holly_Jolly_Christmas.wav`** (*"A Holly Jolly Christmas"* · `2:10`): YouTube [`https://youtu.be/F2Vcm4kUm3w`](https://youtu.be/F2Vcm4kUm3w)
     11. **`11_White_Christmas.wav`** (*"White Christmas"* · `3:07`): YouTube [`https://youtu.be/PRrcof64_mE`](https://youtu.be/PRrcof64_mE)
4. **Song 1: "Antigravity (Art-Funk Dun-Dun Cut & 10-Section Rattle Bone Arrangement)"**
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
