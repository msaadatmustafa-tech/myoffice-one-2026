MYOFFICE ONE 2026 — VERSION 0.4 INSTALLER-READY PROJECT
==========================================================
Aapke existing independent MyOffice ka installable Windows 11 package.

IMPORTANT: Yeh ZIP khud EXE INSTALLER NAHI hai. Isme EXE banane ka source code
hai. Is environment mein Windows installer ko compile/test nahi kiya gaya.

EASY STEPS TO CREATE YOUR PERSONAL WINDOWS INSTALLER
1. ZIP Extract All karein (e.g. Desktop\MyOffice-One)
2. Official free Node.js LTS download & install: https://nodejs.org/
3. Ek dafa internet connect rakhein.
4. 'BUILD INSTALLER - Windows 11.cmd' par double-click karein.
5. Process successful hone par 'dist-installer' folder khulega.
6. Wahan 'MyOffice-One-Setup-0.4.0-x64.exe' double-click karein.
7. Admin permission allow karein. Installer mein desktop/start-menu shortcuts banenge.

FILE OPEN WITH / DEFAULT APP
- Supported registered types: .docx, .xlsx, .pptx, .myoffice.
- File right-click > Open with > Choose another app > MyOffice One.
- Windows 11 Settings > Apps > Default apps > MyOffice One, if displayed;
  choose the file types there or use 'Open with > Always'.
- Windows may show MyOffice in 'Choose another app' rather than first-level Open with.
- Installer only registers MyOffice as an option; Windows controls default choice.
- Opening a complex Office file imports a copy; use Save As to avoid accidentally
  overwriting advanced Microsoft Office formatting.

INSTALL / UNINSTALL
- Proper NSIS installer: Programs list + Start Menu + Desktop shortcut.
- Uninstall through Windows Settings > Apps > Installed apps > MyOffice One.
- Work offline after installer has been built and installed.
- Installation does not require MS Office or LibreOffice.

IF YOU JUST WANT TO USE IT NOW
- 'Run MyOffice — No Install.cmd' still works in Edge/Chrome app window.
- That quick-launch version DOES NOT register Windows file associations.

IMPORTANT LIMITATIONS
- This is not full feature parity with Microsoft Office 2026.
- Complex DOCX, XLSX, PPTX files may lose formatting or features on import/export.
- SmartScreen may warn because this self-built EXE has no purchased code signing
  certificate. Build it yourself from source if you want provenance.
- It is a source package, not a pre-compiled/setup-tested EXE.
- After setup registration, Windows file type defaults must be selected by user.

VERSION 0.4 CHANGES
- Actual Windows installer build script and configuration (electron-builder/NSIS)
- Install and uninstall, Desktop and Start Menu shortcuts
- Registered file types for Explorer Open with
- Windows Explorer launched file opens inside the independent app
- File sent to already-running MyOffice opens in existing instance
- Open/Save functionality remains; import files defaults to Save As safety
- IPC and size-limit checks preserved
