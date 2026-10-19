# OPENORBIT

OPENORBIT is a testnet-first, non-custodial token launchpad and community marketplace concept.

## Current status

The frontend has been migrated from a single-file HTML prototype to a React + TypeScript + Vite application. It remains a demo-only preview, not a production marketplace.

### Included

- Responsive marketplace layout and sample asset cards
- Search, category filters, and sorting
- Asset details, wallet-preview, and launch-draft dialogs
- Keyboard Escape handling, focus cycling, focus restoration, and visible focus states
- Client-side validation for launch-draft fields
- Unit tests for core preview interactions
- GitHub Actions workflow for type-checking, tests, and production builds

### Not implemented

- API server, persistent database, authentication, or user profiles
- Live market data, indexer, price feeds, portfolio, or activity data
- Wallet provider integration, smart contracts, trading, or token deployment
- Contract audit, production security review, and chain configuration
- Dependency lockfile; local checks have not been run in the authoring environment (GitHub Actions verification is recorded in `PROGRESS.md`)

## Local development

Requires Node.js 22 or a compatible supported release and npm.

1. Install dependencies with npm install.
2. Start the dev server with npm run dev.
3. Run checks with npm run typecheck and npm test.
4. Create a production bundle with npm run build.
5. Preview the bundle with npm run preview.

The GitHub Actions workflow runs type-checking, unit tests, and the production build on pushes to main and pull requests targeting main. The current passing CI run is recorded in `PROGRESS.md`; a dependency lockfile is still outstanding.

## Deployment

The repository is structured for a Vite static build. For Vercel, use the Vite framework preset, the default build command (npm run build), and dist as the output directory. Deployment is intentionally left to the repository owner.

## Safety and production readiness

- All displayed market metrics and token listings are illustrative sample data.
- Wallet UI is a placeholder and does not connect to wallet providers.
- Trading and token deployment are disabled.
- Do not add private keys or secret values to the repository.
- Do not enable live chain interactions until the target network, audited contract design, transaction flow, and operational controls have been reviewed and approved.

See PROGRESS.md for implementation and verification notes.
