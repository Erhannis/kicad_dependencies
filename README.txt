Some component modules for KiCAD projects, like a micro usb power/data connection, or an eeprom chip with associated caps and resistors.  Comes as sheets, with separate areas of 4-layer PCB, and everything should be annotated with JLCPCB component IDs so you can export with their kicad plugin and it should autofill all the parts for assembly.

To use:
Copy the .kicad_sch file you want, into your project.
In KiCAD, copy the sheet block you want from this project into your project.
In KiCAD, ensure your project has 4 layers (MAYBE you can get it to work otherwise) then copy the corresponding chunk of PCB you want.
THEN "update pcb from schematic", to ensure everything synced up.

IF YOU ADD A MODULE, or rename a reference, you may need to run the vscode js script (see the nur::script extension) to get the refs to copy right - it updates all the labels from the pcb. ...I think.  I forget, now.  Then it removes the "instances" blocks, which don't seem to be necessary and can apparently gunk up the refs??  Commit your files before running the script.

If a part won't load for you, try `pip install easyeda2kicad` and `easyeda2kicad --lcsc_id LCSC_ID_HERE --full`, and adding its symbol/footprint folder to kicad.  I sometimes feel like it would be better to find a kicad built-in footprint or whatever, but it's just so easy....  (I don't think I've used this yet in this repo, but it's just a matter of time, haha.)

So far these things are like, MIT or CERN OHL v2 P (even if I've had to find a second source for the same decisions in a few places).

Notes:
(There may be bugs not listed here.)
inverted_regulator_12v doesn't quite manage an amp; it thermal cycles at 0.85A.  0.8A seemed to work, though you might do 0.7A to be safe.  If you added a proper heat sink it might manage MORE than 1A, haha.  Maybe you could add vias to a plane; depends on if the back is grounded; gnd is connected to -12V after all.
power_cell_18650_3s
  successfully provides several amps at ~12V
  successfully shuts down when batteries dip below 2.7V*3
  successfully switch on/off
  BUG: DO NOT short the output.  It kills the on/off transistor which shorts mostly closed, preventing the controller from turning off the circuit.  Further shorts can cause the on/off transistor to catch fire.
  BUG: it prevents overcurrent when charging (only lightly tested), but does not actually regulate the charging current!  Which means it can't charge the battery without external current control.  Sigh.
amp12v2a does not work.  Huge noise on the output.  I don't know why, I've been trying to get similar circuits to work for weeks.

-Erhannis
