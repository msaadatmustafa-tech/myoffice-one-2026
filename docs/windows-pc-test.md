# Windows PC test report — MyOffice One 0.4.1

Test date: 19 November 2026. Platform: Windows x64, OS build 10.0.26300.

This report covers a locally built Windows NSIS installer and the real desktop application. Small generated test files were used for saves; no original user document was overwritten.

| Check | Result |
| --- | --- |
| Local Windows NSIS installer build | PASS |
| Install to Program Files and launch installed application | PASS |
| Installed-app registration reports version 0.4.1 | PASS |
| Public Desktop and Start Menu shortcuts | PASS |
| DOCX, XLSX, PPTX and MYOFFICE machine file-handler registration | PASS |
| MYOFFICE backup imports three sample workspaces | PASS |
| DOCX native Save dialog, disk content and reopen | PASS |
| XLSX native save/reopen and formula recalculation | PASS: 150 + 60 = 210; dependent cell = 420 |
| Formula retained after Enter navigation | PASS after the 0.4.1 fix |
| Save captures an active cell edit before serializing | PASS after the 0.4.1 fix |
| Ctrl+O uses native Open; Ctrl+Shift+S opens Save As | PASS after the 0.4.1 fix |
| PPTX native save/reopen preserves both sample slides and text | PASS |
| Fullscreen presentation and right-arrow navigation | PASS |
| Sending XLSX to the already running installed app | PASS: imported in the existing app window |
| Uninstall and reinstall | NOT RUN: computer-use tool policy blocked launching the uninstaller |

## Bugs found and fixed during the PC test

- Spreadsheet Enter/Tab navigation previously committed a formula twice, replacing it with its calculated value. Commit now happens once on blur.
- Keyboard Save now commits an active cell before writing the workbook.
- Ctrl+O now uses the native Open flow consistently with the toolbar button.
- Ctrl+Shift+S now explicitly opens Save As.

Regression checks were added for Enter/Tab formula preservation and saving active cell edits. The existing source tests also pass.

## Limits

Installation succeeded, but uninstall/reinstall was not verified. Windows user default-app preferences were not intentionally changed during testing. The installer registers machine file handlers; Windows may still require a user to select the desired default application.

These are basic interoperability checks, not exhaustive Microsoft Office compatibility tests. PPTX roundtrip can simplify layout. Advanced formatting, macros, charts, animations and complex external documents remain outside this test.

The installer is unsigned. The application remains installed after this test.
