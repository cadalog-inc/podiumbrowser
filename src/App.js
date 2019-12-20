import React from 'react';
import axios from 'axios';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { BrowserRouter, Route } from "react-router-dom";
import { NavBar } from './components/navbar';
import { Page } from './components/page';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      items: [],
      relationships: [],
      favorites: [],
      recentItems: []
    };
  }

  componentDidMount() {
    this.getCategories();
    this.getItems();
    this.getRelationships();
    this.getFavorites();
    this.getRecentItems();
  }

  render() {
    return (this.state.categories.length > 0 && this.state.items.length > 0 && this.state.relationships.length > 0) ? (
      <React.Fragment>
        <BrowserRouter>
          <Route exact path="/" render={
            (props) => {
              return (
                <React.Fragment>
                  <NavBar
                    handleCategoryChange={this.handleCategoryChange}
                    handleKeySearchChange={this.handleKeySearchChange}
                    categories={this.state.categories}
                    getSubCategories={this.getSubCategories}
                    parseQueryString={this.parseQueryString}
                    {...props}
                  />
                  <Page
                    categories={this.state.categories}
                    getSubCategories={this.getSubCategories}
                    items={this.state.items}
                    favorites={this.state.favorites}
                    recentItems={this.state.recentItems}
                    getItemsInCategory={this.getItemsInCategory}
                    relationships={this.state.relationships}
                    parseQueryString={this.parseQueryString}
                    {...props}
                  />
                </React.Fragment>
              )
            }
          } />
        </BrowserRouter>
      </React.Fragment>
    ) : (
        <React.Fragment>
          <Alert variant="secondary">
            <p> Loading up the home page. </p>
            <p> This will take a few moments ... </p>
          </Alert>
        </React.Fragment>
      );
  }

  // to do -- add a favorites section to the home page.
  // this section must be rendered only on the home page and
  // not on any of the other pages.
  getFavorites = () => {
    axios.get('favorites.json')
      .then((response) => {
        this.setState({
          favorites: response.data
        }, () => {
          // console.log(this.state.favorites.length);
        });
      });
  }

  getRecentItems = () => {
    axios.get('recentitems.json')
      .then((response) => {
        this.setState({
          recentItems: response.data
        }, () => {
          // console.log(this.state.favorites.length);
        });
      });
  }

  getCategories = () => {
    axios.get('categories.json')
      .then((response) => {
        this.setState({
          categories: response.data
        }, () => {
          // console.log(this.state.categories.length);
        });
      });
  }

  getItems = () => {
    axios.get('items.json')
      .then((response) => {
        this.setState({
          items: response.data
        }, () => {
          // console.log(this.state.items.length);
        });
      });
  }

  getRelationships = () => {
    axios.get('relationships.json')
      .then((response) => {
        this.setState({
          relationships: response.data
        }, () => {
          // console.log(this.state.relationships.length);
        });
      });
  }

  getSubCategories = (categoryId) => {
    return this.state.categories.filter((category) => {
      return category.parentId === categoryId
    });
  }

  getItemsInCategory = (categoryId) => {
    const itemsCategories = this.state.relationships.filter((item) => {
      return item.categoryId === categoryId
    });

    const itemsInCategory = [];

    const l = itemsCategories.length;
    for (let i = 0; i < l; i++) {
      const itemsCategory = itemsCategories[i];
      const item = this.state.items.find((e) => {
        return e.id === itemsCategory.itemId
      });
      itemsInCategory.push(item);
    }

    return itemsInCategory;
  }

  parseQueryString = (queryString) => {
    const values = {};
    const elements = queryString.replace('?', '').split("&");
    const l = elements.length;
    for (let i = 0; i < l; i++) {
      const element = elements[i];
      const pair = element.split('=');
      const key = pair[0];
      let value = pair[1];
      if (!isNaN(parseInt(value))) {
        value = parseInt(value);
      }
      values[key] = value;
    }
    return values;
  }
}

export default App;
