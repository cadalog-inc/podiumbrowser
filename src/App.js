import React from 'react';
import axios from 'axios';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route } from "react-router-dom";
import { NavBar } from './components/navbar';
import { HomePage } from './components/homepage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: {
        title: "",
        categories: []
      },
      items: [],
      selectedCategory: "",
      searchTerm: "",
      indexStart: 0,
      indexLimit: 100
    };
  }

  componentDidMount() {
    this.getCategories();
    this.getItems();
  }

  render() {
    const items = this.state.items.filter((item) => {
      const isInTags = this.state.searchTerm === "" || this.searchArray(item.tags, (this.state.searchTerm));
      const isInCategoryTitle = item.category_title.includes(this.state.selectedCategory);
      return isInTags && isInCategoryTitle;
    });

    // are there any categories in this category?

    // todo: only search on press enter
    return (
      <div className="App">
        <BrowserRouter>
            <Route exact path="/" render={
              (props) => {
                return (
                  <React.Fragment>
                    <NavBar
                      handleCategoryChange={this.handleCategoryChange}
                      handleKeySearchChange={this.handleKeySearchChange}
                      categories={this.state.categories}
                      {...props}
                    />
                    <HomePage
                      categories={this.state.categories}
                      items={items}
                      {...props}
                    />
                  </React.Fragment>
                )
              }
            } />
            {/* <Route render={
              (props) => {
                return (<h3>404 - Not found</h3>)
              }
            } /> */}
        </BrowserRouter>
      </div>
    );
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

  searchArray = (items, value) => {
    const l = items.length;
    for (let i = 0; i < l; i++) {
      const item = items[i];
      if (item.includes(value)) {
        return true;
      }
    }
    return false;
  }
}

export default App;
