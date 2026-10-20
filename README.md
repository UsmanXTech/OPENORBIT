# OPENORBIT

OPENORBIT is a testnet-first, non-custodial token launchpad and community marketplace concept.

## Current status

The frontend has been migrated from a single-file HTML prototype to a React + TypeScript + Vite application. It remains a demo-only preview, not a production marketplace.

### Included

- Screen-fitted single-page app shell (100dvh, no page scroll): Explore / Launch / Wallet / Guide views switch via an accessible tab navigation (W3C APG tabs pattern, arrow-key support, live view announcements)
- Dense token table for the sample catalog (sticky headers, per-row detail actions; reflows to compact cards on narrow screens) replacing the old card grid
- Search, category filters, and sorting; asset detail and wallet preview as inline views, never dialogs
- Keyboard Escape handling, focus management, and visible focus states
- Client-side validation for launch-draft fields
- Unit tests for core preview interactions
- GitHub Actions workflow for type-checking, tests, and production builds

### Not implemented

- API server, persistent database, authentication, or user profiles
- Live market data, indexer, price feeds, portfolio, or activity data
- Wallet provider integration, smart contracts, trading, or token deployment
- Contract audit, production security review, and chain configuration
- No lockfile drift: dependencies are pinned via `package-lock.json`; install, type-check, tests, and production build were last verified locally (Node 24) against the pinned set (see `PROGRESS.md`)

## Local development

Requires Node.js 22 or a compatible supported release and npm.

1. Install dependencies with npm install.
2. Start the dev server with npm run dev.
3. Run checks with npm run typecheck and npm test.
4. Create a production bundle with npm run build.
5. Preview the bundle with npm run preview.

The GitHub Actions workflow runs type-checking, unit tests, and the production build on pushes to main and pull requests targeting main. The current passing CI run is recorded in `PROGRESS.md`; dependencies are pinned in `package-lock.json` and the same checks were verified locally against it.

## Deployment

The repository is structured for a Vite static build. For Vercel, use the Vite framework preset, the default build command (npm run build), and dist as the output directory. Deployment is intentionally left to the repository owner.

## Safety and production readiness

- All displayed market metrics and token listings are illustrative sample data.
- Wallet UI is a placeholder and does not connect to wallet providers.
- Trading and token deployment are disabled.
- Do not add private keys or secret values to the repository.
- Do not enable live chain interactions until the target network, audited contract design, transaction flow, and operational controls have been reviewed and approved.

See PROGRESS.md for implementation and verification notes.
