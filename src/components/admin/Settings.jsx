import React from 'react';
import { Button, Card, Form, Row, Col } from 'react-bootstrap';

export class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: '',
            endpoint: '',
            accessKeyId: '',
            secretAccessKey: '',
            admin: false
        }
    }

    componentDidMount() {
        const value = localStorage.getItem("PodiumBrowserAdminOptions") || "";
        if(value !== null && value !== undefined && value !== "") {
            const options = JSON.parse(value);
            console.log(options);
            this.setState({
                region: options.region,
                endpoint: options.endpoint,
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey,
                admin: options.admin
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <Card style={{ width: 600, margin: 10 }}>
                    <Card.Header>
                        Admin Settings
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Check
                                        type="checkbox"
                                        label="Admin Mode"
                                        style={{ float: 'right' }}
                                        checked={this.state.admin}
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
                                this.props.history.push(`/`);
                                window.scrollTo(0, 0);
                                window.location.reload();
                            }}
                        >
                            Return to Podium Browser
                        </Button>
                        <div style={{ float: 'right' }}>
                            <Button
                                variant="light"
                                onClick={(e) => {
                                    localStorage.setItem("PodiumBrowserAdminOptions", JSON.stringify(this.state));
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