import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { sampleAssets } from "./data/assets";
import type { Asset, AssetFilter, AssetSort, LaunchDraft } from "./types";

function Dialog(props: {open:boolean; title:string; titleId:string; onClose:()=>void; children:ReactNode}) {
  const panel=useRef<HTMLElement>(null);
  const close=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    if(!props.open) return;
    const previous=document.activeElement as HTMLElement|null;
    close.current?.focus();
    const keydown=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){event.preventDefault();props.onClose();return;}
      if(event.key!=="Tab") return;
      const nodes=panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])');
      if(!nodes?.length){event.preventDefault();panel.current?.focus();return;}
      const first=nodes[0],last=nodes[nodes.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    document.addEventListener("keydown",keydown);
    return ()=>{document.removeEventListener("keydown",keydown);previous?.focus();};
  },[props.open,props.onClose]);
  if(!props.open) return null;
  return <div className="modalback show" onMouseDown={e=>{if(e.target===e.currentTarget)props.onClose();}}>
    <section ref={panel} className="modal" role="dialog" aria-modal="true" aria-labelledby={props.titleId} tabIndex={-1}>
      <div className="modalhead"><h2 id={props.titleId}>{props.title}</h2><button ref={close} className="x" type="button" onClick={props.onClose} aria-label="Close dialog">×</button></div>
      {props.children}
    </section>
  </div>;
}

const filters:{value:AssetFilter;label:string}[]=[
  {value:"all",label:"All assets"},{value:"new",label:"New launches"},{value:"trending",label:"Trending"}
];
const tagLabel=(tag:Asset["tag"])=>tag==="trending"?"Trending":tag==="new"?"New":"Community";

