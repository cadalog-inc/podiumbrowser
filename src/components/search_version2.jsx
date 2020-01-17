import React from 'react';
import { MoviesData, renderMovieTitle, getDataSourceInfo, renderSearchSuggestion } from '../services/itemsSearchFilterDatasource';
import Autocomplete from 'react-autocomplete';
//import './App.css';

export class Searchv2 extends React.Component {

    state = { val: '' };

    render() {
        return (
            <React.Fragment>
                <div className="autocomplete-wrapper">
                    <h5>React Autocomplete Demo</h5>
                    <Autocomplete
                        value={this.state.val}
                        items={getDataSourceInfo()}
                        getItemValue={item => item.item}
                        shouldItemRender={renderSearchSuggestion}
                        renderMenu={item => (
                            <div className="dropdown">
                                {item}
                            </div>
                        )}
                        renderItem={(item, isHighlighted) =>
                            <div className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                                {item.item}
                            </div>
                        }
                        onChange={(event, val) => this.setState({ val })}
                        onSelect={val => this.setState({ val })}
                    />
                </div>
            </React.Fragment>
        );
    }
}


