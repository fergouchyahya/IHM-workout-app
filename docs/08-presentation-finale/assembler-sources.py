#!/usr/bin/env python3
"""Build a presentation source snapshot from tracked Git files, without browser mutations."""
import argparse
from datetime import datetime, timezone
import hashlib
import io
import json
from pathlib import Path
import struct
import subprocess
import zipfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--revision', default='HEAD', help='Git commit to snapshot (default: HEAD)')
    args = parser.parse_args()
    bundle = Path(__file__).resolve().parent
    repo = bundle.parents[1]
    revision = subprocess.check_output(
        ['git', 'rev-parse', '--verify', args.revision + '^{commit}'], cwd=repo, text=True
    ).strip()
    paths = ['README.md', 'CONTRIBUTING.md', '.gitignore', 'assets', 'prototypes',
             'research', 'reunions', 'tests', 'output/playwright']
    paths += ['docs/' + name for name in (
        '01-probleme', '02-utilisateurs-personas', '03-scenarios', '04-analyse-taches',
        '05-decisions-conception', '06-prototypes', '07-evaluation')]
    archive_bytes = subprocess.check_output(
        ['git', 'archive', '--format=zip', revision, '--', *paths], cwd=repo
    )
    figures = bundle / 'visuels'
    figures.mkdir(exist_ok=True)
    sources = []
    with zipfile.ZipFile(io.BytesIO(archive_bytes)) as archive:
        for entry in archive.infolist():
            if not entry.is_dir():
                content = archive.read(entry)
                sources.append({'path': entry.filename, 'bytes': len(content),
                                'sha256': hashlib.sha256(content).hexdigest()})
        for name in ('global', 't1', 't2', 't3', 't4', 't5'):
            filename = 'arbre-taches-' + name + '.png'
            (figures / filename).write_bytes(archive.read('assets/diagrammes/' + filename))
        diagrams = archive.read('docs/04-analyse-taches/arbres-visuels.md').decode()
        mermaid = diagrams.split('```mermaid\n', 1)[1].split('```', 1)[0]
        (figures / 't5-corrige.mmd').write_text(mermaid, encoding='utf-8')
    archive_path = bundle / 'sources-projet.zip'
    archive_path.write_bytes(archive_bytes)
    visual_files = []
    for path in sorted(figures.iterdir()):
        if not path.is_file():
            continue
        content = path.read_bytes()
        item = {'path': 'visuels/' + path.name, 'bytes': len(content),
                'sha256': hashlib.sha256(content).hexdigest()}
        if content.startswith(b'\x89PNG\r\n\x1a\n'):
            item['width'], item['height'] = struct.unpack('>II', content[16:24])
        visual_files.append(item)
    provenance_path = figures / 'provenance.json'
    capture_provenance = json.loads(provenance_path.read_text()) if provenance_path.exists() else None
    manifest = {
        'source_commit': revision,
        'assembled_at_utc': datetime.now(timezone.utc).isoformat(),
        'archive': {'path': archive_path.name, 'bytes': len(archive_bytes),
                    'sha256': hashlib.sha256(archive_bytes).hexdigest()},
        'source_file_count': len(sources),
        'sources': sources,
        'visual_files': visual_files,
        'capture_provenance': capture_provenance,
        'evidence_status': 'Technical verification and synthetic demonstrations; no collected experimental results.',
        'excluded': ['docs/08-presentation-finale (avoid recursion)', '.git metadata',
                     'untracked files, including local course PDFs']
    }
    (bundle / 'manifest-sources.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )
    print(f'Snapshot {revision[:7]}: {len(sources)} source files, {len(visual_files)} visual files, '
          f'{len(archive_bytes):,} archive bytes')
    if capture_provenance and capture_provenance.get('source_commit') != revision:
        print('Note: captures refer to another revision; their provenance has been preserved.')


if __name__ == '__main__':
    main()
