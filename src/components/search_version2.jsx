import React from 'react';
import { getDataSourceInfo, renderSearchSuggestion } from '../services/itemsSearchFilterDatasource';
import { Searchv2page } from '../components/search_version2_minipage';
import Autocomplete from 'react-autocomplete';
//import './App.css';

export class Searchv2 extends React.Component {

    state = { val: '', selected: '', selected2: '' };

    handleSuggestionSelect = () => {
        return (<React.Fragment>
            <h5> +++ {this.state.selected.length} +++ </h5>
            <h5> --- {this.state.selected} ---</h5>
        </React.Fragment>)
    }


    render() {
        return (
            <React.Fragment>
                <div className="autocomplete-wrapper">
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
                        onSelect={val => this.setState({ val, selected: val, selected2: this.handleSuggestionSelect() })}
                    />

                    <Searchv2page
                        value={this.state.val}
                        selected={this.state.selected}
                        selected2={this.state.selected2}
                    />
                </div>
            </React.Fragment>
        );
    }
}


