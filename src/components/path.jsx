import React from 'react';

export class Path extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ul>
                    {
                        this.renderPath(
                            this.calculatePathToCategory(this.props.categoryId), 
                            0, 
                            this.props.subCategories, 
                            this.props.searchTerm, 
                            this.props.onlyFree, 
                            this.props.onlyRecent, 
                            this.props.sortBy
                        )
                    }
                </ul>
            </React.Fragment>
        );
    }

    renderPath = (path, index, categories, searchTerm, onlyFree, onlyRecent, sortBy) => {
        const category = path[index];
        return category ? index < path.length - 1 ? (
            <li>
                <span style={{ cursor: "pointer" }} onClick={() => this.props.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent, sortBy)}>
                    {category.title}
                </span>
                <ul>
                    {this.renderPath(path, index + 1, categories, searchTerm, onlyFree, onlyRecent, sortBy)}
                </ul>
            </li>
        ) : (
                <li>
                    <span style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => this.props.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent, sortBy)}>
                        {category.title}
                    </span>
                    <ul>
                        {
                            categories.length > 1 ? (
                                categories.map((item, index) => {
                                    return item.title !== 'HDR' ? (
                                        <li key={index}>
                                            <span style={{ cursor: "pointer" }} onClick={() => this.props.handleCategoryChange(item.id, searchTerm, onlyFree, onlyRecent, sortBy)}>
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

    calculatePathToCategory = (categoryId) => {
        const path = [];
        const selectedCategory = this.props.categories.find((category) => {
            return category.id === categoryId
        });
        if (selectedCategory.id === this.props.getHomeCategory()) {
            path.push(selectedCategory);
        } else {
            const parentCategory = this.props.categories.find((category) => {
                return category.id === selectedCategory.parentId
            });
            if (parentCategory.id === this.props.getHomeCategory()) {
                path.push(parentCategory);
                path.push(selectedCategory);
            } else {
                const parentParentCategory = this.props.categories.find((category) => {
                    return category.id === parentCategory.parentId
                });
                path.push(parentParentCategory);
                path.push(parentCategory);
                path.push(selectedCategory);
            }
        }
        return path;
    }
}