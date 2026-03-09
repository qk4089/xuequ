const fs = require("fs");
const path = require("path");
const { minify: minifyJS } = require("terser");
const { minify: minifyHTML } = require("html-minifier-terser");

const root = __dirname;
const srcDir = path.join(root, "src");
const outputDir = path.join(root, "dist");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function read(file) {
  return fs.readFileSync(path.join(srcDir, file), "utf8");
}

// 读取文件
let html = read("index.html");

let main = read("main.js");
let drawSchool = read("map/drawSchool.js");
let drawDistrict = read("map/drawDistrict.js");

let schools = read("data/schools.js");
let schoolDistricts = read("data/schoolDistricts.js");
let poi = read("data/poi.js");

// 去 export
schools = schools.replace(/export\s+const/g, "const");
schoolDistricts = schoolDistricts.replace(/export\s+const/g, "const");
poi = poi.replace(/export\s+const/g, "const");

drawSchool = drawSchool.replace(/export\s+function/g, "function");
drawDistrict = drawDistrict.replace(/export\s+function/g, "function");

// 去 import
drawSchool = drawSchool.replace(/import .*;/g, "");
drawDistrict = drawDistrict.replace(/import .*;/g, "");
main = main.replace(/import .*;/g, "");

// 合并顺序
const finalJS = `

/* ===== data ===== */
${schools}

${schoolDistricts}

${poi}

/* ===== map ===== */
${drawSchool}

${drawDistrict}

/* ===== main ===== */
${main}

`;

(async function () {
  // 压缩 JS
  const { code: minifiedJS } = await minifyJS(finalJS, {
    compress: { drop_console: false },
    format: { comments: false }
  });

  // 替换 script
  html = html.replace(
    /<script type="module" src="main.js"><\/script>/,
    `<script>${minifiedJS}</script>`
  );

  // 压缩 HTML（内联 script 已由 terser 压缩，此处不再重复）
  const minifiedHTML = await minifyHTML(html, {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: false,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true
  });

  fs.writeFileSync(
    path.join(outputDir, "index.html"),
    minifiedHTML,
    "utf8"
  );

  console.log("✅ 打包完成（已压缩）→ dist/index.html");
})();