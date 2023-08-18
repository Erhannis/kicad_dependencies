Some component modules for KiCAD projects, like a micro usb power/data connection, or an eeprom chip with associated caps and resistors.  Comes as sheets, with separate areas of 4-layer PCB, and everything should be annotated with JLCPCB component IDs so you can export with their kicad plugin and it should autofill all the parts for assembly.

To use:
Copy the .kicad_sch file you want, into your project.
In KiCAD, copy the sheet block you want from this project into your project.
In KiCAD, ensure your project has 4 layers (MAYBE you can get it to work otherwise) then copy the corresponding chunk of PCB you want.
THEN "update pcb from schematic", to ensure everything synced up.

IF YOU ADD A MODULE, or rename a reference, you may need to run the vscode js script (see the nur::script extension) to get the refs to copy right - it updates all the labels from the pcb. ...I think.  I forget, now.  Then it removes the "instances" blocks, which don't seem to be necessary and can apparently gunk up the refs??  Commit your files before running the script.

So far these things are like, MIT or CERN OHL v2 P (even if I've had to find a second source for the same decisions in a few places).

Note that I haven't yet physically tested these, personally; as of Aug 12 some boards are being manufactured and shipped to me.  Fingers crossed.

-Erhannis
