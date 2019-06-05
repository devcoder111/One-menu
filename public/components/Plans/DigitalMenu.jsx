import React, { Component, PropTypes } from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from "../CheckoutForm";
const constants = require('../../constants');
import StripeCheckout from 'react-stripe-checkout';
import {getProfile} from '../Profile/profile.service'
import {chargeDigitalMenuPlan} from '../Subscriptions/subscription.service'


class DigitalMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showForm: false,
            trial: false,
            profile:[]
        }

        this.handleCheckout = this.handleCheckout.bind(this);
        this.handleTrialCheckout = this.handleTrialCheckout.bind(this);
        this.onToken = this.onToken.bind(this);
    }

    handleCheckout() {
        let state = {...this.state}
        state.trial = false;
        this.setState(state);
    }

    handleTrialCheckout() {
        let state = {...this.state}
        state.trial = true;
        this.setState(state);

       // this.setState({showForm: true, trial: true})
    }
    async componentDidMount(){
        let profile = await getProfile();
        let state = {...this.state}
        state.profile = profile;
        this.setState(state);
        //console.log(constants)
        //var test=1;
    }
    async onToken  (token, addresses) {
        let subscription = await chargeDigitalMenuPlan(this.state.profile.Email,token,this.state.trial,this.props.price);
      };

    render() {
        /*const {  digitalMenuPlanCompleted, digitalMenuPlan, currencies } = this.props;
        const { showForm, trial } = this.state;
        let planCurrency = '$';

        if (digitalMenuPlanCompleted && digitalMenuPlan && currencies ) {
            currencies.map((currency, index) => {
                if (currency.NameShort.toLowerCase() === digitalMenuPlan.currency.toLowerCase()) {
                    planCurrency = currency.Symbol;
                }
            })
        }*/
        
        let showForm=false;
        return (
            <div className="plan-wrapper">
                <div className="plan-text">
                    <div className="title">Go Digital</div>
                    <div className="body">Let your customers get the menu on their iPhone or Android smartphone!</div> 
                    {this.props.subscription? '' :
                    <StripeCheckout
                                            amount={this.props.price}
                                            email={this.state.profile.Email}
                                            description="Trial Digital Menu"
                                            locale="auto"
                                            name="one-menu"
                                            token={this.onToken}                                            
                                            stripeKey={'pk_test_Mjz2q28RCNDZsFA6Y783rrKq'}
                                            >    
                                    <button style={{marginRight: 'auto'}} className="button--action button--action-shadow"
                                   onClick={this.handleTrialCheckout}>Get your 3 months free trial</button>
                    </StripeCheckout>                            
                        }
                    
                </div>
                {
                    !this.state.showForm && (
                        <div className="plan-banner">
                            <div className="plan-card active">
                                <div className="title">Digital Menu</div>
                                <div className="version">iOS & Android</div>
                                <div className="fee">Fixed annual fee</div>
                                <div className="price"><span>
                                    ${this.props.price?  this.props.price/100:'•••'}
                                </span><span className="period">/{this.props.period}</span></div>
                                <div className="line"></div>
                                <div className="devices">Mobile & Tablet</div>
                                <div className="NoLimitation">No limitations on branches and menus</div>
                                {this.props.subscription?  <div className="plan-button" >Purchased</div> :
                                <StripeCheckout
                                            amount={this.props.price}
                                            email={this.state.profile.Email}
                                            description="Digital Menu"
                                            locale="auto"
                                            name="one-menu"                                     
                                            stripeKey={'pk_test_Mjz2q28RCNDZsFA6Y783rrKq'}
                                            token={this.onToken}
                                            >
                                     <div className="plan-button" >Get started</div>
                                </StripeCheckout>}
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
};
DigitalMenu.propTypes = {
    component: DigitalMenu.object
};
export default DigitalMenu;