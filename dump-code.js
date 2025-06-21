// save as dump-code.js
const fs = require("fs");
const path = require("path");

function collectFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    return entries.flatMap((entry) => {
        const res = path.join(dir, entry.name);
        if (entry.isDirectory()) return collectFiles(res);
        if (/\.(ts|tsx|css)$/.test(entry.name)) return [res];
        return [];
    });
}

const files = collectFiles("./src").sort();
const content = files
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n\n// ---\n\n");
fs.writeFileSync("all-code.txt", content);
