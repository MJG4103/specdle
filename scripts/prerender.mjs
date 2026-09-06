// Writes the static tool pages into dist/ after `vite build` and the SSR build.
//   dist/gpu/<slug>/index.html, dist/cpu/<slug>/index.html, dist/gpu/index.html, dist/cpu/index.html,
//   dist/sitemap.xml
// The head reuses the built app's stylesheet, favicon and body classes so the pages match the game.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pages, meta } from "../dist-ssr/entry-server.js";
import { SITE_URL, SITE_NAME, GOATCOUNTER_CODE } from "../src/config.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const appHtml = readFileSync(join(dist, "index.html"), "utf8");
const css = readdirSync(join(dist, "assets")).filter((f) => f.endsWith(".css")).map((f) => `/assets/${f}`);
const favicon = (appHtml.match(/<link rel="icon"[^>]*>/) || [""])[0];
const bodyClass = (appHtml.match(/<body class="([^"]*)"/) || [, ""])[1];
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const analytics = GOATCOUNTER_CODE
  ? `<script data-goatcounter="https://${GOATCOUNTER_CODE}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`
  : "";
const clickHook = `<script>document.querySelectorAll("[data-track]").forEach(function(a){a.addEventListener("click",function(){try{window.goatcounter&&window.goatcounter.count({path:"event/"+a.dataset.track,title:a.dataset.track,event:true})}catch(e){}})});</script>`;

function document_(p) {
  const url = SITE_URL + p.path;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>${esc(p.title)}</title>
    <meta name="description" content="${esc(p.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(p.title)}" />
    <meta property="og:description" content="${esc(p.description)}" />
    <meta property="og:image" content="${SITE_URL}/og.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="theme-color" content="#16a34a" />
    ${css.map((h) => `<link rel="stylesheet" href="${h}" />`).join("\n    ")}
    ${favicon}
    ${p.jsonld ? `<script type="application/ld+json">${JSON.stringify(p.jsonld).replace(/</g, "\\u003c")}</script>` : ""}
    ${analytics}
  </head>
  <body class="${bodyClass}">
${p.html}
${clickHook}
  </body>
</html>
`;
}

const all = pages();
let bytes = 0;
for (const p of all) {
  const dir = join(dist, p.path);
  mkdirSync(dir, { recursive: true });
  const html = document_(p);
  writeFileSync(join(dir, "index.html"), html);
  bytes += Buffer.byteLength(html);
}

const today = new Date().toISOString().slice(0, 10);
const urls = [{ path: "/", changefreq: "daily", priority: "1.0" }, ...all.map((p) => ({ path: p.path, changefreq: p.changefreq, priority: p.path.split("/").length > 3 ? "0.6" : "0.8" }))];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u.path}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);
console.log(`prerender: ${all.length} pages (${(bytes / 1e6).toFixed(1)} MB), sitemap with ${urls.length} URLs; dataset ${meta.generated}, Blender snapshot ${meta.perfSnapshot}, CPI ${meta.cpiYear}`);
