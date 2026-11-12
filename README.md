# R2R Mobile — Auth-only GitHub Pages release target

This public repository is a **distribution target**, not the source of truth.

- Authoritative private code: `hkassir/R2R-Platform`
- Expected isolated first-party HTTPS origin: `https://auth-mobile.intelligentradiology.ai`
- Identity provider: Neon Auth (managed Better Auth, `r2r_shared`).
- Current state: staging placeholder only. **No real credentials or clinical functionality are published.**
- No original AppDeploy synthetic/tester fixture may be copied into this repo.
- Only signed-in Neon identity can be stated; no R2R Manager/Assessor/clinical role may be inferred from email.
- The separate public Tester applications continue in the original GitHub Pages repository.

## Publishing

Private GitHub Actions in `R2R-Platform` builds the original frozen frontend.
A protected, scoped deploy token may push reviewed static assets only to
the `gh-pages` branch here. **Do not store tokens in this repo.**

Before publishing the real authentication frontend:
1. Configure the repository Pages source as `gh-pages` root.
2. Verify a CNAME for `auth-mobile.intelligentradiology.ai` pointing to `hkassir.github.io` at the DNS owner.
3. Confirm GitHub Pages issues HTTPS and has this exact custom domain set.
4. Add exactly `https://auth-mobile.intelligentradiology.ai` to Neon's trusted redirect origins.
5. Build the frozen non-tester profile with `VITE_R2R_AUTH_ALLOWED_ORIGIN`
   set to the exact HTTPS origin. App code refuses authentication on
   the fallback `hkassir.github.io` hostname.
6. Validate email OTP, password creation, Neon sign-in, session restoration
   and sign-out. Treat account/clinical authorization as an independent phase.

**No source files or credentials are maintained manually in this public repo.**
