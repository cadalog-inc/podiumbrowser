import React from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faDownload } from '@fortawesome/free-solid-svg-icons';
import License from '../models/License';
import App from '../App';

export class Item extends React.Component {
    parseExt = (item) => {
        return item.imageFile.split('.')[1];
    }
    render() {
        return (
            <React.Fragment>
                <OverlayTrigger
                    placement="bottom"
                    delay={{ dhow: 500 }}
                    overlay={(props) => {
                        return (
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
                >
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
                            src={`http://v3.pdm-plants-textures.com/images/files/${this.props.item.hash}.${this.parseExt(this.props.item)}`}
                            style={{
                                position: 'relative',
                                width: '100%',
                                cursor: "pointer",
                                borderBottom: '1px solid #e5e5e5'
                            }}
                            onClick={() => { this.props.handleDownloadClick(this.props.item) }}
                        />
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
                                onClick={() => { this.props.handleDownloadClick(this.props.item) }}
                            >
                                {
                                    (this.props.user.key !== '' && License.isValid(this.props.license)) || this.props.item.type === 'free' ? <FontAwesomeIcon icon={faDownload} color="#343a40" /> : <FontAwesomeIcon icon={faDownload} color="lightgrey" />
                                }
                            </span>
                        </span>
                    </div>
                </OverlayTrigger>
            </React.Fragment>
        );
    }
}