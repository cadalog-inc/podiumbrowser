import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';

export class EditItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hash: "",
            isFree: false,
            title: "",
            tags: []
        }
    }

    componentDidMount() {
        this.setState({
            hash: this.props.item.hash,
            isFree: this.props.item.isFree,
            title: this.props.item.title,
            tags: this.props.item.tags
        })
    }

    componentDidUpdate(prevProps) {
        if(prevProps.item.hash !== this.props.item.hash) {
            this.setState({
                hash: this.props.item.hash,
                isFree: this.props.item.isFree,
                title: this.props.item.title,
                tags: this.props.item.tags
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <Modal show={this.props.show} onHide={this.props.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit Item
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Check
                                        type="checkbox"
                                        label="Free"
                                        style={{ float: 'right', marginBottom: 10 }}
                                        checked={this.state.isFree}
                                        onChange={(e) => {
                                            const value = e.target.checked;
                                            this.setState({
                                                isFree: value
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <img alt="" style={{ width: '100%' }} src={`http://v3.pdm-plants-textures.com/images/files/${this.props.item.hash}.${this.props.item.thumbnailExt}`} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows="2" 
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
                            <Row>
                                <Col>
                                    <Form.Label>Tags</Form.Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Control 
                                        as="textarea" 
                                        rows="3" 
                                        defaultValue={this.state.tags.join(' ')}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            this.setState({
                                                tags: value.split(' ')
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.handleClose}>
                            Cancel
                        </Button>
                        <Button 
                            variant="dark" 
                            onClick={(e) => {
                                this.props.item.isFree = this.state.isFree;
                                this.props.item.tags = this.state.tags;
                                this.props.item.title = this.state.title;
                                var params = {
                                    TableName: "Items",
                                    Key: {
                                        "id": this.props.item.id
                                    },
                                    UpdateExpression: "set isFree:isFree, tags=:tags, title=:title",
                                    ExpressionAttributeValues: {
                                        ":isFree": this.props.item.isFree,
                                        ":tags": this.props.item.tags,
                                        ":title": this.props.item.title
                                    },
                                    ReturnValues: "UPDATED_NEW"
                                };
                                window.docClient.update(params, function(err, data) {
                                    if(err) {
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
}