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
        const primaryCategories = this.props.categories.length > 0 ? this.props.categories : [];

        return (
            <React.Fragment>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <select defaultValue={""} onChange={this.handleCategoryChange}>
                                    {
                                        primaryCategories.map((category, index) => {
                                            return (
                                                <option value={category.id} key={index}>{category.title}</option>
                                            )
                                        })
                                    }
                                </select>
                            </td>
                            <td>
                                <input className="form-control mr-sm-2" type="text" placeholder="Search" style={{ width: 200, height: 30 }} onChange={this.handleSearchTermChange}></input>
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
}