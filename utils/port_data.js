const categories = require('./json/categories.json');
const items = require('./json/items.json');
const relationships = require('./json/relationships.json');
const primaryCategoryIds = [300, 305, 324, 6, 131, 9, 136, 116, 130, 144, 120, 122, 151, 114, 126, 154, 253, 258, 337, 420, 144, 174, 166, 414, 184];
const fs = require('fs');

class PortV3toV4 {
    constructor() {
        this.items = [];
        this.categories = [];
        this.relationships = [];
        this.updateDir = "src/data";
    }
    main() {
        const cl = categories.length;
        const pl = primaryCategoryIds.length;
        const il = items.length;
        const rl = relationships.length;

        // categories
        for (let c = 0; c < cl; c++) {
            const newId = c + 1;
            const category = categories[c];
            category.newId = newId;
            
            for (let c2 = 0; c2 < cl; c2++) {
                if (c2 !== c) {
                    const category2 = categories[c2];
                    if (category2.parentId === category.id) {
                        category2.newParentId = newId;
                    }
                }
            }

            for (let r = 0; r < rl; r++) {
                const relationship = relationships[r];
                if (relationship.categoryId === category.id) {
                    relationship.newCategoryId = newId;
                }
            }
        }

        // primary categories
        for (let c = 0; c < cl; c++) {
            const category = categories[c];
            let primaryIndex = -1;
            for(let p = 0; p < pl; p++) {
                const primaryCategoryId = primaryCategoryIds[p];
                if(category.id === primaryCategoryId) {
                    primaryIndex = p;
                    console.log(`p = ${p} pc = ${primaryCategoryId}`);
                    break;
                }
            }
            this.categories.push({
                id: category.newId,
                title: category.title,
                primaryIndex: primaryIndex,
                parentId: category.newId === 1 ? 0 : category.newParentId
            });
        }

        // items
        for (let i = 0; i < il; i++) {
            const newId = i + 1;
            const item = items[i];
            item.newId = newId;

            for (let r = 0; r < rl; r++) {
                const relationship = relationships[r];
                if (relationship.itemId === item.id) {
                    relationship.newItemId = newId;
                }
            }
        }

        for (let i = 0; i < il; i++) {
            const item = items[i];
            const filenameSplit = item.filename.split('.');
            const fileExt = filenameSplit[filenameSplit.length-1];
            const imageFileSplit = item.imageFile.split('.');
            const thumbnailExt = imageFileSplit[imageFileSplit.length-1];
            const isFree = item.type !== "paid";
            this.items.push({
                id: item.newId,
                hash: item.hash,
                title: item.title,
                tags: item.tags,
                isFree: isFree,
                fileExt: fileExt,
                thumbnailExt: thumbnailExt,
                fileSize: item.fileSize,
                uploadDate: item.uploadDate
            });
        }

        // relationships
        for (let r = 0; r < rl; r++) {
            const relationship = relationships[r];
            this.relationships.push({
                id: r+1,
                itemId: relationship.newItemId,
                categoryId: relationship.newCategoryId
            });
        }

        fs.writeFile(`./${this.updateDir}/categories.json`, JSON.stringify(this.categories.sort((a, b) => a.parentId > b.parentId ? 1 : a.id > b.id ? 1 : -1)), (err) => {
            if (err) return console.log(err);
            console.log(this.categories.length);
            console.log("complete");
        });

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
}

new PortV3toV4().main();