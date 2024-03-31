import path from "path";
import fs from "fs";
const EXTENSIONS = ["ts", "js"];
type Config = {
  siblings: string[];
  relatedPathParts: string[];
  testSuffixes: string[];
  preProcess?: string;
};

export const tester = (file: string, config: Config) => {
  const workspaceRoot = __dirname + "/test/bun-tests";
  return pickOptions(getSiblingsAndRelatedOptions(file, workspaceRoot, config), workspaceRoot).map(
    (a) => `${a.url}${a.exists ? "" : " [CREATE]"}`
  );
};

function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}

export function getIsTestFile(path: string, relatedPathParts: string[]) {
  return Boolean(path.match(/\btests?\b/));
  return Boolean(
    relatedPathParts
      .filter((relatedPathPart) => relatedPathPart.match(/\btests?\b/))
      .find((relatedPathPart) => path.includes(relatedPathPart))
  );
}

export function getSiblingsAndRelated(file: string, workspaceRoot: string, config: Config) {
  return pickOptions(getSiblingsAndRelatedOptions(file, workspaceRoot, config));
}

function getSiblingsAndRelatedOptions(file: string, workspaceRoot: string, config: Config) {
  const { preProcess } = config;
  const { relatedPathParts, siblings, testSuffixes } = (() => {
    if (preProcess) {
      return Function(preProcess).call(null, file, config, workspaceRoot) as Config;
    } else {
      return config;
    }
  })();

  const replaceStarWith = file.split("/")[relatedPathParts[0].split("/").findIndex((elem) => elem === "*")];
  const normalizedPathParts = relatedPathParts
    .map((relatedPathPart) => {
      const part = relatedPathPart.endsWith("/") ? relatedPathPart : relatedPathPart + "/";
      if (part === "/") {
        return "";
      }
      return part;
    })
    .map((relatedPathPart) => relatedPathPart.replace("*", replaceStarWith));
  const isTestFile = getIsTestFile(file, relatedPathParts);
  const testSuffixesRegex = testSuffixes.join("|").replaceAll(".", "\\.");
  const testPathPartRegex = normalizedPathParts
    .filter((part) => part.match(/tests?/))
    .filter((part) => Boolean(part))
    .join("|")
    .replaceAll(".", "\\.");
  let mainFile = isTestFile
    ? file.replace(new RegExp(testSuffixesRegex), "").replace(new RegExp(testPathPartRegex), normalizedPathParts[0])
    : file;

  if (!fs.existsSync(path.join(workspaceRoot, mainFile))) {
    mainFile = mainFile.replace(".js", ".ts");
  }
  const possibleSiblings = isTestFile
    ? []
    : siblings
        .filter(
          (sibling) => sibling !== path.basename(removeExtension(mainFile)) && sibling !== path.basename(mainFile)
        )
        .map((sibling) => {
          const dirname = path.dirname(mainFile);
          const s = {
            name: sibling,
            options: sibling.match(/\./)
              ? [path.join(dirname, sibling)]
              : EXTENSIONS.map((ext) => path.join(dirname, sibling + "." + ext)),
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
                new RegExp(normalizedPathParts[0]),
                relatedPathPart
              )}${testSuffix}.${ext}`;
            })
          ),
        }))
    : [];
  return [{ name: "main", options: [mainFile] }, ...possibleSiblings, ...possibleRelated];
}
function getBestOption(options: string[], workspaceRoot?: string) {
  const workspaceRootAsString = workspaceRoot ? workspaceRoot : "";
  const existingFile = options.find((option) => fs.existsSync(path.join(workspaceRootAsString, option)));
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

function pickOptions(relatedOptions: { name: string; options: string[] }[], workspaceRoot?: string) {
  return relatedOptions
    .map((fileOption) => ({
      name: fileOption.name,
      ...getBestOption(fileOption.options, workspaceRoot),
    }))
    .sort((a, b) => (a.url >= b.url ? 1 : -1));
}
