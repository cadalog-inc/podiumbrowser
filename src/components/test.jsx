import React from 'react';

export class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let categories = this.props.getSubCategories(this.props.selectedCategoryId);
        if (categories.length === 0) {
            const category = this.props.categories.find((category) => {
                return category.id === this.props.selectedCategoryId
            });
            categories.push(category);
        }
        return (
            <React.Fragment>
                <table>
                    <tbody>
                        {categories.map((category, index) => {
                            const items = this.props.getItemsInCategory(category.id).filter((item) => {
                                return this.props.searchTerm === "" || this.props.searchArray(item.tags, this.props.searchTerm);
                            }).slice(0, 3);
                            return (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td>
                                            {category.title}
                                        </td>
                                        <td></td>
                                    </tr>
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
}