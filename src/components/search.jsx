import React from 'react';
import Autocomplete from 'react-autocomplete';

export class Search extends React.Component {
    state = {
        val: '',
        itemTags: []
    };

    getItemTagArray = (tag) => {
        let tagIndex = 0;
        let tagFound = false;
        let pointer = 0;

        do {
            if (this.props.suggestions[pointer].tag === tag) {
                tagFound = true;
                tagIndex = pointer;
            }
            else {
                pointer++;
            }
        } while (!tagFound);

        this.props.updateTags(this.props.suggestions[tagIndex].itemlist);

        return this.props.suggestions[tagIndex].itemlist;
    }

    render() {
        return (
            <React.Fragment>
                <div className="autocomplete-wrapper">
                    <Autocomplete
                        value={this.state.val}
                        items={this.props.suggestions}
                        getItemValue={item => item.tag}
                        shouldItemRender={
                            (item, val) => {
                                return (
                                    item.tag.toLowerCase().indexOf(val.toLowerCase()) === 0
                                );
                            }
                        }
                        renderMenu={
                            item => {
                                return (
                                    <div className="dropdown">
                                        {item}
                                    </div>
                                )
                            }
                        }
                        renderItem={
                            (item, isHighlighted) => {
                                return (
                                    <div className={`item ${isHighlighted ? 'selected-item' : ''}`}>
                                        {item.tag}
                                    </div>
                                )
                            }
                        }
                        onChange={
                            (event, val) => {
                                this.setState({
                                    val
                                })
                            }
                        }
                        onSelect={
                            val => {
                                this.setState({
                                    val,
                                    itemtagarray: this.getItemTagArray(val)
                                })
                            }
                        }
                    />
                </div>

                <h6>{this.state.selected} is selected and its is in {this.state.itemTags.length} items</h6>
            </React.Fragment>
        );
    }
}