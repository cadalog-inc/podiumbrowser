import React from 'react';

export class Path extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ul>
                    {
                        this.renderPath(
                            this.calculatePathToCategory(this.props.query.categoryId),
                            0,
                            this.props.subCategories
                        )
                    }
                </ul>
            </React.Fragment>
        );
    }

    renderPath = (path, index, categories) => {
        const category = path[index];
        return category ? index < path.length - 1 ? (
            <li>
                <span style={{ cursor: "pointer" }} onClick={() => this.props.handleCategoryChange(category.id)}>
                    {category.title}
                </span>
                <ul>
                    {this.renderPath(path, index + 1, categories)}
                </ul>
            </li>
        ) : (
                <li>
                    <span style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => this.props.handleCategoryChange(category.id)}>
                        {category.title}
                    </span>
                    <ul>
                        {
                            categories.length > 1 ? (
                                categories.map((item, index) => {
                                    return (this.props.useHDR || item.title !== 'HDR') ? (
                                        <li key={index}>
                                            <span style={{ cursor: "pointer" }} onClick={() => this.props.handleCategoryChange(item.id)}>
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

    // TODO: rework to handle deeper category tree
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