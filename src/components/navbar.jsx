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
        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        let primaryCategories = this.props.getSubCategories(1);

        return (
            <React.Fragment>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
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
                                <Col>
                                    <FormControl type="text" defaultValue={searchTerm} onChange={this.handleSearchTermChange} className="mr-sm-2" />
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

    handleCategoryChange = (value) => {
        this.setState({
            selectedCategoryId: value
        }, () => {
            this.props.history.push(`/?categoryId=${this.state.selectedCategoryId}&searchTerm=${this.state.searchTerm}`);
        });
    }

    handleSearchTermChange = (event) => {
        const value = event.target.value;
        this.setState({
            searchTerm: value
        });
    }

    handleOnSearchClick = (categoryId) => {
        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${this.state.searchTerm}`);
    }
}