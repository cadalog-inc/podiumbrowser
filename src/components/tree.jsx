import React from 'react';

export class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
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

    render() {
        return (
            <React.Fragment>
               
            </React.Fragment>
        );
    }
}