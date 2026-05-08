#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const inputFolder = process.argv[2];

if (!inputFolder) {
  console.error("❌ Please provide a folder path");
  process.exit(1);
}

const outputFileName = `${path.basename(inputFolder)}.md`;
const outputPath = path.join(process.cwd(), outputFileName);

// Ignore folders/files
const IGNORE = ["node_modules", ".git", ".next", "dist"];

// Get language from extension
const getLanguage = (file) => {
  const ext = path.extname(file).toLowerCase();
  const map = {
    ".js": "javascript",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".jsx": "jsx",
    ".json": "json",
    ".css": "css",
    ".html": "html",
    ".md": "markdown",
  };
  return map[ext] || "";
};

// Recursively collect files
function getAllFiles(dir, baseDir) {
  let results = [];

  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    if (IGNORE.includes(file)) return;

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, baseDir));
    } else {
      results.push({
        fileName: file,
        relativePath: path.relative(baseDir, fullPath),
        fullPath,
      });
    }
  });

  return results;
}

// Build Markdown
function buildMarkdown(files, folderName) {
  let md = `# 📦 ${folderName} Code Export\n\n`;

  // Table of Contents
  md += `## 📑 Table of Contents\n\n`;
  files.forEach((file, index) => {
    const anchor = file.relativePath.replace(/[\/\\.]/g, "").toLowerCase();
    md += `- [${file.relativePath}](#${anchor})\n`;
  });

  md += `\n---\n`;

  // File sections
  files.forEach((file) => {
    let content = "";

    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      content = "⚠️ Unable to read file (binary or unsupported)";
    }

    const anchor = file.relativePath.replace(/[\/\\.]/g, "").toLowerCase();
    const lang = getLanguage(file.fileName);

    md += `\n## 📄 ${file.fileName}\n`;
    md += `**Path:** \`${file.relativePath}\`\n\n`;
    md += `<a id="${anchor}"></a>\n\n`;

    md += "```" + lang + "\n";
    md += content;
    md += "\n```\n";

    md += `\n---\n`;
  });

  return md;
}

// Run
try {
  const absoluteInput = path.resolve(inputFolder);
  const folderName = path.basename(absoluteInput);

  let files = getAllFiles(absoluteInput, absoluteInput);

  // Sort nicely
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const markdown = buildMarkdown(files, folderName);

  fs.writeFileSync(outputPath, markdown, "utf-8");

  console.log(`✅ Beautiful export created: ${outputPath}`);
} catch (err) {
  console.error("❌ Error:", err.message);
}