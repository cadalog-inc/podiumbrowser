import React from 'react';
import { renderSearchSuggestionv3 } from '../services/itemSearchFilterVersion3';
import Autocomplete from 'react-autocomplete';


export class Searchv3 extends React.Component {

    state = { val: '', selected: '' };

    render() {
        return (
            <React.Fragment>
                <div className="autocomplete-wrapper">
                    <Autocomplete
                        value={this.state.val}
                        items={this.props.suggestionslist}
                        getItemValue={item => item.tag}
                        shouldItemRender={renderSearchSuggestionv3}
                        renderMenu={item => (
                            <div className="dropdown">
                                {item}
                            </div>
                        )}
                        renderItem={(item, isHighlighted) =>
                            <div className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                                {item.tag}
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