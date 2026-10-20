import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

// Regression guard for HARD DESIGN RULE 2 (screen-fitted single-page app,
// no page scroll). The rule lives entirely in src/styles.css, so this test
// reads that stylesheet from disk and asserts the structural invariants
// hold: the page can never scroll, the shell is exactly one viewport tall,
// the flex chain cannot collapse panels, and each panel has its documented
// last-resort internal scroll region.

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, "styles.css"), "utf8");

function ruleBlock(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*{([^}]*)}`));
  expect(match, `CSS rule ${selector} must exist`).toBeTruthy();
  return (match as RegExpMatchArray)[1].replace(/\s+/g, " ");
}

describe("no-scroll layout invariants (styles.css)", () => {
  it("the page body can never scroll", () => {
    expect(ruleBlock("body")).toMatch(/overflow\s*:\s*hidden/);
  });

  it("the app shell is exactly one viewport tall", () => {
    const shell = ruleBlock(".shell");
    expect(shell).toMatch(/height\s*:\s*100dvh/);
    expect(shell).toMatch(/display\s*:\s*flex/);
  });

  it("the flex chain cannot collapse view panels", () => {
    expect(ruleBlock(".viewwrap")).toMatch(/flex\s*:\s*1/);
    expect(ruleBlock(".viewwrap")).toMatch(/min-height\s*:\s*0/);
    const view = ruleBlock(".view");
    expect(view).toMatch(/flex\s*:\s*1/);
    expect(view).toMatch(/min-height\s*:\s*0/);
    expect(view).toMatch(/overflow\s*:\s*hidden/);
  });

  it("every view panel has a last-resort internal scroll region", () => {
    for (const selector of [
      ".tablewrap",
      ".asset-detail-page",
      ".launch-grid",
      ".guide-view",
    ]) {
      expect(ruleBlock(selector)).toMatch(/overflow-y\s*:\s*auto/);
    }
  });

  it("the header tab strip cannot grow the header taller on narrow screens", () => {
    expect(ruleBlock(".tablist")).toMatch(/overflow-x\s*:\s*auto/);
  });
});
