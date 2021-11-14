const	chokidar = require('chokidar');
const { exec } = require('child_process');

console.log("Started watching /src directory...");

const stop = chokidar.watch('./src').on('change', path => {
		console.log(`Detected change in ${path}.`);
		exec('./build.sh', (error, stdout, stderr) => {
			if(error) {
				console.log(`error: ${error.message}`);
			}
			if(stderr) {
				console.log(`srderr: ${stderr}`);
			}

			console.log(stdout);
		})
})
