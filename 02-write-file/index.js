const fs = require('fs');
const path = require('path');
const readline = require('readline');

const pathToFile = path.join(__dirname, "text.txt");
const writer = fs.createWriteStream(pathToFile, 'utf-8');
const rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt(`Hello!\nWrite anything to save into text.txt\n`); //set hello statement
rl.prompt();
rl.on('line', (line) => {
    if (line === 'exit') {
        console.log(`\nInput is saved to ${pathToFile}`);
        rl.close();
    }
    writer.write(line + '\n');
});

rl.on('SIGINT', () => { //ctrl+c
    console.log(`\nInput is saved to ${pathToFile}`);
    rl.close();
});