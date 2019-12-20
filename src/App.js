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
    this.getData();
  }

  render() {
    // todo: do i need to make sure categories and relationships is downloaded or just items, since it's download last?
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

  getData = () => {
    this.getCategories(); // begins a chain of data downloads from categories to items
  }

  getCategories = () => {
    axios.get('categories.json')
      .then((response) => {
        this.setState({
          categories: response.data
        }, () => {
          this.getRelationships();
        });
      });
  }

  getRelationships = () => {
    axios.get('relationships.json')
      .then((response) => {
        this.setState({
          relationships: response.data
        }, () => {
          this.getFavorites();
        });
      });
  }

  getFavorites = () => {
    axios.get('favorites.json')
      .then((response) => {
        const favorites = response.data;
        const l = favorites.length;
        for (let i = 0; i < l; i++) {
          const favorite = favorites[i];
          this.state.relationships.push({
            id: this.state.relationships.length,
            itemId: favorite.itemId,
            categoryId: favorite.categoryId
          });
        }
        this.getRecent();
      });
  }

  getRecent = () => {
    axios.get('recent.json')
      .then((response) => {
        const recents = response.data;
        const l = recents.length;
        for (let i = 0; i < l; i++) {
          const recent = recents[i];
          this.state.relationships.push({
            id: this.state.relationships.length,
            itemId: recent.itemId,
            categoryId: recent.categoryId
          });
        }
        this.getItems();
      });
  }

  getItems = () => {
    axios.get('items.json')
      .then((response) => {
        this.setState({
          items: response.data
        }, () => {

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
