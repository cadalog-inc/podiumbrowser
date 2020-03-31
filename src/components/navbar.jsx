import React from 'react';
import { Row, Col, FormControl, Button, Nav, Navbar, NavDropdown, Dropdown } from 'react-bootstrap';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategoryId: 1,
            searchTerm: "",
            searchItems: []
        }
    }

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
        let primaryCategories = this.props.getSubCategories(1);

        return this.props.items.length > 0 ? (
            <React.Fragment>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ height: 70 }}>
                    <Button type="button" variant="dark" onClick={() => { this.handleBackClick() }}>Back</Button>
                    <Button type="button" variant="dark" onClick={() => { this.handleNextClick() }}>Next</Button>
                    <Button type="button" variant="dark" onClick={() => { this.handleCategoryChange(1) }}>Home</Button>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Row>
                                <Col>
                                    <NavDropdown title="Categories" id="collasible-nav-dropdown">
                                        {
                                            primaryCategories.map((category, index) => {
                                                return category.title !== 'HDR' ? (
                                                    <NavDropdown.Item key={index} onClick={
                                                        () => {
                                                            this.handleCategoryChange(category.id)
                                                        }
                                                    }>
                                                        {category.title}
                                                    </NavDropdown.Item>
                                                ) : null
                                            })
                                        }
                                    </NavDropdown>
                                </Col>
                                <Col key={searchTerm}>
                                    <FormControl type="text" style={{ width: 400 }} defaultValue={searchTerm} onChange={(e)=>this.handleSearchTermChange(e.target.value, ()=>{})} className="mr-sm-2" />
                                </Col>
                                <Col>
                                    <Button type="button" variant="dark" onClick={() => { this.handleOnSearchClick(categoryId) }}>Search</Button>
                                </Col>
                                {/* <Col key={searchTerm}>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary">
                                            <FormControl autoFocus type="text" defaultValue={searchTerm} onChange={
                                                (e) => {
                                                    const value = e.target.value;
                                                    const callback = () => {
                                                        this.autoComplete(value, categoryId);
                                                    };
                                                    this.handleSearchTermChange(value, callback)
                                                }
                                             } className="mr-sm-2" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {
                                                this.state.searchItems.map((item, index) => {
                                                    return (
                                                        <Dropdown.Item
                                                            key={index}
                                                            onSelect={() => this.handleSearchTermChange(item.title, () => this.handleOnSearchClick(categoryId))}
                                                        >
                                                            {item.title}
                                                        </Dropdown.Item>
                                                    )
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col> */}
                            </Row>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </React.Fragment>
        ) : null;
    }

    handleBackClick = (event) => {
        this.props.history.goBack();
    }

    handleNextClick = (event) => {
        this.props.history.goForward();
    }

    handleCategoryChange = (value) => {
        this.setState({
            selectedCategoryId: value
        }, () => {
            this.props.history.push(`/?categoryId=${this.state.selectedCategoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=5`);
        });
    }

    handleSearchTermChange = (value, callback) => {
        this.setState({
            searchTerm: value
        }, callback);
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

    autoComplete = (searchTerm, categoryId) => {
        const items = this.props.getItemsInCategory(categoryId);
        const filtered = items.filter((item) => {
            return (searchTerm === "" || this.searchArray(item.tags, searchTerm)) && item.filename.split('.')[1] !== 'hdr';
        })
        this.setState({
            searchItems: filtered.slice(0, 10)
        });
    }

    handleOnSearchClick = (categoryId) => {
        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=5`);
    }
}