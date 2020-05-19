const axios = require('axios');
const fs = require('fs');

axios.get('http://v3.pdm-plants-textures.com/filedata.json')
.then((response) => {
    fs.writeFile(`./utilities/filedata.json`, JSON.stringify(response.data.data), (err) => {
        if (err) return console.log(err);
        console.log("complete");
    });
});

axios.get('http://v3.pdm-plants-textures.com/filedatamin.json')
.then((response) => {
    fs.writeFile(`./utilities/filedatamin.json`, JSON.stringify(response.data.data), (err) => {
        if (err) return console.log(err);
        console.log("complete");
    });
});