import React from 'react';
import { MoviesData, renderMovieTitle, getDataSourceInfo, renderSearchSuggestion } from '../services/itemsSearchFilterDatasource';
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
                        onSelect={val => this.setState({ val, selected: val, selected2: this.handleSuggestionSelect() })}
                    />

                    {
                        this.state.val.length != 0 ? <h3>{this.state.val} is selected </h3> : null
                    }
                    {
                        this.state.selected.length != 0 ? <h3>{this.state.selected} is selected </h3> : null
                    }
                    <h5>{this.state.selected2}</h5>
                </div>
            </React.Fragment>
        );
    }
}


