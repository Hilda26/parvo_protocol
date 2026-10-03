# Parvo -- Submission Notes

Parvo is programmable assurance for public promises. A user stakes GEN behind a quoted commitment from a public URL, names a payee, and lets the contract inspect Internet Archive change points. If the commitment becomes weakened or absent across the required run, the bond can move through breach, contest, adjudication, and settlement.

## Highlights

1. **Archive-backed checks.** Parvo evaluates historical captures, not only the current webpage.
2. **Deterministic safety gates.** URL shape, size caps, digest checks, archive admission, breach run length, contest windows, and accounting stay in contract code.
3. **Human-readable assurance UI.** The frontend shows promise bonds, breach progress, archive timeline rows, payee/promisor details, and action panels.
4. **Permissionless maintenance.** Anyone can run checks, adjudicate contests, settle matured breaches, or expire ended bonds.
5. **No fake fallback data.** Empty reads show an empty product state instead of invented activity.

## Main Contract Methods

```text
create_bond
check_commitment
contest_breach
adjudicate_contest
settle_breach
expire_bond
list_bonds
get_bond
bond_history
commitment_status
get_ledger
get_limits
```

## Verification Commands

Live contract:

- Address: `0xe38Fcd81fbFD216A0d44968463784f822a682602`
- Deploy tx: `0xeb746577e1844037abe42ebcd660bffaf100641d80dba97ee43d1f225f84fbfa`

```bash
npm run verify:schema
npm run lint
npm test
npm run build
python -m pytest tests/direct -q
```

Live StudioNet deploy:

```bash
python scripts/deploy-parvo.py
python -m pytest tests/integration/test_parvo_deploy.py -q -s
```
