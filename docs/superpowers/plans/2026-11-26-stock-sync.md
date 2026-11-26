# Stock Sync Implementation Plan

> **For agentic workers:** executed inline (superpowers:executing-plans). Code lives in the files named below, not duplicated here.

**Goal:** daily stock sync from the Ecovent and Novingair public catalogs.

**Architecture:** one module with pure parsing/planning plus thin fetch/DB wrappers; called by the existing daily cron and by a manual script.

**Tech Stack:** Next.js route handler, supabase-js, resend, tsx + node:assert.

## Global Constraints

Spec: `docs/superpowers/specs/2026-11-26-stock-sync-design.md`. Only `products.stock` changes (0 or 10). No new dependencies, no migration. No commit unless asked.

### Task 1: Planner and parsers (test first)

- Create `scripts/stock-sync-check.ts`, then `src/lib/stockSync.ts`.
- Produces: `ecoventEntries`, `wooEntries`, `toAvailability`, `planSync(rows, feeds, force)`, `reportText(plan, applied)`, `runStockSync({ apply, force })`.
- [ ] Write the check, run `npx tsx scripts/stock-sync-check.ts`, expect module-not-found failure.
- [ ] Implement, run again, expect `stock sync ok`.

### Task 2: Manual script and dry run

- Create `scripts/stock-sync.ts` (`--apply`, `--force`; default report only).
- [ ] `npx tsx --env-file=.env.local scripts/stock-sync.ts` prints the report, writes nothing.

### Task 3: Cron wiring

- Modify `src/app/api/cron/automations/route.ts`: `maxDuration = 300`, sync before `stockAlerts` only if `STOCK_SYNC_ENABLED=1`, e-mail the report to `contact@airlife.ro`.
- Modify `.env.example`.
- [ ] `npx tsc --noEmit` clean, `npx next build` passes.
