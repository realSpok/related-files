// @ts-ignore
import { expect, test, describe } from "bun:test";
import { tester } from "../../utils";
const getSiblingsAndRelated = tester;
describe("back", () => {
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
