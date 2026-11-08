"""Recycle the photos and logos of the current aaction-dem.com site.

Reads originals from src/wix/ (downloaded from static.wixstatic.com/media/<id>),
crops/resizes them and writes optimised WebP files to images/ (photos) and images/logos/.
Also writes images/dims.json so build.mjs knows real width/height.
Usage: python3 -I scripts/import-site-photos.py
"""
import json, os, shutil
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src', 'wix')
OUT = os.path.join(ROOT, 'images')
LOGOS = os.path.join(OUT, 'logos')
BACKUP = os.path.join(OUT, 'chatgpt')

# name -> (source file, target ratio (w/h) or None to keep, focus y 0..1, max width)
PHOTOS = {
    # Hero régénéré avec ChatGPT Images à partir de la photo du site (camionnette entière), recadré (x0, y0, x1, y1)
    # Hero de l'accueil (visuel fourni 2026 : déménageur + camionnette « Déménageurs de vies », fond corail)
    'hero-demenageur':           ('hero-home-2026.webp', None, .5, 1655),
    'particulier': ('nsplsh_5d35408df0604a6e854fcc35209b4488~mv2.jpg', 3/2, .5, 1536),
    'entreprise':  ('nsplsh_f7bd0931e7a74f48a73cd07e891ee0ca~mv2.jpg', 3/2, .5, 1536),
    'garde-meuble':             ('cd448d_1f46ea2f73d4454e812721b249f00b49~mv2.jpg', 3/2, .5, 1536),
    'monte-meuble':              ('cd448d_c790ac8d0cdf45b1bdf95ba7251c8b5a~mv2.jpeg', 3/2, .45, 1204),
    # Équipe devant les camions : photo fournie 2026 (t-shirts verts Aaction Dem)
    'equipe-demenageurs':        ('equipe-camions-2026.webp', 3/2, .55, 1536),
    'visite-technique':          ('cd448d_879b48ecb40949a7b1bce39b5bee32f2~mv2.png', 3/2, .5, 1536),
    'demenagement-longwy':       ('cd448d_20144f75000a47d8b74a1f4858123e85~mv2.jpg', 3/2, .5, 1536),
    # Hero Piano : photo fournie (équipe Aaction Dem déplaçant un piano droit)
    'demenagement-piano':        ('piano-hero.webp', None, .5, 1536),
    'vente-materiel':            ('cd448d_dc45dc540b0743d7be7110a2b48a987b~mv2.jpg', 3/2, .6, 1000),
    'protection-mobilier':       ('cd448d_7d59b80511524dec85d8de70d7ea7d5f~mv2.jpg', 3/2, .5, 1000),
    'equipe-gentlemen':          ('cd448d_20144f75000a47d8b74a1f4858123e85~mv2.jpg', 3/2, .5, 1536),
    # Hero Particulier : photo fournie (famille heureuse avec cartons Les Gentlemen)
    'famille-demenagement':      ('particulier-hero.webp', None, .5, 1536),
    'demenagement-metz':         ('cd448d_d325539bdac245539ea39928a3faf0fe~mv2.jpg', 3/2, .5, 1536),
    # Hero Thionville : photo fournie (déménageur portant des cartons Aaction Dem dans une rue commerçante)
    'demenagement-thionville':   ('thionville-hero.webp', None, .5, 1536),
    'monte-meuble-rue':          ('cd448d_7bf223cebaa545fd83e873f224538df5~mv2.jpeg', 3/2, .35, 1152),
    'longwy-ville-haute':        ('cd448d_3e27363c32344e9abceaad69b3c88fe2~mv2.jpg', 3/2, .5, 1536),
    'dechargement-camion':       ('cd448d_55061cee67704685bfcea6ea1a24a84b~mv2.jpg', 3/2, .5, 1248),
    'camion-centre-ville':       ('cd448d_b65bff36b9c94d61bcfbddaaef5d5885~mv2.jpeg', 3/2, .55, 1536),
    'cartons-gentlemen':         ('cd448d_0261a514b8484ef4a8bfe918bfa6b2b7~mv2.jpg', 3/2, .5, 1536),
    # Généré avec ChatGPT Images (cliente écrivant un avis après son déménagement)
    'avis-clients':              ('avis-clients-chatgpt.jpg', 3/2, .5, 1536),
    # Hero de la page Knutange (photo fournie, camion Aaction Dem « Déménageurs de vies »)
    'demenagement-knutange':     ('knutange-hero.webp', None, .5, 1536),
    'bureaux-entreprise':        ('cd448d_2ace563da06e4334b3d2e603152a0c29~mv2.jpg', 3/2, .45, 1536),
}
# OG image (1200x630 JPEG) from the real team photo
OG = ('equipe-camions-2026.webp', .55)

