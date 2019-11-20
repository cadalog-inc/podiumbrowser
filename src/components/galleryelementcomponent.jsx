import React from 'react';
import axios from 'axios';

export class GalleryElement extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
  
      }
    }
  
    render () {
      return (
         <div className="float-left grayborder" style={{ marginLeft: "5px", marginRight: "5px", marginBottom: "25px", height:220, width:180 }}>
            <p>{this.props.filesize} MB</p>
            <p>{this.props.description}</p>
            <p>In/{this.props.category}/{this.props.subcategory}</p>
         </div>
      );
    }
}