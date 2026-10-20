import os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

VAULT_DIR = "/Users/ronhiggins/Desktop/CletusMaxx_YouTube_Vault"
ART_DIR = os.path.join(VAULT_DIR, "art")
os.makedirs(ART_DIR, exist_ok=True)

TRACKS = [
    {
        "num": "01",
        "title": "Liddle Redd Rooster",
        "slug": "01_Liddle_Redd_Rooster",
        "year": "2022",
        "date": "April 22, 2022",
        "audio": "/Users/ronhiggins/Downloads/01_Liddle_Redd_Rooster.wav",
        "isrc": "QZBTK1800011",
        "upc": "741754016366",
        "credits": "Ronald Higgins (Composer, Lyricist, Vocals, Guitars, Bass, Production, Engineering)",
        "publisher": "CletusMaxx Music Publishing (BMI)",
        "lyrics": """[Liddle Redd Rooster]
Written and composed by Ronald Higgins
Produced & Recorded in Mandan, North Dakota"""
    },
    {
        "num": "02",
        "title": "In the Back of Your Mind",
        "slug": "02_In_The_Back_Of_Your_Mind",
        "year": "2019",
        "date": "April 9, 2019",
        "audio": "/Users/ronhiggins/Library/Mobile Documents/com~apple~CloudDocs/Desktop/In The Back Of Your Mind2.wav",
        "isrc": "QZBTK1800008",
        "upc": "099451668396",
        "credits": "Ron Higgins (Composer, Lyricist, Vocals, Instruments, Production, Engineering)",
        "publisher": "Ron Higgins Music / CletusMaxx Music Publishing (BMI)",
        "lyrics": """[In the Back of Your Mind]
Written and composed by Ron Higgins
Produced & Recorded in Mandan, North Dakota"""
    },
    {
        "num": "03",
        "title": "To Much Truth in Honesty",
        "slug": "03_To_Much_Truth_In_Honesty",
        "year": "2019",
        "date": "April 27, 2019",
        "audio": "/Users/ronhiggins/Library/Mobile Documents/com~apple~CloudDocs/Desktop/To Much Truth In Honesty.aif",
        "isrc": "QZBTK1800009",
        "upc": "099451679828",
        "credits": "Ron Higgins (Composer, Lyricist, Vocals, Guitars, Production, Engineering)",
        "publisher": "Ron Higgins Music / CletusMaxx Music Publishing (BMI)",
        "lyrics": """[To Much Truth in Honesty]
Written and composed by Ron Higgins
Produced & Recorded in Mandan, North Dakota"""
    },
    {
        "num": "04",
        "title": "The Lesson",
        "slug": "04_The_Lesson",
        "year": "2018",
        "date": "August 21, 2018",
        "audio": "/Users/ronhiggins/Library/Mobile Documents/com~apple~CloudDocs/Desktop/desktop folders/desktop from cloud/CletusMaxx 4 Songs Purchased on ReverbNation/The Lesson.mp3",
        "isrc": "QZ8251843993",
        "upc": "024589717555",
        "credits": "Ron Higgins (Composer, Lyricist, Vocals, Guitars, Bass, Synthesizer, Production)",
        "publisher": "Ron Higgins Music",
        "lyrics": """The Lesson
A song about maturity and loss of innocence

It’s too late after the thunder
To take back what you’ve learned
Ahead of life to stay on the lightning
I don’t want to get burned

It’s too late
It’s too late
I don’t want to get burned

It’s too late after the thunder
To take back what you’ve learned
Ahead of life to stay on the lightning
I don’t want to get burned"""
    },
    {
        "num": "05",
        "title": "Midnight",
        "slug": "05_Midnight",
        "year": "2018",
        "date": "May 14, 2018",
        "audio": "/Users/ronhiggins/Library/Mobile Documents/com~apple~CloudDocs/Desktop/desktop folders/desktop from cloud/CletusMaxx 4 Songs Purchased on ReverbNation/Midnight.mp3",
        "isrc": "QZBTK1800006",
        "upc": "786032176745",
        "credits": "Ron Higgins (Composer, Lyricist, Vocals, Guitars, Production, Engineering)",
        "publisher": "CletusMaxx Music Publishing / Ron Higgins Music",
        "lyrics": """Midnight
Hearts on fire filled with desire
Didn't quite know just what to do
Said Goodnight Walking to my car
Fumbled with my keys
I didn't get to far

Midnight and I said goodnight
But all I wanna do is stay close to you
Midnight and I said goodnight
But all I wanna do is stay!

Red lights blue lights Flashing
Taking my breath away
Red lights blue lights Flashing
Shouldn't a got up today"""
    },
    {
        "num": "06",
        "title": "Fights on Life",
        "slug": "06_Fights_On_Life",
        "year": "2018",
        "date": "February 9, 2018",
        "audio": "/Users/ronhiggins/Library/Mobile Documents/com~apple~CloudDocs/Desktop/desktop folders/desktop from cloud/CletusMaxx 4 Songs Purchased on ReverbNation/Fights on Life (1).mp3",
        "isrc": "QZ8251807866",
        "upc": "782752930087",
        "credits": "Ron Higgins / CletusMaxx (Composer, Lyricist, Vocals, Guitars, Production)",
        "publisher": "CletusMaxx Music Publishing",
        "lyrics": """Fights on Life

Another day Another Night
I know it's gonna be all right
I know I know I know
If there's a way to numb this pain
I know it's gonna be all right
I know I know I know
There's a light There's a Fight
I know it's gonna be all right
Fights on Life, Fights on Life"""
    }
]