export default function App(){
  const [filter,setFilter]=useState<AssetFilter>("all");
  const [query,setQuery]=useState("");
  const [sort,setSort]=useState<AssetSort>("featured");
  const [dialog,setDialog]=useState<"wallet"|"launch"|"asset"|null>(null);
  const [selected,setSelected]=useState<Asset|null>(null);
  const [walletNotice,setWalletNotice]=useState("No connection request will be sent.");
  const [notice,setNotice]=useState("");
  const [draftErrors,setDraftErrors]=useState({name:"",symbol:"",supply:""});
  const [result,setResult]=useState<LaunchDraft|null>(null);
  const [draft,setDraft]=useState({name:"",symbol:"",supply:"",description:""});
  const nameInput=useRef<HTMLInputElement>(null);
  const symbolInput=useRef<HTMLInputElement>(null);
  const supplyInput=useRef<HTMLInputElement>(null);
  const closeDialog=useCallback(()=>setDialog(null),[]);
  const resetSearchAndFilters=useCallback(()=>{setQuery("");setFilter("all");},[]);
  const openLaunch=useCallback(()=>{setDraftErrors({name:"",symbol:"",supply:""});setResult(null);setDialog("launch");},[]);
  const visible=useMemo(()=>{
    const q=query.trim().toLocaleLowerCase();
    const items=sampleAssets.filter(a=>(a.name+" "+a.symbol).toLocaleLowerCase().includes(q)&&(filter==="all"||a.tag===filter));
    if(sort==="name") items.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort==="cap") items.sort((a,b)=>b.marketCap-a.marketCap);
    return items;
  },[filter,query,sort]);
  const hasActiveFilters=query.trim().length>0||filter!=="all";
  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const name=draft.name.trim(),symbol=draft.symbol.trim().toUpperCase(),supply=Number(draft.supply),description=draft.description.trim();
    const errors={
      name:name?"":"Enter a token name.",
      symbol:/^[A-Z0-9]{1,10}$/.test(symbol)?"":"Use 1–10 letters or numbers for the symbol.",
      supply:draft.supply.trim()===""?"Enter a total supply.":!Number.isSafeInteger(supply)?"Supply must be a whole number.":supply<1||supply>1_000_000_000_000_000?"Supply must be between 1 and 1,000,000,000,000,000.":""
    };
    setDraftErrors(errors);
    setResult(null);
    if(errors.name){nameInput.current?.focus();return;}
    if(errors.symbol){symbolInput.current?.focus();return;}
    if(errors.supply){supplyInput.current?.focus();return;}
    setResult({name,symbol,supply,description});
  };
  useEffect(()=>{document.title="OPENORBIT — On-chain Launchpad";},[]);

  return <>
    <header className="top"><div className="wrap nav">
      <a className="brand" href="#top" aria-label="OPENORBIT home"><span className="logo" aria-hidden="true">O</span><span>OPENORBIT</span></a>
      <nav className="navlinks" aria-label="Main navigation"><a className="active" href="#explore">Explore</a><a href="#launch">Launch a token</a><a href="#how">How it works</a></nav>
      <div className="right"><span className="net"><span className="dot" aria-hidden="true"/>Preview mode</span><button className="btn primary" type="button" onClick={()=>{setWalletNotice("No connection request will be sent.");setDialog("wallet");}}>Connect wallet</button></div>
    </div></header>
    <main id="top" className="wrap">
      <section className="hero"><div>
        <div className="eyebrow">The on-chain launchpad · Early preview</div><h1>Find your next<br/><span className="grad">orbit.</span></h1>
        <p>Discover emerging community tokens, explore new launches, and prepare your own token project. Built for transparent, non-custodial exploration.</p>
        <div className="actions"><button className="btn primary" type="button" onClick={()=>document.getElementById("explore")?.scrollIntoView({behavior:"smooth"})}>Explore assets ↘</button><button className="btn ghost" type="button" onClick={openLaunch}>Start a launch draft ↗</button></div>
        <div className="notice">Preview mode: market figures are sample data. Wallet and token deployment actions are not connected to a live blockchain.</div>
      </div><aside className="hero-card" aria-label="Preview status">
        <div className="eyebrow">A new constellation</div><div className="orbitart" aria-hidden="true"><div className="orb"><div className="core"/></div></div>
        <div className="status"><span>Network status</span><span><span className="dot" aria-hidden="true"/>Not connected</span></div><div className="status status-last"><span>Deployment mode</span><strong>Read-only preview</strong></div>
      </aside></section>
      <section className="stats" aria-label="Marketplace overview">
        <div className="stat"><label>Sample assets</label><strong>{String(sampleAssets.length).padStart(2,"0")}</strong><small>Illustrative catalog</small></div>
        <div className="stat"><label>Matching results</label><strong>{String(visible.length).padStart(2,"0")}</strong><small>Current search and filters</small></div>
        <div className="stat"><label>Launch status</label><strong>Draft only</strong><small>No contract generated</small></div>
        <div className="stat"><label>Network</label><strong>Not connected</strong><small>No chain configured</small></div>
      </section>
      <section id="explore">
        <div className="sectionhead"><div><div className="eyebrow">Community marketplace</div><h2>Explore assets</h2><p>Browse sample listings to preview the discovery experience.</p></div>
          <div className="tabs" role="group" aria-label="Filter assets">{filters.map(f=><button key={f.value} className={"tab"+(filter===f.value?" active":"")} type="button" aria-pressed={filter===f.value} onClick={()=>setFilter(f.value)}>{f.label}</button>)}</div>
        </div>
        <div className="filters"><div className="search-control">
          <svg className="search-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <input className="field" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name or symbol…" aria-label="Search assets"/>
          {query&&<button className="clear-search" type="button" aria-label="Clear search" onClick={()=>setQuery("")}>×</button>}
        </div>
          <select className="field" value={sort} onChange={e=>setSort(e.target.value as AssetSort)} aria-label="Sort assets"><option value="featured">Sort: Featured</option><option value="name">Name A–Z</option><option value="cap">Market cap</option></select>
        </div>
        <div className="results-meta"><p className="results-count" aria-live="polite" aria-atomic="true">{visible.length===sampleAssets.length&&!hasActiveFilters?`Showing all ${sampleAssets.length} sample assets`:`Showing ${visible.length} of ${sampleAssets.length} sample assets`}</p>{hasActiveFilters&&visible.length>0&&<button className="reset-controls" type="button" onClick={resetSearchAndFilters}>Reset search and filters</button>}</div>
        {notice&&<div className="notice" role="status">{notice}</div>}
        <div className="token-grid">{visible.map(a=><article className="token" key={a.id}>
          <div className="token-top"><div className={"coin "+a.color} aria-hidden="true">{a.initial}</div><div><h3>{a.name}</h3><div className="symbol">{a.symbol} · {a.category}</div></div><span className="badge">{tagLabel(a.tag)}</span></div>
          <p className="desc">{a.description}</p><div className="nums"><div><label>Sample price</label><strong>{a.priceLabel}</strong></div><div><label>Sample market cap</label><strong>{a.marketCapLabel}</strong></div></div>
          <div className="tokenbottom"><button className="btn" type="button" onClick={()=>{setSelected(a);setDialog("asset");}}>View details</button><button className="btn ghost" type="button" onClick={()=>setNotice("Trading is disabled in this preview. Sample market data is for interface demonstration only.")}>Trade · Demo</button></div>
        </article>)}</div>
        {visible.length===0&&<div className="empty"><div><strong>No matching assets</strong><p>Try a different name or symbol, or reset your search and filters.</p></div><button className="btn" type="button" onClick={resetSearchAndFilters}>Reset search and filters</button></div>}
      </section>
      <section className="launch" id="launch"><div><div className="eyebrow">Creator tools</div><h2>Build something worth discovering.</h2><p>Configure an initial token launch draft, review your project parameters, and prepare it for a future testnet integration. Drafts stay in this browser session.</p><div className="pillrow"><span className="pill">Parameter validation</span><span className="pill">Draft review</span><span className="pill">No live transactions</span></div></div><button className="btn primary" type="button" onClick={openLaunch}>Create launch draft ↗</button></section>
      <section id="how"><div className="sectionhead"><div><div className="eyebrow">Designed for clarity</div><h2>From idea to launch draft</h2><p>A safer workflow before chain and contract configuration are finalized.</p></div></div>
        <div className="stats"><div className="stat"><label>01 · Discover</label><strong className="step-title">Explore</strong><span className="step-copy">Search and compare community projects.</span></div><div className="stat"><label>02 · Prepare</label><strong className="step-title">Configure</strong><span className="step-copy">Draft a token name, supply, and symbol.</span></div><div className="stat"><label>03 · Review</label><strong className="step-title">Validate</strong><span className="step-copy">Review inputs before any future deployment.</span></div><div className="stat"><label>04 · Integrate</label><strong className="step-title">Testnet first</strong><span className="step-copy">Enable chain actions only after audit and approval.</span></div></div>
      </section>
      <footer className="footer"><div><strong className="footer-brand">OPENORBIT</strong><br/>A testnet-first launchpad preview.</div><div>Sample metrics are not market data. No wallet custody, trades, or token deployments are enabled.</div><div>© 2026 OPENORBIT · Preview build</div></footer>
    </main>
    <Dialog open={dialog==="wallet"} title="Connect wallet" titleId="walletTitle" onClose={closeDialog}>
      <p>Wallet providers are not configured in this preview. Choose an option to see the intended integration state.</p>
      <button className="walletopt" type="button" onClick={()=>setWalletNotice("MetaMask is shown as a UI preview only. No wallet provider is installed or contacted.")}><span className="walleticon" aria-hidden="true">M</span><span><strong>MetaMask</strong><span className="symbol">Browser wallet · Not connected</span></span></button>
      <button className="walletopt" type="button" onClick={()=>setWalletNotice("WalletConnect is shown as a UI preview only. No wallet provider is installed or contacted.")}><span className="walleticon" aria-hidden="true">W</span><span><strong>WalletConnect</strong><span className="symbol">Mobile wallet · Not configured</span></span></button>
      <div className="notice" role="status" aria-live="polite">{walletNotice}</div>
    </Dialog>
    <Dialog open={dialog==="launch"} title="Create launch draft" titleId="launchTitle" onClose={closeDialog}>
      <p>Draft settings are for preview only and are not submitted to a blockchain.</p>
      <form onSubmit={submit} noValidate><div className="formgrid">
        <label>Token name<input ref={nameInput} value={draft.name} onChange={e=>{setDraft({...draft,name:e.target.value});setDraftErrors(current=>({...current,name:""}));}} aria-invalid={Boolean(draftErrors.name)} aria-describedby={draftErrors.name?"token-name-error":undefined} required maxLength={40} placeholder="e.g. Open Orbit" autoComplete="off"/>{draftErrors.name&&<span id="token-name-error" className="field-error">{draftErrors.name}</span>}</label>
        <label>Token symbol<input ref={symbolInput} value={draft.symbol} onChange={e=>{setDraft({...draft,symbol:e.target.value.toUpperCase()});setDraftErrors(current=>({...current,symbol:""}));}} aria-invalid={Boolean(draftErrors.symbol)} aria-describedby={draftErrors.symbol?"token-symbol-error":undefined} required maxLength={10} pattern="[A-Za-z0-9]+" placeholder="e.g. ORBT" autoComplete="off"/>{draftErrors.symbol&&<span id="token-symbol-error" className="field-error">{draftErrors.symbol}</span>}</label>
        <label className="full">Total supply<input ref={supplyInput} value={draft.supply} onChange={e=>{setDraft({...draft,supply:e.target.value});setDraftErrors(current=>({...current,supply:""}));}} aria-invalid={Boolean(draftErrors.supply)} aria-describedby={draftErrors.supply?"token-supply-error":undefined} type="number" inputMode="numeric" min="1" max="1000000000000000" step="1" required placeholder="1000000000"/>{draftErrors.supply&&<span id="token-supply-error" className="field-error">{draftErrors.supply}</span>}</label>
        <label className="full">Description<input value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})} maxLength={140} placeholder="What makes your project different?"/></label>
      </div>{Object.values(draftErrors).some(Boolean)&&<p className="error-summary" role="alert">Please fix the highlighted fields before reviewing this draft.</p>}<button className="btn primary" type="submit" style={{width:"100%"}}>Review draft</button></form>
      {result&&<div className="draft-result" aria-live="polite"><h3>Draft ready for review</h3><p>{result.name} ({result.symbol}) · Total supply: {result.supply.toLocaleString()}{result.description?" · "+result.description:""}</p><div className="notice">Saved in this page only. No contract has been generated or deployed.</div><button className="btn" type="button" style={{width:"100%",marginTop:12}} onClick={()=>setResult(null)}>Edit draft</button></div>}
    </Dialog>
    <Dialog open={dialog==="asset"} title={selected?selected.name:"Asset details"} titleId="assetTitle" onClose={closeDialog}>
      {selected&&<><p>{selected.description} Symbol: {selected.symbol}. Sample market cap: {selected.marketCapLabel}. No live chain data is connected.</p><div className="notice">Listing metrics are illustrative only. Trading is disabled in this preview.</div></>}
    </Dialog>
  </>;
}
