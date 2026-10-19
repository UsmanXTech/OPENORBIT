# Catalog Search UX Research — 2026-10-20

## Research reviewed before implementation

- **Uniswap Explore overview:** https://blog.uniswap.org/refreshed-web-app  
  The product refresh describes a dedicated token-discovery surface with search and discovery options. Transfer: keep search and category selection close to the results, and show how the current query affects the catalog. Do not transfer live price/volume assumptions or claim OPENORBIT has a live indexer.

- **Raydium LaunchLab creation flow:** https://github.com/raydium-io/raydium-docs-v1/blob/main/user-flows/creating-a-launchlab-token.mdx  
  The documented flow separates token setup choices from the act of signing and launching. Transfer: keep OPENORBIT's local launch draft distinct from asset discovery and label it as a preview. Do not copy live wallet/signing actions.

- **Adobe React Spectrum SearchField:** https://react-spectrum.adobe.com/react-spectrum/SearchField.html  
  The component documentation covers controlled search values, labels, and a clear action. Transfer: make clearing an explicit action with an accessible name. OPENORBIT uses native React/CSS and does not add this library as a dependency.

- **W3C WAI — Labeling Controls:** https://www.w3.org/WAI/tutorials/forms/labels/  
  Keep the search field programmatically named and the icon-only clear control accessible to assistive technology.

- **W3C WCAG 2.2:** https://www.w3.org/TR/WCAG22/  
  Preserve visible keyboard focus, understandable status feedback, sufficient target sizing, and predictable interactions.

## Design decisions

1. Keep the current light editorial surface, ink typography, and single violet accent; avoid new gradients or extra status colors.
2. Add a search icon, an in-field clear action when text exists, and a result count explicitly tied to the illustrative sample catalog.
3. When a query and category produce zero results, show a named reset action that clears both controls. When there are matches but filters are active, offer the same reset path.
4. Keep the empty state responsive and keyboard reachable. Announce result-count changes politely and never rely on color alone.
5. Do not add live market data, chain selectors, trading, wallet connections, or token deployment behavior.

## Acceptance criteria

- Searching by name or symbol updates the visible sample results and count.
- Clear search empties the query without changing the selected category.
- Reset search and filters clears both query and category.
- Empty-state and reset controls remain reachable on narrow screens and by keyboard.
- Regression tests cover count feedback, clear-search, and empty-state recovery.
- Type-check, test, production-build, and deployment results are reported separately; a successful preview build is not proof that tests passed.
