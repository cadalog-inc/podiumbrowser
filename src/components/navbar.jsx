import React from 'react';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const primaryCategories = this.props.categories.length > 0 ? this.props.categories : [];

        return (
            <React.Fragment>
                <div align="center">
                    <form className="form-inline" action="/action_page.php">
                        {/* category dropdown list*/}
                        <select defaultValue={""} onChange={this.props.handleCategoryChange}>
                            {
                                primaryCategories.map((category, index) => {
                                    return (
                                        <option value={category.id} key={index}>{category.title}</option>
                                    )
                                })
                            }
                        </select>
                        <input className="form-control mr-sm-2" type="text" placeholder="Search" style={{ width: 200, height: 30 }} onChange={this.props.handleKeySearchChange}></input>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}