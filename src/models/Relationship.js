class Relationship {
    constructor(id, itemId, categoryId) {
        this.id = id;
        this.itemId = itemId;
        this.categoryId = categoryId;
    }

    static fromArray(objs) {
        const relationships = [];    
        objs.forEach(obj => {
            relationships.push(new Relationship(obj.id, obj.itemId, obj.categoryId));
        });
        return relationships;
    }
}

export default Relationship;