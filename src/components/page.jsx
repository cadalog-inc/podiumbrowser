import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { SideBar } from './sidebar';
import { Category } from './category';
import { SubCategories } from './subcategories';

export class Page extends React.Component {
    render() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = this.props.getHomeCategory();
        let searchTerm = "";
        let onlyFree = false;
        let onlyRecent = false;
        let pageIndex = 0;
        let pageSize = 6;
        let sortBy = "File Name (A to Z)";
        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        if (queryValues.pageIndex && queryValues.pageIndex !== "" && queryValues.pageIndex >= 0) {
            pageIndex = queryValues.pageIndex;
        }
        if (queryValues.pageSize && queryValues.pageSize !== "" && queryValues.pageSize >= 6) {
            pageSize = queryValues.pageSize;
        }
        if (queryValues.onlyFree !== undefined && queryValues.onlyFree !== "") {
            onlyFree = queryValues.onlyFree === 'true' ? true : false;
        }
        if (queryValues.onlyRecent !== undefined && queryValues.onlyRecent !== "") {
            onlyRecent = queryValues.onlyRecent === 'true' ? true : false;
        }
        if (queryValues.sortBy !== undefined && queryValues.sortBy !== "") {
            sortBy = queryValues.sortBy;
        }

        let categories = this.props.isHomeCategory(categoryId) ? [] : this.props.getSubCategories(categoryId);
        const selectedCategory = this.props.categories.find((category) => {
            return category.id === categoryId
        });
        if (categories.length === 0) {

            categories.push(selectedCategory);
        }
        return (
            <React.Fragment>
                <div style={{ marginTop: 55, marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
                    <Row>
                        <Col xl={2} lg={3} md={4} sm={5} xs={6} style={{ padding: 0 }}>
                            <SideBar
                                user={this.props.user}
                                categories={this.props.categories}
                                parseQueryString={this.props.parseQueryString}
                                getSubCategories={this.props.getSubCategories}
                                calculatePathToCategory={this.calculatePathToCategory}
                                getHomeCategory={this.getHomeCategory}
                                isHomeCategory={this.props.isHomeCategory}
                                {...this.props}
                            />
                        </Col>
                        <Col xl={10} lg={9} md={8} sm={7} xs={6}>
                            {
                                categories.length > 1 ?
                                    <Row>
                                        <Col>
                                            <h3>{selectedCategory.title}</h3>
                                        </Col>
                                    </Row> : null
                            }
                            {categories.map((category, index) => {
                                return categories.length > 1 ? (
                                    <SubCategories
                                        key={index}
                                        category={category}
                                        categoriesLength={categories.length}
                                        getHomeCategory={this.props.getHomeCategory}
                                        isHomeCategory={this.props.isHomeCategory}
                                        getItemsInCategory={this.props.getItemsInCategory}
                                        searchArray={this.searchArray}
                                        sortItems={this.sortItems}
                                        calculateNextPage={this.calculateNextPage}
                                        calculatePathToItem={this.calculatePathToItem}
                                        handleDownloadClick={this.props.handleDownloadClick}
                                        handleFavoriteClick={this.props.handleFavoriteClick}
                                        isItemFavorite={this.isItemFavorite}
                                        formatFileSize={this.formatFileSize}
                                        categoryId={categoryId}
                                        searchTerm={searchTerm}
                                        onlyFree={onlyFree}
                                        onlyRecent={onlyRecent}
                                        pageIndex={pageIndex}
                                        pageSize={pageSize}
                                        sortBy={sortBy}
                                        {...this.props}
                                    />
                                ) : (
                                        <Category
                                            key={index}
                                            category={category}
                                            categoriesLength={categories.length}
                                            getHomeCategory={this.props.getHomeCategory}
                                            isHomeCategory={this.props.isHomeCategory}
                                            getItemsInCategory={this.props.getItemsInCategory}
                                            searchArray={this.searchArray}
                                            sortItems={this.sortItems}
                                            calculateNextPage={this.calculateNextPage}
                                            calculatePathToItem={this.calculatePathToItem}
                                            handleDownloadClick={this.props.handleDownloadClick}
                                            handleFavoriteClick={this.props.handleFavoriteClick}
                                            isItemFavorite={this.isItemFavorite}
                                            formatFileSize={this.formatFileSize}
                                            categoryId={categoryId}
                                            searchTerm={searchTerm}
                                            onlyFree={onlyFree}
                                            onlyRecent={onlyRecent}
                                            pageIndex={pageIndex}
                                            pageSize={pageSize}
                                            sortBy={sortBy}
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

    sortItems = (items, onlyRecent, sortBy) => {
        if (onlyRecent) {
            items = items.sort((a, b) => {
                if (a.uploadDate < b.uploadDate) {
                    return -1;
                }
                if (a.uploadDate > b.uploadDate) {
                    return 1;
                }
                return 0;
            }).splice(0, 100);
        } else {
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

    calculatePathToCategory = (categoryId) => {
        const path = [];
        const selectedCategory = this.props.categories.find((category) => {
            return category.id === categoryId
        });
        if (selectedCategory.id === this.props.getHomeCategory()) {
            path.push(selectedCategory);
        } else {
            const parentCategory = this.props.categories.find((category) => {
                return category.id === selectedCategory.parentId
            });
            if (parentCategory.id === this.props.getHomeCategory()) {
                path.push(parentCategory);
                path.push(selectedCategory);
            } else {
                const parentParentCategory = this.props.categories.find((category) => {
                    return category.id === parentCategory.parentId
                });
                path.push(parentParentCategory);
                path.push(parentCategory);
                path.push(selectedCategory);
            }
        }
        return path;
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
            return item.categoryId === 217 && item.itemId === itemId
        });
        return relationship !== undefined;
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