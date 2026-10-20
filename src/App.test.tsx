import {afterEach,describe,expect,it} from "vitest";
import {cleanup,render,screen,within} from "@testing-library/react";
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
 it("shows a structured asset detail view with sample-labeled stats",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getAllByRole("button",{name:"View details"})[0]);
  const dialog=screen.getByRole("dialog",{name:"Lumen Protocol"});
  expect(within(dialog).getByText("Sample price")).toBeInTheDocument();
  expect(within(dialog).getByText("Sample market cap")).toBeInTheDocument();
  expect(within(dialog).getByText("About this listing")).toBeInTheDocument();
  expect(within(dialog).getByText(/Listing metrics are illustrative only/)).toBeInTheDocument();
 });
 it("closes the asset detail dialog from its action button",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getAllByRole("button",{name:"View details"})[0]);
  await user.click(screen.getByRole("button",{name:"Back to catalog"}));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
 it("renders the launch-draft form inline in the page, never in a dialog",async()=>{
  const user=userEvent.setup(); render(<App />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("textbox",{name:"Token name"})).toBeInTheDocument();
  expect(screen.getByRole("button",{name:"Review draft"})).toBeInTheDocument();
  await user.click(screen.getByRole("button",{name:/Start a launch draft/}));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("textbox",{name:"Token name"})).toBeInTheDocument();
 });
 it("links every validation error from the summary to its field",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  const alert=screen.getByRole("alert");
  expect(within(alert).getByText("There is a problem")).toBeInTheDocument();
  const nameLink=within(alert).getByRole("link",{name:"Enter a token name."});
  const supplyLink=within(alert).getByRole("link",{name:"Enter a total supply."});
  expect(nameLink).toHaveAttribute("href","#token-name");
  expect(supplyLink).toHaveAttribute("href","#token-supply");
 });
 it("reviews a launch draft without deploying it",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.type(screen.getByRole("textbox",{name:"Token name"}),"Open Orbit");
  await user.type(screen.getByRole("textbox",{name:"Token symbol"}),"orbt");
  await user.type(screen.getByRole("spinbutton",{name:"Total supply"}),"1000000");
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  expect(screen.getByText("Draft ready for review")).toBeInTheDocument();
  expect(screen.getByText(/No contract has been generated or deployed/)).toBeInTheDocument();
 });
 it("rejects a supply above the documented maximum",async()=>{
  const user=userEvent.setup(); render(<App />);
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
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  const name=screen.getByRole("textbox",{name:"Token name"});
  await user.type(name,"Open Orbit");
  expect(name).toHaveAttribute("aria-invalid","false");
  expect(name).not.toHaveAttribute("aria-describedby");
  expect(screen.queryByText("Enter a token name.")).not.toBeInTheDocument();
 });
 it("keeps wallet integration in preview mode",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("button",{name:"Connect wallet"}));
  expect(screen.getByRole("dialog",{name:"Connect wallet"})).toBeInTheDocument();
  expect(screen.getByText("No connection request will be sent.")).toBeInTheDocument();
 });
});
