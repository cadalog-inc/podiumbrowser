class Item {
    constructor(filename, fileSize, id, imageFile, hash, tags=[], title, type, uploadDate) {
        this.filename = filename;
        this.fileSize = fileSize;
        this.id = id;
        this.imageFile = imageFile;
        this.hash = hash;
        this.tags = tags;
        this.title = title;
        this.type = type;
        this.uploadDate = uploadDate;
    }

    static fromArray(objs) {
        const items = [];
        objs.forEach(obj => {
            items.push(new Item(obj.filename, obj.fileSize, obj.id, obj.imageFile, obj.hash, obj.tags, obj.title, obj.type, obj.uploadDate));
        });
        return items;
    }
}

export default Item;