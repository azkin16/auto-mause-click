const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'chest_page.html'), 'utf8');

const labels = new Set();
const ariaLabelRegex = /aria-label="([^"]+)"/g;
let match;
while ((match = ariaLabelRegex.exec(html)) !== null) {
    labels.add(match[1]);
}

console.log("All aria-labels in chest_page.html:");
for (let label of labels) {
    if (label.toLowerCase().includes('chest')) {
        console.log(`- ${label}`);
    }
}
