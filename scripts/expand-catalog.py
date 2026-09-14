"""Retired Amazon-reference importer.

The original one-off script copied observed amazon.com CDN files into the deployed
public directory and populated branded product records. That workflow is deliberately
disabled because this repository is intended for a public assignment demo.

Use ``scripts/replace-reference-content.mjs`` to rebuild the catalog's original,
unbranded content mapping. Do not restore a downloader or CDN cache here.
"""

raise SystemExit(
    "Reference import is retired: public builds must use original, unbranded assets."
)
