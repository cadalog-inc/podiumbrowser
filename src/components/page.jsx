import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'react-bootstrap';
import { SideBar } from './SideBar';
import { Category } from './Category';
import { SubCategories } from './SubCategories';
import Query from '../models/Query';
import { EditCategory } from './admin/EditCategory';

export class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }
    render() {
        const query = Query.fromQueryString(this.props.location.search);

        let categories = this.props.isHomeCategory(query.categoryId) ? [] : this.props.getSubCategories(query.categoryId);
        const selectedCategory = this.props.categories.find((category) => {
            return category.id === query.categoryId
        });
        if (categories.length === 0) {
            categories.push(selectedCategory);
        }
        return (
            <React.Fragment>
                {
                    window.admin && selectedCategory !== null && selectedCategory !== undefined ?
                        <EditCategory
                            show={this.state.show}
                            category={selectedCategory}
                            isHomeCategory={this.props.isHomeCategory}
                            categories={this.props.categories}
                            items={this.props.items}
                            canUploadItems={false}
                            handleClose={(e) => {
                                this.setState({
                                    show: false
                                })
                            }}
                        /> : null
                }
                <div style={{
                    marginTop: 55,
                    marginBottom: 10,
                    marginLeft: 10,
                    marginRight: 10
                }}>
                    <Row>
                        <Col xl={2} lg={3} md={4} sm={5} xs={6} style={{ padding: 0 }}>
                            <SideBar
                                query={query}
                                user={this.props.user}
                                categories={this.props.categories}
                                getSubCategories={this.props.getSubCategories}
                                getHomeCategory={this.getHomeCategory}
                                isHomeCategory={this.props.isHomeCategory}
                                useHDR={this.props.useHDR}
                                getRecentDownloadedCategoryId={this.props.getRecentDownloadedCategoryId}
                                getMyFavoritesCategoryId={this.props.getMyFavoritesCategoryId}
                                {...this.props}
                            />
                        </Col>
                        <Col xl={10} lg={9} md={8} sm={7} xs={6}>
                            {
                                categories.length > 1 ?
                                    <Row className="ml-1 mt-4">
                                        <Col>
                                            <h3 style={{ marginBottom: 35 }}>{selectedCategory.title} {
                                                window.admin ?
                                                    <React.Fragment>
                                                        <FontAwesomeIcon
                                                            onClick={(e) => {
                                                                this.setState({ show: true })
                                                            }}
                                                            icon={faEdit}
                                                            title="Edit Category"
                                                        />
                                                        <FontAwesomeIcon
                                                            style={{ marginLeft: 5 }}
                                                            onClick={(e) => {
                                                                var title = prompt("Enter title of new sub category");
                                                                if (title !== null && title !== "") {
                                                                    const category = {
                                                                        id: Number(new Date()) + this.props.categories.length,
                                                                        title: title,
                                                                        parentId: query.categoryId,
                                                                        primaryIndex: -1
                                                                    }
                                                                    const page = this;
                                                                    var params = {
                                                                        TableName: "Categories",
                                                                        Item: category
                                                                    };
                                                                    window.docClient.put(params, function (err, data) {
                                                                        if (err) {
                                                                            console.log(err);
                                                                        } else {
                                                                            console.log(data);
                                                                            page.props.categories.push(category);
                                                                            page.forceUpdate();
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                            icon={faPlusSquare}
                                                            title="Add Sub Category"
                                                            color="teal"
                                                        />
                                                    </React.Fragment>
                                                    : null
                                            }</h3>
                                        </Col>
                                    </Row> : null
                            }
                            {categories.sort((a, b) => {
                                return a.title > b.title ? 1 : -1
                            }).map((category, index) => {
                                return categories.length > 1 ? (
                                    <SubCategories
                                        license={this.props.license}
                                        key={index}
                                        category={category}
                                        categoriesLength={categories.length}
                                        getHomeCategory={this.props.getHomeCategory}
                                        isHomeCategory={this.props.isHomeCategory}
                                        getItemsInCategory={this.props.getItemsInCategory}
                                        getSubCategories={this.props.getSubCategories}
                                        searchArray={this.searchArray}
                                        sortItems={this.sortItems}
                                        calculateNextPage={this.calculateNextPage}
                                        calculatePathToItem={this.calculatePathToItem}
                                        handleDownloadClick={this.props.handleDownloadClick}
                                        handleFavoriteClick={this.props.handleFavoriteClick}
                                        isItemFavorite={this.isItemFavorite}
                                        isItemRecent={this.props.isItemRecent}
                                        formatFileSize={this.formatFileSize}
                                        query={query}
                                        useHDR={this.props.useHDR}
                                        selectedAction={this.props.selectedAction}
                                        updateSelectedAction={this.props.updateSelectedAction}
                                        selectedItems={this.props.selectedItems}
                                        updateSelectedItems={this.props.updateSelectedItems}
                                        getRecentDownloadedCategoryId={this.props.getRecentDownloadedCategoryId}
                                        getMyFavoritesCategoryId={this.props.getMyFavoritesCategoryId}
                                        {...this.props}
                                    />
                                ) : (
                                        <Category
                                            license={this.props.license}
                                            key={index}
                                            category={category}
                                            categories={categories}
                                            categoriesLength={categories.length}
                                            getHomeCategory={this.props.getHomeCategory}
                                            isHomeCategory={this.props.isHomeCategory}
                                            isPrimaryCategory={this.props.isPrimaryCategory}
                                            getItemsInCategory={this.props.getItemsInCategory}
                                            searchArray={this.searchArray}
                                            sortItems={this.sortItems}
                                            calculateNextPage={this.calculateNextPage}
                                            calculatePathToItem={this.calculatePathToItem}
                                            handleDownloadClick={this.props.handleDownloadClick}
                                            handleFavoriteClick={this.props.handleFavoriteClick}
                                            isItemFavorite={this.isItemFavorite}
                                            isItemRecent={this.props.isItemRecent}
                                            formatFileSize={this.formatFileSize}
                                            query={query}
                                            useHDR={this.props.useHDR}
                                            updateFromOptions={this.updateFromOptions}
                                            selectedAction={this.props.selectedAction}
                                            updateSelectedAction={this.props.updateSelectedAction}
                                            selectedItems={this.props.selectedItems}
                                            selectAllItemsInCategory={this.props.selectAllItemsInCategory}
                                            updateSelectedItems={this.props.updateSelectedItems}
                                            getRecentDownloadedCategoryId={this.props.getRecentDownloadedCategoryId}
                                            getMyFavoritesCategoryId={this.props.getMyFavoritesCategoryId}
                                            handleClearFavoritesClick={this.props.handleClearFavoritesClick}
                                            {...this.props}
                                        />
                                    );
                            })
                            }
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }

    updateFromOptions = () => {
        this.forceUpdate();
    }

    sortItems = (items, sortBy) => {
        if (sortBy === "File Size (Low to High)") {
            items = items.sort((a, b) => {
                if (a.fileSize < b.fileSize) {
                    return -1;
                }
                if (a.fileSize > b.fileSize) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy === "File Size (High to Low)") {
            items = items.sort((a, b) => {
                if (a.fileSize > b.fileSize) {
                    return -1;
                }
                if (a.fileSize < b.fileSize) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy === "Date Uploaded (New to Old)") {
            items = items.sort((a, b) => {
                if (a.uploadDate > b.uploadDate) {
                    return -1;
                }
                if (a.uploadDate < b.uploadDate) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy === "Date Uploaded (Old to New)") {
            items = items.sort((a, b) => {
                if (a.uploadDate < b.uploadDate) {
                    return -1;
                }
                if (a.uploadDate > b.uploadDate) {
                    return 1;
                }
                return 0;
            });
        } else if (sortBy === "File Name (Z to A)") {
            items = items.sort((a, b) => {
                if (a.title > b.title) {
                    return -1;
                }
                if (a.title < b.title) {
                    return 1;
                }
                return 0;
            });
        } else {
            items = items.sort((a, b) => {
                if (a.title < b.title) {
                    return -1;
                }
                if (a.title > b.title) {
                    return 1;
                }
                return 0;
            });
        }
    }

    calculatePathToItem = (itemId) => {
        const itemsCategories = this.props.relationships.filter((item) => {
            return item.itemId === itemId
        });

        const pathToItem = {
            lastCategoryId: this.props.getHomeCategory(), // starts at home/1
            categoryIds: [this.props.getHomeCategory()]
        };

        let sanity = 0; // sanity check, limit depth of path to < 10

        let l = itemsCategories.length;
        while (itemsCategories.length > 0 && sanity < 10) {
            l = itemsCategories.length;
            for (let i = 0; i < l; i++) {
                const itemCategory = itemsCategories[i];
                const category = this.props.categories.find((c) => {
                    return c.id === itemCategory.categoryId
                });
                if (category && category.parentId === pathToItem.lastCategoryId) {
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
            const category = this.props.categories.find((c) => {
                return c.id === categoryId
            });
            if (i !== 0) {
                pathToItemString += `/ ${category.title}`;
            }
        }

        return pathToItemString;
    }

    isItemFavorite = (itemId) => {
        const relationship = this.props.relationships.find((item) => {
            return item.categoryId === this.props.getMyFavoritesCategoryId() && item.itemId === itemId
        });
        return relationship !== undefined;
    }

    searchArray = (items, value) => {
        if (items) {
            const l = items.length;
            for (let i = 0; i < l; i++) {
                const item = items[i];
                if (item.toUpperCase().includes(value.toUpperCase())) {
                    return true;
                }
            }
        }
        return false;
    }

    formatFileSize(bytes) {
        const size = Math.round(bytes / Math.pow(1024, 2));
        if (size < 1) {
            return '< 1';
        } else {
            return size;
        }
    }

    calculateNextPage(pageIndex, pageSize, itemsLength) {
        let nextPageIndex = pageIndex + 1;
        let totalPages = Math.floor(itemsLength / pageSize);
        let remainingItems = itemsLength % pageSize;
        if (nextPageIndex <= totalPages - 1) {
            return nextPageIndex;
        } else if (nextPageIndex === totalPages && remainingItems > 0) {
            return nextPageIndex;
        } else {
            return pageIndex;
        }
    }
}