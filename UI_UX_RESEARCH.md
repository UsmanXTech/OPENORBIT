# OPENORBIT UI/UX Research and Improvement Plan

_Last reviewed: 2026-10-19_

## Purpose

Use research and a concrete usability review before substantial UI changes. Treat competitor patterns as evidence to evaluate, not as designs to copy. Keep the product honest about its current demo-only state.

## Sources reviewed

1. **W3C — Web Content Accessibility Guidelines (WCAG) 2.2**  
   https://www.w3.org/TR/wcag/  
   Relevant criteria include visible keyboard focus, text labels and instructions, error identification and suggestions, predictable interactions, and minimum target sizing.
2. **W3C WAI — What's New in WCAG 2.2**  
   https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/  
   Useful explanations of focus visibility, focus not being obscured, and target-size requirements.
3. **OpenZeppelin Contracts Wizard**  
   https://wizard.openzeppelin.com/  
   A relevant smart-contract configuration reference point. OPENORBIT should keep any future configuration/review experience explicit about what is configured and what has not been generated, audited, or deployed.
4. **Solana launchpad UI template (public reference implementation)**  
   https://github.com/nirholas/solana-launchpad-ui  
   Documents common launchpad information architecture: discovery tabs, token details, creation form, trade/activity views, and mobile breakpoints. This is a pattern reference only; OPENORBIT must not imply these live features exist.

## Current-interface review

Reviewed the React UI in `src/App.tsx`, styles in `src/styles.css`, sample data in `src/data/assets.ts`, and interaction tests in `src/App.test.tsx`.

### What is already working well

- The app identifies itself as an early preview and labels market data as illustrative.
- Wallet and launch-draft actions are explicitly non-live.
- Asset search, filters, and sorting provide a basic discovery workflow.
- The modal implements Escape handling, focus cycling, and focus restoration.
- The launch form validates the supply limit in application logic and has regression coverage.
- CSS includes a visible keyboard-focus treatment and uses responsive sizing for major headings.

### Prioritized design findings

| Priority | Finding | UX risk | Acceptance criteria |
| --- | --- | --- | --- |
| P0 | The green status dot is used next to network/testnet language even though the app is not connected and is a read-only preview. | Users may interpret a positive green status as a healthy live network connection. | Status copy and color/icon semantics distinguish “preview/demo” from “connected”; status never relies on color alone. |
| P1 | The “Listed assets” stat uses the currently filtered result count. | Filtering search results can make a marketplace-wide metric appear to change. | Rename it to “Matching assets” while filters are active, or keep the total stable and show result count separately. Add tests for the chosen behavior. |
| P1 | The main page combines navigation, search/filter controls, metrics, cards, and launch CTA in one long flow. | Users can lose context when narrowing the catalog, especially on small screens. | On mobile, controls remain readable and reachable; selected filter, result count, empty state, and clear-search action are easy to understand. |
| P1 | The launch form should make its review/confirmation boundary unmistakable. | Users may mistake a local draft for a generated contract or an actual launch. | Review summary states that nothing is generated, signed, or deployed; errors identify the field and how to fix it; no live action is implied. |
| P1 | Accessibility coverage is currently based on a small set of interaction tests. | Keyboard, screen-reader naming, contrast, and responsive regressions can go unnoticed. | Add focused tests for empty search results, keyboard modal behavior, field-level errors, and preview-state wording; manually verify narrow viewport and keyboard-only flow when a browser is available. |
| P2 | Visual styles are mostly compressed into dense CSS rules. | Future visual refinements may become inconsistent and harder to review. | Introduce a small, documented set of design tokens and reusable patterns when touching the stylesheet; avoid a risky full rewrite. |

## Implementation sequence

1. Clarify preview/network status semantics and keep status understandable without color.
2. Correct marketplace metrics and improve search/filter/empty-state feedback.
3. Audit launch-draft form labels, field-level errors, and review summary.
4. Expand keyboard, accessibility, and responsive tests.
5. Consolidate repeated spacing, surface, border, and focus values into maintainable design tokens.
6. Re-check the full flow at desktop and mobile widths; record what was and was not verified.

## Definition of done for a UI/UX change

- The user problem and evidence are documented before implementation.
- Acceptance criteria are testable and scoped to the changed flow.
- UI remains honest about sample data and disabled live blockchain features.
- Keyboard focus, labels, errors, responsive behavior, and empty states are considered.
- Relevant tests, type-check, and production build pass in CI; if unavailable or failing, the limitation is recorded truthfully.
- The change is reviewed against the latest `main` before committing. Never deploy Vercel as part of this workflow.


## 2026-10-20 — Premium visual redesign direction

### Real product examples reviewed before implementation

5. **Uniswap Explore — token discovery**  
   https://app.uniswap.org/explore/tokens  
   Observed patterns: clear product navigation, prominent search, distinct discovery categories, and structured tabular information for comparing assets. Transfer the clear information hierarchy and discovery-first controls; do not copy Uniswap branding, wallet flows, or imply that OPENORBIT has live prices, volume, or chain data.
6. **Raydium LaunchLab — token creation flow**  
   https://raydium.io/launchpad/create/  
   Observed pattern: creation is a dedicated task with explicit configuration steps rather than a generic call-to-action. Transfer the separation between browsing and preparing a launch draft; do not imply that OPENORBIT can create a token or submit a transaction.
7. **W3C WCAG 2.2**  
   https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html  
   Preserve visible focus, semantic labels, contrast, and clear feedback while refining the visual style.

### Design decision

The existing page relies on multiple large gradients, glowing decorative effects, dense rounded surfaces, and a dark blue palette that makes the interface feel more like a generic prototype than a finished product. The redesign uses a more disciplined editorial hierarchy, warm light workspace surfaces, ink-colored text, a single violet accent, consistent borders and radii, tighter data hierarchy, and a dark hero panel as a deliberate focal point. Existing responsive breakpoints, reduced-motion support, visible keyboard focus, and demo-only disclosures must remain intact.

### Acceptance criteria

- Establish a coherent design-token system and consistent surface, spacing, typography, button, input, card, and modal treatments.
- Keep navigation and primary actions clear at desktop and mobile widths.
- Use color and text together for state; never present a live connection or production network that is not configured.
- Keep all sample metrics explicitly identified as illustrative and all wallet/deployment actions non-live.
- Preserve keyboard focus, reduced-motion behavior, and readable form errors.
- Run typecheck, tests, and production build; record actual outcomes and do not claim unrun checks passed.


## 2026-10-20 — Accessible launch-draft validation

### Real examples and guidance reviewed before implementation

- **W3C WAI — Validating Input:** https://www.w3.org/WAI/tutorials/forms/validation/  
  Explains required fields, custom validation, and the need to provide understandable feedback. Transfer: retain application-level validation because the form intentionally uses `noValidate`; do not rely only on browser attributes.
- **W3C WAI — User Notifications:** https://www.w3.org/WAI/tutorials/forms/notifications/  
  Recommends specific inline feedback, corrective instructions, programmatic association via `aria-describedby`, and moving focus to the first invalid control after submit. Transfer all four patterns; avoid a single generic message that forces users to guess which field is wrong.
