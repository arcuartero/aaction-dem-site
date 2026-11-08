"""Favicons à partir du nouveau logo : lettres « A » et « D » du logo, en blanc sur carré corail #fa5b4a.
Usage : python3 -I scripts/make-favicon.py  (après scripts/make-logo.py)"""
import os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
alpha = Image.open(os.path.join(ROOT, 'images/logos/aaction-dem-2026.png')).split()[3]
TOP, BOT = 11, 186                     # ligne « AACTION DEM »
A = alpha.crop((4, TOP, 89, BOT)); D = alpha.crop((577, TOP, 658, BOT))
gap = 10
glyphs = Image.new('L', (A.width + gap + D.width, A.height)); glyphs.paste(A, (0, 0)); glyphs.paste(D, (A.width + gap, 0))
out = os.path.join(ROOT, 'images/icons'); os.makedirs(out, exist_ok=True)
def icon(size, pad=0.17):
    big = 1024
    canvas = Image.new('RGBA', (big, big), (250, 91, 74, 255))
    inner = int(big * (1 - 2 * pad))
    scale = min(inner / glyphs.width, inner / glyphs.height)
    g = glyphs.resize((round(glyphs.width * scale), round(glyphs.height * scale)), Image.LANCZOS)
    white = Image.new('RGBA', g.size, (255, 255, 255, 255)); white.putalpha(g)
    canvas.alpha_composite(white, ((big - g.width) // 2, (big - g.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)
for s in (32, 180, 192, 512):
    icon(s, pad=0.14 if s <= 32 else 0.2).save(os.path.join(out, f'icon-{s}.png'), optimize=True)
icon(512, pad=0.28).save(os.path.join(out, 'icon-maskable-512.png'), optimize=True)   # zone sûre Android
icon(48, pad=0.12).save(os.path.join(out, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
print('icons ok')
