const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, "secret-folder");

fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => { //files from folder
    if (err) console.log(err);
    else {
        files.forEach(file => {
            fs.stat(path.join(pathToFolder, file.name), (err, st) => { //stats of each file
                if (err) console.log(err);
                else if (file.isFile() === true) {
                    console.log(file.name.split('.')[0] + ' - ' + path.extname(file.name).slice(1) + ' - ' + st.size / 1024 + 'kb');
                }
            });
        })
    }
});