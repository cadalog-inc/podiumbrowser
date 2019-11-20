import React from 'react';
import axios from 'axios';
// import logo from './logo.svg';
import './App.css';
import { Link, BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomePage } from './components/homepagecomponent';
import { TableComponent } from './components/gallerytablecomponent';



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

        <TableComponent  itemlist = {items}
                         firstindex = {this.state.indexStart}
                         lastindex = {this.state.indexLimit}/>

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
