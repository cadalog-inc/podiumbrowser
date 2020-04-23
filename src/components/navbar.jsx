import React from 'react';
import { Button, FormControl, Navbar, DropdownButton, NavItem, Dropdown } from 'react-bootstrap';
import Autocomplete from 'react-autocomplete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategoryId: 1,
            searchTerm: "",
            onlyFree: false,
            onlyRecent: false
        }
        this.search = "";
    }

    componentDidMount() {
        this.search = this.props.location.search;
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        let searchTerm = "";
        let onlyFree = false;
        let onlyRecent = false;

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
        this.setState({
            categoryId: categoryId,
            searchTerm: searchTerm,
            onlyFree: onlyFree,
            onlyRecent: onlyRecent
        });
    }

    componentDidUpdate(nextProps) {
        if (this.search !== this.props.location.search) {
            this.search = this.props.location.search;
            const queryValues = this.props.parseQueryString(this.props.location.search);
            let categoryId = 1;
            let searchTerm = "";
            let onlyFree = false;
            let onlyRecent = false;

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

            this.setState({
                categoryId: categoryId,
                searchTerm: searchTerm,
                onlyFree: onlyFree,
                onlyRecent: onlyRecent
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
                <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ height: 55 }}>
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
                    </NavItem>
                    <NavItem>
                        <Dropdown>
                            <Dropdown.Toggle variant="dark">
                                Categories
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={true ? { height: 240 } : null}>
                                {
                                    primaryCategories.map((category, index) => {
                                        return category.title !== 'HDR' ? (
                                            <Dropdown.Item
                                                key={index}
                                                style={true ? {
                                                    width: 200,
                                                    height: 30,
                                                    transform: `translate(${this.getDropdownTranslateX(index)}px, ${this.getDropdownTranslateY(index)}px)`
                                                } : null}
                                                onClick={
                                                    () => {
                                                        this.handleCategoryChange(category.id)
                                                    }
                                                }
                                            >
                                                {category.title}
                                            </Dropdown.Item>
                                        ) : null
                                    })
                                }
                                {
                                    true ? <Dropdown.Divider style={{ width: 800 }} /> : null
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </NavItem>
                    <NavItem>
                        <div style={{zIndex: 10000}}>
                            <Autocomplete
                                getItemValue={(item) => item.label}
                                items={suggestions}
                                renderItem={(item, isHighlighted) =>
                                    <div style={{background: isHighlighted ? 'lightgray' : 'white' }}>
                                        {item.label}
                                    </div>
                                }
                                renderInput={(props) => {
                                    return <FormControl {...props} type="text" style={{ width: 400 }} onKeyUp={this.handleOnSearchKey} onChange={(e) => this.handleSearchTermChange(e.target.value)} className="mr-sm-2" />
                                }}
                                value={this.state.searchTerm}
                                onChange={(e) => this.handleSearchTermChange(e.target.value)}
                                onSelect={(value) => this.handleSearchTermChange(value, this.handleOnSearchClick)}
                            />
                            <Button type="button" variant="dark" onClick={this.handleOnSearchClick}>
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                        </div>
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
            this.props.history.push(`/?categoryId=${this.state.selectedCategoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=8&onlyFree=${this.state.onlyFree}&onlyRecent=${this.state.onlyRecent}`);
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
        this.props.history.push(`/?categoryId=${this.state.categoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=8&onlyFree=${this.state.onlyFree}&onlyRecent=${this.state.onlyRecent}`);
    }
}