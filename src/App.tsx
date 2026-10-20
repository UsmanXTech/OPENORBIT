import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { sampleAssets } from "./data/assets";
import type { Asset, AssetFilter, AssetSort, AssetSortDir, LaunchDraft } from "./types";

type View = "explore" | "launch" | "wallet" | "guide";
const views: { id: View; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "launch", label: "Launch" },
  { id: "wallet", label: "Wallet" },
  { id: "guide", label: "Guide" },
];

const filters: { value: AssetFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "trending", label: "Trending" },
];
const tagLabel = (tag: Asset["tag"]) =>
  tag === "trending" ? "Trending" : tag === "new" ? "New" : "Community";

// Sortable columns: default direction follows the domain convention
// (name A–Z; price and market cap highest-first, as on crypto explorers).
type SortColumn = "name" | "price" | "cap";
const sortDefaults: Record<SortColumn, AssetSortDir> = {
  name: "asc",
  price: "desc",
  cap: "desc",
};
const sortLabels: Record<SortColumn, string> = {
  name: "Token name",
  price: "Sample price",
  cap: "Sample market cap",
};

export default function App() {
  const [view, setView] = useState<View>("explore");
  const [announcement, setAnnouncement] = useState("");
  const [filter, setFilter] = useState<AssetFilter>("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<AssetSort>("featured");
  const [sortDir, setSortDir] = useState<AssetSortDir>("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [returnToId, setReturnToId] = useState<string | null>(null);
  const [walletNotice, setWalletNotice] = useState("No connection request will be sent.");
  const [notice, setNotice] = useState("");
  const [draftErrors, setDraftErrors] = useState({ name: "", symbol: "", supply: "" });
  const [result, setResult] = useState<LaunchDraft | null>(null);
  const [draft, setDraft] = useState({ name: "", symbol: "", supply: "", description: "" });

  const nameInput = useRef<HTMLInputElement>(null);
  const symbolInput = useRef<HTMLInputElement>(null);
  const supplyInput = useRef<HTMLInputElement>(null);
  const connectBtn = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const headingRefs = useRef<Record<View, HTMLHeadingElement | null>>({
    explore: null,
    launch: null,
    wallet: null,
    guide: null,
  });
  const detailHeading = useRef<HTMLHeadingElement>(null);

  const activate = useCallback((next: View, focusHeading: boolean) => {
    setView(next);
    const label = views.find((v) => v.id === next)?.label ?? next;
    setAnnouncement(`${label} view`);
    if (focusHeading) {
      window.setTimeout(() => {
        headingRefs.current[next]?.focus({ preventScroll: true });
      }, 60);
    }
  }, []);

  const onTabKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      let next: number | null = null;
      if (event.key === "ArrowRight") next = (index + 1) % views.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + views.length) % views.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = views.length - 1;
      if (next === null) return;
      event.preventDefault();
      tabRefs.current[next]?.focus();
      activate(views[next].id, false);
    },
    [activate]
  );

  const openDetail = useCallback((a: Asset) => {
    setReturnToId(a.id);
    setSelectedId(a.id);
  }, []);
  const closeDetail = useCallback(() => setSelectedId(null), []);
  const selected = selectedId ? sampleAssets.find((a) => a.id === selectedId) ?? null : null;

  useEffect(() => {
    if (!selectedId) return;
    detailHeading.current?.focus({ preventScroll: true });
  }, [selectedId]);
  useEffect(() => {
    if (selectedId) return;
    if (!returnToId) return;
    const trigger = document.querySelector<HTMLButtonElement>(
      `button[data-detail-trigger="${returnToId}"]`
    );
    trigger?.focus({ preventScroll: true });
    setReturnToId(null);
  }, [selectedId, returnToId]);
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDetail();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedId, closeDetail]);

  const resetSearchAndFilters = useCallback(() => {
    setQuery("");
    setFilter("all");
    setSortKey("featured");
  }, []);

  // Tri-state column sort (Carbon data-table pattern): first click sorts by
  // the column default, second reverses, third restores featured order.
  const cycleSort = useCallback(
    (col: SortColumn) => {
      let nextKey: AssetSort = col;
      let nextDir: AssetSortDir = sortDefaults[col];
      if (sortKey === col) {
        if (sortDir === sortDefaults[col]) {
          nextDir = sortDir === "asc" ? "desc" : "asc";
        } else {
          nextKey = "featured";
        }
      }
      setSortKey(nextKey);
      setSortDir(nextDir);
      setAnnouncement(
        nextKey === "featured"
          ? "Sorting cleared. Showing featured order."
          : `Sorted by ${sortLabels[col]}, ${
              nextDir === "asc" ? "ascending" : "descending"
            }.`
      );
    },
    [sortKey, sortDir]
  );

  // Sortable column header: button inside <th> (W3C APG pattern), aria-sort
  // on the active column only, arrow indicator aria-hidden.
  const renderSortTh = (col: SortColumn, label: string, numeric = false) => {
    const active = sortKey === col;
    const stateText = !active
      ? "not sorted"
      : sortDir === "asc"
        ? "sorted ascending"
        : "sorted descending";
    return (
      <th
        scope="col"
        className={"sortable" + (numeric ? " num" : "")}
        aria-sort={
          active ? (sortDir === "asc" ? "ascending" : "descending") : undefined
        }
      >
        <button
          type="button"
          className="sort-btn"
          onClick={() => cycleSort(col)}
          aria-label={`Sort by ${sortLabels[col]}, currently ${stateText}`}
        >
          <span className="sort-label">{label}</span>
          <span className="sort-icon" aria-hidden="true">
            {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
          </span>
        </button>
      </th>
    );
  };

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    const items = sampleAssets.filter(
      (a) =>
        (a.name + " " + a.symbol).toLocaleLowerCase().includes(q) &&
        (filter === "all" || a.tag === filter)
    );
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortKey === "name") items.sort((a, b) => dir * a.name.localeCompare(b.name));
    if (sortKey === "price") items.sort((a, b) => dir * (a.price - b.price));
    if (sortKey === "cap") items.sort((a, b) => dir * (a.marketCap - b.marketCap));
    return items;
  }, [filter, query, sortKey, sortDir]);
  const hasActiveFilters =
    query.trim().length > 0 || filter !== "all" || sortKey !== "featured";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim(),
      symbol = draft.symbol.trim().toUpperCase(),
      supply = Number(draft.supply),
      description = draft.description.trim();
    const errors = {
      name: name ? "" : "Enter a token name.",
      symbol: /^[A-Z0-9]{1,10}$/.test(symbol)
        ? ""
        : "Use 1–10 letters or numbers for the symbol.",
      supply:
        draft.supply.trim() === ""
          ? "Enter a total supply."
          : !Number.isSafeInteger(supply)
            ? "Supply must be a whole number."
            : supply < 1 || supply > 1_000_000_000_000_000
              ? "Supply must be between 1 and 1,000,000,000,000,000."
              : "",
    };
    setDraftErrors(errors);
    setResult(null);
    if (errors.name) {
      nameInput.current?.focus();
      return;
    }
    if (errors.symbol) {
      symbolInput.current?.focus();
      return;
    }
    if (errors.supply) {
      supplyInput.current?.focus();
      return;
    }
    setResult({ name, symbol, supply, description });
  };

  useEffect(() => {
    document.title = "OPENORBIT — On-chain Launchpad";
  }, []);

  return (
    <div className="shell">
      <header className="top">
        <div className="wrap nav">
          <span className="brand" aria-label="OPENORBIT">
            <span className="logo" aria-hidden="true">
              O
            </span>
            <span className="brand-name">OPENORBIT</span>
          </span>
          <nav aria-label="Primary">
            <div
              className="tablist"
              role="tablist"
              aria-label="App views"
              aria-orientation="horizontal"
            >
              {views.map((v, i) => (
                <button
                  key={v.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`tab-${v.id}`}
                  role="tab"
                  type="button"
                  aria-selected={view === v.id}
                  aria-controls={`panel-${v.id}`}
                  tabIndex={view === v.id ? 0 : -1}
                  className={"tabbtn" + (view === v.id ? " active" : "")}
                  onClick={() => activate(v.id, true)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </nav>
          <div className="right">
            <span className="net">
              <span className="dot" aria-hidden="true" />
              Preview mode
            </span>
            <button
              ref={connectBtn}
              className="btn primary"
              type="button"
              onClick={() => {
                setWalletNotice("No connection request will be sent.");
                activate("wallet", true);
              }}
            >
              Connect wallet
            </button>
          </div>
        </div>
      </header>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <div className="viewwrap wrap">
        {view === "explore" && (
          <section
            id="panel-explore"
            role="tabpanel"
            aria-labelledby="tab-explore"
            className="view"
          >
            <div className="explore-head">
              <div>
                <div className="eyebrow">Community marketplace</div>
                <h2
                  id="explore-heading"
                  ref={(el) => {
                    headingRefs.current.explore = el;
                  }}
                  tabIndex={-1}
                >
                  Explore assets
                </h2>
              </div>
              <p
                className="results-count"
                aria-live="polite"
                aria-atomic="true"
              >
                {visible.length === sampleAssets.length && !hasActiveFilters
                  ? `Showing all ${sampleAssets.length} sample assets`
                  : `Showing ${visible.length} of ${sampleAssets.length} sample assets`}
              </p>
            </div>
            {selected ? (
              <div id="asset-detail" className="asset-detail-page">
                <button type="button" className="back-link" onClick={closeDetail}>
                  <span aria-hidden="true">←</span> Back to explore assets
                </button>
                <div className="asset-detail">
                  <div className="asset-detail-head">
                    <div className={"coin " + selected.color} aria-hidden="true">
                      {selected.initial}
                    </div>
                    <div>
                      <h3
                        id="asset-detail-title"
                        ref={detailHeading}
                        tabIndex={-1}
                      >
                        {selected.name}
                      </h3>
                      <div className="symbol">
                        {selected.symbol} · {selected.category}
                      </div>
                    </div>
                    <span className="badge">{tagLabel(selected.tag)}</span>
                  </div>
                  <dl className="detail-stats">
                    <div>
                      <dt>Sample price</dt>
                      <dd>{selected.priceLabel}</dd>
                    </div>
                    <div>
                      <dt>Sample market cap</dt>
                      <dd>{selected.marketCapLabel}</dd>
                    </div>
                    <div>
                      <dt>Category</dt>
                      <dd>{selected.category}</dd>
                    </div>
                    <div>
                      <dt>Listing</dt>
                      <dd>{tagLabel(selected.tag)}</dd>
                    </div>
                  </dl>
                  <div className="detail-about">
                    <h4>About this listing</h4>
                    <p>{selected.description}</p>
                  </div>
                  <div className="notice">
                    Listing metrics are illustrative only — no live chain data
                    is connected. Trading is disabled in this preview.
                  </div>
                  <button
                    className="btn"
                    type="button"
                    style={{ width: "100%" }}
                    onClick={closeDetail}
                  >
                    Back to catalog
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="toolbar">
                  <div
                    className="seg"
                    role="group"
                    aria-label="Filter assets"
                  >
                    {filters.map((f) => (
                      <button
                        key={f.value}
                        className={"tab" + (filter === f.value ? " active" : "")}
                        type="button"
                        aria-pressed={filter === f.value}
                        onClick={() => setFilter(f.value)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="search-control">
                    <svg
                      className="search-icon"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="10.8"
                        cy="10.8"
                        r="6.8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="m16 16 4.2 4.2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      className="field"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by name or symbol…"
                      aria-label="Search assets"
                    />
                    {query && (
                      <button
                        className="clear-search"
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  {hasActiveFilters && (
                    <button
                      className="reset-controls"
                      type="button"
                      onClick={resetSearchAndFilters}
                    >
                      Reset
                    </button>
                  )}
                </div>
                {notice && (
                  <div className="notice" role="status">
                    {notice}
                  </div>
                )}
                {visible.length === 0 ? (
                  <div className="empty">
                    <div>
                      <strong>No matching assets</strong>
                      <p>
                        Try a different name or symbol, or reset your search and
                        filters.
                      </p>
                    </div>
                    <button
                      className="btn"
                      type="button"
                      onClick={resetSearchAndFilters}
                    >
                      Reset search and filters
                    </button>
                  </div>
                ) : (
                  <div className="tablewrap">
                    <table className="token-table">
                      <thead>
                        <tr>
                          {renderSortTh("name", "Token")}
                          <th scope="col">Category</th>
                          {renderSortTh("price", "Sample price", true)}
                          {renderSortTh("cap", "Sample market cap", true)}
                          <th scope="col">Listing</th>
                          <th scope="col">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((a) => (
                          <tr key={a.id}>
                            <td className="c-token">
                              <span className="token-id">
                                <span
                                  className={"coin " + a.color}
                                  aria-hidden="true"
                                >
                                  {a.initial}
                                </span>
                                <span>
                                  <strong>{a.name}</strong>
                                  <span className="symbol">{a.symbol}</span>
                                </span>
                              </span>
                            </td>
                            <td className="c-cat">{a.category}</td>
                            <td className="c-price num">{a.priceLabel}</td>
                            <td className="c-cap num">{a.marketCapLabel}</td>
                            <td className="c-tag">
                              <span className="badge">{tagLabel(a.tag)}</span>
                            </td>
                            <td className="c-act">
                              <button
                                className="btn sm"
                                type="button"
                                data-detail-trigger={a.id}
                                aria-label={`View details for ${a.name}`}
                                onClick={() => openDetail(a)}
                              >
                                Details
                              </button>
                              <button
                                className="btn sm ghost"
                                type="button"
                                onClick={() =>
                                  setNotice(
                                    "Trading is disabled in this preview. Sample market data is for interface demonstration only."
                                  )
                                }
                              >
                                Trade
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {view === "launch" && (
          <section
            id="panel-launch"
            role="tabpanel"
            aria-labelledby="tab-launch"
            className="view"
          >
            <div className="launch-grid">
              <div className="launch-intro">
                <div className="eyebrow">Creator tools</div>
                <h2
                  ref={(el) => {
                    headingRefs.current.launch = el;
                  }}
                  tabIndex={-1}
                >
                  Create launch draft
                </h2>
                <p>
                  Configure an initial token launch draft and review the project
                  parameters. Drafts stay in this browser session — nothing is
                  submitted to a blockchain.
                </p>
                <div className="pillrow">
                  <span className="pill">Parameter validation</span>
                  <span className="pill">Draft review</span>
                  <span className="pill">No live transactions</span>
                </div>
              </div>
              <div className="launch-card">
                <p className="launch-card-sub">
                  Draft settings are for preview only and are not submitted to a
                  blockchain.
                </p>
                <form
                  onSubmit={submit}
                  noValidate
                  aria-label="Create launch draft form"
                >
                  <div className="formgrid">
                    <div className="field-group">
                      <label htmlFor="token-name">Token name</label>
                      <input
                        id="token-name"
                        ref={nameInput}
                        value={draft.name}
                        onChange={(e) => {
                          setDraft({ ...draft, name: e.target.value });
                          setDraftErrors((current) => ({ ...current, name: "" }));
                        }}
                        aria-invalid={Boolean(draftErrors.name)}
                        aria-describedby={
                          draftErrors.name ? "token-name-error" : undefined
                        }
                        required
                        maxLength={40}
                        placeholder="e.g. Open Orbit"
                        autoComplete="off"
                      />
                      {draftErrors.name && (
                        <span id="token-name-error" className="field-error">
                          {draftErrors.name}
                        </span>
                      )}
                    </div>
                    <div className="field-group">
                      <label htmlFor="token-symbol">Token symbol</label>
                      <input
                        id="token-symbol"
                        ref={symbolInput}
                        value={draft.symbol}
                        onChange={(e) => {
                          setDraft({
                            ...draft,
                            symbol: e.target.value.toUpperCase(),
                          });
                          setDraftErrors((current) => ({
                            ...current,
                            symbol: "",
                          }));
                        }}
                        aria-invalid={Boolean(draftErrors.symbol)}
                        aria-describedby={
                          draftErrors.symbol ? "token-symbol-error" : undefined
                        }
                        required
                        maxLength={10}
                        pattern="[A-Za-z0-9]+"
                        placeholder="e.g. ORBT"
                        autoComplete="off"
                      />
                      {draftErrors.symbol && (
                        <span id="token-symbol-error" className="field-error">
                          {draftErrors.symbol}
                        </span>
                      )}
                    </div>
                    <div className="field-group full">
                      <label htmlFor="token-supply">Total supply</label>
                      <input
                        id="token-supply"
                        ref={supplyInput}
                        value={draft.supply}
                        onChange={(e) => {
                          setDraft({ ...draft, supply: e.target.value });
                          setDraftErrors((current) => ({
                            ...current,
                            supply: "",
                          }));
                        }}
                        aria-invalid={Boolean(draftErrors.supply)}
                        aria-describedby={
                          draftErrors.supply ? "token-supply-error" : undefined
                        }
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max="1000000000000000"
                        step="1"
                        required
                        placeholder="1000000000"
                      />
                      {draftErrors.supply && (
                        <span id="token-supply-error" className="field-error">
                          {draftErrors.supply}
                        </span>
                      )}
                    </div>
                    <div className="field-group full">
                      <label htmlFor="token-description">
                        Description{" "}
                        <span className="optional">(optional)</span>
                      </label>
                      <input
                        id="token-description"
                        value={draft.description}
                        onChange={(e) =>
                          setDraft({ ...draft, description: e.target.value })
                        }
                        maxLength={140}
                        placeholder="What makes your project different?"
                      />
                    </div>
                  </div>
                  {Object.values(draftErrors).some(Boolean) && (
                    <div className="error-summary" role="alert">
                      <strong>There is a problem</strong>
                      <p>
                        Please fix the highlighted fields before reviewing this
                        draft, or select a problem to jump to the field.
                      </p>
                      <ul className="error-summary-list">
                        {draftErrors.name && (
                          <li>
                            <a href="#token-name">{draftErrors.name}</a>
                          </li>
                        )}
                        {draftErrors.symbol && (
                          <li>
                            <a href="#token-symbol">{draftErrors.symbol}</a>
                          </li>
                        )}
                        {draftErrors.supply && (
                          <li>
                            <a href="#token-supply">{draftErrors.supply}</a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  <button
                    className="btn primary"
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    Review draft
                  </button>
                </form>
                {result && (
                  <div className="draft-result" aria-live="polite">
                    <h3>Draft ready for review</h3>
                    <p>
                      {result.name} ({result.symbol}) · Total supply:{" "}
                      {result.supply.toLocaleString()}
                      {result.description ? " · " + result.description : ""}
                    </p>
                    <div className="notice">
                      Saved in this page only. No contract has been generated or
                      deployed.
                    </div>
                    <button
                      className="btn"
                      type="button"
                      style={{ width: "100%", marginTop: 12 }}
                      onClick={() => setResult(null)}
                    >
                      Edit draft
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {view === "wallet" && (
          <section
            id="panel-wallet"
            role="tabpanel"
            aria-labelledby="tab-wallet"
            className="view"
          >
            <div className="wallet-view">
              <div className="eyebrow">Preview only</div>
              <h2
                id="wallet-title"
                ref={(el) => {
                  headingRefs.current.wallet = el;
                }}
                tabIndex={-1}
              >
                Connect wallet
              </h2>
              <p className="wallet-copy">
                Wallet providers are not configured in this preview. The options
                below show the intended integration state — selecting one only
                updates the status note; no connection request is sent.
              </p>
              <div className="wallet-grid">
                <button
                  className="walletopt"
                  type="button"
                  onClick={() =>
                    setWalletNotice(
                      "MetaMask is shown as a UI preview only. No wallet provider is installed or contacted."
                    )
                  }
                >
                  <span className="walleticon" aria-hidden="true">
                    M
                  </span>
                  <span>
                    <strong>MetaMask</strong>
                    <span className="symbol">
                      Browser wallet · Not connected
                    </span>
                  </span>
                </button>
                <button
                  className="walletopt"
                  type="button"
                  onClick={() =>
                    setWalletNotice(
                      "WalletConnect is shown as a UI preview only. No wallet provider is installed or contacted."
                    )
                  }
                >
                  <span className="walleticon" aria-hidden="true">
                    W
                  </span>
                  <span>
                    <strong>WalletConnect</strong>
                    <span className="symbol">
                      Mobile wallet · Not configured
                    </span>
                  </span>
                </button>
              </div>
              <div className="notice" role="status" aria-live="polite">
                {walletNotice}
              </div>
            </div>
          </section>
        )}

        {view === "guide" && (
          <section
            id="panel-guide"
            role="tabpanel"
            aria-labelledby="tab-guide"
            className="view"
          >
            <div className="guide-view">
              <div className="eyebrow">Designed for clarity</div>
              <h2
                ref={(el) => {
                  headingRefs.current.guide = el;
                }}
                tabIndex={-1}
              >
                From idea to launch draft
              </h2>
              <p className="guide-sub">
                A safer workflow before chain and contract configuration are
                finalized.
              </p>
              <ol className="guide-steps">
                <li>
                  <span className="step-num">01</span>
                  <div>
                    <strong>Explore</strong>
                    <p>Search and compare community projects.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">02</span>
                  <div>
                    <strong>Configure</strong>
                    <p>Draft a token name, supply, and symbol.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">03</span>
                  <div>
                    <strong>Validate</strong>
                    <p>Review inputs before any future deployment.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">04</span>
                  <div>
                    <strong>Testnet first</strong>
                    <p>Enable chain actions only after audit and approval.</p>
                  </div>
                </li>
              </ol>
              <div className="notice">
                All displayed market metrics and token listings are illustrative
                sample data. No wallet custody, trades, or token deployments
                are enabled.
              </div>
            </div>
          </section>
        )}
      </div>

      <footer className="statusstrip">
        <div className="wrap statusstrip-inner">
          <span className="statusstrip-text">
            Preview mode: market figures are sample data. Wallet and token
            deployment actions are not connected to a live blockchain.
          </span>
          <span className="statusstrip-right">© 2026 OPENORBIT</span>
        </div>
      </footer>
    </div>
  );
}
