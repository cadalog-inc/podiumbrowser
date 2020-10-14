import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Path } from './Path';

export class SideBar extends React.Component {
    render() {
        const selectedCategory = this.props.categories.find((category) => {
            return category.id === this.props.query.categoryId
        });
        let categories = this.props.getSubCategories(this.props.query.categoryId);
        if (this.props.isHomeCategory(this.props.query.categoryId) || categories.length === 0) {
            categories = [selectedCategory];
        }
        const primaryCategories = this.props.getSubCategories(this.props.getHomeCategory());

        const homeCategories = this.props.categories.filter((category) => {
            return category.id === this.props.getMyFavoritesCategoryId() || category.id === this.props.getRecentDownloadedCategoryId();
        });

        return (
            <React.Fragment> 
                <div style={{
                    backgroundColor: "#f1f1f1",
                    margin: 0,
                    padding: 10,
                    border: "1px solid #e5e5e5"
                }}>
                    {
                        selectedCategory.id !== this.props.getHomeCategory() && selectedCategory.id !== this.props.getMyFavoritesCategoryId() && selectedCategory.id !== this.props.getRecentDownloadedCategoryId() ? <React.Fragment>
                            <Path
                                categories={this.props.categories}
                                subCategories={categories}
                                query={this.props.query}
                                useHDR={this.props.useHDR}
                                getHomeCategory={this.props.getHomeCategory}
                                handleCategoryChange={this.handleCategoryChange}
                            />
                        </React.Fragment> : null
                    }
                    <div className="form-check" style={{ margin: 10 }}>
                        <input className="form-check-input" type="checkbox" defaultChecked={this.props.query.onlyFree} onChange={(e) => {
                            this.props.history.push(`/?categoryId=${this.props.query.categoryId}&searchTerm=${this.props.query.searchTerm}&pageIndex=0&pageSize=${this.props.query.pageSize}&onlyFree=${e.target.checked}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${this.props.query.sortBy}`);
                        }} id="freeChecked" />
                        <label className="form-check-label" htmlFor="freeChecked">
                            Show only free files
                        </label>
                    </div>
                    <div className="form-check" style={{ margin: 10 }}>
                        <input className="form-check-input" type="checkbox" defaultChecked={this.props.query.onlyRecent} onChange={(e) => {
                            this.props.history.push(`/?categoryId=${this.props.query.categoryId}&searchTerm=${this.props.query.searchTerm}&pageIndex=0&pageSize=${this.props.query.pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${e.target.checked}&sortBy=${this.props.query.sortBy}`);
                        }} id="recentChecked" />
                        <label className="form-check-label" htmlFor="recentChecked">
                            Show only recent files
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
                                                    this.handleCategoryChange(category.id)
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
                            primaryCategories.filter((category) => (this.props.useHDR || category.title !== 'HDR')).map((category, index) => {
                                return (
                                    <Button key={index} variant="light"
                                        style={{
                                            margin: 2,
                                            textAlign: "left"
                                        }}
                                        onClick={() => {
                                            this.handleCategoryChange(category.id)
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

    handleCategoryChange = (value) => {
        this.props.history.push(`/?categoryId=${value}&searchTerm=${this.props.query.searchTerm}&pageIndex=0&pageSize=${this.props.query.pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${this.props.query.sortBy}`);
        window.scrollTo(0, 0);
    }
}