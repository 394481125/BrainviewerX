const fs = require('fs');
fetch('https://masilab.github.io/SPINS/Yeo17_renders/')
  .then(r => r.text())
  .then(t => {
      fs.writeFileSync('temp_yeo.html', t);
      console.log('done');
  })
  .catch(console.error);
