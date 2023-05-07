const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, "text.txt");
reader = fs.createReadStream(pathToFile);
  
// Read and display the file data on console
reader.on('data', function (chunk) {
    console.log(chunk.toString());
});