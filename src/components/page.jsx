import React from 'react';
import { Link } from "react-router-dom";
import { Button, Col, Dropdown, InputGroup, Row, Form, OverlayTrigger } from 'react-bootstrap';
import { SideBar } from './sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faAngleLeft, faAngleRight, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Options } from './options';

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
                                categories={categories}
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
                                let items = (this.props.isHomeCategory(category.id) ? this.props.items : this.props.getItemsInCategory(category.id)).filter((item) => {
                                    return (onlyFree === false || item.type === 'free') && (searchTerm === "" || item.title.includes(searchTerm) || this.searchArray(item.tags, searchTerm)) && item.filename.split('.')[1] !== 'hdr';
                                });
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
                                let itemsBegin = categories.length === 1 || category.id === this.props.getHomeCategory() ? pageIndex * pageSize : 0;
                                let itemsEnd = categories.length === 1 || category.id === this.props.getHomeCategory() ? itemsBegin + pageSize : 8;
                                let itemsLength = items.length;
                                let pageBack = pageIndex - 1 > 0 ? pageIndex - 1 : 0;
                                let pageNext = this.calculateNextPage(pageIndex, pageSize, itemsLength);
                                return (
                                    <React.Fragment key={index}>
                                        {
                                            categories.length > 1 ?
                                                <Row style={{ marginTop: 20 }}>
                                                    <Col>
                                                        <h5>{category.title} - {itemsLength} files</h5>
                                                    </Col>
                                                    <Col></Col>
                                                    <Col>
                                                        <Link className="float-right" to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=0&pageSize=6&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}&sortBy=${sortBy}`}>See All</Link>
                                                    </Col>
                                                </Row> : items.length > 0 ?
                                                    <React.Fragment>
                                                        <Row style={{ marginTop: 20 }}>
                                                            <Col>
                                                                <h3>{category.title}</h3>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Options
                                                                    categoryId={categoryId}
                                                                    searchTerm={searchTerm}
                                                                    pageIndex={pageIndex}
                                                                    pageSize={pageSize}
                                                                    onlyFree={onlyFree}
                                                                    onlyRecent={onlyRecent}
                                                                    sortBy={sortBy}
                                                                    pageBack={pageBack}
                                                                    pageNext={pageNext}
                                                                    itemsBegin={itemsBegin}
                                                                    itemsEnd={itemsEnd}
                                                                    itemsLength={itemsLength}
                                                                    {...this.props}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </React.Fragment> : null
                                        }
                                        <Row>
                                            {
                                                items.slice(itemsBegin, itemsEnd).map((item, index) => {
                                                    return (
                                                        <Col key={index} style={{ marginTop: 20, minWidth: 175 }} xl={1} lg={2} md={3} sm={4} xs={6}>
                                                            <OverlayTrigger
                                                                placement="bottom"
                                                                delay={{ dhow: 500 }}
                                                                overlay={(props) => {
                                                                    return (
                                                                        <div
                                                                            {...props}
                                                                            style={{
                                                                                fontSize: '11px',
                                                                                minWidth: 125,
                                                                                color: "#212529",
                                                                                backgroundColor: '#f1f1f1',
                                                                                border: '1px solid #e5e5e5',
                                                                                padding: 2,
                                                                                ...props.style,
                                                                            }}
                                                                        >
                                                                            {this.calculatePathToItem(item.id).slice(1)}
                                                                        </div>
                                                                    )
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        position: 'relative',
                                                                        width: '100%',
                                                                        backgroundColor: '#f1f1f1',
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        border: '1px solid #e5e5e5'
                                                                    }}
                                                                >
                                                                    <img alt='testing 1 2 3'
                                                                        src={"http://v3.pdm-plants-textures.com/images/" + item.imageFile}
                                                                        style={{
                                                                            position: 'relative',
                                                                            width: '100%',
                                                                            cursor: "pointer",
                                                                            borderBottom: '1px solid #e5e5e5'
                                                                        }}
                                                                        onClick={() => { this.props.handleDownloadClick(item) }}
                                                                    />
                                                                    <span
                                                                        style={{
                                                                            position: 'absolute',
                                                                            right: '0px',
                                                                            top: '0px',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={() => { this.props.handleFavoriteClick(item.id) }}
                                                                    >
                                                                        {
                                                                            this.props.user.key !== '' && this.isItemFavorite(item.id) ? <FontAwesomeIcon icon={faStar} color="gold" /> : <FontAwesomeIcon icon={faStar} color="lightgrey" />
                                                                        }
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            fontSize: '11px',
                                                                            width: '100%',
                                                                            padding: 5,
                                                                            borderBottom: '1px solid #e6e6e6'
                                                                        }}
                                                                    >
                                                                        {item.title}
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            height: 27
                                                                        }}
                                                                    >
                                                                        <span
                                                                            style={{
                                                                                position: 'absolute',
                                                                                left: '5px',
                                                                                bottom: '4px',
                                                                                fontSize: '11px',
                                                                                fontWeight: '600'
                                                                            }}
                                                                        >
                                                                            {this.formatFileSize(item.fileSize)} MB
                                                                        </span>
                                                                        <span
                                                                            style={{
                                                                                position: 'absolute',
                                                                                right: '5px',
                                                                                bottom: '2px',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() => { this.props.handleDownloadClick(item) }}
                                                                        >
                                                                            {
                                                                                this.props.user.key !== '' || item.type === 'free' ? <FontAwesomeIcon icon={faDownload} color="#343a40" /> : <FontAwesomeIcon icon={faDownload} color="lightgrey" />
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </OverlayTrigger>
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                        {
                                            categories.length > 1 ?
                                                null : items.length > 0 ?
                                                    <Options
                                                        categoryId={categoryId}
                                                        searchTerm={searchTerm}
                                                        pageIndex={pageIndex}
                                                        pageSize={pageSize}
                                                        onlyFree={onlyFree}
                                                        onlyRecent={onlyRecent}
                                                        sortBy={sortBy}
                                                        pageBack={pageBack}
                                                        pageNext={pageNext}
                                                        itemsBegin={itemsBegin}
                                                        itemsEnd={itemsEnd}
                                                        itemsLength={itemsLength}
                                                        {...this.props}
                                                    /> : null
                                        }
                                    </React.Fragment>
                                )
                            })
                            }
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
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