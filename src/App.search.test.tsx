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
});
