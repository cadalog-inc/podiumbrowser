import React from 'react';
import { Button, FormControl, Navbar, NavItem, Col, Row, OverlayTrigger, Container } from 'react-bootstrap';
import Autocomplete from 'react-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faHome, faSearch, faSync } from '@fortawesome/free-solid-svg-icons';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategoryId: 1,
            searchTerm: "",
            onlyFree: false,
            onlyRecent: false,
            sortBy: "File Name"
        }
        this.search = "";
    }

    componentDidMount() {
        // use most recent query values persisted in local storage
        const savedQueryValues = localStorage.getItem("PodiumBrowserStandaloneQueryValues") || "";
        if(savedQueryValues !== "") {
            this.props.history.push(`/${savedQueryValues}`);
        }

        this.search = this.props.location.search;
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        let searchTerm = "";
        let onlyFree = false;
        let onlyRecent = false;
        let sortBy = "File Name (A to Z)";

        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
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
        this.setState({
            categoryId: categoryId,
            searchTerm: searchTerm,
            onlyFree: onlyFree,
            onlyRecent: onlyRecent, 
            sortBy: sortBy
        });
    }

    componentDidUpdate(nextProps) {
        if (this.search !== this.props.location.search) {
            this.search = this.props.location.search;

            // persist latest query values in local storage
            localStorage.setItem("PodiumBrowserStandaloneQueryValues", this.props.location.search);

            const queryValues = this.props.parseQueryString(this.props.location.search);
            let categoryId = 1;
            let searchTerm = "";
            let onlyFree = false;
            let onlyRecent = false;
            let sortBy = "File Name (A to Z)";

            if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
                categoryId = queryValues.categoryId;
            }
            if (queryValues.searchTerm && queryValues.searchTerm !== "") {
                searchTerm = queryValues.searchTerm;
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

            this.setState({
                categoryId: categoryId,
                searchTerm: searchTerm,
                onlyFree: onlyFree,
                onlyRecent: onlyRecent, 
                sortBy: sortBy
            });
        }
    }

    getDropdownTranslateX = (index) => {
        if (index >= 0 && index < 7) {
            return 0;
        } else if (index >= 7 && index < 13) {
            return 200;
        } else if (index >= 13 && index < 19) {
            return 400;
        } else {
            return 600;
        }
    }

    getDropdownTranslateY = (index) => {
        if (index >= 0 && index < 7) {
            return 0;
        } else if (index >= 7 && index < 13) {
            return -180;
        } else if (index >= 13 && index < 19) {
            return -360;
        } else {
            return -540;
        }
    }

    render() {
        let primaryCategories = this.props.getSubCategories(1);
        const suggestions = this.state.searchTerm === "" ? [] : this.findSuggestions(this.state.searchTerm);
        return this.props.items.length > 0 ? (
            <React.Fragment>
                <Navbar fill="true" fixed="top" expand="lg" bg="dark" variant="dark" style={{zIndex: 1}}>
                    <NavItem>
                        <Button type="button" variant="dark" onClick={() => { this.handleBackClick() }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                        <Button type="button" variant="dark" onClick={() => { this.handleNextClick() }}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                        <Button type="button" variant="dark" onClick={() => { this.handleCategoryChange(1) }}>
                            <FontAwesomeIcon icon={faHome} />
                        </Button>
                        {/* <Button type="button" variant="dark" onClick={() => { window.location.reload(); }}>
                            <FontAwesomeIcon icon={faSync} />
                        </Button> */}
                    </NavItem>
                    <NavItem>
                        <OverlayTrigger
                            trigger="click"
                            rootClose
                            key={'bottom'}
                            placement={'bottom'}
                            overlay={
                                <Container style={{
                                    zIndex: 2,
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e5e5',
                                    boxShadow: 50,
                                    borderRadius: 10,
                                    padding: 20,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Row>
                                        {
                                            primaryCategories.map((category, index) => {
                                                return category.title !== 'HDR' ? (
                                                    <Col lg={3} md={4} key={index}>
                                                        <span
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={
                                                                () => {
                                                                    this.handleCategoryChange(category.id)
                                                                }
                                                            }
                                                        >
                                                            {category.title}
                                                        </span>
                                                    </Col>
                                                ) : null
                                            })
                                        }
                                    </Row>
                                </Container>
                            }
                        >
                            <Button variant="dark">
                                Categories
                            </Button>
                        </OverlayTrigger>
                    </NavItem>
                    <NavItem>
                        <Autocomplete
                            getItemValue={(item) => item.label}
                            items={suggestions}
                            renderItem={(item, isHighlighted) =>
                                <Container style={{ cursor: 'pointer', background: isHighlighted ? 'lightgray' : 'white' }}>
                                    {item.label}
                                </Container>
                            }
                            renderInput={(props) => {
                                return (
                                    <FormControl
                                        type="text"
                                        className="mr-sm-2"
                                        style={{ width: 400 }}
                                        onKeyUp={this.handleOnSearchKey}
                                        onChange={(e) => {
                                            this.handleSearchTermChange(e.target.value);
                                        }}
                                        {...props}
                                    />
                                )
                            }}
                            value={this.state.searchTerm}
                            onChange={(e) => this.handleSearchTermChange(e.target.value)}
                            onSelect={(value) => this.handleSearchTermChange(value, this.handleOnSearchClick)}
                        />
                        <Button type="button" variant="dark" onClick={this.handleOnSearchClick}>
                            <FontAwesomeIcon icon={faSearch} />
                        </Button>
                    </NavItem>
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
            this.props.history.push(`/?categoryId=${this.state.selectedCategoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=8&onlyFree=${this.state.onlyFree}&onlyRecent=${this.state.onlyRecent}&sortBy=${this.state.sortBy}`);
        });
    }

    handleSearchTermChange = (value, callback = () => { }) => {
        this.setState({
            searchTerm: value
        }, callback);
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

    handleOnSearchKey = (e) => {
        // User pressed the enter key
        if (e.keyCode === 13) {
            this.handleOnSearchClick();
            e.target.blur();
        }
    }

    handleOnSearchClick = () => {
        this.props.history.push(`/?categoryId=${this.state.categoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=8&onlyFree=${this.state.onlyFree}&onlyRecent=${this.state.onlyRecent}&sortBy=${this.state.sortBy}`);
    }
}