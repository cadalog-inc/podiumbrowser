import React from 'react';
import { GalleryRow } from './galleryrow';

export class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                {
                    this.props.categories.categories.map((category, index) => {
                        return (<div key={index}>
                            <GalleryRow
                                category={category.title}
                                items={this.props.items}
                            />
                        </div>
                        )
                    })
                }
            </div>
        );
    }

}