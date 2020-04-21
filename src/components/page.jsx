import React from 'react';
import { Link } from "react-router-dom";
import { Button, Breadcrumb, Card, Col, Container, Dropdown, Row, InputGroup } from 'react-bootstrap';
import { SideBar } from './sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faAngleLeft, faAngleRight, faDownload } from '@fortawesome/free-solid-svg-icons';

export class Page extends React.Component {
    render() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        let searchTerm = "";
        let pageIndex = 0;
        let pageSize = 4;
        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        if (queryValues.pageIndex && queryValues.pageIndex !== "" && queryValues.pageIndex >= 0) {
            pageIndex = queryValues.pageIndex;
        }
        if (queryValues.pageSize && queryValues.pageSize !== "" && queryValues.pageSize >= 4) {
            pageSize = queryValues.pageSize;
        }
        let categories = this.props.getSubCategories(categoryId);
        if (categoryId === 1) {
            categories = categories.filter((category) => {
                return category.id === 14 || category.id === 21 || category.id === 24 || category.id === 8 || category.id === 217 || category.id === 218;
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
                <Container fluid>
                    <Row>
                        <Col sm={2}>
                            <SideBar
                                categories={categories}
                                parseQueryString={this.props.parseQueryString}
                                getSubCategories={this.props.getSubCategories}
                                calculatePathToCategory={this.calculatePathToCategory}
                                {...this.props}
                            />
                        </Col>
                        <Col sm={10}>
                            <Container>
                                {
                                    categories.length > 1 ?
                                        <Row>
                                            <Col>
                                                <h3>{selectedCategory.title}</h3>
                                            </Col>
                                        </Row> : null
                                }
                                {categories.map((category, index) => {
                                    const items = this.props.getItemsInCategory(category.id).filter((item) => {
                                        return (searchTerm === "" || this.searchArray(item.tags, searchTerm)) && item.filename.split('.')[1] !== 'hdr';
                                    });
                                    let itemsBegin = categories.length === 1 ? pageIndex * pageSize : 0;
                                    let itemsEnd = categories.length === 1 ? itemsBegin + pageSize : 4;
                                    let itemsLength = items.length;
                                    let pageBack = pageIndex - 1 > 0 ? pageIndex - 1 : 0;
                                    let pageNext = this.calculateNextPage(pageIndex, pageSize, itemsLength);
                                    return (
                                        <React.Fragment key={index}>
                                            {
                                                categories.length > 1 && items.length > 0 ?
                                                    <Row style={{ margin: 20 }}>
                                                        <Col>
                                                            <h5>{category.title} - {itemsLength} files</h5>
                                                        </Col>
                                                        <Col colSpan="3"></Col>
                                                        <Col>
                                                            <Link className="float-right" to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=0&pageSize=4`}>See All</Link>
                                                        </Col>
                                                    </Row> : items.length > 0 ?
                                                        <Row style={{ margin: 20 }}>
                                                            <Col colSpan="3">
                                                                <h3>{category.title}</h3>
                                                            </Col>
                                                            <Col colSpan="2">
                                                                <div className="float-right">
                                                                    <InputGroup className="mb-3">
                                                                        <span><InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}>Items per page:</InputGroup.Text></span>
                                                                        <Dropdown>
                                                                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                                                                {pageSize}
                                                                            </Dropdown.Toggle>

                                                                            <Dropdown.Menu>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(4, searchTerm, categoryId) }}>4</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(16, searchTerm, categoryId) }}>16</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(32, searchTerm, categoryId) }}>32</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(64, searchTerm, categoryId) }}>64</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(128, searchTerm, categoryId) }}>128</Dropdown.Item>
                                                                            </Dropdown.Menu>
                                                                        </Dropdown>
                                                                        <span><InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}> {itemsBegin} - {itemsEnd <= itemsLength ? itemsEnd : itemsLength} of {itemsLength} </InputGroup.Text></span>
                                                                        <InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}>
                                                                            <Link to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=${pageBack}&pageSize=${pageSize}`}>
                                                                                <FontAwesomeIcon icon={faAngleLeft} color="darkgrey" />
                                                                            </Link>
                                                                        </InputGroup.Text>
                                                                        <InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}>
                                                                            <Link to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=${pageNext}&pageSize=${pageSize}`}>
                                                                                <FontAwesomeIcon icon={faAngleRight} color="darkgrey" />
                                                                            </Link>
                                                                        </InputGroup.Text>
                                                                    </InputGroup>
                                                                </div>
                                                            </Col>
                                                        </Row> : null
                                            }
                                            <Row>
                                                {
                                                    items.slice(itemsBegin, itemsEnd).map((item, index) => {
                                                        return (
                                                            <Col key={index} md="3">
                                                                <div
                                                                    style={{
                                                                        position: 'relative',
                                                                        width: '104px',
                                                                        backgroundColor: '#f1f1f1',
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        border: '2px solid #f2f2f2'
                                                                    }}
                                                                >
                                                                    <img alt=''
                                                                        src={"http://v3.pdm-plants-textures.com/images/" + item.imageFile}
                                                                        style={{
                                                                            position: 'relative',
                                                                            width: '100px',
                                                                            cursor: "pointer"
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
                                                                            this.isItemFavorite(item.id) ? <FontAwesomeIcon icon={faStar} color="gold" /> : <FontAwesomeIcon icon={faStar} color="lightgrey" />
                                                                        }
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            fontSize: '11px',
                                                                            width: '100px'
                                                                        }}
                                                                    >
                                                                        {item.title}
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            fontSize: '11px',
                                                                            width: '100px'
                                                                        }}
                                                                    >
                                                                        {this.formatFileSize(item.fileSize)} MB
                                                                    </span>
                                                                    <span
                                                                        style={{
                                                                            position: 'absolute',
                                                                            right: '2px',
                                                                            bottom: '0px',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={() => { this.props.handleDownloadClick(item) }}
                                                                    >
                                                                        {
                                                                            this.props.user.key !== '' ? <FontAwesomeIcon icon={faDownload} color="#343a40" /> : <FontAwesomeIcon icon={faDownload} color="lightgrey" />
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </Col>
                                                        )
                                                    })
                                                }
                                            </Row>
                                        </React.Fragment>
                                    )
                                })
                                }
                            </Container>
                        </Col>
                    </Row>
                </Container>

            </React.Fragment>
        );
    }

    handleBreadCrumbClick = (categoryId, searchTerm) => {
        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${searchTerm}&pageIndex=0&pageSize=4`);
    }

    handlePageSizeClick = (pageSize, searchTerm, categoryId) => {
        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${searchTerm}&pageIndex=0&pageSize=${pageSize}`);
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