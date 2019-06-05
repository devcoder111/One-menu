import React, { Component, PropTypes } from 'react';
import {GetMultiLanguageSubscriptionTypes} from '../Subscriptions/subscription.service'
import StripeCheckout from 'react-stripe-checkout';
import {getProfile} from '../Profile/profile.service'
import {chargeMultilanguageplan} from '../Subscriptions/subscription.service'
import { Grid, Image } from 'semantic-ui-react'

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
          this.handleContinue=this.handleContinue.bind(this);
    }
    async componentDidMount(){
        let state = {...this.state};
        state.SubscriptionTypes=await GetMultiLanguageSubscriptionTypes();
        let profile = await getProfile();
        state.profile = profile;
        this.setState(state);
    }
    async onToken  (token) {
        let subscription = await chargeMultilanguageplan(this.state.profile.Email,token,this.state.subscriptions);
       };
    async componentWillReceiveProps(nextprops){
            let price=0;
            let state = {...this.state};
            let subscriptions=[];
            if(nextprops.orders && nextprops.orders.length>0)
            {  
                let controllist = [];
                for(let i=1;i<this.props.orders.length;i++)        
                {   let currentSubscription={};
                    let currentOrder = this.props.orders[i];
                    let types =  this.state.SubscriptionTypes;
                    let suscriptionType = types.find(x=>x.id==currentOrder.subscription);
                    let languages = currentOrder.languages.length;
                    let additionalLanguages = languages-2;
                    let additionaLanguagesControl=(<div></div>);
                    let currentpriceAditionalLanguages =0;
                  
                    //set up the subscription
                    currentSubscription.price_additionalanguages=0;
                    if(additionalLanguages>=1)
                    {
                        currentpriceAditionalLanguages=suscriptionType.extralanguage.amount*additionalLanguages;
                        additionaLanguagesControl=( 
                            <Grid.Row>
                            <Grid.Column width={9}>                          
                                Additional lang                              
                            </Grid.Column>
                            <Grid.Column width={4}>
                            ${suscriptionType.extralanguage.amount}x{additionalLanguages+''}=
                            </Grid.Column>
                            <Grid.Column width={2}>
                             ${currentpriceAditionalLanguages}
                            </Grid.Column></Grid.Row>);
                        
                        
                        
                        currentSubscription.price_additionalanguages=currentpriceAditionalLanguages;
                    }
               
                    price+=currentpriceAditionalLanguages+suscriptionType.amount;    
                    currentSubscription.originaLanguageLabel=currentOrder.originaLanguageLabel;                
                    currentSubscription.price=suscriptionType.amount;
                    currentSubscription.type = suscriptionType.title;
                    currentSubscription.total = 5*price;
                    currentSubscription.additionallanguagesubscription = suscriptionType.extralanguage.stripeid;
                    currentSubscription.suscription=suscriptionType.stripeid;
                    currentSubscription.languages = currentOrder.languages;
                    currentSubscription.additionalLanguages=additionalLanguages;
                    currentSubscription.MenuId=currentOrder.menu;
                    currentSubscription.Menu=currentOrder.title;
                    subscriptions.push(currentSubscription)
                    
                    let newControl = (
                      <div>
                        <div className="menu">
                          Menu #{currentOrder.id + ''}.{' '}
                          {currentOrder.title + ''}
                        </div>
                        <Grid columns={3}>
                          <Grid.Row>
                            <Grid.Column width={9}>
                              <div>
                                "
                                {suscriptionType.title + ''}
                                "(2lang inc)
                              </div>
                              <div className="secondary">
                                {"  "}Prepaid
                              </div>
                            </Grid.Column>
                            <Grid.Column width={4}>
                              ${suscriptionType.amount}x1=
                            </Grid.Column>
                            <Grid.Column width={2}>
                              ${suscriptionType.amount}
                            </Grid.Column>
    
                          </Grid.Row>                          
                            {additionaLanguagesControl}
                        </Grid>
                      </div>
                    );
                    controllist.push(newControl);

                }
                state.subscriptions=subscriptions;
                state.price=price;
                state.controlList=controllist;
                state.valid = true;

            }else{
                state.valid = false;
            }
           
            this.setState(state);

    }
    handleContinue() {
        const { history } = this.props;
        var pageType = {
            pathname: '/subscriptions/step-2',
            state: {
              data:{
                'price':this.state.price,
                'email': this.state.profile.Email,
                'subscription':this.state.subscriptions
              }
            }
          }
        history.push(pageType);
      }
    render() {
      
       
        //console.log(controllist);
        return (<div className={`plan-order`} >
        <div className="header"><img src={`assets/images/cart.png`} /> <span className="title">Your Order</span></div>
        {this.state.controlList} 
        <div className="footer"><span className="title">Total</span><span className="title" style={{marginRight:'20px'}}>${this.state.price ? this.state.price : '0,0'}</span></div>      
        {this.state.valid ?
            <div style={{paddingLeft: 50,paddingRight: 50}} className={"notification button--action button--action-filled "} onClick={this.handleContinue}>Continue</div>
            :''  }  
       
        </div>
        )
       
    }
};

export default PlanOrder;