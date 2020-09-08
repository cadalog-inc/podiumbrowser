import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faStar, faDownload } from '@fortawesome/free-solid-svg-icons';
import License from '../models/License';
import { EditItem } from './EditItem';

export class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }
    render() {
        return (
            <React.Fragment>
                {
                    window.admin ? <EditItem
                        show={this.state.show}
                        item={this.props.item}
                        parseExt={this.parseExt}
                        handleClose={(e) => {
                            this.setState({
                                show: false
                            })
                        }}
                    /> : null
                }

                {/* <OverlayTrigger
                    placement="bottom"
                    delay={{ dhow: 500 }}
                    overlay={(props) => {
                        return window.admin ? <span /> : (
                            <div
                                {...props}
                                style={{
                                    fontSize: '11px',
                                    minWidth: 125,
                                    color: "#212529",
                                    backgroundColor: '#f1f1f1',
                                    border: '1px solid #e5e5e5',
                                    padding: 2,
                                    ...props.style,
                                }}
                            >
                                {this.props.calculatePathToItem(this.props.item.id).slice(1)}
                            </div>
                        )
                    }}
                > */}
                <div className="mb-4"
                    style={{
                        position: 'relative',
                        width: '100%',
                        backgroundColor: '#f1f1f1',
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        border: '1px solid #e5e5e5'
                    }}
                >
                    <img alt={this.props.item.title}
                        src={`http://v3.pdm-plants-textures.com/images/files/${this.props.item.hash}.${this.props.item.thumbnailExt}`}
                        style={{
                            position: 'relative',
                            width: '100%',
                            cursor: "pointer",
                            borderBottom: '1px solid #e5e5e5'
                        }}
                        onClick={() => { this.props.handleDownloadClick(this.props.item) }}
                    />
                    {
                        window.admin ?
                            <span
                                style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '0px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => { 
                                    // todo: select item for copy/cut/paste in categories
                                }}
                            >
                                {/* <input type="checkbox"/> */}
                            </span>
                            :
                            <span
                                style={{
                                    position: 'absolute',
                                    right: '0px',
                                    top: '0px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => { this.props.handleFavoriteClick(this.props.item.id) }}
                            >
                                {
                                    this.props.user.key !== '' && this.props.isItemFavorite(this.props.item.id) ? <FontAwesomeIcon icon={faStar} color="gold" /> : <FontAwesomeIcon icon={faStar} color="lightgrey" />
                                }
                            </span>
                    }
                    <span
                        style={{
                            fontSize: '11px',
                            width: '100%',
                            padding: 5,
                            borderBottom: '1px solid #e6e6e6'
                        }}
                    >
                        {this.props.item.title}
                    </span>
                    <span
                        style={{
                            height: 27
                        }}
                    >
                        <span
                            style={{
                                position: 'absolute',
                                left: '5px',
                                bottom: '4px',
                                fontSize: '11px',
                                fontWeight: '600'
                            }}
                        >
                            {this.props.formatFileSize(this.props.item.fileSize)} MB
                            </span>
                        <span
                            style={{
                                position: 'absolute',
                                right: '5px',
                                bottom: '2px',
                                cursor: 'pointer'
                            }}
                            onClick={(e) => {
                                if (window.admin) {
                                    this.setState({
                                        show: true
                                    });
                                } else {
                                    this.props.handleDownloadClick(this.props.item);
                                }
                            }}
                        >
                            {
                                window.admin ? <FontAwesomeIcon icon={faEdit} /> : (this.props.user.key !== '' && License.isValid(this.props.license)) || this.props.item.isFree ? <FontAwesomeIcon icon={faDownload} color="#343a40" /> : <FontAwesomeIcon icon={faDownload} color="lightgrey" />
                            }
                        </span>
                    </span>
                </div>
                {/* </OverlayTrigger> */}
            </React.Fragment>
        );
    }
}