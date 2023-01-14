const os = require('os');

let free_memory = os.freemem();
let user = os.userInfo();

// console.log(free_memory);
console.log(user);
