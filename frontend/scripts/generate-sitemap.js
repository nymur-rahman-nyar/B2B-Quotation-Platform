#!/usr/bin/env node
import sitemapPkg from "sitemap";
const { SitemapStream, streamToPromise } = sitemapPkg; // pull in the streaming API
import { Readable } from "stream";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

async function generate() {
  // 1) list your URLs
  const links = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/products", changefreq: "weekly", priority: 0.8 },
    { url: "/services", changefreq: "weekly", priority: 0.8 },
    { url: "/contacts", changefreq: "monthly", priority: 0.7 },
    { url: "/request-quote", changefreq: "monthly", priority: 0.7 },
    // …add more or generate programmatically
  ];

  // 2) build a stream & convert to XML
  const stream = new SitemapStream({
    hostname: "http://localhost:5173/", // ← update this
  });
  const xmlData = await streamToPromise(Readable.from(links).pipe(stream));

  // 3) write to public/sitemap.xml
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const outPath = join(__dirname, "../public/sitemap.xml");

  fs.writeFileSync(outPath, xmlData.toString());
  console.log(`✅ sitemap.xml generated at ${outPath}`);
}

generate().catch((e) => {
  console.error("❌ sitemap generation failed:", e);
  process.exit(1);
});
