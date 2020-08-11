class Item {
    constructor(
        fileExt, 
        fileSize, 
        id, 
        thumbnailExt, 
        hash, 
        tags=[], 
        title, 
        isFree, 
        uploadDate
    ) {
        this.fileExt = fileExt;
        this.fileSize = fileSize;
        this.id = id;
        this.thumbnailExt = thumbnailExt;
        this.hash = hash;
        this.tags = tags;
        this.title = title;
        this.isFree = isFree;
        this.uploadDate = uploadDate;
    }

    static fromArray(objs) {
        const items = [];
        objs.forEach(obj => {
            items.push(new Item(obj.fileExt, obj.fileSize, obj.id, obj.thumbnailExt, obj.hash, obj.tags, obj.title, obj.isFree, obj.uploadDate));
        });
        return items;
    }
}

export default Item;