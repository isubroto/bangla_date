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

  // Obfuscate the code with safer settings
  const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: false, // Keep this false - causes const reassignment issues
    deadCodeInjection: false, // Set to false - can cause const issues
    debugProtection: false, // Safer to disable for libraries
    disableConsoleOutput: true,
    identifierNamesGenerator: "mangled",
    identifiersPrefix: "",
    log: false,
    numbersToExpressions: false, // Disable - can cause issues
    renameGlobals: false, // Safer for libraries used by others
    selfDefending: false, // Disable - can cause runtime errors
    simplify: true,
    splitStrings: false,
    stringArray: true, // Re-enable but with safe settings
    stringArrayCallsTransform: true,
    stringArrayEncoding: ["none"], // Use safe encoding
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: "variable",
    stringArrayThreshold: 0.75,
    transformObjectKeys: false, // Safer to disable
    unicodeEscapeSequence: false,
    target: "browser",
    // Remove source map for production
    sourceMap: false,
    reservedNames: [],
    reservedStrings: [],
    seed: 0,
  }).getObfuscatedCode();

  // Post-process to fix any remaining const reassignment issues
  let fixedCode = obfuscatedCode;

  // Replace problematic const declarations that get reassigned
  // This is a safety net in case the obfuscator still creates them
  fixedCode = fixedCode.replace(
    /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=([^;]+);([^}]*)\1\s*=/g,
    "let $1=$2;$3$1="
  );

  // Write the obfuscated code back to the file
  fs.writeFileSync(filePath, fixedCode);
});

