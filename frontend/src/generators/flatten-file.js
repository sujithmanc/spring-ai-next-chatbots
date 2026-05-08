const fs = require("fs");
const path = require("path");

const inputFolder = process.argv[2];

if (!inputFolder) {
  console.error("❌ Please provide a folder path");
  console.log("👉 Example: node flatten-folder.js src/app/emp");
  process.exit(1);
}

const outputFileName = `${path.basename(inputFolder)}.md`;
const outputPath = path.join(process.cwd(), outputFileName);

// Recursively get all files
function getAllFiles(dir, baseDir) {
  let results = [];

  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
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

// Read and format content
function buildOutput(files) {
  let content = "";

  files.forEach((file) => {
    let fileContent = "";

    try {
      fileContent = fs.readFileSync(file.fullPath, "utf-8");
    } catch (err) {
      fileContent = "⚠️ Unable to read file (possibly binary)";
    }

    content += `FileName: ${file.fileName}\n`;
    content += `RelativePath: ${file.relativePath}\n`;
    content += `FileContent:\n`;
    content += `${fileContent}\n`;
    content += `---\n`;
  });

  return content;
}

// Run
try {
  const absoluteInput = path.resolve(inputFolder);
  const files = getAllFiles(absoluteInput, absoluteInput);
  const output = buildOutput(files);

  fs.writeFileSync(outputPath, output, "utf-8");

  console.log(`✅ Done! Output written to ${outputPath}`);
} catch (error) {
  console.error("❌ Error:", error.message);
}