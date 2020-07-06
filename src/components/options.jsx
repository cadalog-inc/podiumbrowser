import React from 'react';
import { Button, Dropdown, Form, Nav, Navbar, NavbarBrand } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

export class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSizes: [
                25, 50, 100, 200, 400
            ],
            sortBys: [
                'File Name (A to Z)',
                'File Name (Z to A)',
                'File Size (High to Low)',
                'File Size (Low to High)',
                'Date Uploaded (New to Old)',
                'Date Uploaded (Old to New)'
            ]
        }
    }

    handlePageSizeClick = (pageSize) => {
        this.props.history.push(`/?categoryId=${this.props.query.categoryId}&searchTerm=${this.props.query.searchTerm}&pageIndex=0&pageSize=${pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${this.props.query.sortBy}`);
        window.scrollTo(0, 0);
    }

    handleSortByClick = (sortBy) => {
        this.props.history.push(`/?categoryId=${this.props.query.categoryId}&searchTerm=${this.props.query.searchTerm}&pageIndex=0&pageSize=${this.props.query.pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${sortBy}`);
        window.scrollTo(0, 0);
    }

    handlePageIndexClick = (pageIndex) => {
        this.props.history.push(`/?categoryId=${this.props.query.categoryId}&searchTerm=${this.props.query.searchTerm}&pageIndex=${pageIndex}&pageSize=${this.props.query.pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${this.props.query.sortBy}`);
        window.scrollTo(0, 0);
    }

    render() {
        return this.props.upper ? (
            <React.Fragment>
                <Navbar expand="lg" bg="light">
                    <NavbarBrand>
                        {this.props.category.title}
                    </NavbarBrand>
                    <Navbar.Text>
                        {this.props.itemsLength > 0 ? this.props.itemsBegin + 1 : 0} - {this.props.itemsEnd <= this.props.itemsLength ? this.props.itemsEnd : this.props.itemsLength} of {this.props.itemsLength}
                    </Navbar.Text>
                    <Navbar.Toggle aria-controls="options-navbar-nav" />
                    <Navbar.Collapse className="justify-content-end" id="options-navbar-nav" >
                        <Dropdown size="sm" style={{ margin: 5 }}>
                            <Dropdown.Toggle variant="light">
                                Per page: {this.props.query.pageSize}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    this.state.pageSizes.map((pageSize, index) => {
                                        return (
                                            <Dropdown.Item key={index} onClick={() => {
                                                this.handlePageSizeClick(pageSize)
                                            }}>
                                                {pageSize}
                                            </Dropdown.Item>
                                        );
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown size="sm" style={{ margin: 5 }}>
                            <Dropdown.Toggle variant="light">
                                Sort by: {this.props.query.sortBy}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    this.state.sortBys.map((sortBy, index) => {
                                        return (
                                            <Dropdown.Item key={index} onClick={() => {
                                                this.handleSortByClick(sortBy)
                                            }}>
                                                {sortBy}
                                            </Dropdown.Item>
                                        );
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        {
                            this.props.category.id === 217 ?
                            (
                                <Button type="button" variant="light" style={{ margin: 5 }}
                                    onClick={(e) => {
                                        this.props.handleClearFavoritesClick();
                                    }}>
                                        Clear My Favorites
                                </Button>
                            )
                            : null
                        }
                    </Navbar.Collapse>
                </Navbar>
            </React.Fragment>
        ) : (
                <React.Fragment>
                    <Navbar bg="light" style={{
                        justifyContent: 'center'
                    }}>
                        <Button type="button" variant="light" style={{ margin: 5 }}
                            onClick={() => this.handlePageIndexClick(this.props.pageBack)}>
                            <FontAwesomeIcon icon={faAngleLeft} color="darkgrey" />
                        </Button>
                        <Navbar.Text>
                            {this.props.itemsLength > 0 ? this.props.itemsBegin + 1 : 0} - {this.props.itemsEnd <= this.props.itemsLength ? this.props.itemsEnd : this.props.itemsLength} of {this.props.itemsLength}
                        </Navbar.Text>
                        <Button type="button" variant="light" style={{ margin: 5 }}
                            onClick={() => this.handlePageIndexClick(this.props.pageNext)}>
                            <FontAwesomeIcon icon={faAngleRight} color="darkgrey" />
                        </Button>
                    </Navbar>
                </React.Fragment>
            );
    }
}