import React from 'react';

export class SideBar extends React.Component {
    render() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        let searchTerm = "";
        let onlyFree = false;
        let onlyRecent = false;
        let pageSize = 8;
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
                <hr />
                {
                    selectedCategory.id !== 1 && selectedCategory.id !== 217 && selectedCategory.id !== 218 ? <React.Fragment>
                        <ul>
                            {
                                this.renderPath(this.props.calculatePathToCategory(categoryId), 0, categories, searchTerm, onlyFree, onlyRecent)
                            }
                        </ul>
                        <hr />
                    </React.Fragment> : null
                }
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked={onlyFree} onChange={(e) => {
                        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${searchTerm}&pageIndex=0&pageSize=${pageSize}&onlyFree=${e.target.checked}&onlyRecent=${onlyRecent}`);
                    }} id="freeChecked" />
                    <label className="form-check-label" htmlFor="freeChecked">
                        Show only free files
                    </label>
                </div>
                <div className="form-check" hidden={selectedCategory.id === 1} >
                    <input className="form-check-input" type="checkbox" onChange={(e) => {
                        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${searchTerm}&pageIndex=0&pageSize=${pageSize}&onlyFree=${onlyFree}&onlyRecent=${e.target.checked}`);
                    }} value="" id="recentChecked" />
                    <label className="form-check-label" htmlFor="recentChecked">
                        Show only recent files
                    </label>
                </div>
                <hr />
                {

                    this.props.user.key !== '' ? <React.Fragment>
                        <ul>
                            {
                                homeCategories.map((category, index) => {
                                    return (
                                        <li key={index}>
                                            <span style={category.id === selectedCategory.id ? { fontWeight: "bold", cursor: "pointer" } : { cursor: "pointer" }} onClick={() => this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent)}>
                                                {category.title}
                                            </span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <hr />
                    </React.Fragment> : null
                }
                <ul>
                    {
                        primaryCategories.map((category, index) => {
                            return category.title !== 'HDR' ? (
                                <li key={index}>
                                    <span style={category.id === selectedCategory.id ? { fontWeight: "bold", cursor: "pointer" } : { cursor: "pointer" }} onClick={() => this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent)}>
                                        {category.title}
                                    </span>
                                </li>
                            ) : null
                        })
                    }
                </ul>
            </React.Fragment>
        );
    }

    handleCategoryChange = (value, searchTerm, onlyFree, onlyRecent) => {
        this.props.history.push(`/?categoryId=${value}&searchTerm=${searchTerm}&pageIndex=0&pageSize=8&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}`);
    }

    renderPath = (path, index, categories, searchTerm, onlyFree, onlyRecent) => {
        const category = path[index];
        return category ? index < path.length - 1 ? (
            <li>
                <span style={{ cursor: "pointer" }} onClick={() => this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent)}>
                    {category.title}
                </span>
                <ul>
                    {this.renderPath(path, index + 1, categories, searchTerm, onlyFree, onlyRecent)}
                </ul>
            </li>
        ) : (
                <li>
                    <span style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent)}>
                        {category.title}
                    </span>
                    <ul>
                        {
                            categories.length > 1 ? (
                                categories.map((item, index) => {
                                    return item.title !== 'HDR' ? (
                                        <li key={index}>
                                            <span style={{ cursor: "pointer" }} onClick={() => this.handleCategoryChange(item.id, searchTerm, onlyFree, onlyRecent)}>
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