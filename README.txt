EEE120 MicroCoder - browser conversion

To run:
1. Keep index.html, styles.css, app.js, and all JPG files in the same folder.
2. Open index.html in a modern browser (Chrome, Edge, Firefox, Safari).

The app runs entirely in the browser; no server, .NET runtime, or external library is required.

Implementation notes:
- The four microcode nibbles use the bit assignments from Form1.cs.
- Default selections are initialized explicitly (SRAM data source, NOP operation,
  PC address source, and next step 00). This avoids the original WinForms startup
  issue where unselected combo boxes could leave their SelectedIndex at -1.
- Selecting an ALU operation updates the Load ACC checkbox. The original event
  handlers could unintentionally force every non-NOP operation back to PASS;
  this browser version preserves the selected operation instead.
