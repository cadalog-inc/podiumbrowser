import React from 'react';
import { Link } from "react-router-dom";
import { Button, Breadcrumb, Card, Col, Container, Dropdown, Row, InputGroup } from 'react-bootstrap';
import { SideBar } from './sidebar';

export class Page extends React.Component {
    render() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        let searchTerm = "";
        let pageIndex = 0;
        let pageSize = 5;
        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        if (queryValues.pageIndex && queryValues.pageIndex !== "" && queryValues.pageIndex >= 0) {
            pageIndex = queryValues.pageIndex;
        }
        if (queryValues.pageSize && queryValues.pageSize !== "" && queryValues.pageSize >= 5) {
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
                <Breadcrumb style={{ height: 20, marginBottom: 40 }}>
                    {
                        this.calculatePathToCategory(categoryId).map((category, index) => {
                            return (
                                <Breadcrumb.Item key={index} onClick={() => {
                                    this.handleBreadCrumbClick(category.id, searchTerm)
                                }
                                }>{category.title}</Breadcrumb.Item>
                            )
                        })
                    }
                </Breadcrumb>
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
                                    let itemsEnd = categories.length === 1 ? itemsBegin + pageSize : 3;
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
                                                        <Col></Col>
                                                        <Col>
                                                            <Link className="float-right" to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=0&pageSize=5`}>See All</Link>
                                                        </Col>
                                                    </Row> : items.length > 0 ?
                                                        <Row style={{ margin: 20 }}>
                                                            <Col>
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
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(5, searchTerm, categoryId) }}>5</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(10, searchTerm, categoryId) }}>10</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(25, searchTerm, categoryId) }}>25</Dropdown.Item>
                                                                                <Dropdown.Item onClick={() => { this.handlePageSizeClick(100, searchTerm, categoryId) }}>100</Dropdown.Item>
                                                                            </Dropdown.Menu>
                                                                        </Dropdown>
                                                                        <span><InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}> {itemsBegin} - {itemsEnd <= itemsLength ? itemsEnd : itemsLength} of {itemsLength} </InputGroup.Text></span>
                                                                        <InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}> <Link to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=${pageBack}&pageSize=${pageSize}`}>Back</Link> </InputGroup.Text>
                                                                        <InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}> <Link to={`/?categoryId=${category.id}&searchTerm=${searchTerm}&pageIndex=${pageNext}&pageSize=${pageSize}`}>Next</Link> </InputGroup.Text>
                                                                    </InputGroup>
                                                                </div>
                                                            </Col>
                                                        </Row> : null
                                            }
                                            <Row>
                                                {
                                                    items.slice(itemsBegin, itemsEnd).map((item, index) => {
                                                        return (
                                                            <Col key={index} md="4">
                                                                <Card style={{ width: '18rem', height: '25rem', margin: 20 }}>
                                                                    <Card.Img style={{ height: '200px' }} variant="top" src={"http://v3.pdm-plants-textures.com/images/" + item.imageFile} />
                                                                    <Card.Body>
                                                                        <InputGroup className="mb-3">
                                                                            <InputGroup.Text style={{ backgroundColor: "white", borderColor: "white" }}> {this.formatFileSize(item.fileSize)} MB </InputGroup.Text>
                                                                            <Button variant="light" style={{ width: 60 }}></Button>
                                                                            <Button variant="link" onClick={() => { this.props.handleDownloadClick(item) }}> dl </Button>
                                                                            <Button variant="link" onClick={() => { this.props.handleFavoriteClick(item.id) }}>
                                                                                {
                                                                                    this.isItemFavorite(item.id) ? <b>FAV</b> : <span>fav</span>
                                                                                }
                                                                            </Button>
                                                                        </InputGroup>
                                                                        <Card.Title>{item.title}</Card.Title>
                                                                        <Card.Text>
                                                                            In {this.calculatePathToItem(item.id)}
                                                                        </Card.Text>
                                                                    </Card.Body>
                                                                </Card>
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
        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${searchTerm}&pageIndex=0&pageSize=5`);
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