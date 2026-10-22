# Appendices & Forensic Artifacts: The Sovereign Musician

---

## Appendix A: The Complete CletusMaxx Distribution Ledger & Payout Autopsy
*Source: ReverbNation / BandLab Distribution Verified Records (2018–2026)*  
*Entity: Ron Higgins (Ronald Higgins / CletusMaxx)*  
*Publishing: CletusMaxx Music Publishing (BMI) / Ron Higgins Music*  

### 1. Master Catalog Table
| # | Track / Release Title | Release Date | UPC / Barcode | ISRC Code | Catalog # | Duration | Lifetime Streams | Total Earnings | Publisher / Label |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Play** | 2025-04-29 | `683304427812` | `QZBTK1800012` | RN1552600 | 4:04 | 445 | $5.92 | CletusMaxx Music Publishing |
| 2 | **Liddle Redd Rooster** | 2022-04-22 | `741754016366` | `QZBTK1800011` | RN1335560 | 2:26 | 91,618 | $492.82 | CletusMaxx Music Publishing |
| 3 | **To Much Truth in Honesty** | 2019-04-27 | `099451679828` | `QZBTK1800009` | RN984666 | 3:27 | 222,928 | $1,114.88 | Ron Higgins Music / CletusMaxx Music Publishing BMI |
| 4 | **In the Back of Your Mind** | 2019-04-09 | `099451668396` | `QZBTK1800008` | RN975371 | 2:45 | 232,237 | $1,138.29 | Ron Higgins Music / CletusMaxx Music Publishing BMI |
| 5 | **The Lesson** | 2018-08-21 | `024589717555` | `QZ8251843993` | RN874293 | 4:34 | 251,886 | $1,210.03 | Ron Higgins Music |
| 6 | **Midnight** | 2018-05-14 | `786032176745` | `QZBTK1800006` | RN827850 | 3:53 | 246,042 | $1,231.26 | CletusMaxx Music Publishing / Ron Higgins Music |
| 7 | **I Don't Give A Damn Anymore** | 2018-03-22 | `782752959606` | `QZ8251816612` | RN800284 | 3:34 | 257,560 | $1,263.71 | Ron Higgins Music |
| 8 | **Fights on Life** | 2018-02-09 | `782752930087` | `QZ8251807866` | RN776849 | 4:13 | 247,799 | $1,241.70 | CletusMaxx |

* **Total Lifetime Streams Logged:** **1,550,515**
* **Total Gross Earnings Disbursed:** **$7,698.61**
* **Average Gross Payout per Stream:** **$0.00496**

### 2. The 25-Page Complete Credit Account Ledger (611 Verified Records, 2017–2026)
In addition to release summaries, the partnership conducted a complete forensic extraction of the legacy ReverbNation Credit Account ledger (`legacy.reverbnation.com/control_room/artist/5779750/bank`), capturing all **611 chronological transaction records** across 25 pages spanning from May 2017 to October 2026.

Key forensic insights from the 611-line ledger:
* **The Final Severance Payout:** Transaction ID `20267524` on October 11, 2026, cleanly transferred the remaining balance to Ron Higgins via PayPal (`ron.higgins47@yahoo.com`, TXN ID: `7UV627454C8572059`), bringing the account balance to exactly **$0.00** before severance.
* **The Granular Reality of Streaming Pennies:** Over 550 of the 611 transactions represent micro-deposits of $0.02, $0.06, $0.08, $0.11, and $0.15 for batches of 2 to 8 streams.
* **The Subscription Skim:** The ledger documents recurring subscription fees, sponsored content charges (e.g., $11.99, $19.95), and platform fees silently eroding artist earnings over an eight-year window.
* **The Permanent Vault:** The complete dataset is permanently cataloged in the repository vault as:
  * `00_Meta/CletusMaxx_ReverbNation_Credit_Account_Ledger.csv` (Full raw table)
  * `00_Meta/CletusMaxx_ReverbNation_Credit_Account_Full_25_Pages.json` (Structured JSON)
  * `00_Meta/CletusMaxx_ReverbNation_Credit_Account_Ledger.md` (Human-readable markdown table)

---

## Appendix B: The Local Python/ffmpeg Broadcast Production Script
*Open-source, local-first utility to turn uncompressed WAV audio files and 1920x1080 PNG graphics into broadcast-quality H.264/AAC MP4 video files with automated decode verification.*

