import fs from 'node:fs';
import path from 'node:path';

const site = path.join(process.cwd(), 'site');
if (!fs.existsSync(site)) {
  console.log('No site directory found; nothing to finalize.');
  process.exit(0);
}
const htmlFiles = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(site);
let changed = 0;
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = html.replace(/<form\b[\s\S]*?<\/form>/gi, '<section class="card"><strong>Public-site boundary</strong><p>This public page does not collect information. Use info@quebec.ai for public-safe business inquiries only.</p></section>');
  html = html.replace(/<textarea\b[\s\S]*?<\/textarea>/gi, '<pre class="log">Built-in public-safe demo receipt. No pasted data required.</pre>');
  html = html.replace(/<input\b[^>]*>/gi, '<span class="pill">No public input required</span>');
  html = html.replace(/<select\b[\s\S]*?<\/select>/gi, '<span class="pill">Built-in scenario selector</span>');
  if (html !== before) { fs.writeFileSync(file, html); changed++; }
}
console.log(`Public site boundaries finalized; updated ${changed} files.`);
