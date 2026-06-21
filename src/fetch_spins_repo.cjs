const fs = require('fs');

fetch('https://api.github.com/repos/MASILab/SPINS', {
   headers: {'User-Agent': 'fetch-script'}
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
