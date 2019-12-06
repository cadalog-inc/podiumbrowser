import React from 'react';
import { Row, Col, FormControl, Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategoryId: 1,
            searchTerm: ""
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

        return (
            <React.Fragment>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
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
                                                return (
                                                    <NavDropdown.Item key={index} onClick={() => { this.handleCategoryChange(category.id) }}>{category.title}</NavDropdown.Item>
                                                )
                                            })
                                        }
                                    </NavDropdown>
                                </Col>
                                <Col key={searchTerm}>
                                    <FormControl type="text" style={{ width: 200 }} defaultValue={searchTerm} onChange={this.handleSearchTermChange} className="mr-sm-2" />
                                </Col>
                                <Col>
                                    <Button type="button" variant="dark" onClick={() => { this.handleOnSearchClick(categoryId) }}>Search</Button>
                                </Col>
                            </Row>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </React.Fragment>
        );
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

    handleSearchTermChange = (event) => {
        const value = event.target.value;
        this.setState({
            searchTerm: value
        });
    }

    handleOnSearchClick = (categoryId) => {
        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=5`);
    }
}