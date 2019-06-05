import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';
import { StorageManagerInstance } from  '../shared/storage.utils';
import { connect } from 'react-redux';
import { Ajax } from '../shared/ajax.utils';

class CheckoutForm extends Component {
    constructor(props) {
        super(props);
        this.state = {complete: false};
        this.submit = this.submit.bind(this);
    }

    async submit(ev) {
        const {profile, trial} = this.props;
        let {token} = await this.props.stripe.createToken({name: "Name"});
        const data = { stripeToken: token.id, email: profile.Email, trial: trial }
        let response = await Ajax().post("/charge/digital-menu", {
            headers: {
                "content-type": "application/json",
                "cache-control": "no-cache",
                "x-access-token": StorageManagerInstance.read('token')
            },
            body: JSON.stringify(data)
        });
        if (response.success) this.setState({complete: true});
    }

    render() {
        if (this.state.complete) return <h1>Purchase Complete</h1>;

        return (
            <div className="checkout">
                <p>Would you like to complete the purchase?</p>
                <CardElement />
                <div className="group-buttons" style={{marginTop: 20}}>
                    <div className="notification button--action button--action-filled" style={{cursor: 'pointer'}} onClick={this.submit}>Send</div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    profile: state._profile.profile
  }
};

export default connect(mapStateToProps)(injectStripe(CheckoutForm));