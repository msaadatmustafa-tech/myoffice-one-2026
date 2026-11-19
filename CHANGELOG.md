# Changelog

## Unreleased

- Regenerated the broken dependency lock file so a fresh npm installation can resolve dependencies.
- Changed installer scripts and CI to locked dependency installs; added automated Windows builds and artifact checks.
- Fixed Ctrl+S to use the native Save/Save As flow instead of always exporting a download.
- Caught document serialization failures inside the save error handler.
- Flushed draft recovery on page hide and retained edit timestamps during debounced writes.
- Validated and normalized backup items before importing; preserved existing work when validation fails.
- Added ZIP entry bounds, checksum and expanded-size checks for Office imports.
- Validated native save byte values and blocked document navigation away from the application.
- Renamed the browser launcher to a portable ASCII filename.
- Added searchable project metadata, feature descriptions, installation steps, FAQ and contribution guidance.
