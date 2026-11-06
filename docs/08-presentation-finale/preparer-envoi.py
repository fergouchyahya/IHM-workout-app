"""Build the teacher-facing G6 archive from verified local deliverables."""
from pathlib import Path
from tempfile import TemporaryDirectory
from io import BytesIO
import csv
import hashlib
import html
import json
import re
import shutil
import subprocess
import zipfile

from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[2]
DECK = ROOT / 'docs/08-presentation-finale'
OUT = ROOT / 'output/envoi'
PACK = OUT / 'G6'
MEMBERS = ['Marie YU-BARREAU', 'Matthieu MULLER', 'Sami ZEFIZEF', 'Yahya FERGOUCH']
APP = 'prototypes/propotype%201/01-connexion/index.html'
CREAM, NAVY, PURPLE, CORAL = '#fffbea', '#183b4b', '#44317e', '#dd392d'


def build():
    PACK.mkdir(parents=True, exist_ok=True)
    (PACK / 'captures').mkdir(exist_ok=True)
    (PACK / 'slides').mkdir(exist_ok=True)
    report = json.loads((DECK / 'verification.json').read_text())
    source_pdf = ROOT / 'output/pdf/G6.pdf'
    assert report['passed']
    assert hashlib.sha256(source_pdf.read_bytes()).hexdigest() == report['pdfSha256']
    content = json.loads(subprocess.check_output([
        'node', '-e', 'const fs=require("fs"),vm=require("vm");const c={window:{}};'
        'vm.runInNewContext(fs.readFileSync(process.argv[1],"utf8"),c);'
        'process.stdout.write(JSON.stringify(c.window.presentationContent));', str(DECK / 'slides.js')
    ]))
    fresh = json.loads((ROOT / 'output/playwright/envoi-g6/captures.json').read_text())['captures']
    provenance = json.loads((DECK / 'visuels/provenance.json').read_text())
    scenarios = {
        'decouverte': 'Découvrir', 'recherche': 'Recherche avec espace final',
        'preparation': 'Préparer les cibles', 'entrainement': 'Séance en cours',
        'serie': 'Renseigner une série', 'recopie': 'Recopier un résultat',
        'correction': 'Corriger une série', 'annulation': 'Annuler sans écraser une correction',
        'verification': 'Vérifier avant de terminer', 'bilan': 'Bilan conservé',
        'squelette': 'Navigation et programmes', 't2-reserve': 'Espace de séance encore réservé',
    }
    inventory = []
    for capture in provenance['captures']:
        name = capture['file']
        stage = {'p1': 'Prototype 1', 'p2': 'Prototype 2', 'p3': 'Version finale'}[capture['version']]
        profile = 'Thomas - débutant' if name.startswith('thomas-') else ('Structure initiale' if capture['version'] == 'p1' else 'Suivi avec RPE')
        inventory.append({'file': name, 'title': scenarios[capture['scenario']], 'stage': stage, 'format': profile, 'kind': 'interface'})
        shutil.copy2(DECK / 'visuels' / name, PACK / 'captures' / name)
    for capture in fresh:
        inventory.append({'file': capture['file'], 'title': capture['title'], 'stage': 'Version finale', 'format': capture['device'], 'kind': 'interface'})
        shutil.copy2(ROOT / 'output/playwright/envoi-g6' / capture['file'], PACK / 'captures' / capture['file'])
    for asset in provenance['derivedAssets']:
        name = asset['file']
        inventory.append({'file': name, 'title': 'Fil de fer' if name == 'fil-de-fer.png' else name.removesuffix('.png').replace('-', ' '), 'stage': 'Première exploration' if name == 'fil-de-fer.png' else 'Analyse des tâches', 'format': 'diagramme', 'kind': 'interface' if name == 'fil-de-fer.png' else 'diagramme'})
        shutil.copy2(DECK / 'visuels' / name, PACK / 'captures' / name)
    with (PACK / 'captures/INDEX.csv').open('w', newline='', encoding='utf-8-sig') as stream:
        writer = csv.DictWriter(stream, fieldnames=['file', 'title', 'stage', 'format', 'kind'])
        writer.writeheader()
        writer.writerows(inventory)

    # Keep the PDF's application link relative to the extracted archive.
    with TemporaryDirectory(prefix='g6-submit-') as temp:
        script = Path(temp) / 'portable.js'
        script.write_text('var d=new PDFDocument(' + json.dumps(str(source_pdf)) + ');'
                          'd.findPage(16).get("Annots").get(0).get("A").put("URI",d.newString(' + json.dumps(APP) + '));'
                          'd.save(' + json.dumps(str(PACK / 'G6.pdf')) + ',"compress");')
        subprocess.run(['mutool', 'run', str(script)], check=True)
        subprocess.run(['pdftoppm', '-scale-to', '1400', '-png', str(PACK / 'G6.pdf'), str(Path(temp) / 'G6')], check=True)
        rendered = sorted(Path(temp).glob('G6-*.png'))
        assert len(rendered) == len(content['slides']) == 44
        slide_files = []
        for i, (image, slide) in enumerate(zip(rendered, content['slides']), 1):
            label = slide['id'].upper() if slide['appendix'] else f'{i:02}'
            name = f'G6-{label}.png'
            shutil.copy2(image, PACK / 'slides' / name)
            slide_files.append({'file': name, 'title': slide['title'], 'label': label})

    # Only runtime assets and presentation content: no private rehearsal assessment.
    target = PACK / 'docs/08-presentation-finale'
    target.mkdir(parents=True, exist_ok=True)
    for name in ['index.html', 'presentation.css', 'presentation.js']:
        shutil.copy2(DECK / name, target / name)
    (target / 'index.html').write_text((target / 'index.html').read_text().replace('../../output/pdf/G6.pdf', '../../G6.pdf'))
    for slide in content['slides']:
        slide['notes'] = ''
        slide['sources'] = []
        slide['body'] = slide['body'].replace('visuels/', '../../captures/')
        slide['body'] = re.sub(r'<button[^>]*data-video[^>]*>.*?</button>', '', slide['body'])
    (target / 'slides.js').write_text('window.presentationContent=' + json.dumps({'slides': content['slides']}, ensure_ascii=False) + ';\n')
    with (target / 'presentation.css').open('a') as stream:
        stream.write('\n#notes{display:none}\n')
    for file in (ROOT / 'prototypes/propotype 1').rglob('*'):
        if file.is_file() and file.suffix in {'.html', '.css', '.js', '.svg', '.png'}:
            destination = PACK / file.relative_to(ROOT)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file, destination)

    catalogue(inventory, fresh)
    gallery(PACK / 'captures.html', 'Captures du prototype et diagrammes', [
        {'href': 'captures/' + item['file'], 'title': item['stage'] + ' - ' + item['title'] + ' - ' + item['format']} for item in inventory])
    gallery(PACK / 'slides.html', 'Slides de la présentation', [
        {'href': 'slides/' + item['file'], 'title': item['label'] + ' - ' + item['title']} for item in slide_files])
    (PACK / 'index.html').write_text(portal())
    (PACK / 'LISEZ-MOI.txt').write_text(
        'GROUPE 6 - TRAINING APP\n' + '\n'.join(MEMBERS) + '\n\n'
        '1. G6.pdf : présentation principale (17 slides + 27 annexes).\n'
        '2. G6-prototype.pdf : catalogue visuel des prototypes et diagrammes.\n'
        '3. index.html : accès aux galeries, à la présentation interactive et au prototype.\n'
        '4. captures/ : images originales en pleine résolution ; INDEX.csv donne les légendes.\n'
        '5. slides/ : les 44 slides en PNG.\n\n'
        'Extraire entièrement le ZIP avant ouverture. Le prototype se lance depuis index.html, puis "Essayer sans compte". '
        'Les fichiers sont locaux et les données de démonstration restent dans le navigateur.\n'
        'Alternative : dans le dossier extrait, lancer python3 -m http.server 8765 --bind 127.0.0.1 '
        'puis ouvrir http://127.0.0.1:8765/.\n'
        'Présentation : flèches pour naviguer, O pour le sommaire, A pour les annexes, F pour le plein écran.\n\n'
        'Les captures illustrent les interfaces avec des données de démonstration ; elles ne sont pas un enregistrement des tests humains.\n')
    (OUT / 'email-envoi-G6.txt').write_text(
        'À : laurence.nigay@univ-grenoble-alpes.fr\n'
        'Objet : Projet IHM - Groupe 6 - Présentation du 6 novembre\n\n'
        'Bonjour Madame,\n\n'
        'Veuillez trouver en pièce jointe G6.pdf, la présentation du groupe 6 pour la soutenance du projet IHM du 6 novembre.\n\n'
        'Nous joignons également G6-envoi.zip, qui contient le catalogue visuel des prototypes et diagrammes, '
        'ainsi que le prototype exécutable localement.\n\n'
        'Membres du groupe : ' + ', '.join(MEMBERS) + '.\n\n'
        'Cordialement,\nLe groupe 6\n\n'
        'À joindre : G6/G6.pdf et G6-envoi.zip. Envoi avant le 5 novembre 2026 à 20 h, heure de Paris.\n')
    archive = OUT / 'G6.zip'
    with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipped:
        for file in sorted(PACK.rglob('*')):
            if file.is_file():
                zipped.write(file, file.relative_to(OUT))
    email_archive = email_pack()
    summary = {'archive': str(archive.relative_to(ROOT)), 'archiveBytes': archive.stat().st_size,
               'emailArchive': str(email_archive.relative_to(ROOT)), 'emailArchiveBytes': email_archive.stat().st_size,
               'interfaceImages': sum(x['kind'] == 'interface' for x in inventory),
               'diagrams': sum(x['kind'] == 'diagramme' for x in inventory),
               'slideImages': len(slide_files), 'cataloguePages': 46, 'sent': False}
    (OUT / 'contenu-G6.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(summary, ensure_ascii=False))


def catalogue(inventory, fresh):
    pdfmetrics.registerFont(TTFont('G6', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
    pdfmetrics.registerFont(TTFont('G6Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
    c = canvas.Canvas(str(PACK / 'G6-prototype.pdf'), pagesize=(1200, 675))
    c.setTitle('G6 - Training App - Catalogue des prototypes')
    c.setAuthor('Groupe 6')
    page = 0

    def start(title, subtitle):
        nonlocal page
        page += 1
        c.setFillColor(CREAM); c.rect(0, 0, 1200, 675, fill=1, stroke=0)
        c.setFillColor(CORAL); c.setFont('G6Bold', 13); c.drawString(48, 635, 'GROUPE 6 - COMPLÉMENT VISUEL')
        c.setFillColor(NAVY); c.setFont('G6Bold', 28); c.drawString(48, 590, title)
        c.setFont('G6', 16); c.drawString(48, 560, subtitle)
        c.setFont('G6', 11); c.drawRightString(1152, 22, f'{page:02} / G6')

    def picture(name, x, y, w, h):
        # The archive keeps lossless originals; JPEG embedding keeps the PDF small.
        image = Image.open(PACK / 'captures' / name).convert('RGB')
        image.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
        stream = BytesIO(); image.save(stream, format='JPEG', quality=80, optimize=True)
        stream.seek(0)
        c.drawImage(ImageReader(stream), x, y, w, h, preserveAspectRatio=True, anchor='c')

    def pair(title, subtitle, left, right, labels):
        start(title, subtitle)
        for x, name, label in [(48, left, labels[0]), (624, right, labels[1])]:
            c.setFont('G6Bold', 17); c.setFillColor(PURPLE); c.drawString(x, 520, label)
            picture(name, x, 53, 528, 450)
        c.showPage()

    start('Training App - les interfaces en images', 'Fil de fer, prototypes historiques et version finale')
    c.setFont('G6Bold', 32); c.setFillColor(PURPLE); c.drawString(48, 470, '69 vues d’interface + 10 diagrammes')
    c.setFont('G6', 21)
    for i, member in enumerate(MEMBERS): c.drawString(48, 405-i*36, member)
    c.setFillColor(NAVY); c.setFont('G6', 18)
    c.drawString(48, 200, 'Parcours, comparaisons avant / après et vues téléphone / ordinateur.')
    c.drawString(48, 166, 'Données de démonstration ; les images ne sont pas le film des tests humains.')
    c.showPage()
    start('Fil de fer', 'Accueil, préparation et séance en cours')
    picture('fil-de-fer.png', 48, 65, 1104, 460); c.showPage()
    pair('Prototype 1', 'Premier cadre de navigation et espaces encore réservés', 'p1-squelette.png', 'p1-t2-reserve.png', ['Navigation et programmes', 'Séance encore réservée'])
    thomas = [x for x in inventory if x['file'].startswith('thomas-p2-')]
    for item in thomas:
        pair('Thomas - ' + item['title'], 'Même étape du parcours, deux versions de l’interface', item['file'], item['file'].replace('p2-', 'p3-'), ['Prototype 2', 'Version finale'])
    advanced = [x for x in inventory if x['file'].startswith('p2-')]
    for item in advanced:
        pair('Autres outils - ' + item['title'], 'Suivi avec RPE - données de démonstration', item['file'], item['file'].replace('p2-', 'p3-'), ['Prototype 2', 'Version finale'])
    for item in [x for x in fresh if x['device'] == 'mobile']:
        pair(item['title'], 'Version finale - deux formats d’écran', item['file'], item['file'].replace('-mobile-', '-ordinateur-'), ['Téléphone', 'Ordinateur'])
    for item in [x for x in inventory if x['kind'] == 'diagramme']:
        start('Analyse des tâches', item['title'])
        picture(item['file'], 48, 50, 1104, 470); c.showPage()
    assert page == 46, page
    c.save()


def gallery(path, title, items):
    cards = ''.join('<figure><a href="' + html.escape(i['href']) + '"><img loading="lazy" src="' + html.escape(i['href']) + '" alt="' + html.escape(i['title']) + '"></a><figcaption>' + html.escape(i['title']) + '</figcaption></figure>' for i in items)
    path.write_text('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>G6 - ' + html.escape(title) + '</title><style>' + STYLE + '</style><body><main><a href="index.html">← Dossier G6</a><h1>' + html.escape(title) + '</h1><p>Cliquer une image pour ouvrir sa pleine résolution.</p><div class="gallery">' + cards + '</div></main></body></html>')


STYLE = 'body{margin:0;background:#fffbea;color:#183b4b;font:18px/1.5 Arial,sans-serif}main{max-width:1200px;margin:auto;padding:40px}h1,a{color:#44317e}nav{display:flex;gap:16px;flex-wrap:wrap}nav a{padding:16px;border:2px solid #44317e;border-radius:5px;text-decoration:none}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}figure{margin:0;padding:16px;background:white;border:1px solid #dfdfd0}img{width:100%;height:260px;object-fit:contain}figcaption{font-size:15px;margin-top:12px}.members{border-left:4px solid #dd392d;padding-left:22px}code{background:white;padding:4px}'


def portal():
    return '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>G6 - Training App</title><style>' + STYLE + '</style><body><main><p>GROUPE 6 - PROJET IHM</p><h1>Training App</h1><p class="members">' + '<br>'.join(MEMBERS) + '</p><nav><a href="G6.pdf">Présentation PDF</a><a href="G6-prototype.pdf">Catalogue des prototypes</a><a href="docs/08-presentation-finale/index.html">Présentation interactive</a><a href="' + APP + '">Essayer l’application ↗</a><a href="captures.html">Toutes les captures</a><a href="slides.html">Les 44 slides en images</a></nav><h2>Essayer le prototype</h2><p>Ouvrir l’application puis choisir <strong>Essayer sans compte</strong>. Les données restent dans le navigateur.</p><p>Les galeries contiennent les captures historiques, la version finale sur téléphone et ordinateur et les diagrammes. Cliquer une image pour la voir en pleine résolution.</p><p>Pour une ouverture par serveur local : <code>python3 -m http.server 8765 --bind 127.0.0.1</code>, puis <code>http://127.0.0.1:8765/</code>.</p></main></body></html>'


def email_pack():
    archive = OUT / 'G6-envoi.zip'
    portal_text = re.sub(r'<a href="docs/08-presentation-finale/index.html">.*?</a>|<a href="captures.html">.*?</a>|<a href="slides.html">.*?</a>', '', portal())
    portal_text = portal_text.replace('Les galeries contiennent les captures historiques, la version finale sur téléphone et ordinateur et les diagrammes. Cliquer une image pour la voir en pleine résolution.', 'Le catalogue PDF contient 69 vues des interfaces et 10 diagrammes, du fil de fer à la version finale.')
    readme = 'GROUPE 6 - TRAINING APP\n' + '\n'.join(MEMBERS) + '\n\nG6.pdf : présentation, 17 slides et 27 annexes.\nG6-prototype.pdf : 69 vues d’interface et 10 diagrammes.\nindex.html : accès aux PDF et au prototype.\n\nExtraire entièrement le ZIP, ouvrir index.html et choisir Essayer l’application, puis Essayer sans compte.\nLes données restent dans le navigateur. Les captures utilisent des données de démonstration et ne sont pas le film des tests humains.\n'
    with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipped:
        for file in [PACK / 'G6.pdf', PACK / 'G6-prototype.pdf'] + sorted((PACK / 'prototypes').rglob('*')):
            if file.is_file():zipped.write(file, Path('G6-envoi') / file.relative_to(PACK))
        zipped.writestr('G6-envoi/index.html', portal_text)
        zipped.writestr('G6-envoi/LISEZ-MOI.txt', readme)
    return archive


if __name__ == '__main__':
    build()
