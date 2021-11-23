let fs = require('fs');
let path = require('path');

let pagesDir = './src/pages';
let articlesDir = './src/pages/articles';
let articles = [
  {
    file: 'store_url_and_friendly_redirect_in_phoenix.html',
    title: 'Storing previous urls and doing friendly redirects in phoenix',
    date: '2018-07-09',
  },
  {
    file: 'testing_custom_form_helpers_in_phoenix.html',
    title: 'Testing Custom Form Helpers in Phoenix',
    date: '2018-03-31',
  },
  {
    file: 'asynchronous_programming_part_2.html',
    title: 'An introduction to JavaScript Asynchronous Programming - Part 2 | DOM Events',
    date: '2018-02-19',
  },
  {
    file: 'asynchronous_programming_part_1.html',
    title: 'An introduction to JavaScript Asynchronous Programming - Part 1 | General Definitions and Timers',
    date: '2017-10-02',
  },
  {
    file: 'learning_frameworks_and_best_practices.html',
    title: 'Thoughts and rules about choosing and applying tools, frameworks and best practices in programming and web development',
    date: '2017-07-25',
  },
  {
    file: 'getting_a_programming_job.html',
    title: 'Going from not knowing about programming to getting a full time job as a web developer',
    date: '2017-06-15',
  },
]

// Build articles
let indexBody = ''
articles.forEach( article =>  {
  let pageContent = 
    `
     <article>
       ${fs.readFileSync(path.join(articlesDir, article.file), 'utf8')}
     </article>
    `
  let page = renderContentWithLayout(pageContent);

  let articlePath = `/articles/${article.file}`
  indexBody += `
  <li>
    <time>${article.date}</time>
    <h2><a href=${articlePath}>${article.title}</a></h2>
  </li>
  `

  fs.writeFileSync(`./build/articles/${article.file}`, page, 'utf8');
})

let indexContent = `
  <ul>
    ${indexBody}
  </ul>
`;
let index = renderContentWithLayout(indexContent);
fs.writeFileSync(`./build/index.html`, index, 'utf8');


// Build each page inside the layout
let dirEnts = fs.readdirSync(pagesDir, {withFileTypes: true});
dirEnts.forEach( dirEnt => {
  if(dirEnt.isFile()) {
    let pageContent =
      fs.readFileSync(path.join(pagesDir, dirEnt.name), 'utf8');


    let page = renderContentWithLayout(pageContent);

    fs.writeFileSync(`./build/${dirEnt.name}`, page, 'utf8');
  }
});

// HELPERS
function renderContentWithLayout(content, opts) {
  opts = opts || {};
  let stylesheets = ['index.css'];
  if(opts.sylesheets) {
    stylesheets = stylesheets.concat(opts.stylesheets);
  }
  let styleTags = stylesheets.reduce((accum, stylesheet) => {
    let ret = (accum + `<link href="${stylesheet}" rel="stylesheet" />`);
    return ret
  }, '')
    
  let ret = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300|PT+Sans" 
      rel="stylesheet">
    <title>
      Software Development | Federico Rodriguez
    </title>
    <meta name="description" content="A blog by Federico Rodriguez about Software Development">
    ${styleTags}
  </head>

  <body>
    ${content}
  </body>

</html>
`
  return ret;
}

