const fs = require('fs');
const path = require('path');

function copyDir(originalPath, newPath) {
    fs.promises.mkdir(newPath, { recursive: true }); //create new folder
    fs.readdir(originalPath, { withFileTypes: true }, (err, files) => { //files from new folder
        if (err) console.log(err);
        else {
            files.forEach(file => {
                if(file.isDirectory()) copyDir(path.join(originalPath, file.name), path.join(newPath, file.name));
                if(file.isFile()) fs.promises.copyFile(path.join(originalPath, file.name), path.join(newPath, file.name)); 
            })
        }
    });
}

function mergeStyles(pathToStyleFolder, pathToStyleFile) {
    const writer = fs.createWriteStream(pathToStyleFile, 'utf-8');

    fs.readdir(pathToStyleFolder, { withFileTypes: true }, (err, files) => { //files from style folder
        if (err) console.log(err);
        else {
            files.forEach(file => {
                if (file.isFile() && path.extname(file.name) === '.css') {
                    const reader = fs.createReadStream(path.join(pathToStyleFolder, file.name), 'utf-8'); //read each file
                    reader.on('data', chunk => {
                        writer.write(chunk.toString()); //write to .css
                    });
                }
            })
        }
    });
}

function promiseReadFromFile(pathToFile) {
    return new Promise((resolve, reject) => {
        let reader = fs.createReadStream(pathToFile, 'utf-8');
        let res = "";
        reader.on('data', chunk => {
            res += chunk.toString();
        });
        reader.on('end', () => {
            resolve(res);
        });
        reader.on('error', (error) => {
            reject(error);
        });
    });
}

function createObject(pathToFolderData, ){
    return new Promise((resolve, reject) => {
        let obj = new Object();
        fs.readdir(pathToFolderData, { withFileTypes: true }, (err, files) => { //files from folder
            if (err) console.log(err);
            else {
                files.forEach(file => {
                    if (file.isFile() && path.extname(file.name) === '.html') {
                        const reader = fs.createReadStream(path.join(pathToFolderData, file.name), 'utf-8');
                        reader.on('data', chunk => {
                            if(!(file.name.split('.')[0] in obj)) obj[file.name.split('.')[0]] = chunk.toString();
                        });
                        reader.on('end', () => {
                            resolve(obj);
                        });
                        reader.on('error', (error) => {
                            reject(error);
                        });
                    }
                })
            }
        });
    });
}

async function changeHtml(pathToFile, pathToFolderData, pathToFolder) {
    let dataFromFile = await promiseReadFromFile(pathToFile);
    let objProm = await createObject(pathToFolderData);
    for(key in objProm){
        dataFromFile = dataFromFile.replace('{{' + key + '}}', objProm[key]);
    }
    const writer = fs.createWriteStream(path.join(pathToFolder, 'index.html'), 'utf-8');
    writer.write(dataFromFile);
}

function init() {
    const pathToHtml = path.join(__dirname, 'template.html');
    const pathToFolderComp = path.join(__dirname, 'components');
    const pathToFolder = path.join(__dirname, 'project-dist');
    const pathToFolderAssets = path.join(__dirname, 'assets');
    const pathToStyleFolder = path.join(__dirname, 'styles');
    const pathToStyleFile = path.join(__dirname, path.join('project-dist', 'style.css'));

    fs.promises.mkdir(pathToFolder, { recursive: true }); //create new folder

    copyDir(pathToFolderAssets, path.join(pathToFolder, 'assets'));
    mergeStyles(pathToStyleFolder, pathToStyleFile);
    changeHtml(pathToHtml, pathToFolderComp, pathToFolder);
}

init();