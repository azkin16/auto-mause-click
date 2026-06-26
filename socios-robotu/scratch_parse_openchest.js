const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'modal_page.html'), 'utf8');

// Find all buttons containing "Open Chest" or similar
const buttonRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
let match;
console.log("Searching for Open Chest buttons in modal_page.html...");
while ((match = buttonRegex.exec(html)) !== null) {
    const btnHtml = match[0];
    const btnText = match[1].replace(/<[^>]*>/g, '').trim();
    if (btnText.toLowerCase().includes('open') || btnText.toLowerCase().includes('chest')) {
        console.log(`- Text: "${btnText}" | HTML: ${btnHtml.substring(0, 300)}`);
    }
}
