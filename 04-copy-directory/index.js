const fs = require('fs');
const path = require('path');

function copyDir() {
    fs.readdir(__dirname, { withFileTypes: true }, (err, files) => { //files from folder
        if (err) console.log(err);
        else {
            files.forEach(file => {
                if (file.isDirectory() && file.name === 'files') {
                    const originalPath = path.join(__dirname, file.name);
                    const newPath = path.join(__dirname, file.name + '-copy');
    
                    fs.promises.mkdir(newPath, { recursive: true }); //create new folder
                    fs.readdir(originalPath, { withFileTypes: true }, (err, files) => { //files from new folder
                        if (err) console.log(err);
                        else {
                            files.forEach(file => {
                                fs.promises.copyFile(path.join(originalPath, file.name), path.join(newPath, file.name));
                            })
                        }
                    });
                }
            })
        }
    });
}

copyDir();