import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Options } from './options';
import { Item } from './item';

export class Category extends React.Component {
    render() {
        let items = (this.props.isHomeCategory(this.props.category.id) ? this.props.items.filter((item) => {
            return (this.props.searchArray(item.tags, "homepage") || this.props.query.searchTerm !== "") && (this.props.useHDR || item.fileExt !== 'hdr');
        }) : this.props.getItemsInCategory(this.props.category.id)).filter((item) => {
            return (this.props.query.onlyFree === false || item.isFree) && (this.props.query.searchTerm === "" || item.title.toUpperCase().includes(this.props.query.searchTerm.toUpperCase()) || this.props.searchArray(item.tags, this.props.query.searchTerm)) && (this.props.useHDR || item.fileExt !== 'hdr');
        });

        this.props.sortItems(items, this.props.query.sortBy);

        let itemsBegin = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? this.props.query.pageIndex * this.props.query.pageSize : 0;
        let itemsEnd = this.props.categoriesLength === 1 || this.props.category.id === this.props.getHomeCategory() ? itemsBegin + this.props.query.pageSize : 25;
        let itemsLength = items.length;
        let pageBack = this.props.query.pageIndex - 1 > 0 ? this.props.query.pageIndex - 1 : 0;
        let pageNext = this.props.calculateNextPage(this.props.query.pageIndex, this.props.query.pageSize, itemsLength);
        return (
            <React.Fragment>
                <Row className="ml-1 mb-4 mt-4">
                    <Col>
                        <Options
                            upper={true}
                            query={this.props.query}
                            category={this.props.category}
                            categories={this.props.categories}
                            pageBack={pageBack}
                            pageNext={pageNext}
                            itemsBegin={itemsBegin}
                            itemsEnd={itemsEnd}
                            itemsLength={itemsLength}
                            handleClearFavoritesClick={this.props.handleClearFavoritesClick}
                            handleDownloadClick={this.props.handleDownloadClick}
                            handleFavoriteClick={this.props.handleFavoriteClick}
                            getRecentDownloadedCategoryId={this.props.getRecentDownloadedCategoryId}
                            getMyFavoritesCategoryId={this.props.getMyFavoritesCategoryId}
                            {...this.props}
                        />
                    </Col>
                </Row>
                <Row className="ml-1">
                    {
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
                <Row className="ml-1 mb-4">
                    <Col>
                        <Options
                            upper={false}
                            query={this.props.query}
                            pageBack={pageBack}
                            pageNext={pageNext}
                            itemsBegin={itemsBegin}
                            itemsEnd={itemsEnd}
                            itemsLength={itemsLength}
                            handleDownloadClick={this.props.handleDownloadClick}
                            handleFavoriteClick={this.props.handleFavoriteClick}
                            getRecentDownloadedCategoryId={this.props.getRecentDownloadedCategoryId}
                            getMyFavoritesCategoryId={this.props.getMyFavoritesCategoryId}
                            {...this.props}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}