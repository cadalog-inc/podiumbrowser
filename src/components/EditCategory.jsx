import React from 'react';
import { Utils } from '../utils/uuid';
import axios from 'axios';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';

export class EditCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            added: [],
            uploaded: []
        }
    }

    componentDidMount() {
        this.setState({
            title: this.props.category.title
        })
    }

    render() {
        return (
            <React.Fragment>
                <Modal show={this.props.show} onHide={this.props.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit Category
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        defaultValue={this.state.title}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            this.setState({
                                                title: value
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                            {
                                this.props.category.id === 1 || this.props.canUploadItems === false ? null :
                                    <Row>
                                        <Col>
                                            <Form.Label>Add New Items</Form.Label>
                                            <div style={{ margin: 10 }}>
                                                <span>Drag files:</span>
                                                <div
                                                    style={{
                                                        border: '1px solid black',
                                                        width: '100%',
                                                        height: 300
                                                    }}
                                                    onDrop={this.upload}
                                                    onDragOver={(e) => e.preventDefault()}
                                                />
                                                <div
                                                    style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: '300px 300px'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            border: '1px solid black',
                                                            width: '50%',
                                                            height: 300
                                                        }}
                                                    >
                                                        <span style={{ margin: 5 }}>Files added:</span>
                                                        <ul>
                                                            {
                                                                this.state.added.map((item, index) => {
                                                                    return (
                                                                        <li key={index}>{item.title}</li>
                                                                    );
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div
                                                        style={{
                                                            border: '1px solid black',
                                                            width: '50%',
                                                            height: 300
                                                        }}
                                                    >
                                                        <span style={{ margin: 5 }}>Files uploaded:</span>
                                                        <ul>
                                                            {
                                                                this.state.uploaded.map((item, index) => {
                                                                    return (
                                                                        <li key={index}>{item.title}</li>
                                                                    );
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                            }
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="dark"
                            onClick={(e) => {
                                this.props.category.title = this.state.title;
                                var params = {
                                    TableName: "Categories",
                                    Key: {
                                        "id": this.props.category.id
                                    },
                                    UpdateExpression: "set title=:title",
                                    ExpressionAttributeValues: {
                                        ":title": this.props.category.title
                                    },
                                    ReturnValues: "UPDATED_NEW"
                                };
                                window.docClient.update(params, function (err, data) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(data);
                                    }
                                });
                                this.props.handleClose(e);
                            }}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }

    saveItem = (item) => {
        const id = this.calculateNextItemId();
        var params = {
            TableName: "Items",
            Item: {
                filename: item.filename,
                fileSize: item.fileSize,
                id: id,
                imageFile: item.imageFile,
                hash: item.hash,
                tags: item.tags,
                title: item.title,
                type: item.type,
                uploadDate: item.uploadDate
            }
        };
        console.log(params);
        const callback = this.saveRelationships;
        window.docClient.put(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                callback(id);
            }
        });
    }

    saveRelationships = (itemId) => {
        const relationships = this.calculateRelationships();
        const rl = relationships.length;
        for (let r = 0; r < rl; r++) {
            let id = this.calculateNextRelationshipId();
            var params = {
                TableName: "Relationships",
                Item: {
                    id: id,
                    categoryId: relationships[r],
                    itemId: itemId
                }
            };
            console.log(params);
            window.docClient.put(params, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
        }
    }

    calculateRelationships = () => {
        const relationships = [];
        let category = this.state.categories[this.state.categoryIndex];
        if (category && category !== undefined) {
            let id = category.id;
            let parentId = category.parentId;
            let sanity = 0;
            while (sanity < 10) {
                relationships.push(id);
                if (id === 1) {
                    break;
                } else {
                    category = this.state.categories.find((c) => c.id === parentId);
                    if (category && category !== undefined) {
                        id = category.id;
                        parentId = category.parentId;
                    } else {
                        break;
                    }
                }

                sanity = sanity + 1;
            }
        }
        return relationships;
    }

    upload = (e) => {
        e.preventDefault();
        if (e.dataTransfer.items) {
            const dataTransferItems = e.dataTransfer.items;
            const items = [];
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                if (e.dataTransfer.items[i].kind === 'file') {
                    const file = e.dataTransfer.items[i].getAsFile();
                    const title = file.name.split('.')[0];
                    const ext = file.name.split('.')[1];
                    if (ext === 'skp') {
                        items.push({
                            "filename": file.name,
                            "fileSize": file.size,
                            "id": null,
                            "imageFile": null,
                            "hash": Utils.create_UUID().replace(/-/g, ''),
                            "tags": [],
                            "title": title,
                            "type": "paid",
                            "uploadDate": Number(new Date()),
                            skpIndex: i,
                            imgIndex: null
                        });
                    }
                }
            }
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                if (e.dataTransfer.items[i].kind === 'file') {
                    const file = e.dataTransfer.items[i].getAsFile();
                    const title = file.name.split('.')[0];
                    const ext = file.name.split('.')[1];
                    if (ext === 'jpg') {
                        for (let j = 0; j < items.length; j++) {
                            if (items[j].title === title) {
                                items[j].imageFile = file.name;
                                items[j].imgIndex = j;
                                break;
                            }
                        }
                    }
                }
            }
            this.setState({
                added: items,
                uploaded: []
            }, () => {
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
                            console.log(r);
                            axios
                                .post(`https://v3.pdm-plants-textures.com/api/upload/${hash}.jpg/img`, imgFormData)
                                .then((r) => {
                                    this.props.saveItem(item);
                                })
                                .catch((e) => {
                                    console.log(e)
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