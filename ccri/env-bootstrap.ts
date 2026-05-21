/**
 * .env.local loader — side-effect module, imported FIRST in run.ts so that
 * downstream modules (push.ts, sign.ts) see populated process.env when their
 * top-level code captures RPC / oracle / signer constants.
 *
 * `ponder dev` auto-loads .env.local; the standalone `tsx ccri/run.ts` path
 * does not. This bridges the gap with zero external deps.
 */
import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";

for (const file of [".env.local", ".env"]) {
  const p = resolve(process.cwd(), file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || process.env[m[1]!]) continue;
    let v = m[2]!;
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    process.env[m[1]!] = v;
  }
}
