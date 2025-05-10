import JavaScriptObfuscator from "javascript-obfuscator";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "..", "dist");

// Function to recursively find all JS files
function getAllJsFiles(dir) {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(getAllJsFiles(filePath));
    } else if (file.endsWith(".js")) {
      results.push(filePath);
    }
  });

  return results;
}

// Get all JS files recursively
const files = getAllJsFiles(distDir);

files.forEach((filePath) => {
  const code = fs.readFileSync(filePath, "utf8");

  // Obfuscate the code to look like React production build
  const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: true,
    debugProtection: true,
    disableConsoleOutput: true,
    identifierNamesGenerator: "mangled",
    identifiersPrefix: "",
    log: false,
    numbersToExpressions: true,
    renameGlobals: true,
    selfDefending: true,
    simplify: true,
    splitStrings: false,
    stringArray: false,
    stringArrayCallsTransform: false,
    stringArrayEncoding: [],
    stringArrayIndexShift: false,
    stringArrayRotate: false,
    stringArrayShuffle: false,
    stringArrayWrappersCount: 0,
    stringArrayWrappersChainedCalls: false,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: "variable",
    stringArrayThreshold: 0,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    target: "browser",
    sourceMap: true,
    sourceMapMode: "separate",
    sourceMapBaseUrl: "",
    sourceMapFileName: "",
    reservedNames: [],
    reservedStrings: [],
    seed: 0,
    inputFileName: "",
    identifiersDictionary: [],
    namesCache: null,
    rotateStringArray: false,
    shuffleStringArray: false,
  }).getObfuscatedCode();

  // Write the obfuscated code back to the file
  fs.writeFileSync(filePath, obfuscatedCode);
});
