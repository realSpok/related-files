// @ts-ignore
import { expect, test, describe } from "bun:test";
import { tester } from "../../utils";
const getSiblingsAndRelated = tester;
const config = {
  siblings: ["route", "controller", "component", "template.hbs", "style.scss"],
  relatedPathParts: ["app", "tests/unit", "tests/integration"],
  testSuffixes: ["-test"],
  preProcess: `
    const file = arguments[0];
    const config = arguments[1];
    if (file.includes("/pods/")) {
      return {
        ...config,
        relatedPathParts: ["app/legacy", "tests/integration", "tests/unit"],
      };
    }
    return config;
`,
};
describe("front", () => {
  describe("legacy", () => {
    test("main file", () => {
      const relatedFiles = getSiblingsAndRelated("app/legacy/pods/login/controller.ts", config);
      expect(relatedFiles).toEqual([
        "app/legacy/pods/login/component.ts [CREATE]",
        "app/legacy/pods/login/controller.ts [CREATE]",
        "app/legacy/pods/login/route.ts [CREATE]",
        "app/legacy/pods/login/style.scss [CREATE]",
        "app/legacy/pods/login/template.hbs [CREATE]",
        "tests/integration/pods/login/controller-test.ts [CREATE]",
        "tests/unit/pods/login/controller-test.ts [CREATE]",
      ]);
    });
    test("test", () => {
      const relatedFiles = getSiblingsAndRelated("tests/integration/pods/login/controller-test.ts", config);
      expect(relatedFiles).toEqual([
        "app/legacy/pods/login/controller.ts [CREATE]",
        "tests/integration/pods/login/controller-test.ts [CREATE]",
        "tests/unit/pods/login/controller-test.ts [CREATE]",
      ]);
    });
  });
  test("main file", () => {
    const relatedFiles = getSiblingsAndRelated(
      "app/features/billing/components/trial-notification-bar/component.ts",
      config
    );
    expect(relatedFiles).toEqual([
      "app/features/billing/components/trial-notification-bar/component.ts [CREATE]",
      "app/features/billing/components/trial-notification-bar/controller.ts [CREATE]",
      "app/features/billing/components/trial-notification-bar/route.ts [CREATE]",
      "app/features/billing/components/trial-notification-bar/style.scss [CREATE]",
      "app/features/billing/components/trial-notification-bar/template.hbs [CREATE]",
      "tests/integration/features/billing/components/trial-notification-bar/component-test.ts [CREATE]",
      "tests/unit/features/billing/components/trial-notification-bar/component-test.ts [CREATE]",
    ]);
  });
  test("test", () => {
    const relatedFiles = getSiblingsAndRelated(
      "tests/integration/features/billing/components/trial-notification-bar/component-test.ts",
      config
    );
    expect(relatedFiles).toEqual([
      "app/features/billing/components/trial-notification-bar/component.ts [CREATE]",
      "tests/integration/features/billing/components/trial-notification-bar/component-test.ts [CREATE]",
      "tests/unit/features/billing/components/trial-notification-bar/component-test.ts [CREATE]",
    ]);
  });
  test("from javascript test", () => {
    const relatedFiles = getSiblingsAndRelated(
      "tests/integration/features/billing/components/trial-notification-bar/component-test.js",
      config
    );
    expect(relatedFiles).toEqual([
      "app/features/billing/components/trial-notification-bar/component.ts [CREATE]",
      "tests/integration/features/billing/components/trial-notification-bar/component-test.ts [CREATE]",
      "tests/unit/features/billing/components/trial-notification-bar/component-test.ts [CREATE]",
    ]);
  });
  test("css", () => {
    const relatedFiles = getSiblingsAndRelated("app/pods/login/style.scss", config);
    expect(relatedFiles).toEqual([
      "app/pods/login/component.ts [CREATE]",
      "app/pods/login/controller.ts [CREATE]",
      "app/pods/login/route.ts [CREATE]",
      "app/pods/login/style.scss [CREATE]",
      "app/pods/login/template.hbs [CREATE]",
    ]);
  });
});
