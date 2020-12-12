import React from 'react';
import axios from 'axios';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Utils } from '../../utils/uuid';

export class UpdateItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            added: [],
            uploaded: []
        }
    }
    render() {
        return (
            <React.Fragment>
                <Modal show={this.props.show} onHide={this.props.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Update Skp/Thumbnail
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col
                                    style={{
                                        height: 100,
                                        border: '1px solid #ced4da',
                                        marginLeft: 15,
                                        marginRight: 15,
                                        marginBottom: 15
                                    }}
                                    onDrop={this.upload}
                                    onDragOver={(e) => e.preventDefault()}
                                >

                                    <Form.Label>Drag Files here...</Form.Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ overflowY: 'scroll', height: 300, fontSize: 8, border: '1px solid #ced4da', margin: 15 }}>
                                    <Form.Label>Files added...</Form.Label>

                                    <ul>
                                        {
                                            this.state.added.sort((a, b) => {
                                                return a.title < b.title ? -1 : 1
                                            }).map((item, index) => {
                                                return (
                                                    <li key={index}>{index}: {item.title}</li>
                                                );
                                            })
                                        }
                                    </ul>
                                </Col>
                                <Col style={{ overflowY: 'scroll', height: 300, fontSize: 8, border: '1px solid #ced4da', margin: 15 }}>
                                    <Form.Label>Files uploaded...</Form.Label>
                                    <ul>
                                        {
                                            this.state.uploaded.sort((a, b) => {
                                                return a.title < b.title ? -1 : 1
                                            }).map((item, index) => {
                                                return (
                                                    <li key={index}>{index}: {item.title}</li>
                                                );
                                            })
                                        }
                                    </ul>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal>
            </React.Fragment >
        );
    }

    upload = (e) => {
        e.preventDefault();
        if (e.dataTransfer.items) {
            const dataTransferItems = e.dataTransfer.items;

            const fileOptions = [];
            const imageOptions = [];

            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                if (e.dataTransfer.items[i].kind === 'file') {
                    const file = e.dataTransfer.items[i].getAsFile();
                    const title = file.name.split('.')[0];
                    const ext = file.name.split('.')[file.name.split('.').length - 1];
                    const options = {
                        title: title,
                        ext: ext,
                        index: Number(i)
                    }
                    if (ext === 'skp') {
                        fileOptions.push(options);
                    } else if (ext === 'jpg' || ext === 'png') {
                        imageOptions.push(options);
                    }
                }
            }

            const fl = fileOptions.length;
            const il = imageOptions.length;

            const items = [];
            if (fl > il) {
                for (let i = 0; i < fl; i++) {
                    const fileOption = fileOptions[i];
                    items.push({
                        type: "file",
                        title: fileOption.title,
                        hash: this.props.item.hash,
                        thumbnailExt: "",
                        skpIndex: fileOption.index,
                        imgIndex: -1
                    });
                }
            } else if (il > fl) {
                for (let i = 0; i < il; i++) {
                    const imageOption = imageOptions[i];
                    items.push({
                        type: "image",
                        title: imageOption.title,
                        hash: this.props.item.hash,
                        thumbnailExt: imageOption.ext,
                        skpIndex: -1,
                        imgIndex: imageOption.index
                    });
                }
            } else {
                for (let i = 0; i < fl; i++) {
                    const fileOption = fileOptions[i];
                    let imageOption = null;
                    for (let j = 0; j < il; j++) {
                        if (imageOptions[j].title === fileOption.title) {
                            imageOption = imageOptions[j];
                        }
                    }
                    if (imageOption) {
                        items.push({
                            type: "both",
                            title: fileOption.title,
                            hash: this.props.item.hash,
                            thumbnailExt: imageOption.ext,
                            skpIndex: fileOption.index,
                            imgIndex: imageOption.index
                        });
                    }
                }
            }

            this.setState({
                added: items,
                uploaded: []
            }, async () => {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const hash = item.hash;
                    const thumbnailExt = item.thumbnailExt;
                    const skp = item.skpIndex !== -1 ? dataTransferItems[item.skpIndex].getAsFile() : null;
                    const img = item.imgIndex !== -1 ? dataTransferItems[item.imgIndex].getAsFile() : null;
                    const skpFormData = new FormData();
                    if(item.skpIndex !== -1) {
                        skpFormData.append('file', skp);
                    }
                    const imgFormData = new FormData();
                    if(item.imgIndex !== -1) {
                        imgFormData.append('file', img);
                    }
                    if (item.type === "file") {
                        axios
                            .post(`https://v3.pdm-plants-textures.com/api/upload/${hash}.skp/skp`, skpFormData)
                            .then((r) => {
                                this.state.uploaded.push(item);
                                this.forceUpdate();
                                console.log(item);
                            })
                            .catch((e) => {
                                console.log(e)
                            });
                    } else if (item.type === "image") {
                        axios
                            .post(`https://v3.pdm-plants-textures.com/api/upload/${hash}.${thumbnailExt}/img`, imgFormData)
                            .then((r) => {
                                this.state.uploaded.push(item);
                                this.forceUpdate();
                                console.log(item);
                            })
                            .catch((e) => {
                                console.log(e);
                            });
                    } else if (item.type === "both") {
                        axios
                            .post(`https://v3.pdm-plants-textures.com/api/upload/${hash}.skp/skp`, skpFormData)
                            .then((r) => {
                                axios
                                    .post(`https://v3.pdm-plants-textures.com/api/upload/${hash}.${thumbnailExt}/img`, imgFormData)
                                    .then((r) => {
                                        this.state.uploaded.push(item);
                                        this.forceUpdate();
                                        console.log(item);
                                    })
                                    .catch((e) => {
                                        console.log(e);
                                    });
                            })
                            .catch((e) => {
                                console.log(e)
                            });
                    }
                }
            });
        }
    }
}