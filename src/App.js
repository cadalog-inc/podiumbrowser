import React from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { NavBar } from './components/NavBar';
import { Page } from './components/Page';
import Category from './models/Category';
import Item from './models/Item';
import Relationship from './models/Relationship';
import User from './models/User';
import License from './models/License';
import { Settings } from './components/admin/Settings';

/*global sketchup*/

// admin
const AWS = require('aws-sdk');
const value = localStorage.getItem("PodiumBrowserAdminOptions") || "";
if (value !== null && value !== undefined && value !== "") {
    const options = JSON.parse(value);
    AWS.config.update({
        region: options.region,
        endpoint: options.endpoint,
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey
    });
    window.docClient = new AWS.DynamoDB.DocumentClient();
    window.admin = options.admin;
} else {
    window.admin = false;
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                "id": 1,
                "key": ""
            },
            license: new License("", "", "", ""),
            homeCategoryId: 1,
            categories: [],
            items: [],
            relationships: [],
            recentDistance: 100,
            useHDR: false,
            standalone: false,
            dataDownloaded: false,
            dataDownloadingMessage: 'data',
            isValid: false
        };
        window["setLicense"] = this.setLicense.bind(this);
        window["validateLicense"] = this.validateLicense.bind(this);
        // admin
        window.document.body.addEventListener('keyup', (e) => {
            if (e.code === 'F5') {
                window.location = window.location.origin;
            }
        });
    }

    componentDidMount() {
        if (window.admin) {
            this.getLiveData();
        } else {
            this.getCachedData();
        }
    }

    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Switch>
                        <Route path="/admin" render={
                            (props) => {
                                return (
                                    <React.Fragment>
                                        <Settings {...props} />
                                    </React.Fragment>
                                )
                            }
                        } />
                        {/* using exact broke this in production */}
                        <Route path="/" render={
                            (props) => {
                                return this.state.dataDownloaded ? (
                                    <React.Fragment>
                                        <NavBar
                                            license={this.state.license}
                                            handleUpdateLicense={this.handleUpdateLicense}
                                            saveQueryValues={this.saveQueryValues}
                                            handleCategoryChange={this.handleCategoryChange}
                                            handleKeySearchChange={this.handleKeySearchChange}
                                            items={this.state.items}
                                            getItemsInCategory={this.getItemsInCategory}
                                            categories={this.state.categories}
                                            getSubCategories={this.getSubCategories}
                                            getHomeCategory={this.getHomeCategory}
                                            relationships={this.state.relationships}
                                            useHDR={this.state.useHDR}
                                            standalone={this.state.standalone}
                                            {...props}
                                        />
                                        <Page
                                            license={this.state.license}
                                            user={this.state.user}
                                            categories={this.state.categories}
                                            getSubCategories={this.getSubCategories}
                                            items={this.state.items}
                                            getItemsInCategory={this.getItemsInCategory}
                                            relationships={this.state.relationships}
                                            handleDownloadClick={this.handleDownloadClick}
                                            handleFavoriteClick={this.handleFavoriteClick}
                                            getHomeCategory={this.getHomeCategory}
                                            isHomeCategory={this.isHomeCategory}
                                            isItemRecent={this.isItemRecent}
                                            useHDR={this.state.useHDR}
                                            getRecentDownloadedCategoryId={this.getRecentDownloadedCategoryId}
                                            getMyFavoritesCategoryId={this.getMyFavoritesCategoryId}
                                            handleClearFavoritesClick={this.handleClearFavoritesClick}
                                            {...props}
                                        />
                                    </React.Fragment>
                                ) : (
                                        <React.Fragment>
                                            <Alert variant="secondary">
                                                <p> Loading up the home page. </p>
                                                <p> This will take a few moments ... </p>
                                                {
                                                    window.admin ? <p> Downloading {this.state.dataDownloadingMessage}...</p> : null
                                                }
                                            </Alert>
                                        </React.Fragment>
                                    )
                            }
                        } />
                    </Switch>
                </BrowserRouter>
            </React.Fragment>
        );
    }

    // license methods
    handleUpdateLicense = (license, callback = () => { }) => {
        this.setState({
            license: license
        }, () => {
            this.forceUpdate();
            callback();
        });
    }

    getLicense() {
        // call sketchup to get license
        // sketchup will call set license below
        if (window.sketchup !== undefined) {
            sketchup.getLicense();
        } else {
            this.dataDownloaded();
        }
    }

    setLicense(license, isValid) {
        const sd = license.checkin.split('/');
        const nd = new Date(sd[2], sd[1] - 1, sd[0]);
        license.checkin = nd.toLocaleDateString();
        this.setState({
            license: license,
            useHDR: true,
            standalone: false,
            isValid: isValid
        }, () => {
            this.getUser();
        })
    }

    validateLicense() {
        License.getLicense().validate((license, valid) => {
            this.setState({
                license: license,
                useHDR: false,
                standalone: true,
                isValid: valid
            }, () => {
                this.getUser();
            });
        }, () => {
            this.setState({
                useHDR: false,
                standalone: true
            }, () => {
                this.dataDownloaded();
            });
        });
    }

    // ruby calls
    getRecentDownloadedCategoryId = () => {
        const l = this.state.categories.length;
        for (let c = 0; c < l; c++) {
            const category = this.state.categories[c];
            if (category.title === "Recent Downloaded") {
                return category.id;
            }
        }
        return null;
    }

    getMyFavoritesCategoryId = () => {
        const l = this.state.categories.length;
        for (let c = 0; c < l; c++) {
            const category = this.state.categories[c];
            if (category.title === "My Favorites") {
                return category.id;
            }
        }
        return null;
    }

    handleDownloadClick = (item) => {
        const path = `https://v3.pdm-plants-textures.com/.secret/files/${item.hash}`;
        if (this.state.user.key !== '' && License.isValid(this.state.license)) {
            if (window.sketchup !== undefined) {
                sketchup.on_load_comp(`${path}|${item.fileExt}|${item.title}`);
            } else {
                window.location = `${path}.${item.fileExt}`;
            }
            this.addRecentDownloaded(item.id);
        } else if (item.isFree) {
            if (window.sketchup !== undefined) {
                sketchup.on_load_comp(`${path}|${item.fileExt}|${item.title}`);
            } else {
                window.location = `${path}.${item.fileExt}`;
            }
        }
    }

    addRecentDownloaded = (itemId) => {
        const categoryId = this.getRecentDownloadedCategoryId();
        if (categoryId !== null) {
            axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/add_recent/${this.state.user.id}/${itemId}/${categoryId}`)
                .then((response) => {
                    this.state.relationships.push({
                        id: this.state.relationships.length,
                        userId: this.state.user.id,
                        itemId: itemId,
                        categoryId: categoryId
                    });
                    this.setState({
                        relationships: this.state.relationships
                    });
                });
        }
    }

    handleClearFavoritesClick = () => {
        const categoryId = this.getMyFavoritesCategoryId();
        if (categoryId !== null && this.state.user.key !== '') {
            const relationshipsToSave = [];
            const relationshipsToRemove = [];
            const l = this.state.relationships.length;
            for (let i = 0; i < l; i++) {
                const relationship = this.state.relationships[i];
                if (relationship.categoryId === categoryId) {
                    relationshipsToRemove.push(relationship);
                } else {
                    relationshipsToSave.push(relationship);
                }
            }
            this.setState({
                relationships: relationshipsToSave
            }, () => {
                this.clearFavorites(relationshipsToRemove);
            });
        }
    }

    clearFavorites = (relationships) => {
        const categoryId = this.getMyFavoritesCategoryId();
        if (categoryId !== null && relationships.length > 0) {
            const relationship = relationships[0];
            axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/remove_favorite/${this.state.user.id}/${relationship.itemId}/${categoryId}`)
                .then((response) => {
                    relationships.shift();
                    this.clearFavorites(relationships);
                });
        }
    }

    handleFavoriteClick = (itemId) => {
        const categoryId = this.getMyFavoritesCategoryId();
        if (categoryId !== null && this.state.user.key !== '') {
            const item = this.state.items.find((e) => {
                return e.id === itemId
            });
            const l = this.state.relationships.length;
            for (let i = 0; i < l; i++) {
                const relationship = this.state.relationships[i];
                if (relationship.categoryId === categoryId && relationship.itemId === itemId) {
                    // remove from 
                    this.state.relationships.splice(i, 1);
                    this.setState({
                        relationships: this.state.relationships
                    }, () => {
                        axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/remove_favorite/${this.state.user.id}/${itemId}/${categoryId}`)
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
                categoryId: categoryId
            });
            this.setState({
                relationship: this.state.relationships
            }, () => {
                axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/add_favorite/${this.state.user.id}/${itemId}/${categoryId}`)
                    .then((response) => {
                        console.log(response);
                    });
            });
        }
    }

    // item methods
    
    isItemRecent = (item) => {
        const now = new Date();
        const then = new Date(item.uploadDate*1000);
        const nowTime = now.getTime();
        const thenTime = then.getTime();
        const difference = nowTime - thenTime;
        let days = difference;
        days = days / (1000 * 3600 * 24);
        const daysDistance = Math.abs(this.state.recentDistance - days);
        // if(daysDistance <= 100) {
        //     console.log(daysDistance);
        // }
        return daysDistance <= 100;
    }

    // category methods
    getHomeCategory = () => {
        return this.state.homeCategoryId;
    }

    isHomeCategory = (categoryId) => {
        return categoryId === this.getHomeCategory();
    }

    getSubCategories = (categoryId) => {
        if (this.isHomeCategory(categoryId)) {
            return this.getPrimaryCategories();
        } else {
            const subCategories = this.state.categories.filter((category) => {
                return category.parentId === categoryId
            });

            if (categoryId === 24) {
                return subCategories.sort((a, b) => {
                    if (a.id > b.id) {
                        return -1;
                    }
                    if (a.id < b.id) {
                        return 1;
                    }
                    return 0;
                });
            } else {
                return subCategories;
            }
        }
    }

    getPrimaryCategories = () => {
        const primaryCategories = [];
        const l = this.state.categories.length;
        for (let c = 0; c < l; c++) {
            const category = this.state.categories[c];
            if (category.primaryIndex !== -1) {
                primaryCategories.push(category);
            }
        }
        return primaryCategories.sort((a, b) => a.primaryIndex > b.primaryIndex ? 1 : -1);
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
            if (item && item !== undefined) {
                itemsInCategory.push(item);
            }
        }

        return itemsInCategory;
    }

    // v4 api calls
    getUser = () => {
        this.state.isValid ?
            // todo: first get license and if it doesn't exist, then set license?
            axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/set_license/${this.state.license.key}`)
                .then((response) => {
                    this.setState({
                        user: new User(response.data.id, this.state.license.key)
                    }, () => {
                        this.getFavorites();
                    });
                })
                .catch(() => {
                    this.dataDownloaded();
                }) : this.dataDownloaded();
    }

    getFavorites = () => {
        axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/favorites/${this.state.user.id}`)
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
            .catch(() => {
                this.dataDownloaded();
            });
    }

    getRecent = () => {
        axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/recents/${this.state.user.id}`)
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
                this.dataDownloaded();
            })
            .catch(() => {
                this.dataDownloaded();
            });
    }

    // aws dynamodb
    getLiveData() {
        this.setState({
            dataDownloadingMessage: 'categories'
        }, () => {
            this.getLiveCategories();
        });
    }

    getLiveCategories() {
        console.log('get categories:');
        const params = {
            TableName: "Categories"
        }
        window.docClient.scan(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({
                    categories: Category.fromArray(data.Items),
                    dataDownloadingMessage: 'items'
                }, () => {
                    this.getLiveItems({ action: 'start' });
                });
            }
        })
    }

    getLiveItems(options) {
        console.log('get items:');
        const params = {
            TableName: "Items"
        }
        if (options.hasOwnProperty('lastEvaluatedKey')) {
            params['ExclusiveStartKey'] = options.lastEvaluatedKey;
        }
        window.docClient.scan(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let items = [];
                if (options.action === 'start') {
                    items = Item.fromArray(data.Items);
                } else if (options.action === 'continue') {
                    items = [...this.state.items, ...Item.fromArray(data.Items)];
                }
                if (data.hasOwnProperty('LastEvaluatedKey')) {
                    this.setState({
                        items: items
                    }, () => {
                        this.getLiveItems({ action: 'continue', lastEvaluatedKey: data.LastEvaluatedKey });
                    })
                } else {
                    this.setState({
                        items: items,
                        dataDownloadingMessage: 'relationships'
                    }, () => {
                        this.getLiveRelationships({ action: 'start' });
                    });
                }
            }
        })
    }

    getLiveRelationships(options) {
        console.log('get relationships:');
        const params = {
            TableName: "Relationships"
        }
        if (options.hasOwnProperty('lastEvaluatedKey')) {
            params['ExclusiveStartKey'] = options.lastEvaluatedKey;
        }
        window.docClient.scan(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let relationships = [];
                if (options.action === 'start') {
                    relationships = Relationship.fromArray(data.Items);
                } else if (options.action === 'continue') {
                    relationships = [...this.state.relationships, ...Relationship.fromArray(data.Items)];
                }
                if (data.hasOwnProperty('LastEvaluatedKey')) {
                    this.setState({
                        relationships: relationships
                    }, () => {
                        this.getLiveRelationships({ action: 'continue', lastEvaluatedKey: data.LastEvaluatedKey });
                    })
                } else {
                    this.setState({
                        relationships: relationships,
                        dataDownloadingMessage: 'data'
                    }, () => {
                        const homeCategory = this.state.categories.find((category) => category.title === 'Home');
                        this.setState({
                            homeCategoryId: homeCategory && homeCategory.id ? homeCategory.id : 1
                        }, () => {
                            this.getLicense();
                        });
                    });
                }
            }
        })
    }

    // cached data
    getCachedData() {
        this.getCachedCategories();
    }

    getCachedCategories() {
        axios.get(`https://v4.pdm-plants-textures.com/categories.php`)
            .then((response) => {
                this.setState({
                    categories: Category.fromArray(response.data)
                }, () => {
                    this.getCachedItems();
                })
            })
            .catch(() => {
                this.dataDownloaded();
            });
    }

    getCachedItems() {
        axios.get(`https://v4.pdm-plants-textures.com/items.php`)
            .then((response) => {
                this.setState({
                    items: Item.fromArray(response.data)
                }, () => {
                    this.getCachedRelationships();
                })
            })
            .catch(() => {
                this.dataDownloaded();
            });
    }

    getCachedRelationships() {
        axios.get(`https://v4.pdm-plants-textures.com/relationships.php`)
            .then((response) => {
                this.setState({
                    relationships: Relationship.fromArray(response.data)
                }, () => {
                    const homeCategory = this.state.categories.find((category) => category.title === 'Home');
                    this.setState({
                        homeCategoryId: homeCategory && homeCategory.id ? homeCategory.id : 1
                    }, () => {
                        this.getLicense();
                    });
                })
            })
            .catch(() => {
                this.dataDownloaded();
            });
    }

    dataDownloaded = () => {
        this.setState({
            dataDownloaded: true
        });
    }
}

export default App;
