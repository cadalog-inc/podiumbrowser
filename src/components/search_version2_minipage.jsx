import React from 'react';

export class Searchv2page extends React.Component {

    constructor(props) {
        super();

        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.props.value.length != 0 ? <h3>{this.props.value} is selected </h3> : null
                }
                {
                    this.props.selected.length != 0 ? <h3>{this.props.selected} is selected </h3> : null
                }
                <h5>{this.props.selected2}</h5>

            </React.Fragment>
        );
    }
}