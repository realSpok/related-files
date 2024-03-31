import * as vscode from "vscode";
import * as utils from "./utils";
import * as path from "path";
import * as fs from "fs";

async function open(item?: { url: string }) {
  if (!item) {
    return;
  }
  const doc = await vscode.workspace.openTextDocument(item.url);
  await vscode.window.showTextDocument(doc.uri);
}

export function createFileIfMissing(filePath: string) {
  if (!vscode.workspace.workspaceFolders?.length) {
    return;
  }
  const wsDir = vscode.workspace.workspaceFolders[0].uri.path;
  let absPath = filePath;
  if (!absPath.startsWith(wsDir)) {
    absPath = path.join(wsDir, absPath);
  }
  if (fs.existsSync(absPath)) {
    return;
  }

  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(
    absPath,
    `

describe('function', () => {
    describe('If condition is met', () => {
        it('should not throw a business error', async () => {
            jest.spyOn(fs, 'existsSync').mockReturnValue(true);
            await runFunction();
            expect(fs.existsSync).toHaveBeenCalled();
        });
    });
});

  `
  );
}

export function activate(context: vscode.ExtensionContext) {
  const findRelated = vscode.commands.registerCommand("find-related-files.find", () => {
    if (!vscode.window.activeTextEditor || !vscode.workspace.workspaceFolders?.length) {
      return;
    }

    const { testSuffixes, relatedPathParts, expectedSiblings, preProcess } =
      vscode.workspace.getConfiguration("relatedFiles");
    const document = vscode.window.activeTextEditor.document;
    const file = vscode.workspace.asRelativePath(document.uri.path);
    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.path;

    const filesWithExistingInfo = utils.getSiblingsAndRelated(file, workspaceRoot, {
      siblings: expectedSiblings,
      relatedPathParts,
      testSuffixes,
      preProcess,
    });
    const items = filesWithExistingInfo.map((file) => ({
      url: file.absoluteUrl,
      description: `${file.exists ? "" : "[CREATE] "}${file.url}`,
      label: file.name,
    }));
    vscode.window
      .showQuickPick(items, {
        placeHolder: "Files related ",
        matchOnDescription: true,
      })
      .then((item) => {
        if (!item) {
          return;
        }
        createFileIfMissing(item.url);
        open(item);
      });
  });

  context.subscriptions.push(findRelated);
}

export function deactivate() {}
