# BeeFax
A Ceefax/Weatherscan-Esque Clone

---

## Branches
- **[`main`](https://github.com/sykeben/BeeFax/tree/main)**
    - Development branch.
    - Not hosted or published to GitHub pages.
    - Intended for small changes that will be merged into the production branch when fully polished.
- **[`production`](https://github.com/sykeben/BeeFax/tree/production)**
    - Production branch.
    - Published and hosted on GitHub pages.
    - Intended for larger changes and finalized bugfixes.

---

## File Structure
| Directory | Subdirectory | File | Description |
|---|---|---|---|
| **[`emulation`](https://github.com/sykeben/BeeFax/tree/main/emulation)** | | | Scripts, styles, and other resources needed to create and run the core elements of the front- and back-end |
| | *[`back`](https://github.com/sykeben/BeeFax/tree/main/emulation/back)* | | Core backend scripts. |
| | | [`main.js`](https://github.com/sykeben/BeeFax/blob/main/emulation/back/main.js) | Main script. Loads and starts execution of core components. |
| | *[`charset`](https://github.com/sykeben/BeeFax/tree/main/emulation/charset)* | | Display fonts. |
| | | [`font-cryllic-ext.woff2`](https://github.com/sykeben/BeeFax/blob/main/emulation/charset/font-cryllic-ext.woff2) | Font for cryllic-extended characters. |
| | | [`font-cryllic.woff2`](https://github.com/sykeben/BeeFax/blob/main/emulation/charset/font-cryllic.woff2) | Font for cryllic characters. |
| | | [`font-greek.woff2`](https://github.com/sykeben/BeeFax/blob/main/emulation/charset/font-greek.woff2) | Font for greek characters. |
| | | [`font-latin-ext.woff2`](https://github.com/sykeben/BeeFax/blob/main/emulation/charset/font-latin-ext.woff2) | Font for latin-extended characters. |
| | | [`font-latin.woff2`](https://github.com/sykeben/BeeFax/blob/main/emulation/charset/font-latin.woff2) | Font for latin characters. |
| | *[`front`](https://github.com/sykeben/BeeFax/tree/main/emulation/charset)* | | Core frontend scripts and styles. |