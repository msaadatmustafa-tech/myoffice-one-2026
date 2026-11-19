# MyOffice One 2026 — Free Offline Office Suite for Windows

[![Windows build](https://github.com/msaadatmustafa-tech/myoffice-one-2026/actions/workflows/build-installer.yml/badge.svg)](https://github.com/msaadatmustafa-tech/myoffice-one-2026/actions/workflows/build-installer.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.txt)
[![Platform: Windows x64](https://img.shields.io/badge/Platform-Windows%20x64-185abd.svg)](#download-and-install-on-windows)

**Write documents. Calculate spreadsheets. Create presentations. Work offline.**

Free, independent, offline documents, spreadsheets and slides editor for Windows. Version **0.4.1**.

MyOffice One is a free office suite with a document editor, spreadsheet editor and presentation editor in one desktop app. It supports basic DOCX, XLSX and PPTX workflows, local file saving and editable project backups.

**[Installation](#download-and-install-on-windows) · [Features](#features-and-formats) · [Compatibility](#compatibility-and-backups) · [FAQ](#frequently-asked-questions) · [Report an issue](https://github.com/msaadatmustafa-tech/myoffice-one-2026/issues/new/choose)**

**Free for everyone:** use, copy, modify and redistribute the custom application code under the [MIT license](LICENSE.txt), including personal and commercial use. No Microsoft Office installation is required. This project is independent and is not affiliated with or endorsed by Microsoft. Electron and other dependencies retain their own licenses.

## Download and install on Windows

This repository contains **source code**, not a prebuilt installer. Downloading GitHub's source ZIP does not install the app.

1. Install **Node.js 24 LTS** with npm from https://nodejs.org/.
2. Download this repository using **Code > Download ZIP**, then extract it to a writable folder.
3. Connect to the internet for the first dependency download and installer build.
4. Double-click **BUILD INSTALLER - Windows 11.cmd** in the extracted folder.
5. After the checks and build succeed, open `dist-installer` and run `MyOffice-One-Setup-0.4.1-x64.exe`.
6. Follow the installer and approve the expected administrator prompt. Choose an installation folder; Desktop and Start Menu shortcuts are created.
7. Start **MyOffice One**. The installed editor works offline.

The installer target is **64-bit Windows**, intended for Windows 11. Installation and basic document roundtrips were verified on a Windows PC; uninstall/reinstall is not yet verified. See the [PC test report](docs/windows-pc-test.md). The installer is not code-signed; use a build whose source and origin you trust.

### Run without installing

Open `index.html` in a current Edge or Chrome browser. This mode does not register Windows file associations. Browser storage is local to that browser/profile: export important work and keep backups before clearing browser data.

On Windows, you can also double-click **Run MyOffice - No Install.cmd**.

### Aasaan steps — Roman Urdu

1. Node.js 24 LTS install karein.
2. **Code > Download ZIP** se source download karke **Extract All** karein.
3. **BUILD INSTALLER - Windows 11.cmd** par double-click karein.
4. Build complete hone par `dist-installer` ke andar setup EXE chalayein.
5. Install hone ke baad **MyOffice One** Start Menu ya Desktop se kholein.

Sirf browser mein chalane ke liye `index.html` khol sakte hain. Zaroori files ka backup apne PC par save rakhein.

### Run or build from a terminal

From the extracted project directory:

```powershell
npm ci
npm test
npm start
```

Build the Windows installer:

```powershell
npm run installer-win
```

Build a portable Windows app folder:

```powershell
npm run package-win
```

Outputs go into `dist-installer/` or `dist-portable/`. Node.js and internet are build requirements; users of a successfully built installer do not need Node.js to launch the installed app.

## Features and formats

- Document editing with text formatting, links, tables and pictures.
- Spreadsheets with cell references, arithmetic, SUM, AVERAGE, MIN, MAX, COUNT, IF and ROUND.
- Basic slide editing and presentation export.
- Document, workbook and presentation import/export with DOCX, XLSX and PPTX support.
- Native desktop open/save dialogs and `.myoffice` project backups.
- Windows Explorer Open with integration for `.docx`, `.xlsx`, `.pptx` and `.myoffice`.

## Choose the default app

Right-click a supported file > **Open with > Choose another app > MyOffice One**. Select the Windows option to always use it if desired. You can also use **Settings > Apps > Default apps**. The installer registers an option; Windows leaves the default choice to you.

## Compatibility and backups

This is an early independent editor, with limited Office compatibility. Complex DOCX, XLSX and PPTX files may lose layout, advanced formatting or unsupported features when imported or exported. It does not provide full Microsoft Office feature parity. Open copies of important documents and use **Save As** to preserve originals. Native file input is limited to 75 MB.

## Uninstall

Use **Windows Settings > Apps > Installed apps > MyOffice One > Uninstall**. Export and back up your work first.

## Troubleshooting

- **node/npm not found:** reinstall Node.js with npm, then reopen your terminal or build script.
- **Dependency download failed:** check your internet connection and rerun the build.
- **Checks failed:** resolve the reported error before attempting to distribute a build.
- **Open with entry missing:** finish installation, then use Choose another app to select the installed application.
- **Unexpected formatting:** retain the original file and use simpler formatting or another editor for unsupported content.

## GitHub Actions build

The [Windows installer workflow](https://github.com/msaadatmustafa-tech/myoffice-one-2026/actions/workflows/build-installer.yml) runs on pushes to `main`, pull requests and manual dispatch. It installs locked dependencies, runs tests and builds a Windows x64 NSIS installer. After a successful run, download its `MyOffice-One-Windows-Setup` artifact and extract it. Artifacts expire after 30 days and may require GitHub sign-in. Check the actual run result before downloading; a build badge does not verify installation on your PC.

## Frequently asked questions

**Is MyOffice One free for everyone?** Yes. The custom application code uses the MIT license, allowing personal and commercial use, modification and redistribution with the license notice.

**Does it work offline?** Editing and local file workflows work offline. Downloading build dependencies requires internet access.

**Do I need Microsoft Office?** No. This is an independent application.

**Can it open Word, Excel and PowerPoint files?** Basic DOCX, XLSX and PPTX content is supported. Advanced formatting, macros and other complex features are not guaranteed. Preserve your originals.

**Is the GitHub ZIP an installer?** No. It contains source code. Use the build instructions above or a successfully completed Actions build artifact.

**Where is my work stored?** Draft recovery uses local browser/app storage. Save or export files to disk and use Backup for a `.myoffice` copy. There is no cloud synchronization.

## Contributing and support

See [CONTRIBUTING.md](CONTRIBUTING.md) for development and bug reports, and [CHANGELOG.md](CHANGELOG.md) for fixes. Include reproduction steps and use a small, non-sensitive sample file when reporting a format issue.

## Development checks

`npm test` runs JavaScript syntax checks, spreadsheet calculation and DOCX/XLSX generation smoke checks, plus mocked desktop file-open/save and file-association configuration checks. These are not an end-to-end Windows installer test. PPTX browser XML behavior is not covered by the Node smoke harness; basic PPTX save/reopen was verified in the desktop PC test.

## License

See [LICENSE.txt](LICENSE.txt). The software is provided as-is, without warranty.