LOGO_FILES = {
    'aaction-dem':       'cd448d_1d4944bd09014526a528e48553a6b894~mv2.png',
    'aaction-dem-footer':'cd448d_ac1bed29ebf54f2a96829630ad309d24~mv2.png',
    'gentlemen':         'cd448d_8df5c3f561104170b9232912e08e89db~mv2.png',
    'google-note':       'cd448d_6361bfd88bba4d8eb98eee4c5247ffcb~mv2.png',
    'groupama':          'cd448d_b43bb8d363c945f28648b2dfb70f51a1~mv2.png',
    'maif':              'cd448d_0e6b0ae6002f471ba1583115d7469acc~mv2.png',
    'mma':               'cd448d_d932bbd2ccc04f9ea40154388502e5ea~mv2.png',
    'credit-mutuel':     'cd448d_9d51b8494d3d45ac96704ffde22ee515~mv2.png',
    'orpi':              'cd448d_4d6a453098c44ba4bc895a2a959b31b4~mv2.jpg',
    'credit-agricole':   'cd448d_8ba7bfc068af4944872d06b19f1d8cf4~mv2.png',
    'direct-assurance':  'cd448d_c607fbd62b884c7180447251499ed90d~mv2.png',
    'visa-premier':      'cd448d_9d3edb3018fc4ce3975341d188783970~mv2.png',
}


def crop_ratio(im, ratio, fy):
    w, h = im.size
    if ratio is None:
        return im
    if w / h > ratio:  # too wide -> crop width (centered)
        nw = round(h * ratio); x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / ratio); y = max(0, min(h - nh, round((h - nh) * fy)))
    return im.crop((0, y, w, y + nh))


def trim(im, pad=6):
    """Crop transparent / near-white margins around a logo."""
    rgba = im.convert('RGBA')
    bg = Image.new('RGBA', rgba.size, (255, 255, 255, 255))
    flat = Image.alpha_composite(bg, rgba).convert('L').point(lambda v: 255 if v < 245 else 0)
    box = flat.getbbox()
    if not box:
        return rgba
    l, t, r, b = box
    return rgba.crop((max(0, l - pad), max(0, t - pad), min(rgba.width, r + pad), min(rgba.height, b + pad)))


os.makedirs(LOGOS, exist_ok=True)
os.makedirs(BACKUP, exist_ok=True)
# conserve les entrées gérées par d'autres scripts (ex. nouveau logo, scripts/make-logo.py)
_dp = os.path.join(OUT, 'dims.json')
dims = {k: v for k, v in json.load(open(_dp)).items() if k.startswith('logos/aaction-dem-2026')} if os.path.exists(_dp) else {}
for name, (f, ratio, fy, maxw, *box) in PHOTOS.items():
    dst = os.path.join(OUT, f'{name}.webp')
    if os.path.exists(dst) and not os.path.exists(os.path.join(BACKUP, f'{name}.webp')):
        shutil.copy2(dst, os.path.join(BACKUP, f'{name}.webp'))  # keep the ChatGPT version
    im = Image.open(os.path.join(SRC, f)).convert('RGB')
    if box:
        im = im.crop(box[0])
    im = crop_ratio(im, ratio, fy)
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=80, method=6)
    dims[name] = [im.width, im.height]
    print(f'{name:28} {im.size} {os.path.getsize(dst)//1024} KB')

og = Image.open(os.path.join(SRC, OG[0])).convert('RGB')
og = crop_ratio(og, 1200 / 630, OG[1]).resize((1200, 630), Image.LANCZOS)
og_dst = os.path.join(OUT, 'og-image.jpg')
if os.path.exists(og_dst) and not os.path.exists(os.path.join(BACKUP, 'og-image.jpg')):
    shutil.copy2(og_dst, os.path.join(BACKUP, 'og-image.jpg'))
og.save(og_dst, 'JPEG', quality=82, optimize=True, progressive=True)
dims['og-image'] = [1200, 630]

for name, f in LOGO_FILES.items():
    im = trim(Image.open(os.path.join(SRC, f)))
    if im.height > 220:
        im = im.resize((round(im.width * 220 / im.height), 220), Image.LANCZOS)
    dst = os.path.join(LOGOS, f'{name}.webp')
    im.save(dst, 'WEBP', quality=90, method=6)
    dims[f'logos/{name}'] = [im.width, im.height]
    print(f'logo {name:20} {im.size}')

# Background colour of the hero photo (top-left pixel) so the hero section blends in
hero = Image.open(os.path.join(SRC, PHOTOS['hero-demenageur'][0])).convert('RGB')
dims['_heroBg'] = '#%02x%02x%02x' % hero.getpixel((5, 5))
with open(os.path.join(OUT, 'dims.json'), 'w') as fh:
    json.dump(dims, fh, indent=1)
print('hero bg', dims['_heroBg'])
