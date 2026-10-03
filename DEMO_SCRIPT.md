# Parvo Walkthrough Script

## Scene 1: Open Parvo

Open `https://parvo-protocol.vercel.app` and introduce Parvo as a GenLayer assurance protocol for public promises. The home view shows the command desk, network guard, live ledger counters, and create-bond form.

## Scene 2: Create a Promise Bond

Show the create form. Enter a bond id, public promise URL, quoted commitment, baseline archive timestamp, anchor words, terminal text, payee, term length, and stake. Explain that Parvo binds one public sentence to a GEN stake and stores the source evidence needed to verify it later.

## Scene 3: Review the Bond Pool

Open the Bonds page. Explain that the pool is the operating table for existing bonds: each card shows state, stake, promisor, payee, archive frame count, breach run, and available actions.

## Scene 4: Run Archive Checks

Open a bond detail page or action panel and show the `check_commitment` path. Explain that Parvo asks archive history, admits qualified captures, rejects weak evidence, and records a tamper-resistant timeline.

## Scene 5: Contest or Settle

Show the contest and settlement actions. If a breach is claimed, the promisor can submit archive evidence that the promise still holds. After the contest window, the bond can be adjudicated or settled to the payee.

## Scene 6: Submission Proof

Close by showing the GitHub repository, deployed StudioNet contract address, deploy transaction, and successful test commands:

```text
npm run verify:schema
npm run lint
npm test
npm run build
python -m pytest tests/direct -q
python -m pytest tests/integration/test_parvo_deploy.py -q -s
```
