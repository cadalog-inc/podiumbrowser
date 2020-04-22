import React from 'react';

export class SideBar extends React.Component {
    render() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        let categories = this.props.getSubCategories(categoryId);
        if (categoryId === 1) {
            categories = categories.filter((category) => {
                return category.id === 217 || category.id === 218;
            });
        }
        const selectedCategory = this.props.categories.find((category) => {
            return category.id === categoryId
        });
        if (categories.length === 0) {

            categories.push(selectedCategory);
        }
        const primaryCategories = this.props.getSubCategories(1);
        return (
            <React.Fragment>
                <hr />
                <ul>
                    {
                        this.renderPath(this.props.calculatePathToCategory(categoryId), 0, categories)
                    }
                </ul>
                <hr />
                <div className="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="freeChecked" />
                    <label class="form-check-label" for="freeChecked">
                        Show only free files
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="recentChecked" disabled={selectedCategory.id === 1} />
                    <label class="form-check-label" for="recentChecked">
                        Show only recent files
                    </label>
                </div>
                <hr />
                <ul>
                    {
                        primaryCategories.map((category, index) => {
                            return category.title !== 'HDR' ? (
                                <li key={index}>
                                    <span style={category.id === selectedCategory.id ? { fontWeight: "bold", cursor: "pointer" } : { cursor: "pointer" }} onClick={() => this.handleCategoryChange(category.id)}>
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

    handleCategoryChange = (value) => {
        this.props.history.push(`/?categoryId=${value}&searchTerm=&pageIndex=0&pageSize=5`);
    }

    renderPath = (path, index, categories) => {
        const category = path[index];
        return category ? index < path.length - 1 ? (
            <li>
                <span style={{ cursor: "pointer" }} onClick={() => this.handleCategoryChange(category.id)}>
                    {category.title}
                </span>
                <ul>
                    {this.renderPath(path, index + 1, categories)}
                </ul>
            </li>
        ) : (
                <li>
                    <span style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => this.handleCategoryChange(category.id)}>
                        {category.title}
                    </span>
                    <ul>
                        {
                            categories.length > 1 ? (
                                categories.map((item, index) => {
                                    return item.title !== 'HDR' ? (
                                        <li key={index}>
                                            <span style={{ cursor: "pointer" }} onClick={() => this.handleCategoryChange(item.id)}>
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