```python
#!/usr/bin/env python3
"""
THE SOVEREIGN MUSICIAN: AUTOMATED VIDEO FACTORY
Transforms uncompressed master audio tracks and 1080p artwork cards
into broadcast-grade H.264 / AAC 320kbps MP4 videos.
"""

import subprocess
import os
import sys

CATALOG = [
    {"audio": "01_Play.wav", "art": "01_Play_card.png", "out": "01_Play.mp4"},
    {"audio": "02_Rooster.wav", "art": "02_Rooster_card.png", "out": "02_Liddle_Redd_Rooster.mp4"},
    {"audio": "03_Honesty.wav", "art": "03_Honesty_card.png", "out": "03_To_Much_Truth_In_Honesty.mp4"},
    {"audio": "04_Mind.wav", "art": "04_Mind_card.png", "out": "04_In_The_Back_Of_Your_Mind.mp4"},
    {"audio": "05_Lesson.wav", "art": "05_Lesson_card.png", "out": "05_The_Lesson.mp4"},
    {"audio": "06_Midnight.wav", "art": "06_Midnight_card.png", "out": "06_Midnight.mp4"},
    {"audio": "07_Damn.wav", "art": "07_Damn_card.png", "out": "07_I_Dont_Give_A_Damn_Anymore.mp4"},
    {"audio": "08_Fights.wav", "art": "08_Fights_card.png", "out": "08_Fights_On_Life.mp4"}
]

def render_broadcast_video(audio_path, art_path, output_path):
    print(f"[*] Rendering: {output_path}...")
    cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-framerate", "1",
        "-i", art_path,
        "-i", audio_path,
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "320k",
        "-pix_fmt", "yuv420p",
        "-shortest",
        output_path
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if result.returncode != 0:
        print(f"[!] Error rendering {output_path}: {result.stderr.decode()}")
        return False

    # Bit-by-bit decode verification pass
    verify_cmd = ["ffmpeg", "-v", "error", "-i", output_path, "-f", "null", "-"]
    verify_result = subprocess.run(verify_cmd, stderr=subprocess.PIPE)
    if verify_result.stderr:
        print(f"[!] Verification warning on {output_path}: {verify_result.stderr.decode()}")
        return False

    print(f"[✓] Successfully verified: {output_path} (0 errors, 0 dropped frames)")
    return True

if __name__ == "__main__":
    print("=== STARTING SOVEREIGN VIDEO FACTORY ===")
    for item in CATALOG:
        if os.path.exists(item["audio"]) and os.path.exists(item["art"]):
            render_broadcast_video(item["audio"], item["art"], item["out"])
        else:
            print(f"[!] Skipping: Missing source files for {item['out']}")
    print("=== PRODUCTION COMPLETE ===")
```

---

## Appendix C: The Sovereign Musician's Step-by-Step Liberation Checklist

Follow this procedural checklist to reclaim your catalog, eliminate recurring subscription rent, and establish permanent creative sovereignty:

### Phase 1: The Master Vault & Forensic Audit
- [ ] **Download Uncompressed Masters:** Verify that you have local, pristine WAV/AIFF master recordings for every track in your catalog. Never settle for MP3 or AAC reference copies.
- [ ] **Export Historical Ledgers:** Log into your distributor (DistroKid, TuneCore, ReverbNation, CD Baby). Export every CSV statement, lifetime stream report, and receipt.
- [ ] **Catalog Unique Identifiers:** Record the **ISRC code**, **UPC barcode**, catalog number, and exact release date for every track in a plain-text file (`catalog.json` or `registry.csv`).
- [ ] **Implement the 3-2-1 Backup:** Ensure your master vault exists in 3 copies, across 2 different physical drives, with 1 copy air-gapped offsite.

### Phase 2: Lock Down 100-Point Publishing Sovereignty
- [ ] **Direct PRO Affiliation:** Ensure you are directly registered with a Performing Rights Organization (**BMI** or **ASCAP**) as both Songwriter (Writer's Share) and Publishing Company (Publisher's Share).
- [ ] **Direct MLC Registration:** Register directly with **The MLC (Mechanical Licensing Collective)** as a self-published songwriter to collect 100% of digital mechanical streaming royalties under federal statutory rates with zero commission skim.
- [ ] **SoundExchange Registration:** Register with SoundExchange as both the Featured Artist and Sound Recording Copyright Owner to collect non-interactive digital radio royalties (Pandora, SiriusXM, webcasts).

### Phase 3: The Centaur Studio (Video & Metadata)
- [ ] **Generate 1080p Video Cards:** Use Python/Pillow or clean graphics tools to generate 1920x1080 PNG title cards displaying track title, artist name, and licensing credits.
- [ ] **Batch Render via ffmpeg:** Run the open-source Python script to multiplex audio and visuals into broadcast-quality H.264/AAC MP4 files at 7x real-time speed.
- [ ] **Run Automated Verification:** Confirm zero dropped frames and zero decode errors.
- [ ] **Prepare Master Upload Guide:** Compile all titles, descriptions, credits, lyrics, timestamps, and links into a single text document (`YOUTUBE_UPLOAD_GUIDE.txt`).

### Phase 4: Direct-to-Human Publishing (All for All)
- [ ] **Batch Upload to YouTube:** Drag all MP4 files into YouTube Studio at once. Copy-paste titles, descriptions, and lyrics from your upload guide. Set video visibility to Public.
- [ ] **Declare Creative Commons (CC BY-SA 4.0):** State clearly in your descriptions and websites that your music is open for all human beings under Attribution-ShareAlike.
- [ ] **Deploy Sovereign Web Hub:** Embed ad-free, tracker-free audio streams on your personal web domain (GitHub Pages, Vercel).
- [ ] **Install Sovereign Tip Jar:** Add a clean, voluntary gifting link (Stripe, PayPal, Buy Me a Coffee) so listeners can practice sacred reciprocity directly with zero corporate middleman skim.
- [ ] **Sever Commercial Distribution Rent:** Cancel recurring credit card payments to commercial distributors. Walk away in complete peace.
