import React from 'react';
import axios from 'axios';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route } from "react-router-dom";
import { NavBar } from './components/navbar';
import { Page } from './components/page';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      items: [],
      relationships: []
    };
  }

  componentDidMount() {
    this.getCategories();
    this.getItems();
    this.getRelationships();
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
                    {...props}
                  />
                  <Page
                    categories={this.state.categories}
                    getSubCategories={this.getSubCategories}
                    items={this.state.items}
                    getItemsInCategory={this.getItemsInCategory}
                    searchArray={this.searchArray}
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
          <div>Loading...</div>
        </React.Fragment>
      );
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

  getPathToItem = (itemId) => {
    const item = this.state.items.find((i) => {
      return i.id === itemId
    });

    const itemsCategories = this.state.relationships.filter((item) => {
      return item.itemId === itemId
    });

    const pathToItem = {
      lastCategoryId: 1, // starts at home/1
      categoryIds: [1]
    };

    let sanity = 0; // sanity check, limit depth of path to < 10

    let l = itemsCategories.length;
    while (itemsCategories.length > 0 && sanity < 10) {
      l = itemsCategories.length;
      for (let i = 0; i < l; i++) {
        const itemCategory = itemsCategories[i];
        const category = this.state.categories.find((c) => {
          return c.id === itemCategory.categoryId
        });
        if (category.parentId === pathToItem.lastCategoryId) {
          pathToItem.categoryIds.push(itemCategory.categoryId);
          pathToItem.lastCategoryId = itemCategory.categoryId;
          itemsCategories.splice(i, 1);
          break;
        }
      }

      sanity++;
    }

    let pathToItemString = "";
    l = pathToItem.categoryIds.length;
    for (let i = 0; i < l; i++) {
      const categoryId = pathToItem.categoryIds[i];
      const category = this.state.categories.find((c) => {
        return c.id === categoryId
      });
      if (i === 0) {
        pathToItemString += `${category.title}`;
      } else {
        pathToItemString += `/${category.title}`;
      }
    }

    pathToItemString += `/${item.title}`;

    return pathToItemString;
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
