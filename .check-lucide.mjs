import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function walk(d, l = []) {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, l);
    else if (/\.(tsx|ts)$/.test(f)) l.push(p);
  }
  return l;
}

const names = new Set();
for (const p of walk("src")) {
  const t = readFileSync(p, "utf8");
  const re = /import\s*\{([^}]+)\}\s*from\s*["']lucide-react["']/g;
  let m;
  while ((m = re.exec(t))) {
    for (const n of m[1].split(",")) {
      const nn = n.replace(/type\s+/, "").trim().split(/\s+as\s+/)[0].trim();
      if (nn) names.add(nn);
    }
  }
}

const mod = await import("lucide-react");
const missing = [...names].filter((n) => mod[n] === undefined);
console.log("Used icons:", names.size);
console.log("MISSING at runtime:", JSON.stringify(missing));