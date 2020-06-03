import React from 'react';
import { Button, Col, Form, Row, Nav, Navbar, NavbarBrand } from 'react-bootstrap';
import { Item } from './item';

export class SubCategories extends React.Component {
    render() {
        let items = (this.props.isHomeCategory(this.props.category.id) ? this.props.items : this.props.getItemsInCategory(this.props.category.id)).filter((item) => {
            return (this.props.query.onlyFree === false || item.type === 'free') && (this.props.query.searchTerm === "" || item.title.includes(this.props.query.searchTerm) || this.props.searchArray(item.tags, this.props.query.searchTerm)) && item.filename.split('.')[1] !== 'hdr';
        });

        this.props.sortItems(items, this.props.query.sortBy);

        let itemsBegin = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? this.props.query.pageIndex * this.props.query.pageSize : 0;
        let itemsEnd = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? itemsBegin + this.props.query.pageSize : 6;
        let itemsLength = items.length;
        return (
            <React.Fragment>
                <Row style={{
                    marginTop: 20
                }}>
                    <Col>
                        <Navbar bg="light">
                            <NavbarBrand>
                                {this.props.category.title} - {itemsLength} files
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
                <Row style={{
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {
                        items.slice(itemsBegin, itemsEnd).map((item, index) => {
                            return (
                                <Col
                                    key={index}
                                    xl={1} lg={2} md={3} sm={4} xs={6}
                                    style={{
                                        marginTop: 20,
                                        minWidth: 175
                                    }}
                                >
                                    <Item
                                        item={item}
                                        user={this.props.user}
                                        calculatePathToItem={this.props.calculatePathToItem}
                                        handleDownloadClick={this.props.handleDownloadClick}
                                        handleFavoriteClick={this.props.handleFavoriteClick}
                                        isItemFavorite={this.props.isItemFavorite}
                                        formatFileSize={this.props.formatFileSize}
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