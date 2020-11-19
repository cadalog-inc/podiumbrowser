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
            for (let i = 0; i < fl; i++) {
                const fileOption = fileOptions[i];
                let imageOption = null;
                for (let j = 0; j < il; j++) {
                    if (imageOptions[j].title === fileOption.title) {
                        imageOption = imageOptions[j];
                    }
                }
                if (imageOption) {
                    const file = e.dataTransfer.items[fileOption.index].getAsFile();
                    items.push({
                        id: this.props.item.id,
                        hash: this.props.item.hash,
                        title: this.props.item.title,
                        tags: this.props.item.tags,
                        isFree: this.props.item.isFree,
                        fileExt: fileOption.ext,
                        thumbnailExt: imageOption.ext,
                        fileSize: file.size,
                        uploadDate: Number(new Date()),
                        skpIndex: fileOption.index,
                        imgIndex: imageOption.index
                    });
                }
            }

            this.setState({
                added: items,
                uploaded: []
            }, async () => {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const hash = item.hash;
                    const skp = dataTransferItems[item.skpIndex].getAsFile();
                    const img = dataTransferItems[item.imgIndex].getAsFile();
                    const skpFormData = new FormData();
                    skpFormData.append('file', skp);
                    const imgFormData = new FormData();
                    imgFormData.append('file', img);

                    axios
                        .post(`https://v3.pdm-plants-textures.com/api/upload/${hash}.skp/skp`, skpFormData)
                        .then((r) => {
                            axios
                                .post(`https://v3.pdm-plants-textures.com/api/upload/${hash}.jpg/img`, imgFormData)
                                .then((r) => {
                                    //this.saveItem(item);
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
            });
        }
    }
}