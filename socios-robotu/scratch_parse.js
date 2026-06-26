const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'hunt_page.html'), 'utf8');

// Find all cards block. They start with data-testid="tokenHuntLobby-huntCard-v2-..." and end before the next card or end of div.
// Let's split by the card testid prefix to see each card individually.
const segments = html.split('data-testid="tokenHuntLobby-huntCard-v2-');

for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const id = segment.split('"')[0];
    
    // Find name
    const nameMatch = segment.match(/class="[^"]*jogMsi"[^>]*>([^<]+)</);
    const name = nameMatch ? nameMatch[1] : 'Unknown';
    
    // Find if button exists
    const hasButton = segment.includes('tokenHuntLobby-huntButton-v2-');
    
    // Let's see if there is a link (a href)
    const hrefMatch = segment.match(/href="([^"]+)"/);
    const href = hrefMatch ? hrefMatch[1] : 'No href';
    
    console.log(`Card ID: ${id} | Name: ${name} | Has Button: ${hasButton} | Href: ${href}`);
}
