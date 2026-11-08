"""Génère les variantes mobiles 768 px (JPEG) des photos opaques de images/ pour le srcset.
Remplace macOS « sips » afin que le build fonctionne aussi sur GitHub Actions (Linux).
Usage : python3 -I scripts/make-variants.py"""
import json, os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg = json.load(open(os.path.join(ROOT, 'scripts/image-prompts.json')))
for im in cfg['images']:
    ext = 'jpg' if im.get('format') == 'jpeg' else im.get('format', 'webp')
    src = os.path.join(ROOT, 'images', f"{im['name']}.{ext}")
    if im.get('background') or ext == 'jpg' or not os.path.exists(src):
        continue
    img = Image.open(src).convert('RGB')
    if img.width <= 900:
        continue
    small = img.resize((768, round(img.height * 768 / img.width)), Image.LANCZOS)
    small.save(os.path.join(ROOT, 'images', f"{im['name']}-768.jpg"), 'JPEG', quality=72, optimize=True, progressive=True)
    print(im['name'])
