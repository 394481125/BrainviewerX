const fs = require('fs');

fetch('https://masilab.github.io/SPINS/')
  .then(r => r.text())
  .then(t => {
      fs.writeFileSync('temp_spins.html', t);
      console.log('done');
  })
  .catch(console.error);
