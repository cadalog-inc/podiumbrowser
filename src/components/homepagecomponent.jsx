import React from 'react';
import axios from 'axios';
import { GalleryRow } from '../components/galleryrowcomponent';

export class HomePage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
  
  
      }
    }
  
    render () {
  
      return (
        <div>
          {
            this.props.categories.map((item, index) => {
              return (<div key={index}>
                <GalleryRow  category={item.title}
                             categoryitems={this.props.itemlist} />
              </div>
              )
            })
          }
        </div>
      );
    }
  
  }