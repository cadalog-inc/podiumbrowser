import React from 'react';
import getDataSourceInfo from '../services/itemsSearchFilterDatasource';

export class Search extends React.Component {
    state = {
        datasource: getDataSourceInfo(),
        query: ''
    }

    getResults = () => {
        return this.state.datasource.filter(m => m.item.indexOf(this.state.query) === 0);
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        this.setState({
            query: value
        });
    }

    render() {
        const results = this.state.query !== "" ? this.getResults() : [];
        return (
            <React.Fragment>
                <form>
                    <input
                        placeholder="Search for..."
                        onChange={this.handleInputChange}
                    />
                    <p><b>{this.state.query}</b></p>

                    <p>{results.length}</p>
                    <p></p>
                    {results.map(m => (
                        <p key={m.itemid}>{m.item}</p>
                    ))}
                </form>
            </React.Fragment>
        )
    }
}

export default Search