- **Raydium official LaunchLab creation guide:** https://github.com/raydium-io/raydium-docs-v1/blob/main/user-flows/creating-a-launchlab-token.mdx  
  The documented flow asks creators to review parameters before approving an irreversible on-chain action. Transfer the explicit review boundary only. OPENORBIT remains a local draft and must not copy live signing, wallet, or deployment behavior.
- **W3C WCAG 2.2:** https://www.w3.org/TR/WCAG22/  
  Preserve visible keyboard focus, text-based error cues, and understandable status feedback. Error color is supplementary; each error remains readable text linked to its input.

### Design decision

The launch-draft form previously returned one generic error for three different validation failures. This adds field-level messages for token name, symbol, and total supply; marks invalid inputs with `aria-invalid`; links each message through `aria-describedby`; and moves focus to the first invalid field. Editing a field clears only that field's stale error. A concise alert summary remains for the overall submit failure.

### Acceptance criteria

- Empty submission identifies all required fields and focuses token name first.
- Invalid symbol and out-of-range supply show actionable field-specific guidance.
- Each invalid input exposes `aria-invalid="true"` and references its error text.
- Correcting a field clears its inline error without clearing unrelated errors.
- Valid input still produces only a local draft; no contract is generated, signed, or deployed.
- CI type-check, tests, and production build must pass before promotion; browser-only keyboard and narrow viewport checks remain separately reported.


## 2026-10-20 — Structured asset-detail dialog

### Real references reviewed before implementation

8. **W3C WAI-ARIA APG — Dialog (Modal) Pattern**
   https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
   - Patterns observed: on open, focus moves inside the dialog; Tab/Shift+Tab stay trapped; Escape closes; focus returns to the invoking element; a visible button that closes the dialog is strongly recommended; container has `role=dialog`, `aria-modal="true"`, `aria-labelledby` on the visible title; when content holds semantic structures (lists, paragraphs), initial focus may target a static element at the top so content is not announced as one unbroken string and not scrolled out of view.
   - What transfers: the existing focus trap, focus restoration, Escape handling, and the visible × close button were kept unchanged. A second explicit "Back to catalog" close button was added, matching the APG recommendation of a visible closing action. Initial focus remains on the close control — the dialog is short enough that content does not scroll out of view, so the APG's static-element condition does not apply.
   - What does not transfer: `aria-describedby` on the dialog container (APG advises omitting it when content has semantic structures like lists).
   - Why it suits OPENORBIT: the asset dialog is now structured and informational; keeping it a true modal with focus discipline keeps it keyboard- and screen-reader-friendly.
   - Accessibility/responsive implications: stats are exposed as a `<dl>` with `<dt>`/`<dd>` pairs (machine-readable labeled pairs); the modal already scrolls within `max-height: 85vh`; existing `focus-visible`, reduced-motion, and narrow-viewport styles are untouched.

