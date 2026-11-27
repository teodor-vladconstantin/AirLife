// Manual supplier stock and price sync. Report only by default:
//   npx tsx --env-file=.env.local scripts/stock-sync.ts [--apply] [--force]
// --apply writes stock, selling prices and purchase prices; --force also lets more than 30% of a supplier's products drop to 0 (first run).
import { reportText, runStockSync } from "../src/lib/stockSync";

const apply = process.argv.includes("--apply");
runStockSync({ apply, force: process.argv.includes("--force") }).then((plan) => console.log(reportText(plan, apply) ?? "Nimic de modificat."));
