import {afterEach,describe,expect,it} from "vitest";
import {cleanup,render,screen} from "@testing-library/react";
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
 it("filters assets by name or symbol",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.type(screen.getByRole("textbox",{name:"Search assets"}),"Nebula");
  expect(screen.getByText("Nebula Network")).toBeInTheDocument();
  expect(screen.queryByText("Lumen Protocol")).not.toBeInTheDocument();
 });
 it("keeps the catalog total stable and reports matching results with a reset action",async()=>{
  const user=userEvent.setup(); render(<App />);
  const listedAssets=screen.getByText("Listed assets").parentElement;
  expect(listedAssets).toHaveTextContent("06");
  expect(screen.getByText((_,element)=>element?.classList.contains("results-summary"))).toHaveTextContent("Showing 6 of 6 sample assets");
  await user.type(screen.getByRole("textbox",{name:"Search assets"}),"Nebula");
  expect(listedAssets).toHaveTextContent("06");
  expect(screen.getByText((_,element)=>element?.classList.contains("results-summary"))).toHaveTextContent("Showing 1 of 6 sample assets");
  await user.click(screen.getByRole("button",{name:"Clear search & filters"}));
  expect(screen.getByText("Lumen Protocol")).toBeInTheDocument();
  expect(screen.getByText((_,element)=>element?.classList.contains("results-summary"))).toHaveTextContent("Showing 6 of 6 sample assets");
 });
 it("labels wallet and chain states as preview-only, not as a live testnet",()=>{
  render(<App />);
  expect(screen.getByText("Preview mode")).toBeInTheDocument();
  expect(screen.getByText("Wallet status")).toBeInTheDocument();
  expect(screen.getByText("Chain integration")).toBeInTheDocument();
  expect(screen.getByText("Not configured")).toBeInTheDocument();
  expect(screen.queryByText("Testnet preview")).not.toBeInTheDocument();
 });
 it("filters to trending sample assets",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("button",{name:"Trending"}));
  expect(screen.getByText("Lumen Protocol")).toBeInTheDocument();
  expect(screen.getByText("Solaris Collective")).toBeInTheDocument();
  expect(screen.queryByText("Nebula Network")).not.toBeInTheDocument();
 });
 it("reviews a launch draft without deploying it",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("button",{name:"Create launch draft ↗"}));
  await user.type(screen.getByRole("textbox",{name:"Token name"}),"Open Orbit");
  await user.type(screen.getByRole("textbox",{name:"Token symbol"}),"orbt");
  await user.type(screen.getByRole("spinbutton",{name:"Total supply"}),"1000000");
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  expect(screen.getByText("Draft ready for review")).toBeInTheDocument();
  expect(screen.getByText(/No contract has been generated or deployed/)).toBeInTheDocument();
 });
 it("rejects a supply above the documented maximum",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("button",{name:"Create launch draft ↗"}));
  await user.type(screen.getByRole("textbox",{name:"Token name"}),"Open Orbit");
  await user.type(screen.getByRole("textbox",{name:"Token symbol"}),"orbt");
  await user.type(screen.getByRole("spinbutton",{name:"Total supply"}),"1000000000000001");
  await user.click(screen.getByRole("button",{name:"Review draft"}));
  expect(screen.getByRole("alert")).toHaveTextContent(/between 1 and 1,000,000,000,000,000/);
  expect(screen.queryByText("Draft ready for review")).not.toBeInTheDocument();
 });
 it("keeps wallet integration in preview mode",async()=>{
  const user=userEvent.setup(); render(<App />);
  await user.click(screen.getByRole("button",{name:"Connect wallet"}));
  expect(screen.getByRole("dialog",{name:"Connect wallet"})).toBeInTheDocument();
  expect(screen.getByText("No connection request will be sent.")).toBeInTheDocument();
 });
});
