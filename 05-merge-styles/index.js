const fs = require('fs');
const path = require('path');

const pathToStyleFolder = path.join(__dirname, 'styles');
const pathToStyleFile = path.join(__dirname, path.join('project-dist', 'bundle.css'));
const writer = fs.createWriteStream(pathToStyleFile, 'utf-8');

fs.readdir(pathToStyleFolder, { withFileTypes: true }, (err, files) => { //files from style folder
    if (err) console.log(err);
    else {
        files.forEach(file => {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const reader = fs.createReadStream(path.join(pathToStyleFolder, file.name), 'utf-8'); //read each file
                reader.on('data', chunk => {
                    writer.write(chunk.toString()); //write to bundle.css
                });
            }
        })
    }
});