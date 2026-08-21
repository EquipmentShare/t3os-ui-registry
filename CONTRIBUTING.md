# Contributing

Use Node 24.17.x and pnpm 9.15.0.

```bash
corepack enable
pnpm install
pnpm test
pnpm build
pnpm registry:validate
```

Registry modules must be copy-owned, accessible, responsive, dependency-light, and safe for a public repository. Keep authentication, token handling, persistence, and T3OS network calls in consumer-owned adapters.