9. **Uniswap Support — "What is the Token Details page?"**
   http://support.uniswap.org/hc/en-us/articles/9818052307341-What-is-the-Token-Details-page
   - Limitation recorded honestly: the live app page (https://app.uniswap.org/explore/tokens) is a JavaScript bundle and timed out on text fetch; the reference was read from Uniswap's official support documentation instead.
   - Patterns observed: a token detail page = identity header, price graph, a Stats section (TVL, market cap, FDV, 1-day volume), Transactions, Pools, and an Info section (description + links).
   - What transfers: structured sections — identity header (icon, name, symbol, badge), a labeled stats grid, an "About this listing" description section, and an honest no-live-data notice. Every figure is labeled "Sample".
   - What does not transfer: live price charts, transactions, pools, swap/buy CTAs, branding, or any implication that OPENORBIT has real market data.
   - Why it suits OPENORBIT: a catalog detail view benefits from quick-scan stats plus an about section — it matches the discovery mental model of a real product without copying its look or implying its capabilities.
   - Accessibility/responsive implications: clear heading hierarchy, definition-list stats, and the modal's existing responsive behavior.

## 2026-10-20 — Inline launch-draft form (form-popup → inline page conversion)

### Real references reviewed before implementation

10. **Carbon Design System — Form usage**
    https://www.carbondesignsystem.com/components/form/usage/
    - Patterns observed: a form is structured as header (title + description for context), form body (labels always visible, positioned above inputs; sentence-style capitalization), and footer (submit actions); persistent helper text under fields; placeholder is never a label replacement; error state must block submission until fixed; two-column forms collapse as a group.
    - What transfers: the inline form card now has a clear header ("Create launch draft" + "Draft settings are for preview only and are not submitted to a blockchain.") followed by the fields and a full-width "Review draft" action; labels stay visible above inputs; the description field is now marked "(optional)" instead of leaving ambiguity; error state blocks the draft review until fixed (unchanged logic).
    - What does not transfer: Carbon's tooltip-driven fluid-input style and product-specific token vocabulary — OPENORBIT keeps its existing design tokens.
    - Why it suits OPENORBIT: the form is now a first-class page section rather than a cramped dialog; the header/body/footer structure makes it scannable and honest about its draft-only status.
    - Accessibility/responsive implications: labels remain programmatically linked (`htmlFor`/`id`) and the existing `aria-invalid`/`aria-describedby` wiring is untouched; the two-column `formgrid` already collapses to one column under 680px; the form card uses a light surface on the dark launch panel so label contrast stays high.

11. **GOV.UK Design System — Error summary**
    https://design-system.service.gov.uk/components/error-summary/
    - Patterns observed: on validation failure, always show an error summary at the top of the form region with the heading "There is a problem", link each error to the field it relates to (href="#field-id"), and word summary errors exactly like the inline field errors; single-field questions link directly to the input.
    - What transfers: the inline form now shows an error summary with "There is a problem", an explanatory line, and a link list where each entry links to its field (`#token-name`, `#token-symbol`, `#token-supply`) with wording identical to the inline error messages. The summary keeps `role="alert"` so it is announced.
    - What does not transfer: GOV.UK's convention of moving keyboard focus to the summary container — OPENORBIT's standing behavior (and existing tests) focuses the first invalid field directly on failed submit, which also satisfies "land the user on the problem"; the summary links give the same jump-to-field capability as an additional path.
    - Why it suits OPENORBIT: without a modal trap, the failed submit now gives users two ways to recover — immediate focus on the first invalid field plus a scannable summary of everything that needs fixing.
    - Accessibility/responsive implications: links inside the alert are reachable by keyboard and announced with their destination context; the summary styles reuse the existing danger palette with visible `focus-visible` rings on the links; it reflows naturally inside the form card on narrow viewports.

## 2026-10-20 — Asset detail: dialog → inline page conversion

### Real references reviewed before implementation

12. **Uniswap support — "What is the Token Details page?"**
    http://support.uniswap.org/hc/en-us/articles/9818052307341-What-is-the-Token-Details-page
    - Patterns observed: a token's detail is a full inline page, never a popup — identity header (token icon, name, symbol) at top, then a structured Stats section (TVL, market cap, FDV, 1-day volume), then Transactions/Pools data sections, then an Info section (description + links). Sections stack vertically in the normal page flow.
    - What transfers: the asset detail now renders as an inline page section that replaces the catalog grid; it keeps the existing identity header (coin, name, symbol · category, tag badge), the sample-labeled stats grid, and the "About this listing" section, in the same top-down order as Uniswap's identity → stats → info stack.
    - What does not transfer: Uniswap's live price charts, transaction/pool tables, and swap CTAs — OPENORBIT is a read-only demo with sample data only, so the detail stays read-only and every metric keeps its "Sample" label; no live-data claims.
    - Why it suits OPENORBIT: the detail content is informational reading (scan stats, read the description, go back), not a confirmation or short decision — exactly the content type that dialog accessibility guidance says should live in page flow; it matches the discovery pattern users already know from Uniswap Explore.
    - Accessibility/responsive implications: opening the detail moves programmatic focus to the detail heading (`tabIndex={-1}`, scroll-guarded) so screen readers announce the new context; Escape closes it; focus returns to the triggering "View details" button; catalog search/filter state is preserved on return (no data loss); on narrow viewports the stats grid collapses to one column.

13. **GOV.UK Design System — Back link**
    https://design-system.service.gov.uk/components/back-link/
    - Patterns observed: on journeys with several areas, provide an explicit back link at the top of the page; prefer descriptive link text ("Go back to [page]") when the journey is not a simple one-step flow; the link must return the user to the previous page in the state they last saw it; never pair it with breadcrumbs.
    - What transfers: the detail page opens with an explicit "← Back to explore assets" link (descriptive text, per GOV.UK's complex-journey guidance) placed at the top of the detail panel; returning restores the catalog exactly as left — same search query, filter tab, and sort — and the same back behavior is duplicated by the bottom "Back to catalog" button.
    - What does not transfer: GOV.UK's placement before `<main>` (OPENORBIT is a single-page demo, so the link sits at the top of the detail panel inside the page); no breadcrumb component is introduced.
    - Why it suits OPENORBIT: the detail view is a second-level view inside the explore journey, and an explicit back link is the most discoverable way out for sighted and screen-reader users alike — clearer than relying on Escape or an × button alone.
    - Accessibility/responsive implications: the back link is a native `<button>` with the app's standard `focus-visible` ring, recolored to the accent palette; it sits first in tab order on the detail view so keyboard users encounter the escape hatch immediately.

## 2026-10-20 — Wallet "Connect wallet" dialog → inline panel conversion

### Real references reviewed before implementation

14. **GOV.UK Design System — no modal/dialog component (confirmed via secondary docs)**
    https://tech-docs.teacherservices.cloud/services/check-performance-data/govuk-confirm-modal.html
    - Patterns observed: the official GOV.UK Design System deliberately ships **no** modal/dialog component; its canonical confirmation pattern is a full server-rendered interruption page, so the user never loses place in a page flow behind an overlay. I confirmed this only via secondary search results and docs quoting the GDS position — there is no dedicated GOV.UK modal component page to inspect, which is itself the evidence (the component does not exist).
    - What transfers: the last OPENORBIT dialog (wallet options) is removed entirely and rendered as a first-class inline section (`#wallet`) in the normal page flow, matching GDS's "interruption page" stance for content that deserves its own space.
    - What does not transfer: GOV.UK's server-rendered navigation model — OPENORBIT is a single-page demo, so the wallet panel is shown/hidden in place with scroll-to and heading focus instead of a page load; the panel also carries a "Hide panel" dismissal, since the demo lets the user collapse it.
    - Why it suits OPENORBIT: the wallet panel is informational reading (status + intended providers, no decision to take), exactly the content type dialog guidance says should not be an overlay; it also completes the app's standing no-form-in-dialog rule (the wallet panel, like the launch form and asset detail, now lives in page flow), so the app ships zero modals.
    - Accessibility/responsive implications: no focus trap, no background inerting, and no Escape plumbing to maintain — the section is natively in tab order; opening moves programmatic focus to the panel heading (`tabIndex={-1}`, scroll-guarded) so screen readers announce the new context, and hiding returns focus to the header "Connect wallet" button; the provider grid collapses to one column under 680px.

15. **Carbon Design System — Dialog patterns**
    https://www.carbondesignsystem.com/building-blocks/core/patterns/dialogs
    - Patterns observed: dialogs are "disruptive and can be distracting... Use them sparingly"; explicit don'ts: don't use if the content is unrelated to the current workflow, don't use to display complex or large amounts of data, don't recreate a full app or page in a dialog, don't use when the user hasn't triggered the dialog.
    - What transfers: the wallet-options content (provider cards + status notice) is optional, non-critical information that the user can peruse while still seeing the rest of the page — Carbon's exact non-modal/dialog-sparing case; as a bonus, removing the last dialog also removes the need to keep focus-trap, Escape, and backdrop-click behavior tested.
    - What does not transfer: Carbon's modal/non-modal taxonomy for the remaining flows — there are none left to classify; OPENORBIT now has no overlays at all.
    - Why it suits OPENORBIT: the wallet panel answers "what would connecting look like?" — a knowledge-gathering moment, not a short task with a clear completion path — so inline placement serves comprehension better than a floating box; it also keeps the header "Connect wallet" button's honest label ("Preview mode" remains visible next to it).
    - Accessibility/responsive implications: the panel's provider buttons stay real `<button>` elements with the app's global `focus-visible` ring; the status notice keeps `role="status"` + `aria-live="polite"` so provider selections are announced without stealing focus; reduced-motion users are unaffected since no animations or traps are involved.

16. **Fallingbrick — Modal design UX best practices**
    https://www.fallingbrick.co.uk/modals-in-web-design-best-practices/
    - Patterns observed: common modal mistakes — "Using a modal for everything: Routine messages, long content and simple field errors are usually better handled inline"; "Putting too much in the overlay: If it needs multiple sections, extensive instructions or a long form, use a dedicated page"; accessibility checklist includes focus moving into the dialog, focus restored to the opener on close, and the background not being interactive.
    - What transfers: the wallet panel content (title, explanatory copy, two provider options, live status notice) is a routine, non-urgent message block — handled inline per the checklist's "better handled inline" rule; the "restore focus to the opener" requirement is preserved in the inline version (hiding the panel returns focus to the "Connect wallet" button).
    - What does not transfer: modal-specific mechanics (focus trap, backdrop dismissal) — deleted rather than emulated; the inline section needs none of them.
    - Why it suits OPENORBIT: the previous dialog pattern for the wallet matched two listed mistakes (routine message shown as modal, informational content crammed in an overlay); the inline panel removes both at once with less code to maintain.
    - Accessibility/responsive implications: because there is no overlay, nothing on the page is ever inert, so there is no risk of "leaving focus behind the dialog"; the panel reflows as normal document content on all viewports and honors the app's existing reduced-motion rules without extra work.

## 2026-10-20 — Screen-fitted single-page app shell: tabbed views, no page scroll

### Real references reviewed before implementation

17. **Uniswap — "How to use the Uniswap Explore page" (support doc)**
    https://support.uniswap.org/hc/en-us/articles/9818094509453-How-to-use-the-Uniswap-Explore-page
    - Patterns observed: the Explore page separates Tokens, Pools, and Transactions into three tabs within one context; the Tokens tab is a dense sortable table (price, price change, FDV, volume) with a name/address/symbol search filter — one screen, one dense data surface, no marketing hero above it.
    - What transfers: one view = one dense surface; tabbed grouping of sibling contexts (Explore/Launch/Wallet/Guide); a real `<table>` for the asset catalog with sticky headers and a compact action column; the search-by-name-or-symbol filter kept as the primary discovery control.
    - What does not transfer: Uniswap's live market columns (price change, FDV, volume) — every OPENORBIT figure stays explicitly sample-labeled; no embedded execution (swap/buy) inside detail views.
    - Why it suits OPENORBIT: the Explore view's job is "scan six sample listings at a glance" — a dense table with one action per row is the established crypto-product idiom for exactly that, and it is what makes the whole view fit one screen.
    - Accessibility/responsive implications: the table uses real `<th scope="col">` headers and per-row named buttons (`View details for {name}`); on ≤680px the table reflows to compact cards (category/market-cap columns drop, mirroring how responsive data tables must stay operable), so the same markup serves both layouts.

18. **W3C WAI-ARIA APG — Tabs Pattern (fetched directly)**
    https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
    - Patterns observed: tablist/tab/tabpanel roles; the active tab has `aria-selected="true"`; tabs reference panels via `aria-controls`; Left/Right arrows move focus (with wrap), Home/End jump to ends; automatic activation is recommended when panels render without latency; `tabpanel` needs `tabindex="0"` only when it has no focusable content.
    - What transfers: the full keyboard contract — roving tabindex (active tab 0, others −1), arrow-key navigation with wrap and auto-activation, Home/End support; tabpanel labelled by its tab.
    - What does not transfer: keeping focus on the tab after explicit activation — OPENORBIT moves focus to the panel heading on click/Enter (the existing focus-to-heading convention from the wallet/detail conversions) while arrow-key auto-activation keeps focus on the tab, plus a visually-hidden `role="status"` live region announcing the view name.
    - Why it suits OPENORBIT: the app is literally "a set of layered sections of content that display one panel at a time" (APG's own definition) — tabs are the canonical component for the no-scroll single-view rule.
    - Accessibility/responsive implications: single tab stop for all four views keeps keyboard tab order short; screen readers hear view changes via the live region and panel headings (`tabIndex={-1}`); reduced-motion users see no animation on view switches.

19. **Carbon Design System — Tabs usage**
    https://v10.carbondesignsystem.com/components/tabs/usage/
    - Patterns observed: "Use tabs to allow users to navigate easily between views within the same context"; tab labels concise (no more than two words), no icons in labels; no more than six tabs; consistent order across the experience.
    - What transfers: the four one-word labels (Explore, Launch, Wallet, Guide); placement as the primary in-header navigation; the "same context" framing — all four views stay inside one preview app, never routed to separate pages.
    - What does not transfer: Carbon's tab-line visual language — OPENORBIT keeps its existing segmented pill styling for visual consistency with the category filter control.
    - Why it suits OPENORBIT: four ≤2-word labels keep the tab strip compact enough for the 100dvh shell on narrow screens, and the "one context" rule matches the single-shell architecture.
    - Accessibility/responsive implications: concise labels survive translation and narrow viewports; on ≤680px the tablist scrolls horizontally within the fixed top bar rather than wrapping the header taller (which would steal vertical space from the single screen).

20. **Uniswap live app — app.uniswap.org/explore/tokens (observed read-only via browser, desktop width)**
    https://app.uniswap.org/explore/tokens
    - Patterns observed: the page scrolls as one document (no fixed viewport shell, no internal table scroll container); the top nav is fixed and the token table's column header row is sticky, pinning just below the nav while rows scroll beneath; rows are comfortable-density at ~69px each with ~13–14 visible per 1080px-tall viewport; 8 columns fit without horizontal scroll at desktop width.
    - What transfers: the fixed-nav + sticky-column-header pairing — already mirrored inside OPENORBIT's internal table scroll region (sticky `thead` inside `.tablewrap`), which gives the same "header stays visible while rows move" affordance within the no-scroll shell.
    - What does not transfer: Uniswap's page-scroll model itself — the user rule explicitly requires a screen-fitted app, so OPENORBIT keeps the 100dvh shell and confines scrolling to documented internal regions instead.
    - Why it suits OPENORBIT: sticky headers inside the internal scroll region preserve Uniswap's proven scan-while-scrolling behavior without breaking the single-screen rule.
    - Accessibility/responsive implications: sticky headers aid orientation for keyboard and screen-magnifier users inside long internal lists; the ≤680px card reflow stays (Uniswap's 360px behavior could NOT be verified — the browser tooling has no viewport-resize capability — so no claim is made about it).
    - Limitation noted honestly: the mobile-width layout was unobservable; this session makes no inference about it.

21. **W3C WCAG 2.2 — Understanding Success Criterion 1.4.10 Reflow (AA)**
    http://w3c.github.io/wcag/understanding/reflow
    - Patterns observed: content must be usable without two-dimensional scrolling at 320 CSS px width (400% zoom on 1280px desktop); the criterion names explicit exceptions where 2D/internal scrolling is acceptable: data tables, and "interfaces where it is necessary to keep toolbars in view while manipulating content".
    - What transfers: the exception framing directly justifies OPENORBIT's architecture — the asset catalog is a data table, and the Explore view is an interface where the toolbar (search/filter/sort) must stay in view while browsing rows; internal scroll regions for these panels are the WCAG-sanctioned pattern, not a workaround.
    - What does not transfer: the criterion assumes vertical page scroll as the norm — the user's no-page-scroll rule is stricter than WCAG; the design satisfies 1.4.10's intent (no 2D scroll, toolbar stays put) by construction at ≥320px width since the page never scrolls in either dimension.
    - Why it suits OPENORBIT: it gives the honest-limit documentation a normative anchor — internal panel scroll on short viewports is standards-consistent for data tables.
    - Accessibility/responsive implications: no horizontal page overflow anywhere (all panels constrain to viewport width; tablist scrolls horizontally only within the fixed header); text reflows to a single column at ≤680px (card rows, stacked form, single-column steps), so 400%-zoom-equivalent widths remain operable.

22. **MDN — ARIA: `aria-sort` attribute**
    https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-sort
    - Patterns observed: when a table is sortable, `aria-sort` is set to `ascending`/`descending` on the header cell of the sorted column ONLY (single attribute at a time; it is moved to the newly sorted column, never duplicated); the header text sits inside a `<button>` within the `<th>` so the control is keyboard-reachable; the visual arrow is a CSS/`aria-hidden` detail.
    - What transfers: the button-inside-`<th>` markup, the single-`aria-sort` contract, click-toggles-direction on the same column.
    - What does not transfer: MDN's toggle example flips only ascending↔descending — OPENORBIT needs a path back to the curated "Featured" order, so a third click clears sorting (tri-state cycle), which Carbon's three-state model (unsorted/sorted-up/sorted-down) supports.
    - Why it suits OPENORBIT: one screen of 6 sample rows; headers are the natural sort affordance on desktop, replacing the toolbar select and freeing toolbar space for search.
    - Accessibility/responsive implications: button-in-th is reachable by Tab and operable with Space/Enter (Carbon's stated keyboard contract); live-region announcements on every sort change (`aria-sort` alone is silent on change); on ≤680px the `<thead>` becomes a visible flex row of sort pills instead of `display:none`, so the control never disappears on the card reflow.

23. **Carbon Design System — Data table usage + accessibility**
    https://v10.carbondesignsystem.com/components/data-table/usage/
    https://v10.carbondesignsystem.com/components/data-table/accessibility/
    - Patterns observed: sort controls live in the column headers; the arrow icon is hidden until hover/focus and persists once sorted; three states (unsorted / sorted-up / sorted-down); sortable headers are Tab-reachable and sortable with Space/Enter; numeric columns right-align with tabular numerals; no persistent visual indicator that a table is sortable, so designers annotate.
    - What transfers: header-embedded sort controls with hover/focus-revealed arrows, three states (none/asc/desc), numeric right-alignment (already present via `.num`), Tab + Space/Enter keyboard contract.
    - What does not transfer: Carbon's React-table header-object API (framework machinery, not UX); its paginated/advanced table variants (not needed for 6 rows).
    - Why it suits OPENORBIT: matches the dense Uniswap-style token table already in the Explore view; the arrow-reveal keeps the single-screen header row clean while making sortability discoverable.
    - Accessibility/responsive implications: hover-only reveals would exclude touch/keyboard — the indicator also shows on `:focus-visible` and permanently on the sorted column; `aria-sort` programmatically matches the visual indicator (Carbon's stated requirement); the mobile sort-bar keeps the ≤680px card reflow fully sortable by touch.

24. **Carbon Design System — Content switcher usage (fetched directly)**
    https://www.carbondesignsystem.com/components/content-switcher/usage/
    - Patterns observed: three height sizes (small 32px, medium 40px, large 48px) — "choose a size that best fits your layout's density"; each content tab the same fixed width (widths derive from the longest label, never stretched proportionally); labels 2–3 words, nouns or noun phrases; the switcher sits above the content it controls, aligned with content, never centered; keyboard contract — Tab into the group, then Left/Right arrows move focus between tabs (with wrap), Home/End to the ends, with automatic or manual activation; exactly one tab is always selected.
    - What transfers: the whole contract — the 40px medium baseline shared by the switcher, search field, and reset control; equal-width filter tabs (realized as equal `flex:1` shares, Carbon's proportional equivalent for an auto-width container); arrow-key navigation with wrap + Home/End and auto-activation; the concise noun labels (All / New / Trending) already matched.
    - What does not transfer: Carbon's fixed-pixel tab widths from the longest label (container width is fluid here, so equal flex shares are the honest equivalent); Carbon's high/low-contrast switcher colorways (OPENORBIT keeps its pill styling); manual-activation mode (auto-activation chosen to match the top-level view tabs' existing model, keeping one interaction language).
    - Why it suits OPENORBIT: the category control IS a content switcher ("narrow large content groups") sitting above the table it filters; a shared 40px baseline is what makes the toolbar read as one dense row inside the no-scroll single screen.
    - Accessibility/responsive implications: roving tabindex keeps the group to a single Tab stop; arrow keys are discoverable via the same affordance as the view tabs; on ≤680px the switcher takes the first full row of the stacked toolbar so all 40px touch targets survive.

25. **Carbon Design System — Search usage (fetched directly)**
    https://www.carbondesignsystem.com/components/search/usage/
    - Patterns observed: four sizes (xs 24 / sm 32 / md 40 / lg 48) — "use consistent component sizes throughout a layout to maintain alignment and visual harmony"; magnifier icon as the universal search signifier; a close 'x' appears only after the user starts typing; Enter submits, Esc clears the field; the close icon itself is a button operable with Space/Enter.
    - What transfers: the 40px medium height shared with the switcher (the consistency rule is the whole point of this density pass); Escape-to-clear added to the input (the × button already existed).
    - What does not transfer: the fluid style (in-field stacked label — noise in a one-row toolbar); the large 48px size (too tall for the dense single-screen view).
    - Why it suits OPENORBIT: search is the primary discovery control for the catalog; sharing the exact baseline with the switcher and reset link is what eliminates the previous ragged toolbar.
    - Accessibility/responsive implications: Escape-to-clear means keyboard users never have to Tab-hunt the ×; the 40px height preserves comfortable targets; on ≤680px the search wraps to its own full-width row below the switcher.

26. **Uniswap — Explore tokens page (fetched directly)**
    https://app.uniswap.org/explore/tokens/ethereum
    - Patterns observed: token detail pages lead with an identity header (logo + name + symbol), then price/KPI hero metrics at the top, key metrics in a row beneath, and supporting sections stacked below — identity first, numbers second, context last. Category-style badges sit adjacent to the name rather than as separate stat cards.
    - What transfers: the identity-first header (coin mark + eyebrow + larger name + symbol/badge subline on one band) and the KPI row (the two honest sample metrics given hero-scale numerals in a two-card row), removing stat cards that merely repeat header information (Category, Listing) — one source of truth per fact.
    - What does not transfer: Uniswap's 1H/1D/FDV/volume rows and live charts — fabricating those figures would violate the no-fake-data rule; the illustrative-data fineprint stays, demoted from a loud callout box to a quiet footnote since it is a standing disclaimer, not an alert.
    - Why it suits OPENORBIT: the inline detail page already replaced the table in-flow; giving it a proper detail-page hierarchy (header → KPIs → about → fineprint) makes it read like the reference product pages instead of a flat form, without adding any scroll risk — the page is now shorter than before.
    - Accessibility/responsive implications: heading focus management unchanged (`tabIndex={-1}` + focus on open); KPI numerals use tabular figures for stability; single centered column (max-width 640px) keeps one comfortable reading measure, collapsing to a single KPI column at ≤680px.

27. **CoinMarketCap — Coin Detail Page (CDP) patterns (via CoinMarketCap Academy article, read through search results)**
    https://coinmarketcap.com/academy/es/article/cmcs-new-coin-detail-page-cdp-makes-crypto-tracking-easier-than-ever?ref=cryptoslav.io
    - Patterns observed: a coin page leads with price and key metrics at the top, then the project description — and CMC's redesign explicitly converted long descriptions into collapsible sections so users don't "drown in a wall of text"; numerical info gets progress-bar visualization where it aids digestion.
    - What transfers: the top-down information order (identity → key numbers → about) and the readability fix (comfortable line-height 1.7, 62ch measure) rather than literal collapsible sections — the demo has exactly one short description per asset, so collapse machinery would be noise.
    - What does not transfer: watchlist widgets, ratings stars, institutional data, holder analytics — all live-data features the demo explicitly cannot offer; nothing new was added to the page, only hierarchy and redundancy were fixed.
    - Why it suits OPENORBIT: confirms the chosen order and shows the about section earns its keep through readability, not chrome — the polish here is typographic, which costs no screen space in the no-scroll shell.
    - Accessibility/responsive implications: no new interactive controls means no new keyboard contracts; the about paragraph's 1.7 line-height meets WCAG 1.4.12's text-spacing spirit at default rendering; fineprint at 11px stays above the 10px decorative floor and is a disclaimer, not essential content.

28. **GOV.UK Design System — Error summary component (page opened directly, 2026-10-20)**
    https://design-system.service.gov.uk/components/error-summary/
    - Patterns observed: the summary renders at the TOP of the page before any question; the must-do list is explicit — move keyboard focus to the error summary, use the heading "There is a problem", link each error to the answer it relates to (single fields link directly to the field), and word summary messages identically to the inline messages. The inner wrapper carries `role="alert"`.
    - What transfers: summary-above-the-form placement (in OPENORBIT's screen-fitted shell, "top of the page" means the top of the form card), and links that genuinely move focus to the field. What does not transfer: focus-to-summary-on-submit (GOV.UK's JavaScript does this) — we keep the established, tested first-invalid-field focus instead, because the summary sits directly above the fields and `role="alert"` already announces it to screen readers; adding a second focus move would fight the existing focus contract and its race-condition history on slow runners.
    - Why it suits OPENORBIT: the Launch draft form is the only form-submission flow in the app (Rule 1 territory), and its summary previously rendered below the fields — GOV.UK's placement puts the recovery path where a user looks first; the explicit-focus links repair what plain `#id` anchors cannot do in a no-scroll shell.
    - Accessibility/responsive implications: summary links are real links with visible `:focus-visible` styling already in the stylesheet; `role="alert"` preserved; each link's text matches its inline field error verbatim (GOV.UK wording rule); no layout change otherwise, so the 100dvh fit is untouched.

29. **Carbon Design System — Forms usage (via search-result excerpts, 2026-10-20)**
    https://v10.carbondesignsystem.com/components/form/usage/
    - Patterns observed: inline errors shown whenever possible, validation label below the field written as informatively as possible ("Password must be at least 16 characters", not "invalid"), visual cues that locate the problem within the form, and inline notifications used to state the general problem with the input post-submission; server-side validation pairs an inline notification with inline errors.
    - What transfers: the informative-label discipline (already the app's style — "Supply must be between 1 and 1,000,000,000,000,000"), the summary-as-general-statement role (our "There is a problem" block above the form is exactly the inline-notification slot), and the keep-data rule — we never clear fields when showing errors (already implemented). What does not transfer: Carbon's real-time on-blur validation; the launch form deliberately validates on submit so users can fill fields in any order without mid-typing noise.
    - Why it suits OPENORBIT: confirms the summary-above-form + inline-errors-below-fields pairing as the correct architecture for a short, single-page form, and validates keeping both instead of collapsing one into the other.
    - Accessibility/responsive implications: `aria-invalid` + `aria-describedby` associations unchanged; errors clear on correction (already implemented), so the summary disappears as soon as all fields are valid — no stale alerts.

30. **Atlassian Statuspage — component status list (support page opened directly, 2026-10-20)**
    https://support.atlassian.com/jira-service-management-cloud/docs/create-and-customize-status-page/
    - Patterns observed: status pages model each service as a named component row in a list, with the component's current state shown as a color-coded status indicator next to the name (operational / degraded_performance / partial_outage / major_outage); Atlassian's design language calls this atomic indicator a "Lozenge" — a visual indicator used to highlight an item's status for quick recognition, always paired with a text label. Components are grouped and kept scannable; the page's job is to report what is true right now, not to offer actions.
    - What transfers: the component-row + status-lozenge pattern — one row per integration with a subtle text-labeled pill stating its honest state. What does not transfer: incident/operational status vocabulary (operational/degraded) — a demo has no uptime to report, so the lozenges say "Not connected", "Planned", "Not configured", "Not handled" instead; also no subscribe/history machinery.
    - Why it suits OPENORBIT: the Wallet view's honest job is exactly a status page's job — report the real state of each integration component. It replaces the previous fake-connect affordance (buttons that only updated a note) with a report that cannot be misread as a working connection.
    - Accessibility/responsive implications: the state is never color-only — the lozenge text carries the meaning (WCAG 1.4.1); rows are plain list items (no new keyboard contract); the single-column list fits the 100dvh shell with room to spare on typical viewports and the existing short-viewport fallbacks apply unchanged.

31. **GitHub Docs — "Reviewing your authorized OAuth apps" (via search-result excerpts, 2026-10-20)**
    https://docs.github.com/en/enterprise-cloud@latest/apps/oauth-apps/using-oauth-apps/reviewing-your-authorized-oauth-apps
    - Patterns observed: the canonical honest-connection screen is a review list under Settings → Applications: each authorized app is a row stating what access it actually has, with revoke controls; the page reports the true authorization state rather than prompting new connections. Limitation noted honestly: the docs page itself does not describe its empty-state wording — the pattern (a review list of real states, not a connect flow) is what transfers, not any specific GitHub empty-state copy.
    - What transfers: the "review list of actual authorizations" framing — the Wallet view reads as a review of the app's zero real authorizations. What does not transfer: GitHub's revoke/all controls — there is nothing to revoke in a demo, so the view is read-only by design; also no OAuth registration flow.
    - Why it suits OPENORBIT: it is the reference product pattern for "show me what this app is actually connected to", and OPENORBIT's honest answer is "nothing" — which the Statuspage rows above state per component instead of burying it in a paragraph.
    - Accessibility/responsive implications: no destructive or state-changing controls, so no confirmation dialogs or focus traps to manage (Rule 1 satisfied trivially — the view contains no form at all); the fixed `role="status"` notice carries the one-line truth for screen readers.

32. **PatternFly — Empty state design guidelines (fetched directly, 2026-10-20)**
    https://www.patternfly.org:443/components/empty-state/design-guidelines/
    - Patterns observed: explicit "No results" empty-state variant for search/filter misses — heading briefly states no results were found (DO: "No results found", DON'T: "Your search did not yield any results"); body names the next step (DO: "Adjust your filters and try again.", DON'T: "We did not find any results that matched your filters."); anatomy is icon + heading + body + primary button + optional secondary buttons; for a filtering/search situation a stand-alone secondary button is the sanctioned action; sentence case everywhere, no period on headings; voice: state what isn't there, then give a next step; never blame the user; small variation inside tables (not a full-page takeover).
    - What transfers: the no-results anatomy applied to the catalog empty state — sentence-case heading "No results found" (no period), a body that diagnoses the miss using the user's own terms ("No sample assets match “{q}” in the {Filter} category."), the "Adjust your search or filters and try again." guidance, and granular secondary recovery actions ("Clear search", "Show all assets") kept inline where the table was. What does not transfer: PatternFly's fa-search gray icon (the toolbar already carries the search signifier; an extra glyph is decoration in a density-critical shell); the full-page empty-state spacing (ours is an inline table-region state, PatternFly's small variation).
    - Why it suits OPENORBIT: the old empty state said "No matching assets" with generic advice — PatternFly's DO/DON'T pairs show why that fails the "recognize, diagnose, recover" bar: echoing the user's own query and filter turns the empty state from a dead end into a recovery control, without adding any chrome or scroll risk.
    - Accessibility/responsive implications: recovery buttons are real buttons with visible `:focus-visible` treatment; the heading is a real `h3` (was a `<strong>`); both recovery actions return focus to the search input since their own button unmounts; the existing `aria-live="polite"` result count announces "Showing 0 of N sample assets", so no second live region was added (avoiding double announcements); two-action cap respected (Atlassian's overwhelm rule); no layout-height change, 100dvh fit untouched.

33. **Atlassian Design — Empty state (fetched directly, 2026-10-20)**
    https://atlassian.design/foundations/content/designing-messages/empty-state/
    - Patterns observed: informative scannable title with minimal words, sentence case, no punctuation unless a question; the title should describe the state or tell people what they can do; the body carries the reason plus where to go next in one or two sentences and must not repeat the title; CTAs use imperative verbs ("Try", "Remove", "Create") describing the action, limited to one or two words, and the CTA must complement the title; don't overwhelm with options — empty states should leave people "motivated, supported", knowing how to respond.
    - What transfers: the imperative-verb discipline in the recovery labels ("Clear search", "Show all assets" — the action the click performs, not "OK"/"Reset"); the two-action ceiling for the query+filter case; title/body non-redundancy (the heading states the outcome, the body states the diagnosis). What does not transfer: the celebratory/tone-of-voice layer (a no-results miss is a low-commitment recurring moment — Atlassian's own "flowers not puppies" rule); illustrations (optional per Atlassian, skipped for density).
    - Why it suits OPENORBIT: the old single "Reset search and filters" button blurred which blocker the user was clearing; Atlassian's "CTA complements the title" + "limit options" rules produce the chosen pair — each button names exactly what it undoes, and nothing more.
    - Accessibility/responsive implications: no new keyboard contracts (both actions are buttons, one Tab stop each); focus return to the search box documented above; the compact two-button row fits the existing `.empty` flex layout with no reflow risk at 360px.

34. **Carbon Design System — Empty states (via search-result excerpts, 2026-10-20; full page not fetched directly — documented as a limitation)**
    https://www.carbondesignsystem.com/building-blocks/core/patterns/empty-states
    - Patterns observed: explain the reason for seeing the message and give follow-up steps — "if there are no search results suggest adjusting the search or filters"; don't lead the user into a dead end; plain language; fulfills Nielsen's ninth heuristic — help users recognize, diagnose, and recover; be contextual, don't include content about other areas of the app.
    - What transfers: the recognize/diagnose/recover structure — the body quotes the user's query and names the category filter, which is the "reason" Carbon demands, plus the recovery guidance; the heuristic is the yardstick the change is measured against. What does not transfer: nothing structurally — Carbon's guidance is content-level and fully compatible with the PatternFly anatomy chosen for layout.
    - Why it suits OPENORBIT: Carbon's no-dead-end rule is the standing "recoverable empty states" priority restated — the empty state now ends in named, working recovery actions instead of generic advice.
    - Accessibility/responsive implications: plain-language copy keeps cognitive load low; diagnosis quoting the user's own input is auto-escaped by React (no injection surface).

35. **GOV.UK Design System — Task list component (page opened directly, 2026-10-20)**
    http://design-system.service.gov.uk/components/task-list/
    - Patterns observed: the task list shows all tasks a user needs to do in an ordered list; each task row carries a task name (sentence case, short, sets a reasonable expectation of the task), optional hint text (a single short sentence, NO full stop, no links inside it because the whole row is already linked), and a status (color + short descriptor). The whole task row is linked — users can select anywhere within it to start the task — because user research found people clicking on the statuses thinking they were buttons/links, so statuses were redesigned to look less like buttons. Users may complete tasks in any order they like.
    - What transfers: the whole-row-is-the-action anatomy — OPENORBIT's 4 Guide steps become full-width row buttons, each navigating to the view that does the work; the hint-text discipline (single short sentence, no trailing period: "Search and compare community projects"); the status-as-description pattern with `aria-describedby` from the action to the status (exactly GOV.UK's `aria-describedby="…-status"` on the task link); sentence-case status words. What does not transfer: the Completed/Incomplete gating model — OPENORBIT's Guide is a demo onboarding hub, not a multi-session service, so statuses are honest readiness labels ("Available" ×3, "Preview only" for the testnet step) instead of task-completion tags; GOV.UK's visual tag style was not copied, the app's existing `.lozenge` tones were reused.
    - Why it suits OPENORBIT: the old Guide was four dead-end static cards restating what the app is; the GOV.UK finding (users click at non-obvious places and statuses read as actions) maps directly — the steps ARE actions in this demo, each one a jump to its working view, so making the whole row the button is the honest layout rather than an decorative imitation.
    - Accessibility/responsive implications: the row is a real `<button type="button">` with visible `:focus-visible` treatment (already in the stylesheet) — no new keyboard contract; `aria-describedby` ties each button to its status text (GOV.UK's pattern); the step number is `aria-hidden` decoration while the `<ol>` semantics give screen readers "Step 1 of 4"-style position; arrow glyph is `aria-hidden`; vertical single-column list needs no breakpoints (the old 4-col/2-col/1-col grid overrides were deleted) and fits the 100dvh shell comfortably — 4 compact rows replace 4 tall cards, strictly less height.
36. **Carbon Design System — Status indicator pattern (via search excerpts, 2026-10-20; full page not fetched directly — documented as a limitation)**
    https://v10.carbondesignsystem.com/patterns/status-indicator-pattern/
    - Patterns observed: the text label is the most important element of a status indicator — it communicates the state; Carbon defaults to sentence case for all labels; status indicators should sit in close proximity to the element they describe; they are a standard pattern in task lists and dashboard widgets.
    - What transfers: the "label carries the meaning" rule applied to the Guide step statuses — the lozenge text ("Available", "Preview only") is the message, the tint only reinforces it, so the state is never color-only (WCAG 1.4.1); the status sits at the right end of the row it describes (close proximity). What does not transfer: Carbon's icon-first variants and "stop light" semantic colors — a demo has no uptime to report, so there is no green/red vocabulary to borrow; the app's two muted lozenge tones suffice.
    - Why it suits OPENORBIT: it is the same honesty contract as the Wallet view's status list (session 30) applied to navigation — the Guide must not promise a launch workflow the demo cannot perform, and a visible "Preview only" on the testnet step keeps that promise accurate.
    - Accessibility/responsive implications: states are never color-only; rows remain plain single-column list items with no new keyboard contract; the notice about sample data at the bottom of the view is unchanged.
37. **Carbon Design System — Form usage (page opened and read directly, 2026-10-20)**
    https://carbondesignsystem.com/components/form/usage/
    - Patterns observed: default inputs use the label positioned outside and above the input; in a two-column form the columns should be proportional and align to grid columns, and "the row should respond as a group" (an invalid item pushing content down for its error message makes the sibling item grow too); the typical recommended vertical spacing between components is 32px; labels use sentence-style capitalization, stay short and concise, no colons after label names; placeholder text must not replace a persistent label nor contain crucial information; where the majority of fields are required, mark only the optional ones with "(optional)"; helper text under a default input is replaced by the error message on state change (persistent text preferred over tooltips for pertinent assistance).
    - What transfers: the label-above-input anatomy (already present — labels got a stronger 12px/700 treatment this run, forming the title 14px > field label 12px > input text 12px hierarchy); the proportional-columns rule applied to the name/symbol row (2fr/1fr — name allows 40 characters, symbol at most 10); the "(optional)"-only marking convention (already in use — Description is the only marked field); error messages replacing any help text below the field (already the behavior); the row-as-a-group response (CSS grid already stretches the sibling). What does not transfer: Carbon's 32px vertical component spacing and wide-gutter 32px column gap — both would overflow the no-scroll 100dvh shell, so the tighter 10px rhythm stays as the documented exception; the full three-part form anatomy (no separate header block — the view h2 + the new card title cover it).
    - Why it suits OPENORBIT: the Launch form is the app's densest control surface but currently its airiest — equal-width name/symbol columns made the 10-character symbol field look unfinished; proportional columns are the honest layout (field width matches the data it collects) and simultaneously shave dead space by tightening the grid gap inside the no-scroll shell.
    - Accessibility/responsive implications: no new keyboard contract — DOM order, visible order, and tab order are unchanged; labels keep `htmlFor` association plus the existing `aria-invalid`/`aria-describedby` wiring, so the error-summary→field focus behavior is intact; on ≤680px the grid collapses to one column (existing media query), so proportional columns never squeeze a field below its target size; the input's ~42px rendered height stays well above WCAG 2.2's 24px minimum target size.
38. **Adobe Spectrum — Text field, Spectrum Hub docs (page read directly via live browser, 2026-10-20; original /page/text-fields/ and /page/form/ URLs now 404 after the Spectrum Hub redesign — the page was found through the site's own search)**
    https://spectrum.adobe.com/web/rsp/components/text-field
    - Patterns observed: four sizes (small, medium, large, extra-large) with medium the default and most frequently used; "the minimum width for a text field is 1.5 × the height of the field" (guarantees readability and touch targeting for small fields); labels can sit on top or on the side — top is the default and recommended because it works better with long copy, localization, and responsive layouts, while side labels are "most useful when vertical space is limited"; every text field must have a visible label (sentence case); in a single form mark only the minority — "(optional)" appended when most fields are required; help text below the field gives hints/formatting/requirements but must not restate the label, and "don't add help text if it isn't actually relevant or meaningful" merely to maintain layout continuity; the help-text area displays the error message when triggered (error text replaces help text, which reappears on resolution), and error text is written as 1–2 short complete sentences showing a solution, ending with a period, never an exclamation; instructions/requirements must not live in placeholder text (auto-fill users never see them; they vanish once typed); the page documents no explicit spacing value between form fields.
    - What transfers: the top-label default confirmed (already our anatomy — side labels rejected: they would save vertical room but harm responsive reflow and localization, and this form's constraint is the shell's fixed height, not horizontal space); the minimum-width = 1.5×-height rule as a hard floor for the narrower symbol column (~140px at desktop widths vs. ~63px floor at 42px field height — comfortably satisfied); sentence-case visible labels and minority-only "(optional)" marking (both already match); error text as short complete sentences ending in periods (matches our field-error copy, e.g. "Enter a token name."). What does not transfer: Spectrum's four-size scale (the form keeps one consistent field size — shrinking to S would only be justified by measured overflow, which doesn't exist); adding decorative help text for "layout continuity" — Spectrum explicitly forbids it, and our placeholders ("e.g. Open Orbit") are format hints rather than essential instructions, which keeps them compliant.
    - Why it suits OPENORBIT: it settles the density questions with independent vendor authority — keep top labels (responsive reflow beats the vertical space side labels would save), keep a single field size, and let proportional column widths carry the density story while Spectrum's minimum-width rule guarantees the narrow column never degrades into an unusable target.
    - Accessibility/responsive implications: visible labels for every field already satisfy the "accessible name via visible label" rule; rejecting side labels protects magnified/reflow layouts (WCAG 1.4.10); the symbol column's width/height (~140px × ~42px) far exceeds WCAG 2.2's 24px minimum target size; the existing ≤680px single-column collapse keeps fields full-width on touch devices; no new keyboard contract.

### Honest limitations
- The intended first reference was Material Design's Steppers page (m2.material.io/components/steppers): it now 404s — Material 3 retired the stepper component, so the URL from training memory is dead. The GOV.UK task-list component page (opened directly) replaced it as the primary reference.
- The old gov.uk/service-manual/design/task-list URL also 404s; the pattern now lives under the GOV.UK Design System components section (http://design-system.service.gov.uk/components/task-list/), which is the page actually opened and quoted above.
- Carbon's status-indicator guidance was taken from search-result excerpts only (the full page was not fetched this run) — recorded here rather than claimed as a direct inspection.

- Internal scroll fallback: `.tablewrap`, the launch grid, the asset-detail panel, and now `.guide-view` use `overflow-y: auto` inside the fixed-height shell. On typical viewports (≥620px height) nothing scrolls; on very short viewports the panel scrolls internally while the page itself never scrolls. This is the documented last resort the design rule allows; desktop and most mobile portrait heights render fully scroll-free.
- Audit method (2026-10-20): a live pixel audit was attempted but blocked — the browser agent cannot navigate to loopback URLs (tool-level refusal), has no in-page JavaScript execution, and cannot resize viewports; no Playwright/Chromium exists in the sandbox. The audit was therefore analytical: page scroll is structurally impossible (`body { overflow: hidden }` + 100dvh shell, verified by the new `noscroll.test.ts` invariant suite); 1366×768 geometry fits all views; at 360×640 the Explore table, Launch grid, and asset detail engage their documented internal scroll regions; the Guide view had NO scroll container — a genuine clipping bug at 360×640 (4 steps + header + notice ≈ 600px vs ~504px available) — fixed this run by giving `.guide-view` the same last-resort internal scroll plus a `@media (max-height: 700px)` density pass. This run re-attempted the live audit via the real browser agent against the production site: the site renders cleanly at the default viewport (all views, detail, empty state) but per-viewport resize and in-page JS metrics remain unavailable in this environment, so the audit stayed qualitative; the structural invariants above remain the guarantee.
- The Uniswap live app's 360px behavior could not be observed (no viewport resize in the tooling) and is reported as unknown, not inferred.
