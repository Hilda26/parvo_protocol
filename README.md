# Parvo

Parvo is a GenLayer app for archive-backed promise assurance. A promisor stakes GEN behind one sentence published on a page they control, names a payee, and lets anyone trigger archive checks against Wayback change points. If two qualifying archived versions show the promise weakened or absent, Parvo opens a contest window and can pay the stake to the payee.

Live app: `https://parvo-protocol.vercel.app`  
Repository: `https://github.com/Hilda26/parvo_protocol`

## What makes it different

- **Public promise bonds:** The stake is tied to a quoted commitment, source URL, baseline archive timestamp, payee, and term.
- **Archive-first evidence:** Checks walk Internet Archive change points instead of trusting a live webpage.
- **Breach run meter:** A breach requires consecutive weakened or absent archive frames.
- **Contest room:** The promisor can cite an archived capture where the commitment still holds and post a contest bond.
- **Readable assurance UI:** The app turns raw contract states into promise cards, archive timelines, and settlement actions.

## Local Development

```bash
npm install
npm run dev
```

Configure:

```bash
NEXT_PUBLIC_PARVO_CONTRACT=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_GENLAYER_ENDPOINT=https://studio.genlayer.com/api
NEXT_PUBLIC_GENLAYER_CHAIN=studionet
```

## Contract

StudioNet deployment:

- Contract: `0xe38Fcd81fbFD216A0d44968463784f822a682602`
- Deploy transaction: `0xeb746577e1844037abe42ebcd660bffaf100641d80dba97ee43d1f225f84fbfa`

`contracts/Parvo.py` exposes:

```text
create_bond(...)
check_commitment(...)
contest_breach(...)
adjudicate_contest(...)
settle_breach(...)
expire_bond(...)
get_bond(...)
list_bonds()
bond_history(...)
commitment_status(...)
get_ledger()
get_limits()
```

Deploy to StudioNet:

```bash
python scripts/deploy-parvo.py
```

## Verification

```bash
npm run verify:schema
npm run lint
npm test
npm run build
python -m pytest tests/direct -q
python -m pytest tests/integration/test_parvo_deploy.py -q -s
```
