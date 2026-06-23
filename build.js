import ejs from "ejs";
import fs from "fs";
import puppeteer from "puppeteer-core";

import path from "path";
import { GetAllFiles, DataFile } from "./scripts/scripts.js";
import config from "./config.js";

const variants = (process.argv[2] && process.argv[2] != "all") ? [process.argv[2]] : GetAllFiles("./data/");
const save = process.argv[3] || true;

const css = fs.readFileSync("./styles/style.css", "utf-8");

console.log(variants);


const SaveAsync =async (variant)  => {

// 📦 cargar datos
const dataPath = path.resolve(`./data/${variant.Path()}`);


if (!fs.existsSync(dataPath)) {
  console.error(`There is no data valid file "${variant.Lang}"`);
  
  return;
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

console.log("Generating " + variant.Path());

// 🎨 renderizar HTML desde EJS

const ejsPath = `./templates/cv.${variant.Lang}.ejs`

if (!fs.existsSync(ejsPath)) {
  console.error(`There is no valid ejs for language "${variant.Lang}"`);
  
  return;
}

const html = await ejs.renderFile(
  ejsPath,
  {...data, css}
);


const GenerateRoute = Extension => `./dist/cv_${variant.Name}.${variant.Lang}.${Extension}`

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

console.log(`✔ CV generado: cv_${variant.Name}.pdf ${new Date()}`);

};

const ListSize = variants.length
let processed = 0
const Queue = async (remaining)=>{
  const variant = remaining.pop()
  await SaveAsync(variant)
  console.log(`Processed ${++processed} files of  ${ListSize}`);
  
  if(remaining.length > 0)
    await Queue(remaining)
}
//await variants.forEach(async (variant) => {await SaveAsync(variant)});
await Queue(variants)
