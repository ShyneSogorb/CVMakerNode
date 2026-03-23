import ejs from "ejs";
import fs from "fs";
import puppeteer from "puppeteer-core";

import path from "path";
import { GetAllFilesNameOnly } from "./scripts/scripts.js";
import config from "./config.js";

const variants = (process.argv[2] && process.argv[2] != "all") ? [process.argv[2]] : GetAllFilesNameOnly("./data/");
const save = process.argv[3] || true;

const css = fs.readFileSync("./styles/style.css", "utf-8");

variants.forEach(async variant => {

// 📦 cargar datos
const dataPath = path.resolve(`./data/${variant}.json`);
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// 🎨 renderizar HTML desde EJS
const html = await ejs.renderFile(
  "./templates/cv.ejs",
  {...data, css}
);

const GenerateRoute = Extension => `./dist/cv_${variant}.${Extension}`

// 💾 guardar HTML (para debug)
if (save) {
    fs.writeFileSync(GenerateRoute("html"), html);
}

// 🖨️ generar PDF
const browser = await puppeteer.launch({
  executablePath: config.BrowserPath,
  headless: "new"
});

const page = await browser.newPage();

await page.setContent(html, { waitUntil: "networkidle0" });

await page.pdf({
  path: GenerateRoute("pdf"),
  format: config.Pdf.Format,
  printBackground: true
});

await browser.close();

console.log(`✔ CV generado: cv_${variant}.pdf ${new Date()}`);

});
