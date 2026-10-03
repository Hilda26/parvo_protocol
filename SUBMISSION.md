# Parvo -- Submission Notes

Parvo is programmable assurance for public promises. A user stakes GEN behind a quoted commitment from a public URL, names a payee, and lets the contract inspect Internet Archive change points. If the commitment becomes weakened or absent across the required run, the bond can move through breach, contest, adjudication, and settlement.

## Submission Parameters

- Project name: `Parvo`
- Category/tag: `DeFi` or `Prediction Markets`
- Live app: `https://parvo-protocol.vercel.app`
- GitHub repository: `https://github.com/Hilda26/parvo_protocol`
- Network: `GenLayer StudioNet`
- Contract address: `0xe38Fcd81fbFD216A0d44968463784f822a682602`
- Deploy transaction: `0xeb746577e1844037abe42ebcd660bffaf100641d80dba97ee43d1f225f84fbfa`
- Demo artifact: `demo/parvo-walkthrough.gif`
- One-liner: `Parvo turns public promises into archive-backed assurance bonds that can be checked, contested, and settled on GenLayer.`

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
- Integration evidence tx: `0x14cb18a481d6f1b029c6e6b80ae55d3e5d0da320db4742ecf9cc52aa1393dd12`
- Integration evidence address: `0x10F84F0259d6B857f5E8878Fa6b3878E275fB841`

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
