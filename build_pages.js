let fs = require('fs');
let path = require('path');
let Mustache = require('mustache');

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

let layout =
  fs.readFileSync(pagesDir + '/layouts/index.html', 'utf8');


// Build articles
let indexBody = ''
articles.forEach( article =>  {
  let pageContent = fs.readFileSync(path.join(articlesDir, article.file), 'utf8');
  let page =
    Mustache.render(
      layout,
      {
        content: `
          <article>
            ${pageContent}
          </article>
        `
      }
    );

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
let index = Mustache.render(layout, {content: indexContent});
fs.writeFileSync(`./build/index.html`, index, 'utf8');


// Build each page inside the layout
let dirEnts = fs.readdirSync(pagesDir, {withFileTypes: true});
dirEnts.forEach( dirEnt => {
  if(dirEnt.isFile()) {
    let pageContent =
      fs.readFileSync(path.join(pagesDir, dirEnt.name), 'utf8');


    let page = Mustache.render(layout, {content: pageContent});

    fs.writeFileSync(`./build/${dirEnt.name}`, page, 'utf8');
  }
});

