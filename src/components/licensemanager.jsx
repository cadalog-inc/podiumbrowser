import React from 'react';
import { Button, Form } from 'react-bootstrap';
import License from '../models/License';

export class LicenseManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 'purchase',
            key: ''
        };
    }

    componentDidMount() {
        if(License.isValid(this.props.license)) {
            this.setState({
                screen: 'activated'
            });
        }
    }

    render() {
        return this.state.screen === 'purchase' ? (
            <Form>
                <Form.Group>
                    <Button variant="dark" type="button" onClick={()=> window.open('https://www.suplugins.com/')}>
                        Purchase License
                    </Button>
                    <Form.Text className="text-muted">
                        Visit the online store to purchase an SU Podium license.
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Button variant="dark" type="button" onClick={()=> this.setState({
                        screen: 'activate'
                    })}>
                        Activate License
                    </Button>
                    <Form.Text className="text-muted">
                        Activate this computer with an SU Podium license.
                    </Form.Text>
                </Form.Group>
            </Form>
        ) : this.state.screen === 'activate' ? (
            <Form>
                <Form.Group>
                    <Form.Label>
                        Please enter your license key to activate your SU Podium license on this computer...
                    </Form.Label>
                    <Form.Control type="text" onChange={(e)=>{
                        this.setState({
                            key: e.target.value
                        });
                    }} />
                </Form.Group>
                <Button variant="dark" type="button" disabled={!License.isUUID(this.state.key)} onClick={() => {
                    this.props.license.activate(this.state.key, (license) => {
                        this.props.handleUpdateLicense(license);
                        this.setState({
                            screen: 'activated'
                        });
                    }, (error) => {
                        window.alert(error);
                    });
                }}>
                    Activate License
                </Button>
            </Form>
        ) : (
            <Form>
                <Form.Group>
                    <Form.Label>
                        This computer has been activated with a fully licensed copy of SU Podium Browser Standalone
                    </Form.Label>
                    <Form.Control type="text" readOnly value={this.props.license.key} />
                </Form.Group>
                <Button variant="dark" type="button" onClick={() => {
                    this.props.license.deactivate((license) => {
                        this.props.handleUpdateLicense(license);
                        this.setState({
                            screen: 'purchase'
                        });
                    }, (error) => {
                        window.alert(error);
                    })
                }}>
                    Deactivate License
                </Button>
                <Form.Text className="text-muted">
                    Your SU Podium trial expired on <span style={{fontWeight: 'bold'}}>{this.props.license.checkin}</span>.
                    You have <span style={{fontWeight: 'bold'}}>{this.props.license.days()}</span> days remaining.
                </Form.Text>
            </Form>
        );
    }
}