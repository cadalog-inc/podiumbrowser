import React from 'react';
import { Button, FormControl, Navbar, DropdownButton, NavItem, Dropdown } from 'react-bootstrap';
import Autocomplete from 'react-autocomplete';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategoryId: 1,
            searchTerm: ""
        }
        this.search = "";
    }

    componentDidMount() {
        this.search = this.props.location.search;
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = 1;
        let searchTerm = "";

        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        this.setState({
            categoryId: categoryId,
            searchTerm: searchTerm
        });
    }

    componentDidUpdate(nextProps) {
        if (this.search !== this.props.location.search) {
            this.search = this.props.location.search;
            const queryValues = this.props.parseQueryString(this.props.location.search);
            let categoryId = 1;
            let searchTerm = "";

            if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
                categoryId = queryValues.categoryId;
            }
            if (queryValues.searchTerm && queryValues.searchTerm !== "") {
                searchTerm = queryValues.searchTerm;
            }

            this.setState({
                categoryId: categoryId,
                searchTerm: searchTerm
            });
        }
    }

    render() {
        let primaryCategories = this.props.getSubCategories(1);
        const suggestions = this.state.searchTerm === "" ? [] : this.findSuggestions(this.state.searchTerm);
        return this.props.items.length > 0 ? (
            <React.Fragment>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ height: 70 }}>
                    <NavItem>
                        <Button type="button" variant="dark" onClick={() => { this.handleBackClick() }}>Back</Button>
                        <Button type="button" variant="dark" onClick={() => { this.handleNextClick() }}>Next</Button>
                        <Button type="button" variant="dark" onClick={() => { this.handleCategoryChange(1) }}>Home</Button>
                    </NavItem>
                    <NavItem>
                        <DropdownButton variant="dark" title="Categories" id="collasible-nav-dropdown">
                            {
                                primaryCategories.map((category, index) => {
                                    return category.title !== 'HDR' ? (
                                        <Dropdown.Item key={index} onClick={
                                            () => {
                                                this.handleCategoryChange(category.id)
                                            }
                                        }>
                                            {category.title}
                                        </Dropdown.Item>
                                    ) : null
                                })
                            }
                        </DropdownButton>
                    </NavItem>
                    <NavItem>
                        <Autocomplete
                            getItemValue={(item) => item.label}
                            items={suggestions}
                            renderItem={(item, isHighlighted) =>
                                <div style={{ zIndex: 10, background: isHighlighted ? 'lightgray' : 'white' }}>
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
                        <Button type="button" variant="dark" onClick={this.handleOnSearchClick}>Search</Button>
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
            this.props.history.push(`/?categoryId=${this.state.selectedCategoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=5`);
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
        this.props.history.push(`/?categoryId=${this.state.categoryId}&searchTerm=${this.state.searchTerm}&pageIndex=0&pageSize=5`);
    }
}