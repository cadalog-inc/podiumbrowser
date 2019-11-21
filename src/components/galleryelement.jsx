import React from 'react';

export class GalleryElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="float-left grayborder" style={{ marginLeft: "5px", marginRight: "5px", marginBottom: "25px", height: 220, width: 180 }}>
        {/* <img style={{ width: 175, height: 150 }} /> */}
        <p>{this.formatFilesize(this.props.filesize)} MB</p>
        <p>{this.props.description}</p>
        <p>In/{this.props.category}/{this.props.subcategory}</p>
      </div>
    );
  }

  formatFilesize(bytes) {
    const size = Math.round(bytes / Math.pow(1024, 2));
    if (size < 1) {
      return '< 1';
    } else {
      return size;
    }
  }
}