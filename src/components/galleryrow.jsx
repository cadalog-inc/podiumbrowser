import React from 'react';
import { GalleryElement } from './galleryelement';

export class GalleryRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      // render eight gallery elements per row
      indexStart: 0,
      indexLimit: 8,

      arraypointer: 0,
      arraylength: 0
    }
  }

  handleLeftButtonClick = () => {
    let tempArray = this.state.arraypointer;

    if (tempArray !== 0) {
      tempArray--;
      this.setState({ arraypointer: tempArray });
    }
  };

  handleRightButtonClick = (categorylength) => {
    let tempArray = this.state.arraypointer;

    if (tempArray !== (categorylength - 8)) {
      tempArray++;
      this.setState({ arraypointer: tempArray });
    }
  };

  render() {
    const filtereditems = this.props.items.filter((item) => item.category_title.includes(this.props.category));
    this.state.arraylength = filtereditems.length;

    return (
      <div>
        <h3> {this.props.category} </h3>
        <p> {this.state.arraypointer} </p>

        {/* The left button */}
        <div className="float-left grayborder" style={{ height: 220, width: 24 }}>
          <div className="float-top" style={{ height: 95, width: 22 }}></div>
          <div className="float-left" style={{ height: 29, width: 22 }}>
            <button onClick={() => this.handleLeftButtonClick()}> « </button>
          </div>
          <div className="float-left" style={{ height: 95, width: 22 }}></div>
        </div>

        {
          filtereditems.map((item, index) => {
            if (index >= (this.state.indexStart + this.state.arraypointer) && (index <= this.state.indexLimit + this.state.arraypointer))
              return (
                <GalleryElement 
                  filesize={item.filesize}
                  description={item.title}
                  category={item.category_title}
                  subcategory={item.category_name}
                  key={index} />
              );
          })
        }

        {/* The right button */}
        <div className="float-left grayborder" style={{ height: 220, width: 24 }}>
          <div className="float-top" style={{ height: 95, width: 24 }}></div>
          <div className="float-left" style={{ height: 30, width: 24 }}>
            <button onClick={() => this.handleRightButtonClick(this.state.arraylength)}> » </button>
          </div>
          <div className="float-left" style={{ height: 95, width: 24 }}></div>
        </div>

        {/* A blank region at the end of the row */}
        <div className="float-left whiteborder" style={{ marginBottom: "25px", height: 220, width: 75 }}></div>
      </div>
    );
  }

}