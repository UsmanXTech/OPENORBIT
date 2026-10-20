import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

afterEach(() => cleanup());

const featuredOrder = [
  "Lumen Protocol",
  "Nebula Network",
  "Solaris Collective",
  "Orbit Labs",
  "Verdant DAO",
  "Prism Points",
];

const rowNames = () =>
  Array.from(document.querySelectorAll(".token-table tbody tr")).map(
    (tr) => tr.querySelector(".token-id strong")?.textContent
  );

const sortButton = (label: RegExp) =>
  screen.getByRole("button", { name: label });
const sortTh = (label: RegExp) => sortButton(label).closest("th");
const statusRegion = () => screen.getAllByRole("status")[0];

describe("sortable column headers", () => {
  it("sorts by name A–Z on first click, sets aria-sort, and announces it", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(rowNames()).toEqual(featuredOrder);
    expect(document.querySelector("th[aria-sort]")).toBeNull();

    await user.click(sortButton(/sort by token name/i));
    expect(rowNames()).toEqual([
      "Lumen Protocol",
      "Nebula Network",
      "Orbit Labs",
      "Prism Points",
      "Solaris Collective",
      "Verdant DAO",
    ]);
    expect(sortTh(/sort by token name/i)).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
    expect(document.querySelectorAll("th[aria-sort]")).toHaveLength(1);
    expect(statusRegion()).toHaveTextContent(/Sorted by Token name, ascending/);
  });

  it("toggles name to descending on second click and restores featured order on third", async () => {
    const user = userEvent.setup();
    render(<App />);
    const button = sortButton(/sort by token name/i);

    await user.click(button);
    await user.click(button);
    expect(rowNames()[0]).toBe("Verdant DAO");
    expect(sortTh(/sort by token name/i)).toHaveAttribute(
      "aria-sort",
      "descending"
    );

    await user.click(button);
    expect(rowNames()).toEqual(featuredOrder);
    expect(document.querySelector("th[aria-sort]")).toBeNull();
    expect(statusRegion()).toHaveTextContent(/Sorting cleared/);
  });

  it("sorts by sample price highest-first on first click (crypto convention)", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(sortButton(/sort by sample price/i));
    expect(rowNames()).toEqual([
      "Solaris Collective",
      "Verdant DAO",
      "Lumen Protocol",
      "Nebula Network",
      "Orbit Labs",
      "Prism Points",
    ]);
    expect(sortTh(/sort by sample price/i)).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    expect(statusRegion()).toHaveTextContent(
      /Sorted by Sample price, descending/
    );

    await user.click(sortButton(/sort by sample price/i));
    expect(rowNames()[0]).toBe("Prism Points");
    expect(sortTh(/sort by sample price/i)).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
  });

  it("sorts by market cap on click and exposes the state on the header", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(sortButton(/sort by sample market cap/i));
    expect(sortTh(/sort by sample market cap/i)).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    expect(document.querySelectorAll("th[aria-sort]")).toHaveLength(1);

    await user.click(sortButton(/sort by sample market cap/i));
    expect(rowNames()[0]).toBe("Prism Points");
    expect(sortTh(/sort by sample market cap/i)).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
  });

  it("moves aria-sort to the newly sorted column when a different column is picked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(sortButton(/sort by token name/i));
    await user.click(sortButton(/sort by sample price/i));
    expect(document.querySelectorAll("th[aria-sort]")).toHaveLength(1);
    expect(sortTh(/sort by sample price/i)).toHaveAttribute(
      "aria-sort",
      "descending"
    );
    expect(sortTh(/sort by token name/i)).not.toHaveAttribute("aria-sort");
  });

  it("resetting search and filters also restores the featured sort order", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nameButton = sortButton(/sort by token name/i);
    await user.click(nameButton);
    await user.click(nameButton); // descending
    expect(rowNames()[0]).toBe("Verdant DAO");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(rowNames()).toEqual(featuredOrder);
    expect(document.querySelector("th[aria-sort]")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Reset" })
    ).not.toBeInTheDocument();
  });
});
