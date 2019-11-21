import React from 'react';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const primaryCategories = this.props.categories.categories.length > 0 ? this.props.categories.categories : [];

        return (
            <React.Fragment>
                <div align="center">
                    {/* category dropdown list*/}
                    <select defaultValue={""} onChange={this.props.handleCategoryChange}>
                        <option value="">Home</option>
                        {
                            primaryCategories.map((category, index) => {
                                return (
                                    <option value={category.title} key={index}>{category.title}</option>
                                )
                            })
                        }
                    </select>
                    <input className="form-control mr-sm-2" type="text" placeholder="Search" onChange={this.props.handleKeySearchChange}></input>
                </div>
            </React.Fragment>
        );
    }
}