const axios = require('axios');
const fs = require('fs');

class Files {
    constructor() {
        this.items = [];
        this.homeCategory = {
            id: 1,
            title: "Home",
            parentId: 0
        };
        this.updateDir = "src/data";
        this.categories = [
            this.homeCategory,
        ];
        this.relationships = [];
    }
    main() {
        this.getCategories();
        this.getItems('https://v3.pdm-plants-textures.com/api/files?limit=1000&page=', 1);
    }

    getCategories(categories) {
        axios.get(`https://v3.pdm-plants-textures.com/api/categories`)
            .then((response) => {
                const categories = response.data.data;

                const l = categories.length;
                for (let c = 0; c < l; c++) {
                    const category = categories[c];
                    if (category.fileCount !== 0 && category.parents.length !== 0) {
                        const parentId = category.parents[0].parent_id;
                        this.categories.push({
                            id: category.id,
                            title: category.title,
                            parentId: parentId === 0 ? this.homeCategory.id : parentId
                        });
                    }
                }

                this.categories.push({
                    id: 217,
                    title: "My Favorites",
                    parentId: this.homeCategory.id
                });
                this.categories.push({
                    id: 218,
                    title: "Recent Downloaded",
                    parentId: this.homeCategory.id
                });

                fs.writeFile(`./${this.updateDir}/categories.json`, JSON.stringify(this.categories), (err) => {
                    if (err) return console.log(err);
                    console.log(this.categories.length);
                    console.log("complete");
                });
            })
    }

    getItems(path, page) {
        axios.get(`${path}${page}`)
            .then((response) => {
                const files = response.data.data;

                const l = files.length;
                for (let f = 0; f < l; f++) {
                    const file = files[f];
                    this.addRelationships(file);
                    this.items.push({
                        filename: file.filename,
                        fileSize: file.file_size,
                        id: file.id,
                        imageFile: file.image_file,
                        hash: file.hash,
                        tags: file.tags,
                        title: file.title,
                        type: file.type,
                        uploadDate: file.date_uploaded
                    });
                }

                console.log(response.data.current_page);
                if (response.data.next_page_url) {
                    this.getItems(path, page + 1);
                } else {
                    fs.writeFile(`./${this.updateDir}/items.json`, JSON.stringify(this.items), (err) => {
                        if (err) return console.log(err);
                        console.log(`${this.items.length} items`);
                        console.log("complete");
                    });
                    fs.writeFile(`./${this.updateDir}/relationships.json`, JSON.stringify(this.relationships), (err) => {
                        if (err) return console.log(err);
                        console.log(`${this.relationships.length} relationships`);
                        console.log("complete");
                    });
                }
            });
    }

    addRelationships(file) {
        const l = file.category.length;
        for (let c = 0; c < l; c++) {
            const parentId = file.category[c].id;
            const category = this.categories.find((c) => {
                return c.id === parentId;
            });
            if(category === undefined) {
                console.log(`Parent category id ${parentId} not found`);
            } else {
                const id = this.relationships.length + 1;
                this.relationships.push({
                    id: id,
                    itemId: file.id,
                    categoryId: category.id
                });
            }
        }
    }
}

new Files().main();