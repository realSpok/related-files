// @ts-ignore
import { expect, test, describe } from "bun:test";
import { tester } from "../../utils";
const getSiblingsAndRelated = tester;
describe("agent", () => {
  test("from file", () => {
    const relatedFiles = getSiblingsAndRelated(
      "packages/agent/src/routes/modification/action/action.ts",
      [],
      ["src", "test"],
      [".test"]
    );
    expect(relatedFiles).toEqual([
      "packages/agent/src/routes/modification/action/action.ts [CREATE]",
      "packages/agent/test/routes/modification/action/action.test.ts [CREATE]",
    ]);
  });
  test("from test", () => {
    const relatedFiles = getSiblingsAndRelated(
      "packages/agent/test/routes/modification/action/action.test.ts",
      [],
      ["src", "test"],
      [".test"]
    );
    expect(relatedFiles).toEqual([
      "packages/agent/src/routes/modification/action/action.ts [CREATE]",
      "packages/agent/test/routes/modification/action/action.test.ts [CREATE]",
    ]);
  });
});
