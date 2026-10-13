# Baixa as fotos de banco de imagens (Pexels e Unsplash, licenças gratuitas) e gera WebP otimizado em public/fotos.
import io, sys, urllib.request
from PIL import Image, ImageOps

FOTOS = [
  # nome, url, recorte (None = mantém; 'paisagem' = centro em 3:2)
  ("sala-01", "https://images.pexels.com/photos/37654664/pexels-photo-37654664.jpeg?auto=compress&w=1800", None),
  ("sala-02", "https://images.pexels.com/photos/39824872/pexels-photo-39824872.jpeg?auto=compress&w=1800", None),
  ("sala-03", "https://images.pexels.com/photos/7108118/pexels-photo-7108118.jpeg?auto=compress&w=1800", None),
  ("sala-04", "https://images.unsplash.com/photo-1551076805-e1869033e561?w=1800&q=80&fm=jpg", None),
  ("sala-05", "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1800&q=80&fm=jpg", None),
  ("sala-06", "https://images.pexels.com/photos/17092745/pexels-photo-17092745.jpeg?auto=compress&w=1800", None),
  ("sala-07", "https://images.pexels.com/photos/12104186/pexels-photo-12104186.jpeg?auto=compress&w=1800", None),
  ("sala-08", "https://images.pexels.com/photos/20186736/pexels-photo-20186736.jpeg?auto=compress&w=1800", None),
  ("sala-09", "https://images.pexels.com/photos/39442464/pexels-photo-39442464.jpeg?auto=compress&w=1800", None),
  ("sala-10", "https://images.unsplash.com/photo-1559000357-f6b52ddfbe37?w=1800&q=80&fm=jpg", None),
  ("sala-11", "https://images.pexels.com/photos/11722768/pexels-photo-11722768.jpeg?auto=compress&w=1800", None),
  ("sala-12", "https://images.pexels.com/photos/7108114/pexels-photo-7108114.jpeg?auto=compress&w=1800", "paisagem"),
  ("sala-13", "https://images.pexels.com/photos/7108115/pexels-photo-7108115.jpeg?auto=compress&w=1800", "paisagem"),
  ("foco-01", "https://images.pexels.com/photos/19563295/pexels-photo-19563295.jpeg?auto=compress&w=1800", None),
  ("foco-02", "https://images.unsplash.com/photo-1685997176548-14f9f7f3a918?w=1800&q=80&fm=jpg", None),
  ("equip-01", "https://images.pexels.com/photos/36101262/pexels-photo-36101262.jpeg?auto=compress&w=1800", "paisagem"),
  ("equip-02", "https://images.pexels.com/photos/36101264/pexels-photo-36101264.jpeg?auto=compress&w=1800", "paisagem"),
  ("equipe-01", "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=1800&q=80&fm=jpg", None),
  ("equipe-02", "https://images.unsplash.com/photo-1664902273556-600a6e50beda?w=1800&q=80&fm=jpg", None),
]

def baixar(url):
    # curl lida melhor com a CDN do Unsplash, que corta conexões do urllib no meio
    import subprocess
    return subprocess.run(["curl", "-sL", "--retry", "4", "-A", "Mozilla/5.0", url], check=True, capture_output=True).stdout

total = 0
import os
for nome, url, recorte in FOTOS:
    if os.path.exists(f"public/fotos/{nome}.webp"):
        continue
    try:
        im = ImageOps.exif_transpose(Image.open(io.BytesIO(baixar(url)))).convert("RGB")
    except Exception as e:
        print("FALHOU", nome, e); sys.exit(1)
    if recorte == "paisagem":
        w, h = im.size; nh = int(w * 2 / 3); top = max(0, (h - nh) // 2)
        im = im.crop((0, top, w, top + nh))
    im.thumbnail((1600, 1600))
    destino = f"public/fotos/{nome}.webp"
    im.save(destino, "WEBP", quality=72, method=6)
    tam = __import__("os").path.getsize(destino); total += tam
    print(nome, im.size, f"{tam//1024} KB")
print("total", total // 1024, "KB")
