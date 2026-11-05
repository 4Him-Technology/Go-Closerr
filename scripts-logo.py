# Recorta os arquivos originais da logo metch (PNG com fundo transparente) e gera os tamanhos usados no site.
# Uso: python scripts-logo.py <pasta com logo-escura.png, logo-branca.png e simbolo.png>
import sys
from PIL import Image

pasta = sys.argv[1].rstrip("/\\") + "/"

def recorte(nome, pad=6):
    im = Image.open(pasta + nome).convert("RGBA")
    x0, y0, x1, y1 = im.getchannel("A").getbbox()
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))

logo = recorte("logo-escura.png")
logo.save("public/logo.png", optimize=True)
recorte("logo-branca.png").save("public/logo-branco.png", optimize=True)
simbolo = recorte("simbolo.png")
s = simbolo.copy(); s.thumbnail((256, 256)); s.save("public/simbolo.png", optimize=True)
s = simbolo.copy(); s.thumbnail((64, 64)); s.save("public/favicon.png", optimize=True)

# versão do cabeçalho: apaga a linha do slogan, que fica à direita do símbolo, abaixo do nome
a = logo.getchannel("A"); W, H = logo.size
vao = next(x for x in range(60, W) if all(a.getpixel((x, y)) <= 40 for y in range(H)))
xt = next(x for x in range(vao, W) if any(a.getpixel((x, y)) > 40 for y in range(H)))
linhas = [y for y in range(H) if any(a.getpixel((x, y)) > 40 for x in range(xt, W))]
inicio_slogan = next(linhas[i] for i in range(1, len(linhas)) if linhas[i] > linhas[i - 1] + 1)
cab = logo.copy(); px = cab.load()
for y in range(inicio_slogan - 2, H):
    for x in range(xt - 2, W):
        px[x, y] = (0, 0, 0, 0)
cab.crop(cab.getchannel("A").getbbox()).save("public/logo-cabecalho.png", optimize=True)
