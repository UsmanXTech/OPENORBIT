import {afterEach,describe,expect,it} from "vitest";
import {cleanup,render,screen,waitFor,within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
afterEach(()=>cleanup());
describe("OPENORBIT marketplace preview",()=>{
 it("renders sample assets and the preview safety notice",()=>{
  render(<App />);
  expect(screen.getByRole("heading",{name:"Explore assets"})).toBeInTheDocument();
  expect(screen.getByText("Lumen Protocol")).toBeInTheDocument();
  expect(screen.getByText(/Preview mode: market figures are sample data/)).toBeInTheDocument();
 });
 it("shows exactly one view at a time via the tab navigation",async()=>{
  const user=userEvent.setup(); render(<App />);
  const tablist=screen.getByRole("tablist",{name:"App views"});
  expect(within(tablist).getAllByRole("tab")).toHaveLength(4);
  expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby","tab-explore");
  expect(screen.getByRole("heading",{name:"Explore assets"})).toBeInTheDocument();
  expect(screen.queryByRole("heading",{name:"Create launch draft"})).not.toBeInTheDocument();
  await user.click(screen.getByRole("tab",{name:"Guide"}));
  expect(screen.getByRole("heading",{name:"From idea to launch draft"})).toBeInTheDocument();
  expect(screen.queryByRole("heading",{name:"Explore assets"})).not.toBeInTheDocument();
  expect(screen.getByRole("tab",{name:"Guide"})).toHaveAttribute("aria-selected","true");
  expect(screen.getByRole("tab",{name:"Explore"})).toHaveAttribute("aria-selected","false");
 });
 it("navigates views with arrow keys following the tabs pattern",async()=>{
  const user=userEvent.setup(); render(<App />);
  const exploreTab=screen.getByRole("tab",{name:"Explore"});
  exploreTab.focus();
  await user.keyboard("{ArrowRight}");
  const launchTab=screen.getByRole("tab",{name:"Launch"});
  expect(launchTab).toHaveFocus();
  expect(launchTab).toHaveAttribute("aria-selected","true");
  expect(screen.getByRole("heading",{name:"Create launch draft"})).toBeInTheDocument();
  expect(screen.queryByRole("heading",{name:"Explore assets"})).not.toBeInTheDocument();
  await user.keyboard("{ArrowLeft}");
  expect(screen.getByRole("tab",{name:"Explore"})).toHaveFocus();
  expect(screen.getByRole("heading",{name:"Explore assets"})).toBeInTheDocument();
 });
 it("shows the asset detail as an inline page with sample-labeled stats",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getAllByRole("button",{name:/^View details/})[0]);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  const heading=screen.getByRole("heading",{name:"Lumen Protocol"});
  await waitFor(()=>expect(heading).toHaveFocus());
  expect(screen.getByRole("button",{name:/Back to explore assets/})).toBeInTheDocument();
  expect(screen.getByText("Sample price")).toBeInTheDocument();
  expect(screen.getByText("Sample market cap")).toBeInTheDocument();
  expect(screen.getByText("About this listing")).toBeInTheDocument();
  expect(screen.getByText(/Listing metrics are illustrative only/)).toBeInTheDocument();
  expect(screen.queryByRole("button",{name:/^View details/})).not.toBeInTheDocument();
 });
 it("dedupes the detail stats to the two KPI cards (header owns identity)",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getAllByRole("button",{name:/^View details/})[0]);
  const stats=screen.getByRole("heading",{name:"Lumen Protocol"}).closest(".asset-detail");
  expect(stats).not.toBeNull();
  // exactly two stat cards — Category/Listing no longer duplicate the header
  expect((stats as HTMLElement).querySelectorAll("dt").length).toBe(2);
  expect(within(stats as HTMLElement).getByText("Sample price")).toBeInTheDocument();
  expect(within(stats as HTMLElement).getByText("Sample market cap")).toBeInTheDocument();
  expect(within(stats as HTMLElement).queryByText("Category")).not.toBeInTheDocument();
  expect(within(stats as HTMLElement).queryByText("Listing")).not.toBeInTheDocument();
  // identity lives in the header: eyebrow + badge
  expect(within(stats as HTMLElement).getByText(/Sample listing ·/i)).toBeInTheDocument();
  expect(within(stats as HTMLElement).getByText(/Featured|New|Trending/)).toBeInTheDocument();
 });
 it("returns to the catalog and restores focus to the triggering button",async()=>{
  const user=userEvent.setup(); render(<App />);
  const trigger=screen.getAllByRole("button",{name:/^View details/})[0];
  await user.click(trigger);
  await user.click(screen.getByRole("button",{name:"Back to catalog"}));
  expect(screen.queryByText("About this listing")).not.toBeInTheDocument();
  const triggers=screen.getAllByRole("button",{name:/^View details/});
  expect(triggers.length).toBeGreaterThan(0);
  expect(triggers[0]).toHaveFocus();
 });
 it("closes the asset detail view with Escape",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getAllByRole("button",{name:/^View details/})[0]);
  expect(screen.getByRole("heading",{name:"Lumen Protocol"})).toBeInTheDocument();
  await user.keyboard("{Escape}");
  expect(screen.queryByText("About this listing")).not.toBeInTheDocument();
  expect(screen.queryByRole("button",{name:/Back to explore assets/})).not.toBeInTheDocument();
  expect(screen.getAllByRole("button",{name:/^View details/}).length).toBeGreaterThan(0);
 });
 it("filters assets by name or symbol",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.type(screen.getByRole("textbox",{name:"Search assets"}),"Nebula");
  expect(screen.getByText("Nebula Network")).toBeInTheDocument();
  expect(screen.queryByText("Lumen Protocol")).not.toBeInTheDocument();
 });
 it("filters to trending sample assets",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("button",{name:"Trending"}));
  expect(screen.getByText("Lumen Protocol")).toBeInTheDocument();
  expect(screen.getByText("Solaris Collective")).toBeInTheDocument();
  expect(screen.queryByText("Nebula Network")).not.toBeInTheDocument();
 });
 it("renders the launch-draft form inline in the Launch view, never in a dialog",async()=>{
  const user=userEvent.setup(); render(<App />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("textbox",{name:"Token name"})).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Review draft"})).toBeInTheDocument();
  const heading=screen.getByRole("heading",{name:"Create launch draft"});
  await waitFor(()=>expect(heading).toHaveFocus());
 });
 it("links every validation error from the summary to its field",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  const alert=screen.getByRole("alert");
  expect(within(alert).getByText("There is a problem")).toBeInTheDocument();
  const nameLink=within(alert).getByRole("link",{name:"Enter a token name."});
  const supplyLink=within(alert).getByRole("link",{name:"Enter a total supply."});
  expect(nameLink).toHaveAttribute("href","#token-name");
  expect(supplyLink).toHaveAttribute("href","#token-supply");
 });
 it("places the error summary above the form fields, not below them",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  const alert=screen.getByRole("alert");
  const form=screen.getByRole("form",{name:"Create launch draft form"});
  expect(alert.compareDocumentPosition(form) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 });
 it("moves keyboard focus to the field when a summary link is activated",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  const alert=screen.getByRole("alert");
  await user.click(within(alert).getByRole("link",{name:"Enter a total supply."}));
  expect(screen.getByRole("spinbutton",{name:"Total supply"})).toHaveFocus();
 });
 it("reviews a launch draft without deploying it",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  await waitFor(()=>expect(screen.getByRole("heading",{name:"Create launch draft"})).toHaveFocus());
  await user.type(screen.getByRole("textbox",{name:"Token name"}),"Open Orbit");
  await user.type(screen.getByRole("textbox",{name:"Token symbol"}),"orbt");
  await user.type(screen.getByRole("spinbutton",{name:"Total supply"}),"1000000");
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  expect(screen.getByText("Draft ready for review")).toBeInTheDocument();
  expect(screen.getByText(/No contract has been generated or deployed/)).toBeInTheDocument();
 });
 it("gives the form card its own title below the view heading",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  const title=screen.getByRole("heading",{name:"Draft settings",level:3});
  expect(title).toBeInTheDocument();
  // The card title must not outrank or duplicate the view's h2.
  expect(title.compareDocumentPosition(screen.getByRole("heading",{name:"Create launch draft"})) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
 });
 it("keeps form action buttons' geometry in CSS, not inline styles",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  const submit=screen.getByRole("button",{name:"Review draft"});
  expect(submit).not.toHaveAttribute("style");
  expect(submit).toHaveClass("btn-block");
  await user.type(screen.getByRole("textbox",{name:"Token name"}),"Open Orbit");
  await user.type(screen.getByRole("textbox",{name:"Token symbol"}),"orbt");
  await user.type(screen.getByRole("spinbutton",{name:"Total supply"}),"1000000");
  await user.click(submit);
  const editDraft=screen.getByRole("button",{name:"Edit draft"});
  expect(editDraft).not.toHaveAttribute("style");
  expect(editDraft).toHaveClass("btn-block");
 });
 it("rejects a supply above the documented maximum",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  await waitFor(()=>expect(screen.getByRole("heading",{name:"Create launch draft"})).toHaveFocus());
  await user.type(screen.getByRole("textbox",{name:"Token name"}),"Open Orbit");
  await user.type(screen.getByRole("textbox",{name:"Token symbol"}),"orbt");
  await user.type(screen.getByRole("spinbutton",{name:"Total supply"}),"1000000000000001");
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  const supply=screen.getByRole("spinbutton",{name:"Total supply"});
  expect(screen.getAllByText(/Supply must be between 1 and 1,000,000,000,000,000/).length).toBe(2);
  expect(supply).toHaveAttribute("aria-invalid","true");
  expect(supply).toHaveAttribute("aria-describedby","token-supply-error");
  expect(supply).toHaveFocus();
  expect(screen.queryByText("Draft ready for review")).not.toBeInTheDocument();
 });
 it("shows field-level errors and focuses the first invalid input",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  await waitFor(()=>expect(screen.getByRole("heading",{name:"Create launch draft"})).toHaveFocus());
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  const name=screen.getByRole("textbox",{name:"Token name"});
  expect(name).toHaveAttribute("aria-invalid","true");
  expect(name).toHaveAttribute("aria-describedby","token-name-error");
  expect(name).toHaveFocus();
  expect(screen.getAllByText("Enter a token name.").length).toBe(2);
  expect(screen.getAllByText("Use 1–10 letters or numbers for the symbol.").length).toBe(2);
  expect(screen.getAllByText("Enter a total supply.").length).toBe(2);
  expect(screen.getByRole("alert")).toHaveTextContent(/fix the highlighted fields/i);
 });
 it("clears an inline error when its field is corrected",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Launch"}));
  await waitFor(()=>expect(screen.getByRole("heading",{name:"Create launch draft"})).toHaveFocus());
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  const name=screen.getByRole("textbox",{name:"Token name"});
  await user.type(name,"Open Orbit");
  expect(name).toHaveAttribute("aria-invalid","false");
  expect(name).not.toHaveAttribute("aria-describedby");
  expect(screen.queryByText("Enter a token name.")).not.toBeInTheDocument();
 });
 it("reports honest wallet connection status via the Wallet view, not a dialog",async()=>{
  const user=userEvent.setup(); render(<App />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button",{name:"Wallet"}));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  const heading=screen.getByRole("heading",{name:"Connection status"});
  await waitFor(()=>expect(heading).toHaveFocus());
  expect(screen.getByText(/This preview is not connected to any wallet or blockchain/)).toBeInTheDocument();
  const list=screen.getByRole("list");
  expect(within(list).getAllByRole("listitem")).toHaveLength(5);
  expect(within(list).getByText("Not connected")).toBeInTheDocument();
  expect(within(list).getAllByText("Planned")).toHaveLength(2);
  expect(within(list).getByText("Not configured")).toBeInTheDocument();
  expect(within(list).getByText("Not handled")).toBeInTheDocument();
  expect(screen.getByText(/No connection request will be sent/)).toBeInTheDocument();
  expect(screen.queryByText("Connect wallet")).not.toBeInTheDocument();
  await user.click(screen.getByRole("tab",{name:"Explore"}));
  expect(screen.queryByRole("heading",{name:"Connection status"})).not.toBeInTheDocument();
  expect(screen.getByRole("heading",{name:"Explore assets"})).toBeInTheDocument();
 });
 it("renders the guide as an actionable task list with honest statuses",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Guide"}));
  const list=screen.getByRole("list");
  const rows=within(list).getAllByRole("listitem");
  expect(rows).toHaveLength(4);
  expect(within(list).getByText("Explore")).toBeInTheDocument();
  expect(within(list).getByText("Configure")).toBeInTheDocument();
  expect(within(list).getByText("Validate")).toBeInTheDocument();
  expect(within(list).getByText("Testnet first")).toBeInTheDocument();
  // whole-row buttons: status tags are descriptions, not fake links
  expect(within(list).getAllByRole("button")).toHaveLength(4);
  expect(within(list).getAllByText("Available")).toHaveLength(3);
  expect(within(list).getByText("Preview only")).toBeInTheDocument();
 });
 it("navigates from a guide step to its view with heading focus",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Guide"}));
  const list=screen.getByRole("list");
  await user.click(within(list).getByRole("button",{name:/Configure/}));
  expect(screen.queryByRole("heading",{name:"From idea to launch draft"})).not.toBeInTheDocument();
  const heading=screen.getByRole("heading",{name:"Create launch draft"});
  await waitFor(()=>expect(heading).toHaveFocus());
 });
 it("describes each guide step button by its status tag",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("tab",{name:"Guide"}));
  const list=screen.getByRole("list");
  const row=within(list).getByRole("button",{name:/Testnet first/});
  const describedBy=row.getAttribute("aria-describedby");
  expect(describedBy).not.toBeNull();
  expect(document.getElementById(describedBy as string)?.textContent).toBe("Preview only");
 });
});
