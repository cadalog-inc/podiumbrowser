import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';

export class EditCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ""
        }
    }

    componentDidMount() {
        this.setState({
            title: this.props.category.title
        })
    }

    componentDidUpdate(prevProps) {
        if(prevProps.category.title !== this.props.category.title) {
            this.setState({
                title: this.props.category.title
            });
        }
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
}