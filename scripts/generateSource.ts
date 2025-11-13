import fs from "fs";
import path from "path";

export type FileData = {
  path: string;
  content: string;
  // [key: string]: any; // allow extra fields
};
export type FileMap = Record<string, FileData>;

/**
 * Recursively read files from a directory and return
 * an array of { path, content } objects.
 */
function readFilesRecursive(dir: string, baseDir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let result: { path: string; content: string }[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      result = result.concat(readFilesRecursive(fullPath, baseDir));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();

      // TODO: fix
      const textExtensions: string[] = [
        // ".txt",
        // ".json",
        // ".yaml",
        // ".yml",
        // ".md",
        // ".dart",
        // ".js",
        // ".ts",
        // ".jsx",
        // ".tsx",
        // ".html",
        // ".css",
        // ".scss",
        // ".xml",
        // ".sh",
        // ".bat",
        // ".gitignore",
        // ".c",
        // ".cpp",
        // ".h",
        // ".hpp",
      ];

      if (textExtensions.includes(ext)) continue;

      const content = fs.readFileSync(fullPath, "utf8");
      result.push({
        path: relativePath.replace(/\\/g, "/"), // normalize for Windows
        content,
      });
    }
  }

  return result;
}

export function toPathObject(filesArray: FileData[]): FileMap {
  const result: FileMap = {};
  for (const file of filesArray) {
    result[file.path] = { ...file };
  }
  return result;
}

/**
 * Main script
 */
function generateVersionJson() {
  const dataDir = path.join(process.cwd(), "public", "data");
  const srcDir = path.join(dataDir, "src");
  fs.mkdirSync(srcDir, { recursive: true });
  const versions = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  if (fs.existsSync(path.join(dataDir, "json"))) {
    fs.rmdirSync(path.join(dataDir, "json"), { recursive: true });
  }

  for (const version of versions) {
    const folderPath = path.join(srcDir, version);
    const files = readFilesRecursive(folderPath, folderPath);

    const x = toPathObject(files);

    const outputPath = path.join(dataDir, "json", `${version}.json`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(x, null, 2), "utf-8");
  }

  const outputPath = path.join(dataDir, "versions.json");
  fs.writeFileSync(outputPath, JSON.stringify(versions, null, 2));

  console.log("\n✨ All version JSON files generated successfully!");
}

generateVersionJson();
