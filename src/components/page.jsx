import React from 'react';
import { Link } from "react-router-dom";

export class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const queryValues = this.parseQueryString(this.props.location.search);
        let categoryId = 1;
        let searchTerm = "";
        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        let categories = this.props.getSubCategories(categoryId);
        const selectedCategory = this.props.categories.find((category) => {
            return category.id === categoryId
        });
        if (categories.length === 0) {

            categories.push(selectedCategory);
        }
        return (
            <React.Fragment>
                <table>
                    <thead>
                        <th>
                            <h2>{selectedCategory.title}</h2>
                        </th>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => {
                            const items = this.props.getItemsInCategory(category.id).filter((item) => {
                                return searchTerm === "" || this.props.searchArray(item.tags, searchTerm);
                            }).slice(0, 3);
                            return (
                                <React.Fragment key={index}>
                                    {
                                        categories.length > 1 ?
                                            <tr>
                                                <td>
                                                    {category.title} - {items.length} files
                                            </td>
                                                <td align="right">
                                                    <Link to={`/?categoryId=${category.id}`}>See All</Link>
                                                </td>
                                            </tr> : ''
                                    }
                                    <tr>
                                        <td></td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    {items.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    {item.title}
                                                                </td>
                                                                <td>
                                                                    {this.formatFilesize(item.fileSize)} MB
                                                                </td>
                                                                <td>
                                                                    {this.props.getPathToItem(item.id)}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}</tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            )
                        })
                        }</tbody>
                </table>
            </React.Fragment>
        );
    }
    parseQueryString = (queryString) => {
        const values = {};
        const elements = queryString.replace('?', '').split("&");
        const l = elements.length;
        for (let i = 0; i < l; i++) {
            const element = elements[i];
            const pair = element.split('=');
            const key = pair[0];
            let value = pair[1];
            if (!isNaN(parseInt(value))) {
                value = parseInt(value);
            }
            values[key] = value;
        }
        return values;
    }

    formatFilesize(bytes) {
        const size = Math.round(bytes / Math.pow(1024, 2));
        if (size < 1) {
            return '< 1';
        } else {
            return size;
        }
    }
}