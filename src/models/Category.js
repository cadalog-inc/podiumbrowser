class Category {
    constructor(id, title, parentId, primaryIndex) {
        this.id = id;
        this.title = title;
        this.parentId = parentId;
        this.primaryIndex = primaryIndex;
    }

    static fromArray(objs) {
        const categories = [];
        objs.forEach(obj => {
            categories.push(new Category(obj.id, obj.title, obj.parentId, obj.primaryIndex));
        });
        return categories;
    }
}

export default Category;