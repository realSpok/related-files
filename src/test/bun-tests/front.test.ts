// @ts-ignore
import { expect, test, describe } from "bun:test";
import { tester } from "../../utils";
const getSiblingsAndRelated = tester;
const config = {
  siblings: ["route", "controller", "component", "template.hbs", "style.scss"],
  relatedPathParts: ["app", "tests/unit", "tests/integration"],
  testSuffixes: ["-test"],
};

describe("front", () => {
  test("main file", () => {
    const relatedFiles = getSiblingsAndRelated(
      "app/pods/login/controller.ts",
      config
    );
    expect(relatedFiles).toEqual([
      "app/pods/login/component.ts [CREATE]",
      "app/pods/login/controller.ts [CREATE]",
      "app/pods/login/route.ts [CREATE]",
      "app/pods/login/style.scss [CREATE]",
      "app/pods/login/template.hbs [CREATE]",
      "tests/integration/pods/login/controller-test.ts [CREATE]",
      "tests/unit/pods/login/controller-test.ts [CREATE]",
    ]);
  });

  test("test", () => {
    const relatedFiles = getSiblingsAndRelated(
      "tests/integration/pods/login/controller-test.ts",
      config
    );
    expect(relatedFiles).toEqual([
      "app/pods/login/controller.ts [CREATE]",
      "tests/integration/pods/login/controller-test.ts [CREATE]",
      "tests/unit/pods/login/controller-test.ts [CREATE]",
    ]);
  });

  test("from javascript test", () => {
    const relatedFiles = getSiblingsAndRelated(
      "tests/integration/pods/login/controller-test.js",
      config
    );
    expect(relatedFiles).toEqual([
      "app/pods/login/controller.ts [CREATE]",
      "tests/integration/pods/login/controller-test.ts [CREATE]",
      "tests/unit/pods/login/controller-test.ts [CREATE]",
    ]);
  });

  test("css", () => {
    const relatedFiles = getSiblingsAndRelated(
      "app/pods/login/style.scss",
      config
    );
    expect(relatedFiles).toEqual([
      "app/pods/login/component.ts [CREATE]",
      "app/pods/login/controller.ts [CREATE]",
      "app/pods/login/route.ts [CREATE]",
      "app/pods/login/style.scss [CREATE]",
      "app/pods/login/template.hbs [CREATE]",
    ]);
  });
});
