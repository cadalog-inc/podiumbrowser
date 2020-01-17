import React from 'react';
import axios from 'axios';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { BrowserRouter, Route, HashRouter, Switch } from "react-router-dom";
import { NavBar } from './components/navbar';
import { Page } from './components/page';
/*global sketchup*/
import { Searchv2 } from './components/search_version2';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        "id": 1,
        "key": "2a2d4d95325c15bf"
      },
      categories: [],
      items: [],
      relationships: [],
      favorites: [],
      recentItems: [],
      dataDownloaded: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (this.state.dataDownloaded) ? (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            {/* using exact broke this in production */}
            <Route path="/" render={
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
                      getItemsInCategory={this.getItemsInCategory}
                      relationships={this.state.relationships}
                      parseQueryString={this.parseQueryString}
                      handleDownloadClick={this.handleDownloadClick}
                      handleFavoriteClick={this.handleFavoriteClick}
                      {...props}
                    />

                    <Searchv2 />

                  </React.Fragment>
                )
              }
            } />
          </Switch>
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

  handleDownloadClick = (item) => {
    sketchup.on_load_comp(`${item.hash}|${item.filename.split('.')[1]}|${item.title}`);
    this.state.relationships.push({
      id: this.state.relationships.length,
      userId: this.state.user.id,
      itemId: item.id,
      categoryId: 218
    });
    this.setState({
      relationships: this.state.relationships
    });
  }

  // todo: handle removing all items on favorites page
  handleFavoriteClick = (itemId) => {
    const item = this.state.items.find((e) => {
      return e.id === itemId
    });
    const l = this.state.relationships.length;
    for (let i = 0; i < l; i++) {
      const relationship = this.state.relationships[i];
      if (relationship.categoryId === 217 && relationship.itemId === itemId) {
        this.state.relationships.splice(i, 1);
        this.setState({
          relationships: this.state.relationships
        });
        return;
      }
    }
    // if a relationship wasn't found
    this.state.relationships.push({
      id: this.state.relationships.length,
      userId: this.state.user.id,
      itemId: item.id,
      categoryId: 217
    });
    this.setState({
      relationship: this.state.relationships
    });
  }

  getData = () => {
    this.getCategories(); // begins a chain of data downloads from categories to items
  }
  // https://www.suplugins.com/podiumbrowserstandalone/
  getCategories = () => {
    axios.get('./categories.json')
      .then((response) => {
        this.setState({
          categories: response.data
        }, () => {
          this.getRelationships();
        });
      });
  }

  getRelationships = () => {
    axios.get('./relationships.json')
      .then((response) => {
        this.setState({
          relationships: response.data
        }, () => {
          this.getFavorites();
        });
      });
  }

  getFavorites = () => {
    axios.get('./favorites.json')
      .then((response) => {
        const favorites = response.data;
        const l = favorites.length;
        for (let i = 0; i < l; i++) {
          const favorite = favorites[i];
          this.state.relationships.push({
            id: this.state.relationships.length,
            userId: favorite.userId,
            itemId: favorite.itemId,
            categoryId: favorite.categoryId
          });
        }
        this.getRecent();
      });
  }

  getRecent = () => {
    axios.get('./recent.json')
      .then((response) => {
        const recents = response.data;
        const l = recents.length;
        for (let i = 0; i < l; i++) {
          const recent = recents[i];
          this.state.relationships.push({
            id: this.state.relationships.length,
            userId: recent.userId,
            itemId: recent.itemId,
            categoryId: recent.categoryId
          });
        }
        this.getItems();
      });
  }

  getItems = () => {
    axios.get('./items.json')
      .then((response) => {
        this.setState({
          items: response.data
        }, () => {
          this.setState({
            dataDownloaded: true
          })
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
