import React from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { Path } from './path';

export class SideBar extends React.Component {
    render() {
        const queryValues = this.props.parseQueryString(this.props.location.search);
        let categoryId = this.props.getHomeCategory();
        let searchTerm = "";
        let onlyFree = false;
        let onlyRecent = false;
        let pageSize = 6;
        let sortBy = "File Name (A to Z)";

        if (queryValues.categoryId && queryValues.categoryId !== "" && queryValues.categoryId > 0) {
            categoryId = queryValues.categoryId;
        }
        if (queryValues.searchTerm && queryValues.searchTerm !== "") {
            searchTerm = queryValues.searchTerm;
        }
        if (queryValues.pageSize && queryValues.pageSize !== "" && queryValues.pageSize >= 6) {
            pageSize = queryValues.pageSize;
        }
        if (queryValues.onlyFree !== undefined && queryValues.onlyFree !== "") {
            onlyFree = queryValues.onlyFree === 'true' ? true : false;
        }
        if (queryValues.onlyRecent !== undefined && queryValues.onlyRecent !== "") {
            onlyRecent = queryValues.onlyRecent === 'true' ? true : false;
        }
        if (queryValues.pageSize && queryValues.pageSize !== "" && queryValues.pageSize >= 6) {
            pageSize = queryValues.pageSize;
        }
        if (queryValues.sortBy !== undefined && queryValues.sortBy !== "") {
            sortBy = queryValues.sortBy;
        }

        const selectedCategory = this.props.categories.find((category) => {
            return category.id === categoryId
        });
        let categories = this.props.getSubCategories(categoryId);
        if (this.props.isHomeCategory(categoryId) || categories.length === 0) {
            categories = [selectedCategory];
        }
        const primaryCategories = this.props.getSubCategories(this.props.getHomeCategory());

        const homeCategories = this.props.categories.filter((category) => {
            return category.id === 217 || category.id === 218;
        });

        return (
            <React.Fragment>
                <div style={{
                    backgroundColor: "#f1f1f1",
                    margin: 10,
                    padding: 0,
                    border: "1px solid #e5e5e5"
                }}>
                    {
                        selectedCategory.id !== this.props.getHomeCategory() && selectedCategory.id !== 217 && selectedCategory.id !== 218 ? <React.Fragment>
                            <Path
                                handleCategoryChange={this.handleCategoryChange}
                                renderPath={this.renderPath}
                                getHomeCategory={this.props.getHomeCategory}
                                categories={this.props.categories}
                                subCategories={categories}
                                categoryId={categoryId}
                                searchTerm={searchTerm}
                                onlyFree={onlyFree}
                                onlyRecent={onlyRecent}
                                sortBy={sortBy}
                            />
                        </React.Fragment> : null
                    }
                    <div className="form-check" style={{ margin: 10 }}>
                        <input className="form-check-input" type="checkbox" defaultChecked={onlyFree} onChange={(e) => {
                            this.props.history.push(`/?categoryId=${categoryId}&searchTerm=${searchTerm}&pageIndex=0&pageSize=${pageSize}&onlyFree=${e.target.checked}&onlyRecent=${onlyRecent}&sortBy=${sortBy}`);
                        }} id="freeChecked" />
                        <label className="form-check-label" htmlFor="freeChecked">
                            Show only free files
                        </label>
                    </div>
                    {

                        this.props.user.key !== '' ? <React.Fragment>
                            <ButtonGroup vertical style={{
                                padding: 5,
                                width: '100%'
                            }}>
                                {
                                    homeCategories.map((category, index) => {
                                        return (
                                            <Button key={index} variant="light"
                                                style={{
                                                    margin: 2,
                                                    textAlign: "left"
                                                }}
                                                onClick={() => {
                                                    this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent, sortBy)
                                                }}>
                                                {category.title}
                                            </Button>
                                        )
                                    })
                                }
                            </ButtonGroup>
                        </React.Fragment> : null
                    }
                    <ButtonGroup vertical style={{
                        padding: 5,
                        width: '100%'
                    }}>
                        {
                            primaryCategories.filter((category) => category.title !== 'HDR').map((category, index) => {
                                return (
                                    <Button key={index} variant="light"
                                        style={{
                                            margin: 2,
                                            textAlign: "left"
                                        }}
                                        onClick={() => {
                                            this.handleCategoryChange(category.id, searchTerm, onlyFree, onlyRecent, sortBy)
                                        }}>
                                        {category.title}
                                    </Button>
                                )
                            })
                        }
                    </ButtonGroup>
                </div>
            </React.Fragment>
        );
    }

    handleCategoryChange = (value, searchTerm, onlyFree, onlyRecent, sortBy) => {
        this.props.history.push(`/?categoryId=${value}&searchTerm=${searchTerm}&pageIndex=0&pageSize=6&onlyFree=${onlyFree}&onlyRecent=${onlyRecent}&sortBy=${sortBy}`);
        window.scrollTo(0, 0);
    }
}