# Fonts
font_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", 88)
font_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", 46)
font_meta = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", 32)
font_italic = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Italic.ttf", 28)
font_badge = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", 24)

guide_lines = []
guide_lines.append("=" * 70)
guide_lines.append("CLETUSMAXX (RON HIGGINS) — YOUTUBE CATALOG UPLOAD GUIDE")
guide_lines.append("Ready-to-Paste Titles, Descriptions, Lyrics, & Metadata")
guide_lines.append("=" * 70)
guide_lines.append("")

for idx, t in enumerate(TRACKS, 1):
    print(f"\n[{idx}/6] Processing: {t['title']} ({t['year']})")
    
    # 1. Create Artwork
    w, h = 1920, 1080
    img = Image.new("RGBA", (w, h), (10, 8, 6, 255))
    draw = ImageDraw.Draw(img)
    
    # Warm dark vignette
    for y in range(h):
        r = int(10 + (y / h) * 16)
        g = int(8 + (y / h) * 12)
        b = int(6 + (y / h) * 9)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    # Gold double border
    draw.rectangle([50, 50, w - 50, h - 50], outline=(245, 158, 11, 180), width=3)
    draw.rectangle([62, 62, w - 62, h - 62], outline=(245, 158, 11, 80), width=1)
    
    # Corner flourishes
    draw.line([(75, 75), (140, 75)], fill=(251, 191, 36, 220), width=2)
    draw.line([(75, 75), (75, 140)], fill=(251, 191, 36, 220), width=2)
    draw.line([(w - 75, 75), (w - 140, 75)], fill=(251, 191, 36, 220), width=2)
    draw.line([(w - 75, 75), (w - 75, 140)], fill=(251, 191, 36, 220), width=2)
    draw.line([(75, h - 75), (140, h - 75)], fill=(251, 191, 36, 220), width=2)
    draw.line([(75, h - 75), (75, h - 140)], fill=(251, 191, 36, 220), width=2)
    draw.line([(w - 75, h - 75), (w - 140, h - 75)], fill=(251, 191, 36, 220), width=2)
    draw.line([(w - 75, h - 75), (w - 75, h - 140)], fill=(251, 191, 36, 220), width=2)
    
    # Top badge
    draw.text((w/2, 140), "✦ THE PARTNERSHIP PROJECT · SOVEREIGN ARCHIVE ✦", font=font_badge, fill=(251, 191, 36, 240), anchor="mm")
    
    # Track title
    draw.text((w/2, 380), t['title'].upper(), font=font_title, fill=(254, 243, 199, 255), anchor="mm")
    
    # Gold divider line
    draw.line([(w/2 - 250, 470), (w/2 + 250, 470)], fill=(245, 158, 11, 200), width=2)
    
    # Artist Name
    draw.text((w/2, 540), "C L E T U S M A X X", font=font_sub, fill=(245, 158, 11, 255), anchor="mm")
    
    # Credits
    draw.text((w/2, 630), "Written, Arranged & Produced by Ron Higgins", font=font_meta, fill=(220, 190, 130, 240), anchor="mm")
    draw.text((w/2, 690), f"Mandan, North Dakota · Original Studio Release ({t['year']})", font=font_italic, fill=(180, 160, 130, 220), anchor="mm")
    draw.text((w/2, 750), f"ISRC: {t['isrc']} · Barcode: {t['upc']}", font=font_italic, fill=(150, 135, 115, 200), anchor="mm")
    
    # Bottom Ethos
    draw.text((w/2, 940), "Creative Commons CC BY-SA 4.0 · All for All · partnership-hub.vercel.app", font=font_badge, fill=(160, 145, 120, 220), anchor="mm")
    
    art_path = os.path.join(ART_DIR, f"{t['slug']}.png")
    img.save(art_path)
    print(f"  Artwork saved: {art_path}")
    
    # 2. Render MP4 with ffmpeg
    mp4_path = os.path.join(VAULT_DIR, f"{t['slug']}.mp4")
    print(f"  Rendering MP4 video: {mp4_path}...")
    
    # Command: loop still image, encode audio as high-rate aac (or copy), shortest
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-loop", "1",
        "-i", art_path,
        "-i", t["audio"],
        "-c:v", "libx264",
        "-tune", "stillimage",
        "-c:a", "aac",
        "-b:a", "320k",
        "-pix_fmt", "yuv420p",
        "-shortest",
        mp4_path
    ]
    subprocess.run(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"  Render complete: {mp4_path}")
    
    # 3. Add to Upload Guide
    yt_title = f"{t['title']} — CletusMaxx (Ron Higgins)"
    yt_desc = f"""{t['title']} — Written, recorded, and produced by Ron Higgins under the artist name CletusMaxx.

Release Date: {t['date']}
Origin: Mandan, North Dakota
Composer & Lyricist: {t['credits']}
Publisher: {t['publisher']}
ISRC: {t['isrc']}
UPC / Barcode: {t['upc']}

---
LYRICS:
{t['lyrics']}

---
ABOUT THE ARTIST & CREATIVE SOVEREIGNTY:
Ron Higgins has spent 63 years writing, recording, and engineering original music from the North Dakota prairie. After over 1.5 million streams on commercial platforms, Ron stepped off the corporate streaming treadmill to share his catalog freely under Creative Commons (CC BY-SA 4.0) — All for All.

Explore the complete books, AI collaboration tools, and music catalog at:
https://partnership-hub.vercel.app

Read Book 3: "The Architects of Songs and Music (in the Modern Age)":
https://partnership-hub.vercel.app/music

#CletusMaxx #RonHiggins #IndependentMusic #NorthDakota #CreativeSovereignty #AllForAll #ThePartnershipProject
"""
    guide_lines.append("-" * 70)
    guide_lines.append(f"VIDEO #{t['num']}: {t['slug']}.mp4")
    guide_lines.append("-" * 70)
    guide_lines.append(f"YOUTUBE TITLE:\n{yt_title}\n")
    guide_lines.append(f"YOUTUBE DESCRIPTION:\n{yt_desc}")
    guide_lines.append("\n" + "=" * 70 + "\n")

guide_path = os.path.join(VAULT_DIR, "YOUTUBE_UPLOAD_GUIDE.txt")
with open(guide_path, "w", encoding="utf-8") as f:
    f.write("\n".join(guide_lines))

print(f"\nSUCCESS! All 6 videos and upload guide rendered in:\n{VAULT_DIR}")
