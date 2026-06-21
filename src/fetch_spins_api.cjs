const fs = require('fs');

fetch('https://api.github.com/repos/MASILab/SPINS/git/trees/master?recursive=1', {
   headers: {'User-Agent': 'fetch-script'}
})
  .then(r => r.json())
  .then(data => {
      if(data.tree) {
          const files = data.tree.filter(t => t.path.includes('.nii')).map(t => t.path);
          console.log(files.join('\n'));
      } else {
        console.log(data);
      }
  })
  .catch(console.error);
