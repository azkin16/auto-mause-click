const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'modal_page.html'), 'utf8');

// Find common-desktopModalWrapper in html
const index = html.indexOf('data-testid="common-desktopModalWrapper"');
if (index !== -1) {
    console.log("Found common-desktopModalWrapper!");
    // Print 3000 characters around it
    console.log(html.substring(index - 500, index + 3000));
} else {
    console.log("common-desktopModalWrapper not found!");
}
