import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Item } from './item';

export class SubCategories extends React.Component {
    render() {
        let items = (this.props.isHomeCategory(this.props.category.id) ? this.props.items : this.props.getItemsInCategory(this.props.category.id)).filter((item) => {
            return (this.props.onlyFree === false || item.type === 'free') && (this.props.searchTerm === "" || item.title.includes(this.props.searchTerm) || this.props.searchArray(item.tags, this.props.searchTerm)) && item.filename.split('.')[1] !== 'hdr';
        });

        this.props.sortItems(items, this.props.onlyRecent, this.props.sortBy);

        let itemsBegin = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? this.props.pageIndex * this.props.pageSize : 0;
        let itemsEnd = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? itemsBegin + this.props.pageSize : 6;
        let itemsLength = items.length;
        return (
            <React.Fragment>
                <Row style={{ marginTop: 20 }}>
                    <Col>
                        <h5>{this.props.category.title} - {itemsLength} files</h5>
                    </Col>
                    <Col>
                        <Button 
                            variant="light" 
                            className="float-right"
                            onClick={this.handleSeeAllClick}
                        >
                            See All
                        </Button>
                    </Col>
                </Row>
                <Row>
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

    handleSeeAllClick = (pageIndex) => {
        this.props.history.push(`/?categoryId=${this.props.category.id}&searchTerm=${this.props.searchTerm}&pageIndex=${pageIndex}&pageSize=${this.props.pageSize}&onlyFree=${this.props.onlyFree}&onlyRecent=${this.props.onlyRecent}&sortBy=${this.props.sortBy}`);
        window.scrollTo(0, 0);
    }
}