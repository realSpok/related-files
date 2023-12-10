// @ts-ignore
import { expect, test, describe } from "bun:test";
import { tester } from "../../utils";
const getSiblingsAndRelated = tester;

describe("front", () => {
  test("main file", () => {
    const relatedFiles = getSiblingsAndRelated(
      "app/pods/login/controller.ts",
      ["route", "controller", "component", "template.hbs", "style.scss"],
      ["app", "tests/unit", "tests/integration"],
      ["-test"]
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
      ["route", "controller", "component", "template.hbs", "style.scss"],
      ["app", "tests/unit", "tests/integration"],
      ["-test"]
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
      ["route", "controller", "component", "template.hbs", "style.scss"],
      ["app", "tests/unit", "tests/integration"],
      ["-test"]
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
      ["route", "controller", "component", "template.hbs", "style.scss"],
      ["app", "tests/unit", "tests/integration"],
      ["-test"]
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
