import React, { Component, PropTypes } from 'react';
import {GetMultiLanguageSubscriptionTypes} from '../Subscriptions/subscription.service'
import StripeCheckout from 'react-stripe-checkout';
import {getProfile} from '../Profile/profile.service'
import {AddLanguageToSubscription} from '../Subscriptions/subscription.service'
import { Grid, Image } from "semantic-ui-react";

class PlanOrder extends Component {
    constructor(props){
        super(props)
       // this.generateOrders = this.generateOrders.bind(this);
        this.state = {
            SubscriptionTypes:[],
            profile:[],
            price:0,
            valid:false,
            subscriptions:[]
          };
          this.onToken=this.onToken.bind(this);
          //this.getControls=this.getControls.bind(this);
    }
    async componentDidMount(){
        let state = {...this.state};
        let profile = await getProfile();
        state.profile = profile;
        this.setState(state);
    }
    async onToken  (token) {
        let subscription = await AddLanguageToSubscription(this.state.profile.Email,token,this.state.orders['translate-language'].currentstripesubscription,this.state.orders['translate-language'].languagesstripesubscription,this.state.orders['translate-language'].languages,this.state.orders['translate-language'].amount);
       };
    async componentWillReceiveProps(nextprops){
            let price=0;
            let state = {...this.state};
            let subscriptions=[];
            if(nextprops.orders)
            {  
                state.orders=nextprops.orders;
                console.log(nextprops.orders);
            }
           
            this.setState(state);

    }
   
    render() {
        let total=0;
        let listcontrols =[];
        let control='';
        let newControl='';
        let label='';
        if(this.props.orders['translate-language']&& this.props.orders['translate-language'].elementCount>=1)
        {   
            let number =this.props.orders['translate-language'].elementCount
            let amount=this.props.orders['translate-language'].amount;
            total = amount;
            
            //control=(<div><div className="primary"><div>Additional lang</div><div><span>${amount}x{number}=</span> <span>${total}</span></div></div></div>);
            control=( 
                <Grid columns={3}>
                <Grid.Row>
                <Grid.Column width={9}>                          
                    Additional lang                              
                </Grid.Column>
                <Grid.Column width={4}>
                ${amount}x{number+''}=
                </Grid.Column>
                <Grid.Column width={2}>
                 ${total}
                </Grid.Column></Grid.Row>
                </Grid>
                );

            label=(<div className="notes" style={{paddingLeft:'0px'}}>5 month prepay included</div>)
            newControl = (
                <div>
                  <div className="menu">
                    Menu #1. 
                    {this.props.orders['translate-language'].title + ''}
                  </div>
                  <Grid columns={3}>
                    <Grid.Row>
                      <Grid.Column width={9}>
                        <div>
                          "
                          {this.props.orders['translate-language'].plan+ ''}
                          "(2lang inc)
                        </div>
                        <div className="secondary">
                          {"  "}Prepaid
                        </div>
                      </Grid.Column>    
                      <Grid.Column width={4}>
                              $0x1=
                            </Grid.Column>
                            <Grid.Column width={2}>
                              $0
                            </Grid.Column>             
                    </Grid.Row>                          
                  </Grid>
                </div>
              );
        }
         
        //console.log(controllist);
        return (<div className={`plan-order`} >
                <div className="header"><img src={`assets/images/cart.png`} /> <span className="title">Your Order</span></div>
                {newControl}
                {control}
                {label}
                <div className="footer"><span className="title">Total</span><span className="title">${total ? total: '0,0'}</span></div>      
                {total>0 ?
                <StripeCheckout
                                            amount={total*100}
                                            email={this.state.profile.Email}
                                            description="MULTILINGUAL DIGITAL MENU"
                                            locale="auto"
                                            name="one-menu"
                                            token={this.onToken}                                            
                                            stripeKey={'pk_test_Mjz2q28RCNDZsFA6Y783rrKq'}
                                            >    
                                    <div style={{paddingLeft: 50,paddingRight: 50}} className={"notification button--action button--action-filled "}>Continue</div>
                </StripeCheckout> :''  }  
               
                </div>
        )
    }
};

export default PlanOrder;