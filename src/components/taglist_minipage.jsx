import React from 'react';
import { getItemTagsArray } from '../services/itemtagsSearchDatabase';

export class TagList extends React.Component {

    state = {
        itemTagList: getItemTagsArray()
    }

    render() {
        return (
            <React.Fragment>
                <h3> ++++++ </h3>
                <p></p>
                <h4>{this.state.itemTagList.length}</h4>
                <p></p>
                {this.state.itemTagList.map(item => (<h5>{item.tag} --- {item.pos}</h5>))}
            </React.Fragment>
        )
    }
}