let fs = require('fs');
let path = require('path');

let buildDir = 'build';
let pagesDir = 'src/pages';
let articlesDir = 'src/pages/articles';
let gamesDir = 'src/games';

let routes = {
  articles: {
    index: 'index.html',
    show: (filename) => path.join('articles', filename),
  },
  games: {
    index: path.join('games.html'), 
    show: (dir) => path.join('games', dir, 'index.html'),
    snapshot: (dir, snapshot) => path.join('games', dir, snapshot),
  }
}

function buildPath(route) {
  return path.join(buildDir, route);
}

// ARTICLES
let articles = [
  {
    file: 'store_url_and_friendly_redirect_in_phoenix.html',
    title: 'Storing previous urls and doing friendly redirects in phoenix',
    description: 'Simple way of doing friendly redirect using plugs',
    date: '2018-07-09',
  },
  {
    file: 'testing_custom_form_helpers_in_phoenix.html',
    title: 'Testing Custom Form Helpers in Phoenix',
    description: 'Using form helpers as an example of how to write composable tests',
    date: '2018-03-31',
  },
  {
    file: 'asynchronous_programming_part_2.html',
    title: 'An introduction to JavaScript Asynchronous Programming - Part 2 | DOM Events',
    description: 'An introduction to JavaScript Asynchronous Programming: DOM Events',
    date: '2018-02-19',
  },
  {
    file: 'asynchronous_programming_part_1.html',
    title: 'An introduction to JavaScript Asynchronous Programming - Part 1 | General Definitions and Timers',
    description: 'Understanding the JavaScript runtime\'s event loop and using timers',
    date: '2017-10-02',
  },
  {
    file: 'learning_frameworks_and_best_practices.html',
    title: 'Thoughts and rules about choosing and applying tools, frameworks and best practices in programming and web development',
    description: 'Some ideas about how to navigate the endless information that exists within the programming community and what a professinal programmer should to to get better at her job',
    date: '2017-07-25',
  },
  {
    file: 'getting_a_programming_job.html',
    title: 'Going from not knowing about programming to getting a full time job as a web developer',
    description: 'A detailed step by step guide on what to do from going from zero to getting a web develpment job',
    date: '2017-06-15',
  },
]

// Build articles
let indexBody = ''
articles.forEach( article =>  {
  let pageContent = 
    `
     <article itemscope itemtype="http://schema.org/BlogPosting">
       <h1 itemprop="name headling">${article.title}</h1>
       <div itemprop="articleBody">
         ${fs.readFileSync(path.join(articlesDir, article.file), 'utf8')}
       </div>
     </article>
     <link rel="stylesheet"
           href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css">
     <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js"></script> 
     <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/languages/elixir.min.js"></script>
     <script>hljs.highlightAll();</script>
    `
  let page = renderContentWithLayout(
    pageContent,
    {title: article.title, description: article.description}
  );

  let articlePath = routes.articles.show(article.file);
  indexBody += `
  <li itemscope itemtype="http://schema.org/BlogPosting">
    <time>${article.date}</time>
    <h2 itemprop="name headline"><a href=${articlePath}>${article.title}</a></h2>
  </li>
  `

  fs.writeFileSync(buildPath(articlePath), page, 'utf8');
})

// Article Index
let indexContent = `
  <div itemscope itemtype="http://schema.org/Blog">
    <ul itemscope itemtype="http://schema.org/blogPosts">
      ${indexBody}
    </ul>
  </div>
`;
let index = renderContentWithLayout(indexContent, {title: 'Federico Rodriguez | Software Development Blog', description: 'Latest articles by Federico Rodriguez'});
fs.writeFileSync(buildPath(routes.articles.index), index, 'utf8');

// GAMES
let games = [
  {
    dir: 'tanks',
    snapshot: 'tanks_overview.png',
    title: 'Tanks',
    description: 'Battle city inspired tank shooter',
  },
]

let gamesIndexBody = ''
games.forEach( game =>  {
  let gamePath = routes.games.show(game.dir);
  gamesIndexBody += `
  <li itemscope itemtype="http://schema.org/Game">
    <a href=${gamePath}>
    <h2 itemprop="name">${game.title}</h2>
    <img src=${routes.games.snapshot(game.dir, game.snapshot)}>
  </li>
  `
})

let gamesIndexContent = `
  <ul>
    ${gamesIndexBody}
  </ul>
`;
let gamesIndex = renderContentWithLayout(
  gamesIndexContent, 
  {title: 'Federico Rodriguez | Games', description: 'Games by Federico Rodriguez'}
);
fs.writeFileSync(buildPath(routes.games.index), gamesIndex, 'utf8');


// PAGES
let dirEnts = fs.readdirSync(pagesDir, {withFileTypes: true});
dirEnts.forEach( dirEnt => {
  if(dirEnt.isFile()) {
    let pageContent =
      fs.readFileSync(path.join(pagesDir, dirEnt.name), 'utf8');

    let page = renderContentWithLayout(pageContent);

    fs.writeFileSync(buildPath(dirEnt.name), page, 'utf8');
  }
});

// HELPERS
function renderContentWithLayout(content, opts) {
  opts = opts || {};
  let description = opts.description || 'Sofware Development by Federico Rodriguez';
  let title = opts.title || 'Software Development | Federico Rodriguez';
  let stylesheets = ['/index.css'];
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
    <title>
      ${title}
    </title>
    <meta name="description" content="${description}">
    ${styleTags}
  </head>

  <body>
    ${content}
  </body>

</html>
`
  return ret;
}

