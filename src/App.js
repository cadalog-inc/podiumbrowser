import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    this.getItems();
  }

  render() {
    return (
      <div className="App">
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
              this.state.items.map((item, index) => {
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

  getItems() {
    axios.get('filedatamin.json')
    .then((response) => {
      this.setState({
        items: response.data.data
      }, () => {
        // console.log(this.state.items);
      });
    });
  }

  formatFilesize(bytes) {
    const size = Math.round(bytes / Math.pow(1024, 2));
    if(size < 1) {
      return '< 1';
    } else {
      return size;
    }
  }
}

export default App;
