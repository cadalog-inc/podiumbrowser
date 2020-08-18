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
                                    <React.Fragment>
                                        <Row>
                                            <Col>
                                                <Form.Label style={{marginTop: 10}}>Add New Items</Form.Label>
                                            </Col>
                                        </Row>
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
                                            <Col style={{ height: 300, border: '1px solid #ced4da', margin: 15 }}>
                                                <Form.Label>Files added...</Form.Label>
                                                <ul>
                                                    {
                                                        this.state.added.map((item, index) => {
                                                            return (
                                                                <li key={index}>{item.title}</li>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            </Col>
                                            <Col style={{ height: 300, border: '1px solid #ced4da', margin: 15 }}>
                                                <Form.Label>Files uploaded...</Form.Label>
                                                <ul>
                                                    {
                                                        this.state.uploaded.map((item, index) => {
                                                            return (
                                                                <li key={index}>{item.title}</li>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            </Col>
                                        </Row>
                                    </React.Fragment>
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
            </React.Fragment >
        );
    }

    saveItem = (item) => {
        const filenameSplit = item.filename.split('.');
        const fileExt = filenameSplit[filenameSplit.length-1];
        const imageFileSplit = item.imageFile.split('.');
        const thumbnailExt = imageFileSplit[imageFileSplit.length-1];
        const isFree = item.type !== "paid";
        var params = {
            TableName: "Items",
            Item: {
                id: item.id,
                hash: item.hash,
                title: item.title,
                tags: item.tags,
                isFree: isFree,
                fileExt: fileExt,
                thumbnailExt: thumbnailExt,
                fileSize: item.fileSize,
                uploadDate: item.uploadDate
            }
        };
        const callback = this.saveRelationships;
        window.docClient.put(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                callback(item);
            }
        });
    }

    saveRelationships = (item) => {
        const relationships = this.calculateRelationships();
        const rl = relationships.length;
        for (let r = 0; r < rl; r++) {
            let id = Number(new Date())+r;
            var params = {
                TableName: "Relationships",
                Item: {
                    id: id,
                    categoryId: relationships[r],
                    itemId: item.id
                }
            };
            console.log(params);
            window.docClient.put(params, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                }
            });
        }
        this.state.uploaded.push(item);
        this.forceUpdate();
    }

    calculateRelationships = () => {
        const relationships = [];
        let category = this.props.category;
        if (category && category !== undefined) {
            let id = category.id;
            let parentId = category.parentId;
            let sanity = 0;
            while (sanity < 10) {
                relationships.push(id);
                if (id === 1) {
                    break;
                } else {
                    category = this.props.categories.find((c) => c.id === parentId);
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
                        const id = Number(new Date())+items.length;
                        items.push({
                            "filename": file.name,
                            "fileSize": file.size,
                            "id": id,
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
                            axios
                                .post(`https://v3.pdm-plants-textures.com/api/upload/${hash}.jpg/img`, imgFormData)
                                .then((r) => {
                                    this.saveItem(item);
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