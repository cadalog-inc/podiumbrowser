import React from 'react';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategoryId: 1,
            searchTerm: ""
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
        const primaryCategories = this.props.categories.length > 0 ? this.props.categories : [];

        return (
            <React.Fragment>
                <table>
                    <tbody>
                        <tr>
                            <td key={categoryId}>
                                <select defaultValue={categoryId} onChange={this.handleCategoryChange}>
                                    {
                                        primaryCategories.map((category, index) => {
                                            return (
                                                <option value={category.id} key={index}>{category.title}</option>
                                            )
                                        })
                                    }
                                </select>
                            </td>
                            <td key={searchTerm}>
                                <input className="form-control mr-sm-2" type="text" defaultValue={searchTerm} placeholder="Search" style={{ width: 200, height: 30 }} onChange={this.handleSearchTermChange}></input>
                            </td>
                            <td>
                                <input type="button" onClick={this.handleOnSearchClick} value="Search" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        );
    }

    handleCategoryChange = (event) => {
        const value = event.target.value;

        this.setState({
            selectedCategoryId: value
        }, () => {
            this.props.history.push(`/?categoryId=${this.state.selectedCategoryId}&searchTerm=${this.state.searchTerm}`);
        });
    }

    handleSearchTermChange = (event) => {
        const value = event.target.value;
        this.setState({
            searchTerm: value
        });
    }

    handleOnSearchClick = (event) => {
        this.props.history.push(`/?categoryId=${this.state.selectedCategoryId}&searchTerm=${this.state.searchTerm}`);
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
}