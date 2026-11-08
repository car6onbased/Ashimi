"""Build only the public portfolio. The source of the world page is its deep URL."""
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
from urllib.parse import urlsplit

root = Path(__file__).resolve().parents[1]
public = root / "public"
out = root / "dist"
sim = "service-simulator/council-playable"
version = (root / "VERSION").read_text().strip()
if not re.fullmatch(r"\d+\.\d+\.\d+", version):
    raise ValueError("VERSION must be a semantic version, e.g. 0.1.0")
shutil.copytree(public, out, dirs_exist_ok=True)
for f in out.rglob("*"):
    if f.is_file() and f.relative_to(out).as_posix() != "index.html" and not (public / f.relative_to(out)).is_file():
        f.unlink()

for page in out.rglob("*.html"):
    html = page.read_text()
    if 'id="portfolio-menu"' in html:
        label = '<span class="portfolio-beta">Portfolio beta · v' + version + '</span>'
        html, count = re.subn(r'(<span id="portfolio-menu-title">[^<]+</span>)', r'<div class="portfolio-menu-identity">\1' + label + '</div>', html, count=1)
        if count != 1:
            raise ValueError(f"Could not place the release label in {page}")
        page.write_text(html)
deep = (out / sim / "index.html").read_text()
(out / "index.html").write_text(deep.replace("<head>", '<head>\n  <base href="/' + sim + '/">', 1))

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.base = None
        self.refs = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "base":
            self.base = values.get("href")
        else:
            self.refs.extend((v for k, v in attrs if k in ("href", "src") and v))

for page in out.rglob("*.html"):
    parser = Links()
    parser.feed(page.read_text())
    base = out / parser.base.lstrip("/") if parser.base else page.parent
    for ref in parser.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc or not url.path:
            continue
        target = out / url.path.lstrip("/") if url.path.startswith("/") else base / url.path
        if target.is_dir():
            target = target / "index.html"
        if not target.is_file():
            raise FileNotFoundError(f"{page.relative_to(out)} links to missing {ref}")
print(f"Built portfolio beta v{version}; checked local page links.")
