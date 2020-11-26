import React from 'react';
import { Button, Col, Form, Row, Nav, Navbar, NavbarBrand } from 'react-bootstrap';
import { Item } from './Item';

export class SubCategories extends React.Component {
    render() {
        let items = (this.props.isHomeCategory(this.props.category.id) ? this.props.items.filter((item) => {
            return this.props.searchArray(item.tags, this.props.query.searchTerm) && (this.props.useHDR || item.fileExt !== 'hdr');
        }) : this.props.getItemsInCategory(this.props.category.id)).filter((item) => {
            return (this.props.query.onlyFree === false || item.isFree) && (this.props.query.onlyRecent === false || this.props.isItemRecent(item)) && (this.props.query.searchTerm === "" || item.title.toUpperCase().includes(this.props.query.searchTerm.toUpperCase()) || this.props.searchArray(item.tags, this.props.query.searchTerm)) && (this.props.useHDR || item.fileExt !== 'hdr');
        });

        this.props.sortItems(items, this.props.query.sortBy);

        let itemsBegin = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? this.props.query.pageIndex * this.props.query.pageSize : 0;
        let itemsEnd = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? itemsBegin + this.props.query.pageSize : 5;
        let itemsLength = items.length;

        let subCategories = null;
        if (!this.props.isHomeCategory(this.props.category.id)) {
            subCategories = this.props.getSubCategories(this.props.category.id);
        }
        return (
            <React.Fragment>
                <Row className="ml-1 mb-4">
                    <Col>
                        <Navbar bg="light">
                            <NavbarBrand>
                                {this.props.category.title} {subCategories && subCategories.length > 0 ? (<React.Fragment> - { subCategories.length} categories</React.Fragment>) : <React.Fragment> - {itemsLength} files</React.Fragment>}
                            </NavbarBrand>
                            <Nav className="mr-auto">
                            </Nav>
                            <Form inline>
                                <Button variant="light" onClick={this.handleSeeAllClick}>
                                    See All
                                </Button>
                            </Form>
                        </Navbar>
                    </Col>
                </Row>
                <Row className="ml-1 mb-4">
                    {
                        window.admin ? null :
                            items.slice(itemsBegin, itemsEnd).map((item, index) => {
                                return (
                                    <Col
                                        key={index}
                                        xl={1} lg={2} md={3} sm={4} xs={6}
                                        style={{
                                            minWidth: 160
                                        }}
                                    >
                                        <Item
                                            license={this.props.license}
                                            item={item}
                                            user={this.props.user}
                                            category={this.props.category}
                                            isHomeCategory={this.props.isHomeCategory}
                                            calculatePathToItem={this.props.calculatePathToItem}
                                            handleDownloadClick={this.props.handleDownloadClick}
                                            handleFavoriteClick={this.props.handleFavoriteClick}
                                            isItemFavorite={this.props.isItemFavorite}
                                            formatFileSize={this.props.formatFileSize}
                                            selectedAction={this.props.selectedAction}
                                            updateSelectedAction={this.props.updateSelectedAction}
                                            selectedItems={this.props.selectedItems}
                                            updateSelectedItems={this.props.updateSelectedItems}
                                        />
                                    </Col>
                                )
                            })
                    }
                </Row>
            </React.Fragment>
        );
    }

    handleSeeAllClick = () => {
        this.props.history.push(`/?categoryId=${this.props.category.id}&searchTerm=${this.props.query.searchTerm}&pageIndex=0&pageSize=${this.props.query.pageSize}&onlyFree=${this.props.query.onlyFree}&onlyRecent=${this.props.query.onlyRecent}&sortBy=${this.props.query.sortBy}`);
        window.scrollTo(0, 0);
    }
}