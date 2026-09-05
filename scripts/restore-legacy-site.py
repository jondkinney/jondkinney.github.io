#!/usr/bin/env python3
"""Preserve historical URLs without replacing the current site's built files."""

import os
from pathlib import Path
import re
import shutil
import sys

if len(sys.argv) != 2:
    raise SystemExit("Pass the checkout of the original GitHub Pages site.")

source = Path(sys.argv[1]).resolve(strict=True)
output = Path("dist/client").resolve()
if not (output / "index.html").is_file():
    raise SystemExit("Build the current site with npm run build:pages first.")

restored = 0
for directory, directories, files in os.walk(source):
    directories[:] = [name for name in directories if not name.startswith(".")]
    for name in files:
        if name.startswith("."):
            continue
        original = Path(directory) / name
        destination = output / original.relative_to(source)
        if destination.exists() or original.is_symlink():
            continue
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(original, destination)
        if destination.suffix in (".html", ".xml"):
            contents = destination.read_bytes()
            contents = re.sub(
                rb"http://(?:www\.)?jonkinney\.com(?=[/\"'<\s]|$)",
                b"https://jonkinney.com",
                contents,
            )
            if destination.suffix == ".html":
                # Upgrade old embedded HTTP fonts/scripts when served over TLS.
                contents = re.sub(
                    rb"<head(?:\s[^>]*)?>",
                    lambda match: match[0] + b'\n<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">',
                    contents,
                    count=1,
                    flags=re.I,
                )
            destination.write_bytes(contents)
        restored += 1

print(f"Preserved {restored} historical files alongside the new homepage.")
