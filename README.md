# OPENORBIT

OPENORBIT is a testnet-first, non-custodial on-chain token launchpad and community marketplace concept.

## Current status

This repository currently contains an interactive, static frontend preview in `index.html`. It is suitable for a first Vercel preview deployment as a static website. It is **not** a complete production marketplace.

### Included in this preview

- Responsive landing and marketplace experience
- Asset listing search, category tabs, and sorting
- Asset detail dialog
- Wallet connection UI state (not connected to wallet providers)
- Token launch draft form with basic client-side validation
- Explicit demo-data and disabled-transaction messaging

### Not implemented yet

- React/TypeScript/Vite application architecture
- API server, persistent database, authentication, or user profiles
- Real market data, indexer, price feeds, portfolio, or activity data
- Wallet adapter, smart contracts, trading, or token deployment
- Contract audit, production security review, and chain configuration

## Preview deployment

For the current static preview, import this GitHub repository into Vercel and keep the project as a static site:

- Framework preset: **Other**
- Build command: leave blank
- Output directory: `./`
- Install command: leave blank

The homepage is `index.html` at the repository root. After Vercel is connected to the repository, new commits to the production branch can trigger deployments automatically if the project settings enable Git integration.

## Local preview

The current page has no package dependencies. You can open `index.html` directly, or serve the repository directory with a local static server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Safety and production readiness

- All displayed market metrics and token listings are illustrative sample data.
- Wallet UI is a placeholder and does not connect to wallet providers.
- Trading and token deployment are disabled.
- Do not add private keys or secret values to the repository.
- Do not enable live chain interactions until the target network, audited contract design, transaction flow, and operational controls have been reviewed and approved.

## Next milestones

1. Convert the static preview into the planned React + TypeScript + Vite project.
2. Add linting, type checking, and automated UI tests.
3. Decide the target testnet and contract/trading design.
4. Implement an API and persistence layer with explicit authorization and validation.
5. Integrate wallet and chain reads behind feature flags, then perform a security review before enabling writes.
