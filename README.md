# MyOffice One 2026

Free, independent, offline documents, spreadsheets and slides editor for Windows. Version **0.4.0**.

**Free for everyone:** use, copy, modify and redistribute the custom application code under the [MIT license](LICENSE.txt), including personal and commercial use. No Microsoft Office installation is required. This project is independent and is not affiliated with or endorsed by Microsoft. Electron and other dependencies retain their own licenses.

## Download and install on Windows

This repository contains **source code**, not a prebuilt installer. Downloading GitHub's source ZIP does not install the app.

1. Install **Node.js 24 LTS** with npm from https://nodejs.org/.
2. Download this repository using **Code > Download ZIP**, then extract it to a writable folder.
3. Connect to the internet for the first dependency download and installer build.
4. Double-click **BUILD INSTALLER - Windows 11.cmd** in the extracted folder.
5. After the checks and build succeed, open `dist-installer` and run `MyOffice-One-Setup-0.4.0-x64.exe`.
6. Follow the installer and approve the expected administrator prompt. Choose an installation folder; Desktop and Start Menu shortcuts are created.
7. Start **MyOffice One**. The installed editor works offline.

The installer target is **64-bit Windows**, intended for Windows 11. End-to-end installation and uninstall verification is still required. The installer is not code-signed; use a build whose source and origin you trust.

### Run without installing

Open `index.html` in a current Edge or Chrome browser. This mode does not register Windows file associations. Browser storage is local to that browser/profile: export important work and keep backups before clearing browser data.

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

The included **Build MyOffice One Windows Installer** workflow can be run manually from the **Actions** tab. After a successful run, download its `MyOffice-One-Windows-Setup` artifact and extract it. Workflow artifacts are not the same as a public release download and may require GitHub sign-in. No prebuilt installer is promised until a build has succeeded.

## Development checks

`npm test` runs JavaScript syntax checks, spreadsheet calculation and DOCX/XLSX generation smoke checks, plus mocked desktop file-open/save and file-association configuration checks. These are not an end-to-end Windows installer test. PPTX browser XML behavior is not covered by the Node smoke harness.

## License

See [LICENSE.txt](LICENSE.txt). The software is provided as-is, without warranty.
