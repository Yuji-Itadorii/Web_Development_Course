const path = require('path');

let pathObject = path.parse(__filename);

console.log(pathObject);
console.log(pathObject.name);