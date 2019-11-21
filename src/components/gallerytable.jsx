import React from 'react';

export class TableComponent extends React.Component {
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
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category Name</th>
                <th>Category Title</th>
                <th>File Size</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.itemlist.map((item, index) => {
                  if(index >= this.props.firstindex && index <= this.props.lastindex)
                  return (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{item.category_name}</td>
                      <td>{item.category_title}</td>
                      <td>{this.formatFilesize(item.filesize)}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
  
        </div>
      );
    }
  }