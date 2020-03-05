import React from 'react';
import { renderSearchSuggestionv3 } from '../services/itemSearchFilterVersion3';
import Autocomplete from 'react-autocomplete';


export class Searchv3 extends React.Component {

    state = {
        val: '',
        selected: '',
        itemtagarray: []
    };

    getItemTagArray = (tag) => {
        let tagindex = 0;
        let tagfound = false;
        let arraypointer = 0;

        do {
            if (this.props.suggestionslist[arraypointer].tag === tag) {
                tagfound = true;
                tagindex = arraypointer;
            }
            else
                arraypointer++;
        } while (tagfound === false);

        return this.props.suggestionslist[tagindex].itemlist;
    }

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
                        onSelect={val => this.setState({ val, selected: val, itemtagarray: this.getItemTagArray(val) })}
                    />
                </div>

                <h6>{this.state.selected} is selected and its is in {this.state.itemtagarray.length} items</h6>
            </React.Fragment>
        );
    }
}