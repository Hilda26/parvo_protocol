# Parvo Contract Status

Live app: `https://parvo-protocol.vercel.app`  
Repository: `https://github.com/Hilda26/parvo_protocol`

## Implemented

- `contracts/Parvo.py` defines the `Parvo` GenLayer contract.
- Promise bonds can be created with a stake, public URL, quoted commitment, baseline timestamp, anchor words, payee, and term.
- Archive checks walk Wayback change points and record admitted or rejected snapshot frames.
- Two consecutive weakened or absent qualified frames claim a breach.
- Breach claims can be contested with archived evidence and a contest bond.
- Contests can be adjudicated, breaches settled after the contest window, and active bonds expired after the term.
- Frontend reads are proxied through `/api/parvo/read` to avoid browser-side RPC/CORS failures.

## Local Verification

Expected commands:

```bash
npm run verify:schema
npm run lint
npm test
npm run build
python -m pytest tests/direct -q
```

## Live Verification

Deployed Parvo contract:

- Address: `0xe38Fcd81fbFD216A0d44968463784f822a682602`
- Deploy tx: `0xeb746577e1844037abe42ebcd660bffaf100641d80dba97ee43d1f225f84fbfa`

Use:

```bash
python scripts/deploy-parvo.py
python -m pytest tests/integration/test_parvo_deploy.py -q -s
```

The deploy script writes `NEXT_PUBLIC_PARVO_CONTRACT` to `.env.local`.
