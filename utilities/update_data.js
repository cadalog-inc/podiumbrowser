const axios = require('axios');
const fs = require('fs');

class Files {
    constructor() {
        this.files = [];
        this.categories = [{
            "id": 1,
            "title": "Home",
            "parentId": 0
        }];
        this.relationships = [];
    }
    main() {
        this.getCategories();
        this.getFiles('https://v3.pdm-plants-textures.com/api/files?limit=1000&page=', 1);
    }

    getCategories(categories) {
        axios.get(`https://v3.pdm-plants-textures.com/api/categories`)
            .then((response) => {
                const categories = response.data.data;

                const l = categories.length;
                for (let c = 0; c < l; c++) {
                    const category = categories[c];
                    if (category.fileCount !== 0 && category.parents.length !== 0) {
                        this.categories.push({
                            id: category.id,
                            title: category.title,
                            parentId: category.parents[0].parent_id
                        });
                    }
                }

                fs.writeFile(`./utilities/json/categories.json`, JSON.stringify(this.categories), (err) => {
                    if (err) return console.log(err);
                    console.log(this.categories.length);
                    console.log("complete");
                });
            })
    }

    getFiles(path, page) {
        axios.get(`${path}${page}`)
            .then((response) => {
                const files = response.data.data;

                const l = files.length;
                for (let f = 0; f < l; f++) {
                    const file = files[f];

                    this.files.push({
                        dateUploaded: file.date_uploaded,
                        filename: file.filename,
                        fileSize: file.file_size,
                        id: file.id,
                        imageFile: file.image_file,
                        hash: file.hash,
                        tags: file.tags,
                        title: file.title,
                        type: file.type
                    });
                }

                console.log(response.data.current_page);
                if (response.data.next_page_url) {
                    this.getFiles(path, page + 1);
                } else {
                    fs.writeFile(`./utilities/json/files.json`, JSON.stringify(this.files), (err) => {
                        if (err) return console.log(err);
                        console.log(this.files.length);
                        console.log("complete");
                    });
                }
            });
    }
}

new Files().main();