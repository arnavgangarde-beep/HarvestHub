const fs = require('fs');
const c = fs.readFileSync('src/App.tsx', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('activeTab')) {
    console.log((i+1) + ': ' + l.trim().substring(0, 120));
  }
});
