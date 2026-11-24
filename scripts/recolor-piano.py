# Retouche de la photo du piano : t-shirts verts -> rouges (comme les autres photos), logo des t-shirts en blanc,
# logos des pantalons effacés (remplis avec le noir du pantalon).
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
rgb = np.asarray(im).astype(np.float32) / 255.0
hsv = np.asarray(im.convert('HSV')).astype(np.float32)
H, S, V = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2] / 255
h, w = V.shape
yy, xx = np.mgrid[0:h, 0:w]

# 1. Logos roses (t-shirts et pantalons)
pink = ((H > 280) | (H < 8)) & (S > 0.12) & (V > 0.32) & (rgb[..., 0] > 0.45) & (rgb[..., 2] > 0.32) & (rgb[..., 1] < rgb[..., 0] - 0.06)
pink = ndi.binary_opening(pink, iterations=1)
pink_d = ndi.binary_dilation(pink, iterations=3)
lab, n = ndi.label(ndi.binary_dilation(pink, iterations=8))

# 2. Vert des t-shirts (hors fenêtre à gauche)
green = (H > 120) & (H < 190) & (S > 0.18) & (V < 0.75) & (V > 0.04) & ~((xx < 120) & (yy < 460))
green = ndi.binary_closing(green, iterations=2)

out = rgb.copy()
# T-shirts : rouge-orangé (#c8371f environ), en gardant la lumière du tissu
target = np.array([0.80, 0.22, 0.12])
lum = V / max(np.percentile(V[green], 90), 1e-3)
lum = np.clip(lum, 0, 1.25)
gmask = green & ~pink_d
out[gmask] = np.clip(target[None, :] * lum[gmask][:, None] * 1.05, 0, 1)

# Logos : t-shirt -> blanc ; pantalon -> noir du pantalon (selon la couleur autour du logo)
for i in range(1, n + 1):
    blob = lab == i
    core = blob & pink_d
    if core.sum() < 15:
        continue
    ring = ndi.binary_dilation(blob, iterations=6) & ~blob
    around_green = (green & ring).sum() / max(ring.sum(), 1)
    if around_green > 0.25:
        # logo sur t-shirt : blanc légèrement cassé, ombré comme le tissu
        shade = np.clip(V[core] / max(V[core].max(), 1e-3), 0.82, 1)
        out[core] = np.stack([0.97 * shade, 0.95 * shade, 0.93 * shade], -1)
        # liseré entre le logo et le tissu (ni rose ni vert) : couleur du t-shirt
        edge = ndi.binary_dilation(core, iterations=3) & ~core & ~gmask
        le = np.clip(V[edge] / max(np.percentile(V[green], 90), 1e-3), 0, 1.25)
        out[edge] = np.clip(target[None, :] * le[:, None] * 1.05, 0, 1)
    elif (ring & (V < 0.3)).sum() / max(ring.sum(), 1) > 0.5:
        # logo sur pantalon : remplissage avec la couleur moyenne sombre autour + léger grain
        dark = ring & (V < 0.35)
        col = rgb[dark].mean(0) if dark.sum() else np.array([0.08, 0.08, 0.09])
        fill = ndi.binary_dilation(core, iterations=4)
        noise = (np.random.default_rng(i).normal(0, 0.012, (fill.sum(), 1)))
        out[fill] = np.clip(col[None, :] + noise, 0, 1)

res = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))
res.save(dst, 'WEBP', quality=90)
print('logos :', n, 'pixels t-shirt :', int(gmask.sum()))
