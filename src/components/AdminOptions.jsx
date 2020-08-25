import React from 'react';
import axios from 'axios';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';

export class AdminOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: 'us-west-2',
            endpoint: 'https://dynamodb.us-west-2.amazonaws.com/',
            accessKeyId: 'AKIAZKYMH4JCPQTQPQ4J',
            secretAccessKey: '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',
            admin: false
        }
    }

    render() {
        return (
            <React.Fragment>
                <Card style={{ width: 600, margin: 10 }}>
                    <Card.Header>
                        Admin Options
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Check
                                        type="checkbox"
                                        label="Admin On"
                                        style={{ float: 'right' }}
                                        defaultChecked={this.state.admin}
                                        onChange={(e) => {
                                            const value = e.target.checked;
                                            this.setState({
                                                admin: value
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Region</Form.Label>
                                    <Form.Control
                                        defaultValue={this.state.region}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            this.setState({
                                                region: value
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>End Point</Form.Label>
                                    <Form.Control
                                        defaultValue={this.state.endpoint}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            this.setState({
                                                endpoint: value
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Access Key Id</Form.Label>
                                    <Form.Control
                                        defaultValue={this.state.accessKeyId}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            this.setState({
                                                accessKeyId: value
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Secret Access Key</Form.Label>
                                    <Form.Control
                                        defaultValue={this.state.secretAccessKey}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            this.setState({
                                                secretAccessKey: value
                                            })
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                    <Card.Footer>
                        <Button
                            variant="light"
                            onClick={(e) => {

                            }}
                        >
                            Return to Podium Browser
                        </Button>
                        <div style={{ float: 'right' }}>
                            <Button
                                variant="light"
                                onClick={(e) => {

                                }}
                            >
                                Test Connection
                            </Button>
                            <Button
                                variant="light"
                                onClick={(e) => {

                                }}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>
            </React.Fragment >
        );
    }
}