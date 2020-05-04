import React from 'react';
import { Link } from "react-router-dom";
import { Col, Dropdown, Row, InputGroup } from 'react-bootstrap';
import { SideBar } from './sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faAngleLeft, faAngleRight, faDownload } from '@fortawesome/free-solid-svg-icons';

export class Page extends React.Component {
    render() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        let searchTerm = "";
        let onlyFree = false;
        let onlyRecent = false;
        let pageIndex = 0;
        let pageSize = 8;
        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        if (queryValues.pageIndex && queryValues.pageIndex !== "" && queryValues.pageIndex >= 0) {
            pageIndex = queryValues.pageIndex;
        }
        if (queryValues.pageSize && queryValues.pageSize !== "" && queryValues.pageSize >= 8) {
            pageSize = queryValues.pageSize;
        }
        if (queryValues.onlyFree !== undefined && queryValues.onlyFree !== "") {
            onlyFree = queryValues.onlyFree === 'true' ? true : false;
        }
        if (queryValues.onlyRecent !== undefined && queryValues.onlyRecent !== "") {
            onlyRecent = queryValues.onlyRecent === 'true' ? true : false;
        }
        let categories = this.props.getSubCategories(categoryId);
        if (categoryId === 1) {
            categories = categories.filter((category) => {
                return category.id === 217 || category.id === 218;
            });
        }
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
                        <Col lg={2} md={3} sm={4} xm={5}>
                            <SideBar
                                categories={categories}
                                parseQueryString={this.props.parseQueryString}
                                getSubCategories={this.props.getSubCategories}
                                calculatePathToCategory={this.calculatePathToCategory}
                                {...this.props}
                            />
                        </Col>
                        <Col lg={10} md={9} sm={8} xm={7}>
                            {
                                categories.length > 1 ?
                                    <Row>
                                        <Col>
                                            <h3>{selectedCategory.title}</h3>
                                        </Col>
                                    </Row> : null
                            }
                            {categories.map((category, index) => {
                                let items = this.props.getItemsInCategory(category.id).filter((item) => {
                                    return (onlyFree === false || item.type === 'free') && (searchTerm === "" || item.title.includes(searchTerm) || this.searchArray(item.tags, searchTerm)) && item.filename.split('.')[1] !== 'hdr';
                                });
                                items = onlyRecent ? items.sort((a, b) => {
                                    if(a.uploadDate < b.uploadDate) {
                                        return -1;
                                    }
                                    if(a.uploadDate > b.uploadDate) {
                                        return 1;
                                    }
                                    return 0;
                                }).splice(0, 100) : items;
                                let itemsBegin = categories.length === 1 ? pageIndex * pageSize : 0;
                                let itemsEnd = categories.length === 1 ? itemsBegin + pageSize : 8;
                                let itemsLength = items.length;
                                let pageBack = pageIndex - 1 > 0 ? pageIndex - 1 : 0;
                                let pageNext = this.calculateNextPage(pageIndex, pageSize, itemsLength);
                                return (
                                    <React.Fragment key={index}>
                                        {
                                            categories.length > 1 && items.length > 0 ?
                                                <Row style={{ marginTop: 20 }}>
                                                    <Col>
                                                        <h5>{category.title} - {itemsLength} files</h5>
                                                    </Col>
                                                    <Col></Col>
                                                    <Col>
                                                        <Link className="float-right" to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=0&pageSize=8&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}`}>See All</Link>
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
                                                                <div className="float-right">
                                                                    <InputGroup className="mb-3">
                                                                        <span><InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}>Items per page:</InputGroup.Text></span>
                                                                        <Dropdown>
                                                                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                                                                {pageSize}
                                                                            </Dropdown.Toggle>

                                                                            <Dropdown.Menu>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(8, searchTerm, categoryId, onlyFree, onlyRecent) }}>8</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(16, searchTerm, categoryId, onlyFree, onlyRecent) }}>16</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(32, searchTerm, categoryId, onlyFree, onlyRecent) }}>32</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(64, searchTerm, categoryId, onlyFree, onlyRecent) }}>64</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(128, searchTerm, categoryId, onlyFree, onlyRecent) }}>128</Dropdown.Item>
                                                                            </Dropdown.Menu>
                                                                        </Dropdown>
                                                                        <span><InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}> {itemsBegin} - {itemsEnd <= itemsLength ? itemsEnd : itemsLength} of {itemsLength} </InputGroup.Text></span>
                                                                        <InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}>
                                                                            <Link to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=${pageBack}&pageSize=${pageSize}&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}`}>
                                                                                <FontAwesomeIcon icon={faAngleLeft} color="darkgrey" />
                                                                            </Link>
                                                                        </InputGroup.Text>
                                                                        <InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}>
                                                                            <Link to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=${pageNext}&pageSize=${pageSize}&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}`}>
                                                                                <FontAwesomeIcon icon={faAngleRight} color="darkgrey" />
                                                                            </Link>
                                                                        </InputGroup.Text>
                                                                    </InputGroup>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </React.Fragment> : null
                                        }
                                        <Row>
                                            {
                                                items.slice(itemsBegin, itemsEnd).map((item, index) => {
                                                    return (
                                                        <Col key={index} style={{marginTop: 20, minWidth: 150}} xl={1} lg={2} md={3} sm={4} xs={6}>
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
                                                                <img alt=''
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
                                                        </Col>
                                                    )
                                                })
                                            }
                                        </Row>
                                        {
                                            categories.length > 1 && items.length > 0 ?
                                                null : items.length > 0 ?
                                                    <Row style={{ marginTop: 20 }}>
                                                        <Col>
                                                            <div className="float-right">
                                                                <InputGroup className="mb-3">
                                                                    <span><InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}>Items per page:</InputGroup.Text></span>
                                                                    <Dropdown>
                                                                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                                                                            {pageSize}
                                                                        </Dropdown.Toggle>

                                                                        <Dropdown.Menu>
                                                                            <Dropdown.Item onClick={() => { this.handlePageSizeClick(8, searchTerm, categoryId, onlyFree, onlyRecent) }}>8</Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => { this.handlePageSizeClick(16, searchTerm, categoryId, onlyFree, onlyRecent) }}>16</Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => { this.handlePageSizeClick(32, searchTerm, categoryId, onlyFree, onlyRecent) }}>32</Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => { this.handlePageSizeClick(64, searchTerm, categoryId, onlyFree, onlyRecent) }}>64</Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => { this.handlePageSizeClick(128, searchTerm, categoryId, onlyFree, onlyRecent) }}>128</Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                    <span><InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}> {itemsBegin} - {itemsEnd <= itemsLength ? itemsEnd : itemsLength} of {itemsLength} </InputGroup.Text></span>
                                                                    <InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}>
                                                                        <Link to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=${pageBack}&pageSize=${pageSize}&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}`}>
                                                                            <FontAwesomeIcon icon={faAngleLeft} color="darkgrey" />
                                                                        </Link>
                                                                    </InputGroup.Text>
                                                                    <InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}>
                                                                        <Link to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=${pageNext}&pageSize=${pageSize}&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}`}>
                                                                            <FontAwesomeIcon icon={faAngleRight} color="darkgrey" />
                                                                        </Link>
                                                                    </InputGroup.Text>
                                                                </InputGroup>
                                                            </div>
                                                        </Col>
                                                    </Row> : null
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

    handlePageSizeClick = (pageSize, searchTerm, categoryId, onlyFree, onlyRecent) => {
        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${searchTerm}&pageIndex=0&pageSize=${pageSize}&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}`);
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
        if (selectedCategory.id === 1) {
            path.push(selectedCategory);
        } else {
            const parentCategory = this.props.categories.find((category) => {
                return category.id === selectedCategory.parentId
            });
            if (parentCategory.id === 1) {
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
            lastCategoryId: 1, // starts at home/1
            categoryIds: [1]
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