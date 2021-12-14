const	chokidar = require('chokidar');
const path = require('path');
const { exec } = require('child_process');

console.log("Started watching /src directory...");

const stop = chokidar.watch('./src').on('change', filepath => {
		console.log(`Detected change in ${filepath}.`);
    let command 
    if(path.extname(filepath) === '.css') {
      // If it's a css file just process that file (because Post CSS is super slow)
      command = './build_css_file.sh ' + filepath;
    } else {
      // Else we just build all pages again
      command = 'node build_pages.js';
    }

    let now = new Date();
		exec(command, (error, stdout, stderr) => {
			if(error) {
				console.log(`error: ${error.message}`);
			}
			if(stderr) {
				console.log(`srderr: ${stderr}`);
			}

			console.log(stdout);
      let after = new Date();
      console.log(`ran ${command} in ${(after - now) / 1000} seconds`);
		})
})
