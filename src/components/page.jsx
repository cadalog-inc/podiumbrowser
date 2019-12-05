import React from 'react';
import { Link } from "react-router-dom";

export class Page extends React.Component {
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
                        <tr>
                            <th>
                                <h2>{selectedCategory.title}</h2>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => {
                            const items = this.props.getItemsInCategory(category.id).filter((item) => {
                                return searchTerm === "" || this.props.searchArray(item.tags, searchTerm);
                            });
                            return (
                                <React.Fragment key={index}>
                                    {
                                        categories.length > 1 && items.length > 0 ?
                                            <tr>
                                                <td>
                                                    <h5>{category.title} - {items.length} files</h5>
                                                </td>
                                                <td align="right">
                                                    <Link to={`/?categoryId=${category.id}&searchTerm=${searchTerm}`}>See All</Link>
                                                </td>
                                            </tr> : null
                                    }
                                    <tr>
                                        <td></td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    {items.slice(0, 5).map((item, index) => {
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