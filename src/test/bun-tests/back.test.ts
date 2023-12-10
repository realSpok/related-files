// @ts-ignore
import { expect, test, describe, afterEach } from "bun:test";
import fs from "fs";
import path from "path";
import { tester } from "../../utils";
const getSiblingsAndRelated = tester;
const createFile = (filePath: string) => {
  const fullPath = __dirname + "/" + filePath;
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(__dirname + filePath, "");
};
describe("back", () => {
  describe("when files dont exist", () => {
    test("from file", () => {
      const relatedFiles = getSiblingsAndRelated(
        "deserializers/model-customization-deserializer.ts",
        [],
        ["", "test/jest/"],
        [".test", ".unit.test"]
      );
      expect(relatedFiles).toEqual([
        "deserializers/model-customization-deserializer.ts [CREATE]",
        "test/jest/deserializers/model-customization-deserializer.test.ts [CREATE]",
      ]);
    });
    test("from test", () => {
      const relatedFiles = getSiblingsAndRelated(
        "test/jest/deserializers/model-customization-deserializer.test.ts",
        [],
        ["", "test/jest/"],
        [".test", ".unit.test"]
      );
      expect(relatedFiles).toEqual([
        "deserializers/model-customization-deserializer.ts [CREATE]",
        "test/jest/deserializers/model-customization-deserializer.test.ts [CREATE]",
      ]);
    });
    test("from js test", () => {
      const relatedFiles = getSiblingsAndRelated(
        "test/jest/deserializers/model-customization-deserializer.test.js",
        [],
        ["", "test/jest/"],
        [".test", ".unit.test"]
      );
      expect(relatedFiles).toEqual([
        "deserializers/model-customization-deserializer.ts [CREATE]",
        "test/jest/deserializers/model-customization-deserializer.test.ts [CREATE]",
      ]);
    });
    test("from test with alternate prefix", () => {
      const relatedFiles = getSiblingsAndRelated(
        "test/jest/deserializers/model-customization-deserializer.unit.test.ts",
        [],
        ["", "test/jest/"],
        [".test", ".unit.test"]
      );
      expect(relatedFiles).toEqual([
        "deserializers/model-customization-deserializer.ts [CREATE]",
        "test/jest/deserializers/model-customization-deserializer.test.ts [CREATE]",
      ]);
    });
  });
  describe("when files exist", () => {
    afterEach(() => {
      fs.rmSync(__dirname + "/test", { recursive: true, force: true });
      fs.rmSync(__dirname + "/deserializers", { recursive: true, force: true });
    });

    describe("when main file exists", () => {
      test("from main file", () => {
        createFile("/deserializers/model-customization-deserializer.ts");
        const relatedFiles = getSiblingsAndRelated(
          "deserializers/model-customization-deserializer.ts",
          [],
          ["", "test/jest/"],
          [".test", ".unit.test"]
        );
        expect(relatedFiles).toEqual([
          "deserializers/model-customization-deserializer.ts",
          "test/jest/deserializers/model-customization-deserializer.test.ts [CREATE]",
        ]);
      });
    });
    describe("when test file exists", () => {
      test("from main file", () => {
        createFile(
          "/test/jest/deserializers/model-customization-deserializer.test.ts"
        );
        const relatedFiles = getSiblingsAndRelated(
          "deserializers/model-customization-deserializer.ts",
          [],
          ["", "test/jest/"],
          [".test", ".unit.test"]
        );
        expect(relatedFiles).toEqual([
          "deserializers/model-customization-deserializer.ts [CREATE]",
          "test/jest/deserializers/model-customization-deserializer.test.ts",
        ]);
      });
      test("from js test file", () => {
        createFile(
          "/test/jest/deserializers/model-customization-deserializer.test.js"
        );
        const relatedFiles = getSiblingsAndRelated(
          "test/jest/deserializers/model-customization-deserializer.test.js",
          [],
          ["", "test/jest/"],
          [".test", ".unit.test"]
        );
        expect(relatedFiles).toEqual([
          "deserializers/model-customization-deserializer.ts [CREATE]",
          "test/jest/deserializers/model-customization-deserializer.test.js",
        ]);
      });
    });
  });
});
