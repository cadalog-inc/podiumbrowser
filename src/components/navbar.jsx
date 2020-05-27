import React from 'react';
import { Button, FormControl, InputGroup, Navbar, NavItem, Col, Row, OverlayTrigger, Container } from 'react-bootstrap';
import Autocomplete from 'react-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faHome, faSearch, faSync, faTimes } from '@fortawesome/free-solid-svg-icons';
import Query from '../models/Query';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategoryId: this.props.getHomeCategory(),
            query: new Query()
        }
        this.search = "";
    }

    componentDidMount() {
        // use most recent query values persisted in local storage
        const savedQueryValues = localStorage.getItem("PodiumBrowserStandaloneQueryValues") || "";
        if (savedQueryValues !== "") {
            this.props.history.push(`/${savedQueryValues}`);
        }

        this.search = this.props.location.search;
        
        const query = Query.fromQueryString(this.props.location.search);
        this.setState({
            query: query
        });
    }

    componentDidUpdate(nextProps) {
        if (this.search !== this.props.location.search) {
            this.search = this.props.location.search;

            // persist latest query values in local storage
            localStorage.setItem("PodiumBrowserStandaloneQueryValues", this.props.location.search);

            const query = Query.fromQueryString(this.props.location.search);
            this.setState({
                query: query
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
        let primaryCategories = this.props.getSubCategories(this.props.getHomeCategory());
        const suggestions = this.state.searchTerm === "" ? [] : this.findSuggestions(this.state.searchTerm);
        return this.props.items.length > 0 ? (
            <React.Fragment>
                <Navbar fill="true" fixed="top" expand="lg" bg="dark" variant="dark" style={{ zIndex: 1 }}>
                    <NavItem>
                        <Button type="button" variant="dark" onClick={() => { this.handleBackClick() }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                        <Button type="button" variant="dark" onClick={() => { this.handleNextClick() }}>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                        <Button type="button" variant="dark" onClick={() => { this.handleCategoryChange(this.props.getHomeCategory()) }}>
                            <FontAwesomeIcon icon={faHome} />
                        </Button>
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
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            type="text"
                                            variant="light"
                                            style={{ width: 400 }}
                                            onKeyUp={this.handleOnSearchKey}
                                            onChange={(e) => {
                                                this.handleSearchTermChange(e.target.value);
                                            }}
                                            {...props}
                                        />
                                        <InputGroup.Append>
                                            <Button
                                                type="button"
                                                variant="light"
                                                style={{ 
                                                    marginLeft: 0,
                                                    borderTopRightRadius: 5,
                                                    borderBottomRightRadius: 5
                                                }}
                                                onClick={() => {
                                                    this.handleSearchTermChange('')
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                            <Button type="button" variant="dark" onClick={this.handleOnSearchClick}>
                                                <FontAwesomeIcon icon={faSearch} />
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup >
                                )
                            }}
                            value={this.state.searchTerm}
                            onChange={(e) => this.handleSearchTermChange(e.target.value)}
                            onSelect={(value) => this.handleSearchTermChange(value, this.handleOnSearchClick)}
                        />
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
            this.props.history.push(`/?categoryId=${this.state.selectedCategoryId}&searchTerm=${this.state.query.searchTerm}&pageIndex=0&pageSize=${this.state.query.pageSize}&onlyFree=${this.state.query.onlyFree}&onlyRecent=${this.state.query.onlyRecent}&sortBy=${this.state.query.sortBy}`);
            window.scrollTo(0, 0);
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
        this.props.history.push(`/?categoryId=${this.state.query.categoryId}&searchTerm=${this.state.query.searchTerm}&pageIndex=0&pageSize=${this.state.query.pageSize}&onlyFree=${this.state.query.onlyFree}&onlyRecent=${this.state.query.onlyRecent}&sortBy=${this.state.query.sortBy}`);
        window.scrollTo(0, 0);
    }
}