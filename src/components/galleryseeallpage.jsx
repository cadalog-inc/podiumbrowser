import React from 'react';
import { GalleryElement } from '../components/galleryelementcomponent';

class GallerySeeAllPage extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
  
      }
    }
  
    formatFilesize(bytes) {
      const size = Math.round(bytes / Math.pow(1024, 2));
      if(size < 1) {
        return '< 1';
      } else {
        return size;
      }
    }
  
    render () {
      return (
        <div>
          {
            this.props.itemlist.map((item, index) => {
              if(index >= this.props.firstindex && index <= this.props.lastindex)
              return (
                <GalleryElement filesize = {this.formatFilesize(item.filesize)}
                                description = {item.title}
                                category = {item.category_title}
                                subcategory = {item.category_name} 
                                key={index}/>
              );
            })
          }
  
        </div>);
    }
  
  }