# Parvo Review Notes

Parvo turns an archive-checking promise-bond contract into a standalone assurance product.

## Changes

- Rebranded the app, routes, environment variables, and UI language to Parvo.
- Added promise-bond dashboard, bond cards, create-bond form, bond detail page, breach meter, archive timeline, and lifecycle actions.
- Added Parvo-specific read proxy, typed contract client, status helpers, validation tests, schema verification, deploy script, and submission docs.
- Removed stale insurance-pool pages, components, scripts, and tests.

## Remaining Before Submission

- Deploy `contracts/Parvo.py` to StudioNet.
- Update `.env.local` and Vercel env with the deployed `NEXT_PUBLIC_PARVO_CONTRACT`.
- Run live integration test and deploy the frontend.
