import React from 'react';
import { getItemTagsArray, createItemRelationshipsArray } from '../services/itemtagsSearchDatabase';

export class TagList extends React.Component {

    state = {
        itemTagList: getItemTagsArray(),
        itemtagrelationships: createItemRelationshipsArray(),

        itemtagRelationshipsArrayv2: []
    }

    handleButtonClick = () => {

        const itemlist = this.props.items;
        const itemTagsArray = this.props.tagarray;
        let itemtagRelationshipArray = [];

        // loop through the tags
        for (let i = 0; i < 3000; i++) {

            // temp array
            let itemtaginfo = [];

            // loop through the items
            for (let j = 0; j < itemlist.length; j++) {
                let itemtagpointer = 0;
                let tagfound = false;

                do {
                    if (itemlist[j].tags[itemtagpointer] === itemTagsArray[i]) {
                        tagfound = true;
                        itemtaginfo.push(j);
                    }
                    else {
                        itemtagpointer++;
                    }
                } while ((tagfound === false) && (itemtagpointer < itemlist[j].tags.length));
            }

            itemtagRelationshipArray.push({ tag: itemTagsArray[i], itemlist: itemtaginfo });
        }

        this.setState({ itemtagRelationshipsArrayv2: itemtagRelationshipArray });

    };

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
                <p></p>
                <button onClick={() => this.handleButtonClick()}> Test it </button>
                <h6> {this.state.itemtagRelationshipsArrayv2.length} </h6>
            </React.Fragment>
        )
    }
}