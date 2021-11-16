let fs = require('fs');
let Mustache = require('mustache');

let pagesDir = './src/pages';

let layout =
  fs.readFileSync(pagesDir + '/layouts/index.html', 'utf8');

// Build each page inside the layout
let dirEnts = fs.readdirSync(pagesDir, {withFileTypes: true});
dirEnts.forEach( dirEnt => {
  if(dirEnt.isFile()) {
    let pageContent =
      fs.readFileSync(`${pagesDir}/${dirEnt.name}`, 'utf8');


    let page = Mustache.render(layout, {content: pageContent});

    // TODO: Write to a file here
    fs.writeFileSync(`./build/${dirEnt.name}`, page, 'utf8');
  }
});
