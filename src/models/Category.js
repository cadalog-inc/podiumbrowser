class Category {
    constructor(id, title, parentId) {
        this.id = id;
        this.title = title;
        this.parentId = parentId;
    }

    static fromArray(objs) {
        const categories = [];
        objs.forEach(obj => {
            categories.push(new Category(obj.id, obj.title, obj.parentId));
        });
        return categories;
    }
}

export default Category;