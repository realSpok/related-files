// @ts-ignore
import { expect, test, describe, afterEach } from "bun:test";
import { tester } from "../../utils";
import { createFile } from "./test-helpers";
import fs from "fs";
const getSiblingsAndRelated = tester;
const config = {
  siblings: [],
  relatedPathParts: ["src", "test"],
  testSuffixes: [".test"],
};
describe("agent", () => {
  test("from file", () => {
    const relatedFiles = getSiblingsAndRelated(
      "packages/agent/src/routes/modification/action/action.ts",
      config
    );
    expect(relatedFiles).toEqual([
      "packages/agent/src/routes/modification/action/action.ts [CREATE]",
      "packages/agent/test/routes/modification/action/action.test.ts [CREATE]",
    ]);
  });
  test("from test", () => {
    const relatedFiles = getSiblingsAndRelated(
      "packages/agent/test/routes/modification/action/action.test.ts",
      config
    );
    expect(relatedFiles).toEqual([
      "packages/agent/src/routes/modification/action/action.ts [CREATE]",
      "packages/agent/test/routes/modification/action/action.test.ts [CREATE]",
    ]);
  });

  describe("with existing files", () => {
    afterEach(() => {
      fs.rmSync(__dirname + "/packages", { recursive: true, force: true });
    });

    test("from existing js file", () => {
      createFile("packages/agent/src/routes/modification/action/action.js");
      const relatedFiles = getSiblingsAndRelated(
        "packages/agent/src/routes/modification/action/action.js",
        config
      );
      expect(relatedFiles).toEqual([
        "packages/agent/src/routes/modification/action/action.js",
        "packages/agent/test/routes/modification/action/action.test.ts [CREATE]",
      ]);
    });
    test("from existing js file with existing test file", () => {
      createFile("packages/agent/src/routes/modification/action/action.js");
      createFile(
        "packages/agent/test/routes/modification/action/action.test.ts"
      );
      const relatedFiles = getSiblingsAndRelated(
        "packages/agent/src/routes/modification/action/action.js",
        config
      );
      expect(relatedFiles).toEqual([
        "packages/agent/src/routes/modification/action/action.js",
        "packages/agent/test/routes/modification/action/action.test.ts",
      ]);
    });
    test("from existing js test file with existing ts main file", () => {
      createFile("packages/agent/src/routes/modification/action/action.ts");
      createFile(
        "packages/agent/test/routes/modification/action/action.test.js"
      );
      const relatedFiles = getSiblingsAndRelated(
        "packages/agent/test/routes/modification/action/action.test.ts",
        config
      );
      expect(relatedFiles).toEqual([
        "packages/agent/src/routes/modification/action/action.ts",
        "packages/agent/test/routes/modification/action/action.test.js",
      ]);
    });
  });
});
