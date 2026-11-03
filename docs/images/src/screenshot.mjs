// Takes docs/images/screenshot.png: the zero-width tool with Mix and Debug (blocks) on.
//
//   npm run dev                          # in another terminal
//   npm i --no-save puppeteer-core
//   node docs/images/src/screenshot.mjs http://localhost:3000/invisible-ink/ docs/images/screenshot.png
//   magick docs/images/screenshot.png -strip -resize 1600x -dither None -colors 256 PNG8:docs/images/screenshot.png
//
// Set BROWSER to a Chrome or Edge executable if the default Edge path doesn't exist.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const [url, out] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: process.env.BROWSER ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
  userDataDir: mkdtempSync(join(tmpdir(), "invisible-ink-shot-")),
  args: ["--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await page.evaluate((text) => {
  const box = document.querySelector("#source-input");
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(box, text);
  box.dispatchEvent(new Event("input", { bubbles: true }));
}, "Nothing to see here.");
await page.select("#char-type", "mix");
await page.click("#inspector-toggle");
await page.select("#inspector-style", "block");
await new Promise((r) => setTimeout(r, 400));
const height = await page.evaluate(() => Math.ceil(document.querySelector("main").getBoundingClientRect().bottom));
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height } });
await browser.close();
console.log(`saved ${out}`);
