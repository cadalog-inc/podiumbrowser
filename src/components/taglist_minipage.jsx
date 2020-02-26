import React from 'react';
import { getItemTagsArray, createItemRelationshipsArray } from '../services/itemtagsSearchDatabase';

export class TagList extends React.Component {

    state = {
        itemTagList: getItemTagsArray(),
        itemtagrelationships: createItemRelationshipsArray()
    }

    render() {
        return (
            <React.Fragment>
                <h3> ++++++ </h3>
                <p></p>
                <h4>{this.state.itemTagList.length}</h4>
                <p></p>
                {this.state.itemtagrelationships.map(item => (<h5>{item.tag}  --  appears in {item.itemlist.length} items </h5>))}
                <p></p>
                <h6>{this.state.itemtagrelationships[37].itemlist[0]} --- {this.state.itemtagrelationships[37].itemlist[1]} --- {this.state.itemtagrelationships[37].itemlist[2]}</h6>
            </React.Fragment>
        )
    }
}