import React from 'react';
import { Row, Col, Button, Form, FormControl, ListGroup, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Autocomplete from 'react-autocomplete';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryId: 1,
            searchTerm: ""
        }
    }

    componentDidMount() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = null;
        let searchTerm = null;
        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        if(categoryId) {
            if(searchTerm) {
                this.setState({
                    categoryId: categoryId,
                    searchTerm: searchTerm
                })
            } else {
                this.setState({
                    categoryId: categoryId
                })
            }
        }
    }

    render() {
        let primaryCategories = this.props.getSubCategories(1);

        const suggestions = this.state.searchTerm === "" ? [] : this.findSuggestions(this.state.searchTerm);

        return this.props.items.length > 0 ? (
            <React.Fragment>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ height: 70 }}>
                    <Button type="button" variant="dark" onClick={() => { this.handleBackClick() }}>Back</Button>
                    <Button type="button" variant="dark" onClick={() => { this.handleNextClick() }}>Next</Button>
                    <Button type="button" variant="dark" onClick={() => { this.handleCategoryChange(1) }}>Home</Button>
                    <Autocomplete
                        getItemValue={(item) => item.label}
                        items={suggestions}
                        renderItem={(item, isHighlighted) =>
                            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                {item.label}
                            </div>
                        }
                        renderInput={(props) => {
                            return <FormControl {...props} type="text" style={{ width: 400 }} defaultValue={searchTerm} onChange={(e) => this.handleSearchTermChange(e.target.value, () => { })} className="mr-sm-2" />
                        }}
                        value={this.state.searchTerm}
                        default
                        onChange={(e) => this.handleSearchTermChange(e.target.value)}
                        onSelect={(value) => this.handleSearchTermChange(value)}
                    />
                    <Button type="button" variant="dark" onClick={() => { this.handleOnSearchClick(categoryId) }}>Search</Button>

                    {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" />
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
                                <Col>
                                    <Autocomplete
                                        getItemValue={(item) => item.label}
                                        items={suggestions}
                                        renderItem={(item, isHighlighted) =>
                                            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                                {item.label}
                                            </div>
                                        }
                                        renderInput={(props) => {
                                            return <FormControl {...props} type="text" style={{ width: 400 }} defaultValue={searchTerm} onChange={(e)=>this.handleSearchTermChange(e.target.value, ()=>{})} className="mr-sm-2" />
                                        }}
                                        value={this.state.searchTerm}
                                        default
                                        onChange={(e) => this.handleSearchTermChange(e.target.value)}
                                        onSelect={(value) => this.handleSearchTermChange(value)}
                                    />
                                </Col>
                                <Col>
                                    <Button type="button" variant="dark" onClick={() => { this.handleOnSearchClick(categoryId) }}>Search</Button>
                                </Col>
                            </Row>
                        </Nav>
                    </Navbar.Collapse> */}
                    {/* 
<Col key={searchTerm}>
                                    <FormControl type="text" style={{ width: 400 }} defaultValue={searchTerm} onChange={(e)=>this.handleSearchTermChange(e.target.value, ()=>{})} className="mr-sm-2" />
                                </Col>
                                <Col>
                                    <Button type="button" variant="dark" onClick={() => { this.handleOnSearchClick(categoryId) }}>Search</Button>
                                </Col> */}
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
                </Navbar>
            </React.Fragment>
        ) : null;
    }

    handleBackClick = () => {
        this.props.history.goBack();
    }

    handleNextClick = () => {
        this.props.history.goForward();
    }

    handleCategoryChange = (value) => {
        this.setState({
            selectedCategoryId: value
        }, () => {
            this.props.history.push(`/?categoryId=${this.state.categoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=5`);
        });
    }

    handleSearchTermChange = (value) => {
        this.setState({
            searchTerm: value
        });
    }

    searchTags = (tags, value) => {
        const l = tags.length;
        for (let i = 0; i < l; i++) {
            const tag = tags[i];
            if (tag.includes(value)) {
                return tag;
            }
        }
        return false;
    }

    findSuggestions = (searchTerm) => {
        const suggestions = [];
        const l = this.props.items.length;
        for (let i = 0; i < l; i++) {
            const item = this.props.items[i];
            const result = this.searchTags(item.tags, searchTerm);
            if (result && !suggestions.includes(result)) {
                suggestions.push(result);
            }
        }

        const final = Array.from(new Set(suggestions)).sort().slice(0, 10).map((item) => {
            return { label: item }
        });

        return final;
    }

    handleOnSearchClick = (categoryId) => {
        this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=5`);
    }
}