import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

afterEach(() => cleanup());

describe("catalog search feedback", () => {
  it("shows a sample result count and clears the search", async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole("textbox", { name: "Search assets" });

    await user.type(search, "Nebula");
    expect(screen.getByText(/Showing 1 of \d+ sample assets/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(search).toHaveValue("");
    expect(screen.getByText(/Showing all \d+ sample assets/)).toBeInTheDocument();
  });

  it("diagnoses the empty catalog with the user's own search and filter", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Trending" }));
    await user.type(screen.getByRole("textbox", { name: "Search assets" }), "Nebula");

    // PatternFly "No results" pattern: heading states the outcome in sentence
    // case with no punctuation; the body echoes back the search term and the
    // active category so the user can recognize and diagnose the miss.
    const empty = screen.getByText("No results found").closest(".empty");
    expect(empty).not.toBeNull();
    const body = within(empty as HTMLElement);
    expect(body.getByText(/No sample assets match “Nebula” in the Trending category\./)).toBeInTheDocument();
    expect(body.getByText(/Adjust your search or filters and try again\./)).toBeInTheDocument();
    expect(body.getByRole("button", { name: "Clear search" })).toBeInTheDocument();
    expect(body.getByRole("button", { name: "Show all assets" })).toBeInTheDocument();
  });

  it("recovers from the empty state by clearing just the search term", async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole("textbox", { name: "Search assets" });

    await user.click(screen.getByRole("button", { name: "Trending" }));
    await user.type(search, "Nebula");
    expect(screen.getByText("No results found")).toBeInTheDocument();

    const empty = screen.getByText("No results found").closest(".empty") as HTMLElement;
    await user.click(within(empty).getByRole("button", { name: "Clear search" }));

    // Only the search term is cleared — the Trending filter stays active —
    // and focus returns to the search box so the user can retype.
    expect(search).toHaveValue("");
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
    expect(screen.getByText("Lumen Protocol")).toBeInTheDocument();
    expect(screen.getByText("Solaris Collective")).toBeInTheDocument();
    expect(screen.queryByText("Nebula Network")).not.toBeInTheDocument();
    expect(search).toHaveFocus();
  });

  it("recovers from the empty state by clearing the category filter", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Trending" }));
    await user.type(screen.getByRole("textbox", { name: "Search assets" }), "Nebula");
    expect(screen.getByText("No results found")).toBeInTheDocument();

    const empty = screen.getByText("No results found").closest(".empty") as HTMLElement;
    await user.click(within(empty).getByRole("button", { name: "Show all assets" }));

    // The filter is reset to All while the search term is preserved.
    expect(screen.getByText("Nebula Network")).toBeInTheDocument();
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });

  it("recovers fully via the toolbar reset after emptying the search", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Trending" }));
    await user.type(screen.getByRole("textbox", { name: "Search assets" }), "Nebula");
    expect(screen.getByText("No results found")).toBeInTheDocument();

    // Clearing the search from the empty state leaves the category filter in
    // place; the toolbar Reset then restores the full catalog.
    const empty = screen.getByText("No results found").closest(".empty") as HTMLElement;
    await user.click(within(empty).getByRole("button", { name: "Clear search" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByText("Lumen Protocol")).toBeInTheDocument();
    expect(screen.getByText("Nebula Network")).toBeInTheDocument();
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
    expect(screen.getByText(/Showing all \d+ sample assets/)).toBeInTheDocument();
  });

  it("clears the search when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole("textbox", { name: "Search assets" });
    await user.type(search, "Nebula");
    expect(screen.getByText(/Showing 1 of \d+ sample assets/)).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(search).toHaveValue("");
    expect(screen.getByText(/Showing all \d+ sample assets/)).toBeInTheDocument();
  });

  it("navigates filter tabs with arrow keys and auto-selects", async () => {
    const user = userEvent.setup();
    render(<App />);
    const all = screen.getByRole("button", { name: "All" });
    await user.click(all);
    expect(all).toHaveFocus();
    expect(all).toHaveAttribute("aria-pressed", "true");

    await user.keyboard("{ArrowRight}");
    const newest = screen.getByRole("button", { name: "New" });
    expect(newest).toHaveFocus();
    expect(newest).toHaveAttribute("aria-pressed", "true");
    expect(all).toHaveAttribute("aria-pressed", "false");

    await user.keyboard("{End}");
    const trending = screen.getByRole("button", { name: "Trending" });
    expect(trending).toHaveFocus();
    expect(trending).toHaveAttribute("aria-pressed", "true");

    await user.keyboard("{ArrowRight}");
    const wrapped = screen.getByRole("button", { name: "All" });
    expect(wrapped).toHaveFocus();
    expect(wrapped).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Showing all \d+ sample assets/)).toBeInTheDocument();

    await user.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "All" })).toHaveFocus();
  });
});
