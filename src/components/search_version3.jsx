import React from 'react';
import { renderSearchSuggestionv3 } from '../services/itemsSearchFilterDatasource';
//import { Searchv2page } from '../components/search_version2_minipage';
import Autocomplete from 'react-autocomplete';
//import './App.css';

export class Searchv3 extends React.Component {

    state = { val: '', selected: '' };

    render() {
        return (
            <React.Fragment>
                <div className="autocomplete-wrapper">
                    <Autocomplete
                        value={this.state.val}
                        items={this.props.suggestionslist}
                        getItemValue={item => item}
                        shouldItemRender={renderSearchSuggestionv3}
                        renderMenu={item => (
                            <div className="dropdown">
                                {item}
                            </div>
                        )}
                        renderItem={(item, isHighlighted) =>
                            <div className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                                {item}
                            </div>
                        }
                        onChange={(event, val) => this.setState({ val })}
                        onSelect={val => this.setState({ val, selected: val })}
                    />
                </div>
                <h6>{this.props.suggestionslist.length}</h6>
            </React.Fragment>
        );
    }
}