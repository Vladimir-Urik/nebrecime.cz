#!/usr/bin/env python3
"""Convert lesson HTML pages to Hugo Markdown content files."""
import re
import os
from pathlib import Path

BASE = Path(__file__).parent

def extract_title(html: str) -> str:
    m = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
    if not m:
        return ""
    # Normalize whitespace (multi-line titles)
    return re.sub(r'\s+', ' ', m.group(1)).strip()

def extract_nav(html: str) -> list[dict]:
    """Extract anchor nav links (not Rozcestník) from <nav>."""
    nav_m = re.search(r'<nav>(.*?)</nav>', html, re.DOTALL)
    if not nav_m:
        return []
    nav_html = nav_m.group(1)
    links = re.findall(r'<a\s+href="#([^"]+)"[^>]*>(.*?)</a>', nav_html, re.DOTALL)
    return [{"anchor": a, "label": re.sub(r'<[^>]+>', '', label).strip()} for a, label in links]

def strip_tags(s: str) -> str:
    """Strip HTML tags and normalize whitespace."""
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s)).strip()

def markdownify(content: str) -> str:
    """Convert safe HTML tags to Markdown equivalents."""
    # Headings with optional id attribute
    for level, hashes in [(2, '##'), (3, '###'), (4, '####')]:
        def replace_heading(m, hashes=hashes):
            id_m = re.search(r'id="([^"]+)"', m.group(1))
            text = strip_tags(m.group(2))
            if id_m:
                return f'\n{hashes} {text} {{#{id_m.group(1)}}}\n'
            return f'\n{hashes} {text}\n'
        content = re.sub(
            rf'<h{level}([^>]*)>(.*?)</h{level}>',
            replace_heading, content, flags=re.DOTALL
        )

    # Bold: <b>...</b> and <strong>...</strong> (single-line only, no nested tags)
    content = re.sub(r'<(?:b|strong)>([^<]+)</(?:b|strong)>', r'**\1**', content)

    # Italic: <i>...</i> and <em>...</em> (single-line only)
    content = re.sub(r'<(?:i|em)>([^<]+)</(?:i|em)>', r'*\1*', content)

    return content

def dedent_html(content: str) -> str:
    """Remove leading tabs/spaces from each line so HTML isn't treated as code blocks."""
    lines = content.split('\n')
    return '\n'.join(line.lstrip('\t ') for line in lines)

def extract_main_content(html: str) -> str:
    """Extract <main> content, removing the <h1> tag."""
    m = re.search(r'<main>(.*?)</main>', html, re.DOTALL)
    if not m:
        return ""
    content = m.group(1).strip()
    # Remove the leading <h1>...</h1>
    content = re.sub(r'^\s*<h1[^>]*>.*?</h1>\s*', '', content, flags=re.DOTALL)
    return dedent_html(content).strip()

def build_frontmatter(title: str, nav: list[dict]) -> str:
    lines = ['---', 'markup: html', f'smallTitle: "{title}"']
    if nav:
        lines.append('nav:')
        for item in nav:
            lines.append(f'  - anchor: "{item["anchor"]}"')
            lines.append(f'    label: "{item["label"]}"')
    lines.append('---')
    return '\n'.join(lines)

def convert_file(src: Path, dest: Path):
    html = src.read_text(encoding='utf-8')
    title = extract_title(html)
    nav = extract_nav(html)
    content = extract_main_content(html)
    front = build_frontmatter(title, nav)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(front + '\n' + content + '\n', encoding='utf-8')
    print(f"  ✓ {src.name} → {dest.relative_to(BASE)}")

def main():
    conversions = [
        # (glob pattern, content subdir)
        (BASE / 'dvk', 'dvk', r'^\d+\.html$|^chronologie\.html$'),
        (BASE / 'vma', 'vma', r'^\d+\.html$'),
    ]

    for src_dir, content_subdir, pattern in conversions:
        dest_dir = BASE / 'content' / content_subdir
        print(f"\nConverting {src_dir.name}/...")
        files = sorted(src_dir.glob('*.html'), key=lambda p: p.name)
        for f in files:
            if re.match(pattern, f.name):
                stem = f.stem  # e.g. "1", "chronologie"
                # Use .md extension; markup: html in front matter bypasses goldmark buffer limits
                convert_file(f, dest_dir / f'{stem}.md')

    print("\nDone!")

if __name__ == '__main__':
    main()
