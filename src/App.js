import React from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { NavBar } from './components/navbar';
import { Page } from './components/page';
import Category from './models/Category';
import Item from './models/Item';
import Relationship from './models/Relationship';
import User from './models/User';
import categories from './data/categories.json';
import items from './data/items.json';
import relationships from './data/relationships.json';
import License from './models/License';
import { Upload } from './components/upload';
/*global sketchup*/

// todo: handle removing all items on favorites page
// note: https://v4.pdm-plants-textures.com/
// note: 2a2d4d95325c15bf 96d6410f-10f3-48cb-a0f9-64a3931d4074
class App extends React.Component {
    static admin = '3c54d6bf-dfd9-4f2e-a488-1beed5af31ef';
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
            useHDR: false,
            standalone: false,
            dataDownloaded: false
        };
        window["setLicense"] = this.setLicense.bind(this);
        window["validateLicense"] = this.validateLicense.bind(this);
    }

    componentDidMount() {
        this.setState({
            categories: Category.fromArray(categories),
            items: Item.fromArray(items),
            relationships: Relationship.fromArray(relationships),
            license: License.getLicense()
        }, () => {
            const homeCategory = this.state.categories.find((category) => category.title === 'Home');
            this.setState({
                homeCategoryId: homeCategory && homeCategory.id ? homeCategory.id : 1
            }, () => {
                this.getLicense();
            });
        });
    }

    render() {
        return (this.state.dataDownloaded) ? (
            <React.Fragment>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/upload" render={
                            (props) => {
                                return (
                                    <React.Fragment>
                                        <Upload />
                                    </React.Fragment>
                                )
                            }
                        } />
                        {/* using exact broke this in production */}
                        <Route path="/" render={
                            (props) => {
                                return (
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
                                            useHDR={this.state.useHDR}
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

    // admin gallery editing methods

    handleGalleryElementClick = (username) => {

        // username is the name of the user that is using the app

        // This method will get passed down to the Item class via
        // props: App.js -> Page -> Item

        /*
        username.  user.key === '3c54d6bf-dfd9-4f2e-a488-1beed5af31ef' ? (render editing window to allow user to make changes and save them to the server) : null

        */

    }

    handleAddGalleryElement = (username) => {

        // username is the name of the user that is using the app
        // This feature should be available on the navbar and is 
        // conditionally rendered.

        // allows the user to add gallery elements and save them to the server.
    }



    // license methods

    handleUpdateLicense = (license, callback = () => { }) => {
        this.setState({
            license: license
        }, callback);
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
        this.setState({
            license: license,
            useHDR: true,
            standalone: true
        }, () => {
            if (isValid) {
                this.getUser();
            } else {
                this.dataDownloaded();
            }
        })
    }

    validateLicense() {
        this.state.license.validate((license, valid) => {
            this.setState({
                license: license
            }, () => {
                if (valid) {
                    this.getUser();
                } else {
                    this.dataDownloaded();
                }
            });
        }, () => {
            this.dataDownloaded();
        });
    }

    // ruby calls

    handleDownloadClick = (item) => {
        if ((this.state.user.key !== '' && License.isValid(this.state.license)) || item.type === 'free') {
            sketchup.on_load_comp(`${item.hash}|${item.filename.split('.')[1]}|${item.title}|${this.state.license.key}|${this.state.license.fingerprint}`);
            axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/add_recent/${this.state.user.id}/${item.id}/218`)
                .then((response) => {
                    console.log(response.data);
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
                        axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/remove_favorite/${this.state.user.id}/${itemId}/217`)
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
                axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/add_favorite/${this.state.user.id}/${itemId}/217`)
                    .then((response) => {
                        console.log(response);
                    });
            });
        }
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
        const primaryCategoryNames = [
            "Light fixtures exterior",
            "Light fixtures interior",
            "Environment",
            "Materials",
            "Vegetation",
            "People & animals",
            "Vehicles",
            "Kitchen",
            "Bathroom",
            "Bedroom",
            "Dining",
            "Living",
            "Office",
            "Electronic",
            "Decoration",
            "Hardware & construction",
            "Sports equipment",
            "Assembly spaces",
            "Full 3D Models",
            "Windows",
            "Bedroom",
            "Exterior residential",
            "Exterior public",
            "HDR",
            "Holiday"
        ];

        const primaryCategories = [];
        const l = primaryCategoryNames.length;
        for (let i = 0; i < l; i++) {
            const primaryCategoryName = primaryCategoryNames[i];
            const primaryCategory = this.state.categories.filter((category) => {
                return category.title === primaryCategoryName;
            })[0];
            primaryCategories.push(primaryCategory);
        }

        return primaryCategories;
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

    // v4 api calls

    getUser = () => {
        // todo: first get license and if it doesn't exist, then set license?
        axios.get(`https://v3.pdm-plants-textures.com/v4/api/users/set_license/${this.state.license.key}`)
            .then((response) => {
                this.setState({
                    user: new User(response.data.id, response.data.key)
                }, () => {
                    this.getFavorites();
                });
            })
            .catch(() => {
                this.dataDownloaded();
            });
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

    dataDownloaded = () => {
        this.setState({
            dataDownloaded: true
        });
    }
}

export default App;
