import React from 'react';
import { Button, Modal, Form, Row, Col, ListGroup } from 'react-bootstrap';

export class EditItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
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
                                    <img alt="" style={{ width: '100%' }} src={`http://v3.pdm-plants-textures.com/images/files/${this.props.item.hash}.${this.props.parseExt(this.props.item)}`} />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control defaultValue={this.props.item.title}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Tags</Form.Label>
                                    <ListGroup>
                                        {
                                            this.props.item.tags.map((tag, index) => {
                                                return (
                                                    <ListGroup.Item>
                                                        <Form.Control defaultValue={tag}/>
                                                    </ListGroup.Item>
                                                )
                                            })
                                        }
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="dark" onClick={this.props.handleClose}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}