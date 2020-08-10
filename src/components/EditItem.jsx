import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';

export class EditItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            tags: []
        }
    }

    componentDidMount() {
        this.setState({
            title: this.props.item.title,
            tags: this.props.item.tags
        })
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
                                    <img alt="" style={{ width: '100%' }} src={`http://v3.pdm-plants-textures.com/images/files/${this.props.item.hash}.${this.props.parseExt(this.props.item)}`} />
                                </Col>
                            </Row>
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
                                this.props.item.title = this.state.title;
                                this.props.item.tags = this.state.tags;
                                var params = {
                                    TableName: "Items",
                                    Key: {
                                        "id": this.props.item.id
                                    },
                                    UpdateExpression: "set tags=:tags, title=:title",
                                    ExpressionAttributeValues: {
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