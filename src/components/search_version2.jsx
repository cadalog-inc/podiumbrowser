import React, { Component } from 'react';
import getDataSourceInfo, { renderSearchSuggestion } from '../services/itemsSearchFilterDatasource';
import Autocomplete from 'react-autocomplete';



export class Searchv2 extends Component {

    state = { val: '' };

    render() {
        return (
            <div className="autocomplete-wrapper">
                <h3>React Autocomplete Demo</h3>
                <Autocomplete
                    value={this.state.val}
                    items={getDataSourceInfo()}
                    getItemValue={item => item.title}
                    shouldItemRender={renderSearchSuggestion}
                    renderMenu={item => (
                        <div className="dropdown">
                            {item}
                        </div>
                    )}
                    renderItem={(item, isHighlighted) =>
                        <div className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                            {item.title}
                        </div>
                    }
                    onChange={(event, val) => this.setState({ val })}
                    onSelect={val => this.setState({ val })}
                />
            </div>
        );
    }
}

