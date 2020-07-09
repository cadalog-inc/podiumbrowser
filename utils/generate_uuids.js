const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
let value = "";
for(let i=0; i<20000; i++) {
    value += uuidv4() + "\r\n";
}
fs.writeFile(`./utils/pbs_uuids_20k_05_15_2020.csv`, value, function (err) {
    if (err) return console.log(err);
    console.log("complete");
});