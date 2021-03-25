class Query {
    constructor(
        categoryId = 1, 
        searchTerm = "",
        onlyFree = false,
        onlyRecent = false,
        pageIndex = 0,
        pageSize = 25,
        sortBy = "File Name (A to Z)"
    ) {
        this.categoryId = categoryId;
        this.searchTerm = searchTerm;
        this.onlyFree = onlyFree;
        this.onlyRecent = onlyRecent;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.sortBy = sortBy;
    }

    static fromQueryString(queryString) {
        const query = new Query();
        const queryValues = Query.parseQueryString(queryString);

        for(let key of Object.keys(query)) {
            if (queryValues[key] !== null && queryValues[key] !== undefined && queryValues[key] !== '') {
                query[key] = queryValues[key];
            }
        }

        return query;
    }

    static parseQueryString(queryString) {
        const values = {};
        const elements = decodeURIComponent(queryString).replace('?', '').split("&");
        elements.forEach(element => {
            let [key, value] = element.split('=');
            if(!isNaN(parseInt(value))) {
                if(key !== 'searchTerm') {
                    value = parseInt(value);
                }
            } else if(value === 'true') {
                value = true;
            } else if(value === 'false') {
                value = false;
            }
            values[key] = value;
        });
        return values;
    }
}

export default Query;