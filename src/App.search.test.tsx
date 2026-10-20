import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
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

  it("resets both search and category when no assets match", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Trending" }));
    await user.type(screen.getByRole("textbox", { name: "Search assets" }), "Nebula");
    expect(screen.getByText("No matching assets")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset search and filters" }));
    expect(screen.getByText("Lumen Protocol")).toBeInTheDocument();
    expect(screen.queryByText("No matching assets")).not.toBeInTheDocument();
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
