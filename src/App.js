import React from 'react';
import axios from 'axios';
// import logo from './logo.svg';
import './App.css';
import { Link, BrowserRouter as Router, Route, Switch } from "react-router-dom";

class HomePage extends React.Component {
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
              <p >{item.title}</p>
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

class GalleryRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      indexStart: 0,
      indexLimit: 9
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

    const filtereditems = this.props.categoryitems.filter( (item) => item.category_title.includes(this.props.category));

    return (<div>
        <p> -- ++ {this.props.category} ++ --</p>
        <p> -- {this.props.categoryitems.length} -- </p>
        <p> -- {filtereditems.length} --</p>

        <div>
          {
            filtereditems.map((item, index) => {
              if(index >= 0 && index <= 9)
              return (
                <GalleryElement filesize = {this.formatFilesize(item.filesize)}
                                description = {item.title}
                                category = {item.category_title}
                                subcategory = {item.category_name} 
                                key={index}/>
              );
            })
          }
          
        </div>

    </div>);
  }

}

class GalleryElement extends React.Component {
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

class TableComponent extends React.Component {
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


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: {
        title: "",
        categories: []
      },


      browserDatabaseArray : [],

      items: [],

      selectedCategory: "",
      searchTerm : "",
      indexStart: 0,
      indexLimit: 100
    };
  }

  componentDidMount() {
    this.getCategories();
    this.getItems();
  }

  searchArray = (items, value) => {
    const l = items.length;
    for(let i=0; i<l; i++) {
      const item = items[i];
      if(item.includes(value)) {
        return true;
      }
    }
    return false;
  }

  handleCategoryChange = (event) => {
    const value = event.target.value;

    this.setState({
      selectedCategory: value
    });
  }

  handleKeySearchChange = (event) => {
    const value = event.target.value;

    this.setState({
      searchTerm: value
    });
  }

  render() {
    const items = this.state.items.filter( (item) => {
      const isInTags = this.state.searchTerm === "" || this.searchArray(item.tags,(this.state.searchTerm));
      const isInCategoryTitle = item.category_title.includes(this.state.selectedCategory);
      return isInTags && isInCategoryTitle;
    });

    const primaryCategories = this.state.categories.categories.length > 0 ? this.state.categories.categories : [];

    // todo: only search on press enter
    return (
      <div className="App">
        <Router>

        </Router>
        <select defaultValue={""} onChange={this.handleCategoryChange}>
          
        <option value="">Home</option>
          {
            primaryCategories.map((item, index) => {
              return (
              <option value={item.title} key={index}>{item.title}</option>
              )
            })
          }
        </select>
        <input className="form-control mr-sm-2" type="text" placeholder="Search" onChange={this.handleKeySearchChange}></input>

        <p>{items.length}</p>

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
              items.map((item, index) => {
                if(index >= this.state.indexStart && index <= this.state.indexLimit)
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

        <p></p>
        <p> Test 001</p>
        <p></p>

        <TableComponent  itemlist = {items}
                         firstindex = {this.state.indexStart}
                         lastindex = {this.state.indexLimit}/>

        <p></p>
        <p> Test 002</p>
        <p></p>

        <GallerySeeAllPage itemlist = {items}
                         firstindex = {this.state.indexStart}
                         lastindex = {this.state.indexLimit}/>


        <p></p>
        <p> Test 003</p>
        <p> ++ {items.length} ++ </p>

        <HomePage categories = {primaryCategories}
                  itemlist = {this.state.browserDatabaseArray}/>

      </div>
    );
  }

  getCategories() {
    axios.get('categories.json')
    .then((response) => {
      this.setState({
        categories: response.data.categories
      }, () => {
        console.log(this.state.categories.categories.length);
      });
    });
  }

  getItems() {
    axios.get('items.json')
    .then((response) => {
      this.setState({
        items: response.data.data, browserDatabaseArray: response.data.data
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
