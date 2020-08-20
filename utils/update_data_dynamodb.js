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

class Item {
    constructor(
        fileExt,
        fileSize,
        id,
        thumbnailExt,
        hash,
        tags = [],
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

const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-west-2",
    endpoint: 'https://dynamodb.us-west-2.amazonaws.com/',
    // accessKeyId default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    accessKeyId: "AKIAZKYMH4JCPQTQPQ4J",
    // secretAccessKey default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    secretAccessKey: "+/M1uIc1EUN42miGL+6BCLbujs7wYudoZHimcV7P"
});
const docClient = new AWS.DynamoDB.DocumentClient();

class Update {
    constructor() {
        this.categories = [];
        this.items = [];
        this.relationships = [];
    }

    main() {
        this.getCategories();
    }

    getCategories() {
        console.log('get categories:');
        const params = {
            TableName: "Categories"
        }
        docClient.scan(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                this.categories = Category.fromArray(data.Items);
                this.getItems({ action: 'start' });
            }
        });
    }

    getItems(options) {
        console.log('get items:');
        const params = {
            TableName: "Items"
        }
        if (options.hasOwnProperty('lastEvaluatedKey')) {
            params['ExclusiveStartKey'] = options.lastEvaluatedKey;
        }
        docClient.scan(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let items = [];
                if (options.action === 'start') {
                    items = Item.fromArray(data.Items);
                } else if (options.action === 'continue') {
                    items = [...this.items, ...Item.fromArray(data.Items)];
                }
                if (data.hasOwnProperty('LastEvaluatedKey')) {
                    this.items = items;
                    this.getItems({ action: 'continue', lastEvaluatedKey: data.LastEvaluatedKey });
                } else {
                    this.items = items;
                    this.getRelationships({ action: 'start' });
                }
            }
        });
    }

    getRelationships(options) {
        console.log('get relationships:');
        const params = {
            TableName: "Relationships"
        }
        if (options.hasOwnProperty('lastEvaluatedKey')) {
            params['ExclusiveStartKey'] = options.lastEvaluatedKey;
        }
        docClient.scan(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let relationships = [];
                if (options.action === 'start') {
                    relationships = Relationship.fromArray(data.Items);
                } else if (options.action === 'continue') {
                    relationships = [...this.relationships, ...Relationship.fromArray(data.Items)];
                }
                if (data.hasOwnProperty('LastEvaluatedKey')) {
                    this.relationships = relationships;
                    this.getRelationships({ action: 'continue', lastEvaluatedKey: data.LastEvaluatedKey });
                } else {
                    this.relationships = relationships;
                    console.log(JSON.stringify({
                        categories: this.categories,
                        items: this.items,
                        relationships: this.relationships
                    }));
                }
            }
        });
    }
}

new Update().main();