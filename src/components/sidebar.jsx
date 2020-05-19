import React from 'react';

export class SideBar extends React.Component {
    render() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        let searchTerm = "";
        let onlyFree = false;
        let onlyRecent = false;
        let pageSize = 6;
        let sortBy = "File Name (A to Z)";

        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        if (queryValues.pageSize && queryValues.pageSize !== "" && queryValues.pageSize >= 8) {
            pageSize = queryValues.pageSize;
        }
        if (queryValues.onlyFree !== undefined && queryValues.onlyFree !== "") {
            onlyFree = queryValues.onlyFree === 'true' ? true : false;
        }
        if (queryValues.onlyRecent !== undefined && queryValues.onlyRecent !== "") {
            onlyRecent = queryValues.onlyRecent === 'true' ? true : false;
        }
        if (queryValues.sortBy !== undefined && queryValues.sortBy !== "") {
            sortBy = queryValues.sortBy;
        }

        const selectedCategory = this.props.categories.find((category) => {
            return category.id === categoryId
        });
        let categories = this.props.getSubCategories(categoryId);
        if (categoryId === 1 || categories.length === 0) {
            categories = [selectedCategory];
        }
        const primaryCategories = this.props.getSubCategories(1);

        const homeCategories = this.props.categories.filter((category) => {
            return category.id === 217 || category.id === 218;
        });

        return (
            <React.Fragment>
                <div style={{
                    backgroundColor: "#f1f1f1",
                    margin: 10,
                    padding: 0,
                    border: "1px solid #e5e5e5"
                }}>
                    {
                        selectedCategory.id !== 1 && selectedCategory.id !== 217 && selectedCategory.id !== 218 ? <React.Fragment>
                            <ul>
                                {
                                    this.renderPath(this.props.calculatePathToCategory(categoryId), 0, categories, searchTerm, onlyFree, onlyRecent, sortBy)
                                }
                            </ul>
                        </React.Fragment> : null
                    }
                    <hr style={{width: "90%"}}/>
                    <div className="form-check" style={{margin: 10}}>
                        <input className="form-check-input" type="checkbox" defaultChecked={onlyFree} onChange={(e) => {
                            this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${searchTerm}&pageIndex=0&pageSize=${pageSize}&onlyFree=${e.target.checked}&onlyRecent=${onlyRecent}&sortBy=${sortBy}`);
                        }} id="freeChecked" />
                        <label className="form-check-label" htmlFor="freeChecked">
                            Show only free files
                        </label>
                    </div>
                    <hr style={{width: "90%"}}/>
                    {

                        this.props.user.key !== '' ? <React.Fragment>
                            <ul>
                                {
                                    homeCategories.map((category, index) => {
                                        return (
                                            <li key={index} style={{
                                                padding: 0,
                                                margin: 5
                                            }}>
                                                <button style={{
                                                    width: "100%",
                                                    backgroundColor: "#f7f5f5",
                                                    border: "1px solid #e5e5e5",
                                                    textAlign: "left"
                                                }} onClick={() => this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent, sortBy)}>
                                                    {category.title}
                                                </button>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <hr style={{width: "90%"}} />
                        </React.Fragment> : null
                    }
                    <ul>
                        {
                            primaryCategories.map((category, index) => {
                                return category.title !== 'HDR' ? (
                                    <li key={index} style={{
                                        padding: 0,
                                        margin: 2
                                    }}>
                                        <button style={{
                                            width: "100%",
                                            backgroundColor: "#f7f5f5",
                                            border: "1px solid #e5e5e5",
                                            textAlign: "left"
                                        }} onClick={() => this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent, sortBy)}>
                                            {category.title}
                                        </button>
                                    </li>
                                ) : null
                            })
                        }
                    </ul>
                </div>
            </React.Fragment>
        );
    }

    handleCategoryChange = (value, searchTerm, onlyFree, onlyRecent, sortBy) => {
        this.props.history.push(`/?categoryId=${value}&searchTerm=${searchTerm}&pageIndex=0&pageSize=6&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}&sortBy=${sortBy}`);
    }

    renderPath = (path, index, categories, searchTerm, onlyFree, onlyRecent, sortBy) => {
        const category = path[index];
        return category ? index < path.length - 1 ? (
            <li>
                <span style={{ cursor: "pointer" }} onClick={() => this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent, sortBy)}>
                    {category.title}
                </span>
                <ul>
                    {this.renderPath(path, index + 1, categories, searchTerm, onlyFree, onlyRecent, sortBy)}
                </ul>
            </li>
        ) : (
                <li>
                    <span style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent, sortBy)}>
                        {category.title}
                    </span>
                    <ul>
                        {
                            categories.length > 1 ? (
                                categories.map((item, index) => {
                                    return item.title !== 'HDR' ? (
                                        <li key={index}>
                                            <span style={{ cursor: "pointer" }} onClick={() => this.handleCategoryChange(item.id, searchTerm, onlyFree, onlyRecent, sortBy)}>
                                                {item.title}
                                            </span>
                                        </li>
                                    ) : null
                                })
                            ) : null
                        }
                    </ul>
                </li>
            ) : null
    }
}