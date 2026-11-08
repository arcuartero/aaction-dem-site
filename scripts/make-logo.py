"""Nouveau logo Aaction Dem : extrait le texte crème du fond corail, le recolore en #fa5b4a (et en blanc) sur fond transparent.
Usage : python3 -I scripts/make-logo.py   (source : src/logo/aaction-dem-2026-source.png)"""
import os, collections
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
im = Image.open(os.path.join(ROOT, 'src/logo/aaction-dem-2026-source.png')).convert('RGB'); w, h = im.size; px = im.load()
CG, KG = 101, 243                      # canal vert du fond corail / du texte crème
a = Image.new('L', (w, h)); ap = a.load()
for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        ap[x, y] = 0 if b > 238 else int(255 * max(0, min(1, (g - CG) / (KG - CG))))
# Supprime les éléments qui touchent un bord (restes de lettres coupées, bord du disque)
seen = set()
for y in range(h):
    for x in range(w):
        if ap[x, y] > 40 and (x, y) not in seen:
            q = collections.deque([(x, y)]); seen.add((x, y)); pts = []
            while q:
                cx, cy = q.popleft(); pts.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in seen and ap[nx, ny] > 40:
                        seen.add((nx, ny)); q.append((nx, ny))
            if len(pts) < 6 or any(p[0] <= 1 or p[1] <= 1 or p[0] >= w - 2 or p[1] >= h - 2 for p in pts):
                for (cx, cy) in pts:
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            if 0 <= cx + dx < w and 0 <= cy + dy < h: ap[cx + dx, cy + dy] = 0
a = a.point(lambda v: 0 if v < 25 else v)
l, t, r, b = a.getbbox(); a = a.crop((max(0, l - 3), max(0, t - 3), min(w, r + 3), min(h, b + 3)))
out = os.path.join(ROOT, 'images/logos'); os.makedirs(out, exist_ok=True)
for name, col in (('aaction-dem-2026', (250, 91, 74)), ('aaction-dem-2026-blanc', (255, 255, 255))):
    img = Image.new('RGBA', a.size, col + (0,)); img.putalpha(a)
    img.save(os.path.join(out, f'{name}.png'))
    # WebP pour le site : 480 px de large (≈ 2× la taille affichée), suffisant pour les écrans Retina
    small = img.resize((480, round(img.height * 480 / img.width)), Image.LANCZOS)
    small.save(os.path.join(out, f'{name}.webp'), 'WEBP', lossless=True, method=6)
import json
dp = os.path.join(ROOT, 'images/dims.json'); dims = json.load(open(dp)) if os.path.exists(dp) else {}
for name in ('aaction-dem-2026', 'aaction-dem-2026-blanc'): dims[f'logos/{name}'] = list(a.size)
json.dump(dims, open(dp, 'w'), indent=1)
print('logo', a.size)
