import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';

export class ExportData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        return (
            <React.Fragment>
                <Modal show={this.props.show} onHide={this.props.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Export Data
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Label>Categories</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows="3" 
                                        defaultValue={JSON.stringify(this.props.categories)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Items</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows="3" 
                                        defaultValue={JSON.stringify(this.props.items)}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Relationships</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows="3" 
                                        defaultValue={JSON.stringify(this.props.relationships)}
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
                                this.props.handleClose(e);
                            }}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment >
        );
    }
}