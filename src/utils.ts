import path from "path";
import fs from "fs";
const EXTENSIONS = ["ts", "js"];

export const tester = (
  file: string,
  siblings: string[],
  relatedPathParts: string[],
  testSuffixes: string[]
) => {
  const wsRoot = __dirname + "/test/bun-tests";
  return pickOptions(
    getSiblingsAndRelatedOptions(
      file,
      siblings,
      relatedPathParts,
      testSuffixes,
      wsRoot
    ),
    wsRoot
  ).map((a) => `${a.url}${a.exists ? "" : " [CREATE]"}`);
};

function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}

export function isTestFile(path: string, relatedPathParts: string[]) {
  return Boolean(
    relatedPathParts
      .filter((relatedPathPart) => relatedPathPart.includes("test"))
      .find((relatedPathPart) => path.includes(relatedPathPart))
  );
}

export function getSiblingsAndRelated(
  file: string,
  siblings: string[],
  relatedPathParts: string[],
  testSuffixes: string[],
  workspaceRoot: string
) {
  return pickOptions(
    getSiblingsAndRelatedOptions(
      file,
      siblings,
      relatedPathParts,
      testSuffixes,
      workspaceRoot
    ),
    workspaceRoot
  );
}

function getSiblingsAndRelatedOptions(
  file: string,
  siblings: string[],
  relatedPathParts: string[],
  testSuffixes: string[],
  workspaceRoot: string
) {
  const normalizedPathParts = relatedPathParts.map((relatedPathPart) => {
    const part = relatedPathPart.endsWith("/")
      ? relatedPathPart
      : relatedPathPart + "/";
    if (part === "/") {
      return "";
    }
    return part;
  });
  const testFile = isTestFile(file, relatedPathParts);
  const reg = testSuffixes.join("|").replaceAll(".", "\\.");
  const reg2 = normalizedPathParts
    .filter((part) => Boolean(part))
    .join("|")
    .replaceAll(".", "\\.");
  let mainFile = testFile
    ? file
        .replace(new RegExp(reg), "")
        .replace(new RegExp(reg2), normalizedPathParts[0])
    : file;
  if (!fs.existsSync(path.join(workspaceRoot, mainFile))) {
    mainFile = mainFile.replace(".js", ".ts");
  }
  const possibleSiblings = testFile
    ? []
    : siblings
        .filter(
          (sibling) =>
            sibling !== path.basename(removeExtension(mainFile)) &&
            sibling !== path.basename(mainFile)
        )
        .map((sibling) => {
          const dirname = path.dirname(mainFile);
          const s = {
            name: sibling,
            options: sibling.match(/\./)
              ? [path.join(dirname, sibling)]
              : EXTENSIONS.map((ext) =>
                  path.join(dirname, sibling + "." + ext)
                ),
          };
          return s;
        });

  const possibleRelated = EXTENSIONS.find((ext) => mainFile.endsWith(ext))
    ? normalizedPathParts
        .filter((path, index) => index > 0)
        .map((relatedPathPart) => ({
          name: relatedPathPart,
          options: testSuffixes.flatMap((testSuffix) =>
            EXTENSIONS.map((ext) => {
              return `${removeExtension(mainFile).replace(
                normalizedPathParts[0],
                relatedPathPart
              )}${testSuffix}.${ext}`;
            })
          ),
        }))
    : [];
  return [
    { name: "main", options: [mainFile] },
    ...possibleSiblings,
    ...possibleRelated,
  ];
}
function getBestOption(options: string[], workspaceRoot?: string) {
  const workspaceRootAsString = workspaceRoot ? workspaceRoot : "";
  const existingFile = options.find((option) =>
    fs.existsSync(path.join(workspaceRootAsString, option))
  );
  if (existingFile) {
    return {
      url: existingFile,
      absoluteUrl: path.join(workspaceRootAsString, existingFile),
      exists: true,
    };
  }
  return {
    url: options[0],
    absoluteUrl: path.join(workspaceRootAsString, options[0]),
    exists: false,
  };
}

function pickOptions(
  relatedOptions: { name: string; options: string[] }[],
  workspaceRoot?: string
) {
  return relatedOptions
    .map((fileOption) => ({
      name: fileOption.name,
      ...getBestOption(fileOption.options, workspaceRoot),
    }))
    .sort((a, b) => (a.url >= b.url ? 1 : -1));
}
