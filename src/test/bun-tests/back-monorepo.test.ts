// @ts-ignore
import { expect, test, describe, afterEach } from "bun:test";
import { tester } from "../../utils";
import { createFile } from "./test-helpers";
import fs from "fs";
const getSiblingsAndRelated = tester;
const config = {
  siblings: [],
  relatedPathParts: ["packages/*/", "packages/*/test/jest/"],
  testSuffixes: [".unit.test"],
};
describe("back", () => {
  describe("when files dont exist", () => {
    test("from file", () => {
      const relatedFiles = getSiblingsAndRelated(
        "packages/forestadmin-api/services/subscription/subscription-service.ts",
        config
      );
      expect(relatedFiles).toEqual([
        "packages/forestadmin-api/services/subscription/subscription-service.ts [CREATE]",
        "packages/forestadmin-api/test/jest/services/subscription/subscription-service.unit.test.ts [CREATE]",
      ]);
    });
    test("from test", () => {
      const relatedFiles = getSiblingsAndRelated(
        "packages/forestadmin-api/test/jest/services/subscription/subscription-service.unit.test.ts",
        config
      );
      expect(relatedFiles).toEqual([
        "packages/forestadmin-api/services/subscription/subscription-service.ts [CREATE]",
        "packages/forestadmin-api/test/jest/services/subscription/subscription-service.unit.test.ts [CREATE]",
      ]);
    });
  });
});
