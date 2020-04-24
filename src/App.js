import React from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { NavBar } from './components/navbar';
import { Page } from './components/page';
/*global sketchup*/

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                "id": 1,
                "key": "" // 2a2d4d95325c15bf
            },
            categories: [],
            items: [],
            relationships: [],
            favorites: [],
            recentItems: [],
            dataDownloaded: false
        };

        window["setLicense"] = this.setLicense.bind(this);
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
                                        <Page
                                            user={this.state.user}
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
                                        <NavBar
                                            handleCategoryChange={this.handleCategoryChange}
                                            handleKeySearchChange={this.handleKeySearchChange}
                                            items={this.state.items}
                                            getItemsInCategory={this.getItemsInCategory}
                                            categories={this.state.categories}
                                            getSubCategories={this.getSubCategories}
                                            parseQueryString={this.parseQueryString}
                                            {...props}
                                        />
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
        if (this.state.user.key !== '' || item.type === 'free') {
            sketchup.on_load_comp(`${item.hash}|${item.filename.split('.')[1]}|${item.title}`);
            axios.get(`http://v3.pdm-plants-textures.com/v4/api/users/add_recents/${this.state.user.id}/${item.id}`)
                .then((response) => {
                    this.state.relationships.push({
                        id: this.state.relationships.length,
                        userId: this.state.user.id,
                        itemId: item.id,
                        categoryId: 218
                    });
                    this.setState({
                        relationships: this.state.relationships
                    });
                });
        }
    }

    // todo: handle removing all items on favorites page
    handleFavoriteClick = (itemId) => {
        if (this.state.user.key !== '') {
            const item = this.state.items.find((e) => {
                return e.id === itemId
            });
            const l = this.state.relationships.length;
            for (let i = 0; i < l; i++) {
                const relationship = this.state.relationships[i];
                if (relationship.categoryId === 217 && relationship.itemId === itemId) {
                    // remove from 
                    this.state.relationships.splice(i, 1);
                    this.setState({
                        relationships: this.state.relationships
                    }, () => {
                        axios.get(`http://v3.pdm-plants-textures.com/v4/api/users/remove_favorite/${this.state.user.id}/${itemId}`)
                            .then((response) => {
                                console.log(response);
                            });
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
            }, () => {
                axios.get(`http://v3.pdm-plants-textures.com/v4/api/users/add_favorite/${this.state.user.id}/${itemId}`)
                    .then((response) => {
                        console.log(response);
                    });
            });
        }
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
        const elements = decodeURIComponent(queryString).replace('?', '').split("&");
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

    getData = () => {
        this.getCategories(); // begins a chain of data downloads from categories to items
    }

    // https://www.suplugins.com/podiumbrowserstandalone/
    getCategories = () => {
        axios.get('http://www.suplugins.com/podiumbrowserstandalone/categories.json')
            .then((response) => {
                this.setState({
                    categories: response.data
                }, () => {
                    this.getRelationships();
                });
            });
    }

    getRelationships = () => {
        axios.get('http://www.suplugins.com/podiumbrowserstandalone/relationships.json')
            .then((response) => {
                this.setState({
                    relationships: response.data
                }, () => {
                    this.getItems();
                });
            });
    }

    getItems = () => {
        axios.get('http://www.suplugins.com/podiumbrowserstandalone/items.json')
            .then((response) => {
                this.setState({
                    items: response.data
                }, () => {
                    this.getLicense();
                });
            });
    }

    getLicense() {
        // call sketchup to get license
        // sketchup will call set license below
        sketchup.getLicense();
    }

    setLicense(license, isValid) {
        if (isValid) {
            this.getUser(license.key);
        } else {
            this.setState({
                dataDownloaded: true
            });
        }
    }

    getUser = (key) => {
        axios.get(`http://v3.pdm-plants-textures.com/v4/api/users/set_license/${key}`)
            .then((response) => {
                this.setState({
                    user: {
                        id: response.data.id,
                        key: key
                    }
                }, () => {
                    this.getFavorites();
                });
            })
            .catch((e) => {
                this.setState({
                    dataDownloaded: true
                });
            });
    }

    getFavorites = () => {
        axios.get(`http://v3.pdm-plants-textures.com/v4/api/users/favorites/${this.state.user.id}`)
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
            })
            .catch((e) => {
                this.setState({
                    dataDownloaded: true
                });
            });
    }

    getRecent = () => {
        axios.get(`http://v3.pdm-plants-textures.com/v4/api/users/recents/${this.state.user.id}`)
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
                this.setState({
                    dataDownloaded: true
                });
            })
            .catch((e) => {
                this.setState({
                    dataDownloaded: true
                });
            });
    }
}

export default App;
