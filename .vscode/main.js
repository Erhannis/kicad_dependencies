/// <reference path="/home/erhannis/.vscode/extensions/nur.script-0.2.1/@types/api.global.d.ts" />
/// <reference path="/home/erhannis/.vscode/extensions/nur.script-0.2.1/@types/vscode.global.d.ts" />
//  @ts-check
//  API: https://code.visualstudio.com/api/references/vscode-api

// import * as vscode from 'vscode';
const vscode = require('vscode');

async function activate(_context) {
//    let disposable = vscode.commands.registerCommand('extension.findAndReplace', async () => {
        const pcbFiles = await vscode.workspace.findFiles('**/*.kicad_pcb');

        for (const file of pcbFiles) {
            const document1 = await vscode.workspace.openTextDocument(file);

            println("file:"+document1.fileName);

            // Find matches
            const pattern1 = /"\/([-a-zA-Z0-9]*)\/([-a-zA-Z0-9]*)"\)\n.*\(attr.*\)\n.*\(fp_text reference "([^"]*)"/g;
            // const pattern = /"\/([-a-zA-Z0-9]*)\/([-a-zA-Z0-9]*)"\)/g;
            const content1 = document1.getText();
            let match1;
            while (match1 = pattern1.exec(content1)) {
                println("match: "+match1[0]);
                let sheetUuid = match1[1];
                let componentUuid = match1[2];
                let componentRef = match1[3];
                println("1: "+match1[1]);
                println("2: "+match1[2]);
                println("3: "+match1[3]);


                /*
                search kicad_deps.kicad_sch for pattern2
                open file given by match
                replace by
                    (uuid c1ac9470-8dbb-487e-8356-fa85d20c7ec9)
                    (property "Reference" "POW1_VI1" (at 123.8759 60.96 0)
                log any misses
                */

                const pattern2 = new RegExp(`\\(uuid ${sheetUuid}\\)\\n.*\\n.*\\n.*\\n.*\\(property "Sheetfile" "(.*).kicad_sch"`, "g");

                //DUMMY hardcoded
                const rootname = (await vscode.workspace.findFiles("kicad_deps.kicad_sch"))[0];
                const root = await vscode.workspace.openTextDocument(rootname);

                const content2 = root.getText();
                let match2 = pattern2.exec(content2);
                let filenamebase3 = match2[1]+".kicad_sch";

                const filename3 = (await vscode.workspace.findFiles(filenamebase3))[0];
                const document3 = await vscode.workspace.openTextDocument(filename3);

                const pattern3 = new RegExp(`(\\(uuid ${componentUuid}\\)\\n.*\\(property "Reference" ")([^"]*)"`, "g");
                const content3 = document3.getText();

                // const replacedContent = content3.replace(pattern3, (match, group1, group2, offset, string, groups) => {
                //     return group1 + componentRef + "\"";
                // });

                // println(replacedContent);


                // Create a WorkspaceEdit to hold all the edits
                const workspaceEdit3 = new vscode.WorkspaceEdit();

                //DUMMY I don't think this accounts for the movements of text as changes are made?
                let match3;
                while ((match3 = pattern3.exec(content3)) !== null) {
                    const fullMatchRange = new vscode.Range(
                        document3.positionAt(match3.index),
                        document3.positionAt(match3.index + match3[0].length)
                    );

                    // Determine the range of the second capture group (group2) to replace
                    const group2Range = new vscode.Range(
                        document3.positionAt(match3.index + match3[1].length), // Start after the first group
                        document3.positionAt(match3.index + match3[0].length-1)  // End of the full match
                    );

                    // Replace the second capture group with 'qux'
                    workspaceEdit3.replace(document3.uri, group2Range, componentRef);
                }

                // Apply the edits
                await vscode.workspace.applyEdit(workspaceEdit3);
                await document3.save();

/*

delete 'instances'
^    \(instances(.*\n)*?    \)

*/                
                const pattern4 = /\n    \(instances(.*\n)*?    \)/g;
                const content4 = document3.getText();

                // Create a WorkspaceEdit to hold all the edits
                const workspaceEdit4 = new vscode.WorkspaceEdit();

                println("trying delete: "+filename3);

                //DUMMY I don't think this accounts for the movements of text as changes are made?
                let match4;
                while ((match4 = pattern4.exec(content4)) !== null) {
                    println("delete match");
                    const fullMatchRange = new vscode.Range(
                        document3.positionAt(match4.index),
                        document3.positionAt(match4.index + match4[0].length)
                    );

                    // Replace the second capture group with 'qux'
                    workspaceEdit4.delete(document3.uri, fullMatchRange);
                    println("deleted: "+match4[0]);
                }

                // Apply the edits
                await vscode.workspace.applyEdit(workspaceEdit4);
                await document3.save();


/*


    (uuid ae208133-afa9-4b97-890f-a7922fc377b4)
    (property "Sheetname" "Voltage Inverter" (at 125.095 48.1834 0)
      (effects (font (size 1.27 1.27)) (justify left bottom))
    )
    (property "Sheetfile" "voltage_inverter.kicad_sch" (at 125.095 63.4496 0)
*/
                
                // Perform your desired replacement here
                // const replacement = 'replacement text'; // Modify this to match your logic
                // const range = new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
                // workspaceEdit.replace(file, range, replacement);
            }
        }

        // Apply the edits
//        await vscode.workspace.applyEdit(workspaceEdit);

        println("done");
        vscode.window.showInformationMessage('Find and replace completed.');
//    });

//    _context.subscriptions.push(disposable);

    //    window.showInformationMessage('Hello, World!');
}

function deactivate() {}

module.exports = { activate, deactivate }

// "/([-a-zA-Z0-9]*)/([-a-zA-Z0-9]*)"\)\n.*\(attr.*\)\n.*\(fp_text reference "([^"]*)"

/*

kicad_deps.kicad_pcb
"/([-a-zA-Z0-9]*)/([-a-zA-Z0-9]*)"\)\n.*\(attr.*\)\n.*\(fp_text reference "([^"]*)"

    (path "/ae208133-afa9-4b97-890f-a7922fc377b4/c1ac9470-8dbb-487e-8356-fa85d20c7ec9")
    (attr smd)
    (fp_text reference "POW1_VI1" (at 0 -3.4) (layer "F.SilkS")


kicad_deps.kicad_sch
    (uuid ae208133-afa9-4b97-890f-a7922fc377b4)
    (property "Sheetname" "Voltage Inverter" (at 125.095 48.1834 0)
      (effects (font (size 1.27 1.27)) (justify left bottom))
    )
    (property "Sheetfile" "voltage_inverter.kicad_sch" (at 125.095 63.4496 0)

replace in foo.kicad_sch
    (uuid c1ac9470-8dbb-487e-8356-fa85d20c7ec9)
    (property "Reference" "POW1_VI1" (at 123.8759 60.96 0)

*/
