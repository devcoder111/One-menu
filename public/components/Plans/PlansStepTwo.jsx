import React, { Component } from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actionCreators from "../../action-creators";
import Navbar from "../Navbar";
import Aside from "../Aside";
import PageHeader from "../PageHeader";
import { withRouter } from "react-router-dom";
const classNames = require("classnames");
import StripeCheckout from "react-stripe-checkout";
import { Form, Radio } from 'semantic-ui-react'
import {
  chargeMultilanguageplan,
  ValidateCoupon,
  ModifySubscription
} from "../Subscriptions/subscription.service";
import { Grid } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import {
  GetStripeParameters,GetMultiLanguageSubscriptionTypes
} from "../Subscriptions/subscription.service"

class PlansStepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      current: 2,
      price: 0,
      profile: {},
      coupondiscount: 0,
      TotalPrice: 0,
      mode:'normal'

    };
    this.handleContinue = this.handleContinue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onChanges = this.onChanges.bind(this);
    this.handleAddSubscription = this.handleAddSubscription.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.GetPlanOrder = this.GetPlanOrder.bind(this);
    this.onToken = this.onToken.bind(this);
    this.GetMainSection = this.GetMainSection.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.GetTotalPrice=this.GetTotalPrice.bind(this);
  }
async GetTotalPrice(state,)
{
  let YearTotalPrice=0;
  let MonthlyTotalPrice=0;
  let MonthlyPrice=0;
  
    for(let i=0;i< state.subscriptions.length;i++)
    {
      let currentSubscription=state.subscriptions[i];
    
        let MonthlyTotalPriceResult=0;
        let MonthlyPriceResult=0;
        ({ MonthlyTotalPriceResult, MonthlyPriceResult } = this.GetMontlyPrice(currentSubscription, state.SubscriptionTypes));
        MonthlyTotalPrice+=MonthlyTotalPriceResult;
        MonthlyPrice+=MonthlyPriceResult;

        YearTotalPrice += this.GetAnualPrice(state.SubscriptionTypes, currentSubscription, state, i);
 
    }
    return [MonthlyTotalPrice,MonthlyPrice,YearTotalPrice];
}
  GetAnualPrice(SubscriptionTypes, currentSubscription, state, i) {
    let TotalPrice=0;
    let SubscriptionType = SubscriptionTypes.filter(x => x.stripeid == currentSubscription.suscription)[0];
    TotalPrice += SubscriptionType.amount_yearly;
    //state.subscriptions[i].suscription = SubscriptionType.stripeidyearly;
    if (currentSubscription.languages.length >= 1) {
      //state.subscriptions[i].additionallanguagesubscription = SubscriptionType.extralanguage.stripeidyearly;
      TotalPrice += currentSubscription.languages.length * SubscriptionType.extralanguage.amount_yearly;
    }
    return TotalPrice;
  }

  GetMontlyPrice(currentSubscription, SubscriptionTypes) {
    let MonthlyTotalPriceResult=0;
    let MonthlyPriceResult=0;
    MonthlyTotalPriceResult += currentSubscription.price;
    let SubscriptionType = SubscriptionTypes.filter(x => x.stripeid == currentSubscription.suscription)[0];
    if (currentSubscription.languages.length >= 1) {
      MonthlyTotalPriceResult += currentSubscription.languages.length * SubscriptionType.extralanguage.amount;
    }
    MonthlyPriceResult = MonthlyTotalPriceResult;
    MonthlyTotalPriceResult = 5 * MonthlyPriceResult;
    return { MonthlyTotalPriceResult, MonthlyPriceResult };
  }

  async componentDidMount() {
   
    // this.props.dispatch(actionCreators.getProfile(this.handlers.onProfileFetched));
    this.props.dispatch(actionCreators.getLanguages());
    let state = { ...this.state };
    state.SubscriptionTypes = await GetMultiLanguageSubscriptionTypes();
    state.price = this.props.history.location.state.data.price;
    state.profile.email = this.props.history.location.state.data.email;
    state.subscriptions = this.props.history.location.state.data.subscription;
    if(this.props.history.location.state.data.mode)
    {
      state.mode = this.props.history.location.state.data.mode;
    }
    state.checkBoxValue="monthly"

    let res= await this.GetTotalPrice(state);
   
    state.MonthlyPrice =res[1]
    state.MontlyTotalPrice =res[0] 
    state.YearlyPrice =res[2] 
    this.SetBillingCycle(state);

  state.couponapplied = false;
    this.setState(state);
  }
  async onToken(token) {
    let currentCoupon = this.state.coupon;
    if (!this.state.couponapplied) {
      currentCoupon = null;
    }
    if(this.state.mode=="normal")
    {
      let subscription = await chargeMultilanguageplan(
        this.state.profile.email,
        token,
        this.state.subscriptions,
        currentCoupon,
        this.state.checkBoxValue
      );
    }
    if(this.state.mode=="upgrade")
    {
      let subscription = await ModifySubscription(
        this.state.profile.email,
        token,
        this.state.subscriptions,
        currentCoupon, 
        this.state.mode,
        this.props.location.state.data.OriginalSubscription,
        this.state.checkBoxValue
      );
    }
    if(this.state.mode=="downgrade")
    {
      let subscription = await ModifySubscription(
        this.state.profile.email,
        token,
        this.state.subscriptions,
        currentCoupon,
        this.props.location.state.data.OriginalSubscription,
        this.state.checkBoxValue
      );
    }
  
    const { history } = this.props;
    history.push("/subscriptions/my-subscriptions");
  }
  handleContinue() {
    // const { history } = this.props;
    // history.push('/subscriptions/step-2')
  }

  handleClick(id) {
    this.setState({ selected: id });
    this.handleStart();
  }
 async handleChange (e, { value }) {
    let state = {...this.state}
    state.checkBoxValue=value;
  

    this.SetBillingCycle(state);
    this.setState(state);
  }
  SetBillingCycle(state) {
    if (state.checkBoxValue == "monthly") {
      for (let i = 0; i < state.subscriptions.length; i++) {
        let currentSubscription = state.subscriptions[i];
        let currentSubscriptionType = state.SubscriptionTypes.filter(x => x.stripeid == currentSubscription.suscription || x.stripeidyearly == currentSubscription.suscription)[0];
        state.subscriptions[i].subscription = currentSubscriptionType.stripeid;
        state.subscriptions[i].price = currentSubscriptionType.amount;
        state.subscriptions[i].price_additionalanguages = currentSubscriptionType.extralanguage.amount;
        state.subscriptions[i].cycle=state.checkBoxValue;
      }
      state.TotalPrice = state.MontlyTotalPrice;
    }
    if (state.checkBoxValue == "yearly") {
      for (let i = 0; i < state.subscriptions.length; i++) {
        let currentSubscription = state.subscriptions[i];
        let currentSubscriptionType = state.SubscriptionTypes.filter(x => x.stripeid == currentSubscription.suscription || x.stripeidyearly == currentSubscription.suscription)[0];
        state.subscriptions[i].subscription = currentSubscriptionType.stripeidyearly;
        state.subscriptions[i].price = currentSubscriptionType.amount_yearly;
        state.subscriptions[i].price_additionalanguages = currentSubscriptionType.extralanguage.amount_yearly;
        state.subscriptions[i].cycle=state.checkBoxValue;
      }
      state.TotalPrice = state.YearlyPrice;
    }
  }

  onChanges(type, obj) {
    console.log(type, obj);
    console.log("changing", this.props.menu);
    let dataToUpdate = {};
    switch (type) {
      case "main":
        dataToUpdate[obj.key] = obj.target.target.value;
        // console.log(dataToUpdate);

        this.props.dispatch(
          actionCreators.setMenu(
            {
              ...this.props.menu,
              languages: this.props.languages,
              originalLanguages: this.props.originalLanguages
            },
            dataToUpdate
          )
        );
        break;
      default:
        dataToUpdate[type] = obj.data;

        // console.log(obj);
        // console.log(dataToUpdate);
        this.props.dispatch(
          actionCreators.setMenu(
            {
              ...this.props.menu
            },
            dataToUpdate
          )
        );
    }
  }

  handleAddSubscription() {}

  sendMessage() {
    console.log(this.inputtext.value);
  }
  async handleClick() {
    if (!this.state.couponapplied) {
      let res = await ValidateCoupon(this.state.coupon);
      if (res.valid) {
        let state = { ...this.state };
        state.coupondiscount = res.coupon.percent_off;
        state.TotalPrice= Math.round(state.TotalPrice-state.TotalPrice* (state.coupondiscount / 100))     
        this.setState(state);
      }
    }
  }
  handleInputChange(e) {
    let state = { ...this.state };
    state.coupon = e.target.value;
    this.setState(state);
  }
  GetPlanOrder() {
    let BillingDetails = (<span></span>);
    if(this.state.checkBoxValue=="monthly")
    {

    
    BillingDetails=(<span><p
      style={{
        "font-weight": "normal",
        "font-size": "14px",
        "font-family": "Lato"
      }}
    >
      Pre paid 5 months ${this.state.MonthlyPrice} x 5 mo = $
      {5 * this.state.MonthlyPrice}{" "}
    </p>
    <p
      style={{
        "font-weight": "normal",
        "font-size": "14px",
        "font-family": "Lato"
      }}
    >
      Montly Payment: ${this.state.MonthlyPrice} x mo{" "}
    </p>
    </span>);
    }
    if(this.state.checkBoxValue=="yearly")
    {

    
    BillingDetails=(<span><p
      style={{
        "font-weight": "normal",
        "font-size": "14px",
        "font-family": "Lato"
      }}
    >
      Pre paid 12 months ${this.state.YearlyPrice} per year= $
      {this.state.YearlyPrice}{" "}
    </p>
    
    </span>);
    }
    
    if (this.state.price && this.state.profile) {
      return (
        <div className={`plan-order`} style={{ "margin-top": "14px" }}>
          <div className="header">
            <img src={`assets/images/cart.png`} />{" "}
            <span className="title">Your Order</span>
          </div>
          <div>
            <p
              style={{
                "font-weight": "bold",
                "font-size": "14px",
                "font-family": "Lato"
              }}
            >
              Billing Cycle
            </p>
            {BillingDetails}
            <p
              style={{
                "font-weight": "normal",
                "font-size": "14px",
                "font-family": "Lato"
              }}
            >
              Coupon Discount: {this.state.coupondiscount}%=$
              {5 * this.state.price * (this.state.coupondiscount / 100)}{" "}
            </p>
          </div>
          <div>
            <p
              style={{
                "font-weight": "normal",
                "font-size": "14px",
                "font-family": "Lato"
              }}
            >
              Redeem Coupon:
            </p>

            <Input
              placeholder="Coupon..."
              style={{ height: "40px", width: "180px" }}
              action={{ content: "Apply", onClick: () => this.handleClick() }}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="footer">
            <span className="title">Total</span>
            <span className="title">
              ${this.state.TotalPrice ? this.state.TotalPrice : "0,0"}
            </span>
          </div>

          <StripeCheckout
            amount={this.state.TotalPrice * 100}
            email={this.state.profile.email}
            description="MULTILINGUAL DIGITAL MENU"
            locale="auto"
            name="one-menu"
            token={this.onToken}
            stripeKey={"pk_test_Mjz2q28RCNDZsFA6Y783rrKq"}
          >
            <div
              style={{ paddingLeft: 50, paddingRight: 50 }}
              className={"notification button--action button--action-filled "}
            >
              Continue
            </div>
          </StripeCheckout>
        </div>
      );
    }
  }
  GetMainSection() {
    return (
      <div style={{flex: 1}}>
        <h2 className="asset--subtitle" style={{marginBottom: 14}}>
          {' '}
        </h2>

        <div className="article--branch" style={{width: '886px'}}>
          <div className="branch--contact aside--section contacts--support">
            <div className="global-padding-wrapper">
              <Form>
                <Grid columns={3}>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <img src="assets/images/FivePercentDiscount.png" />{' '}
                    </Grid.Column>
                    <Grid.Column width={9}>
                      <Form.Field>
                        <div style={{float: 'left',marginRight:'20px',}}>
                          <Radio
                            name="radioGroup"
                            value="yearly"
                            checked={this.state.checkBoxValue === 'yearly'}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div
                          style={{
                            marginRight:'20px',
                            float: 'left',
                          }}
                        >
                          {' '}
                          <p>Yearly Payment:</p>{' '}
                        </div>
                        <div style={{float: 'left',marginRight:'20px',}}>
                          {' '}
                          <span>${this.state.YearlyPrice} per year</span>
                          <div
                            className="secondary"
                            style={{
                              'font-size': '12px',
                              'font-weight': '300',
                            }}
                          >
                            Prepaid first year
                          </div>
                        </div>
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column style={{textAlign: 'right'}} width={3}>
                      <span>${this.state.YearlyPrice} a year</span>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <span
                      style={{
                        borderBottom: '1px dashed #898E9F',
                        color: '',
                        width: '100%',
                        height: '0px',
                        marginLeft: '100px',
                        marginRight: '100px',
                      }}
                    />
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={3}>
                     
                    </Grid.Column>
                    <Grid.Column width={9}>
                      <Form.Field>
                        <div style={{float: 'left',marginRight:'20px',}}>
                          <Radio
                            name="radioGroup"
                            value="monthly"
                            checked={this.state.checkBoxValue === 'monthly'}
                            onChange={this.handleChange}
                          />
                        </div>
                        <div
                          style={{
                            marginRight:'20px',
                            float: 'left',
                          }}
                        >
                          {' '}
                          <p>Monthly Payment:</p>{' '}
                        </div>
                        <div style={{float: 'left',marginRight:'20px',}}>
                          {' '}
                          <span>${this.state.MonthlyPrice} a month</span>
                          <div
                            className="secondary"
                            style={{
                              'font-size': '12px',
                              'font-weight': '300',
                            }}
                          >
                            Prepaid first 5 months
                          </div>
                        </div>
                      </Form.Field>
                    </Grid.Column>
                    <Grid.Column style={{textAlign: 'right'}} width={3}>
                      <span>${12*this.state.MonthlyPrice} a year</span>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const action = this.props.match.params.action;

    const profile = this.props.profile ? this.props.profile : {};

    const branchRoot =
      profile.branches && profile.branches.length > 0
        ? profile.branches.find(branch => {
            return branch.HasHeadquarters == 1;
          })
        : null;

    if (branchRoot) {
      branchRoot.mainContact =
        branchRoot.contacts && branchRoot.contacts.length > 0
          ? branchRoot.contacts.find(contact => {
              return contact.IsAdmin == 1;
            })
          : null;
    }

    const company = {
      name: profile.Name,
      description: profile.Description,
      logo: {
        imgPath: profile.LogoPath,
        altDesc: profile.LogoAltDesc
      },
      website: profile.Website,
      tel: profile.Tel,
      email: profile.Email,
      social: {
        twitter: profile.Twitter,
        facebook: profile.Facebook,
        instagram: profile.Instagram,
        youtube: profile.Youtube
      },
      branchRoot: branchRoot
    };

    const asideType = "plan";

    const classes = classNames(
      "content--section",
      "section--dashboard",
      "section--type-plans"
    );


    return (
      <div>
        <Navbar logo={company.logo} />
        <div className="content">
          <PageHeader company={company} />

          <div className="main-content">
            <Aside type={asideType} />

            <main className="main">
              <section className={classes}>
                <ul className="breadcrumbs">
                  <li>
                    {'<'}{' '}
                    <Link to="/subscriptions/plans">Back to Package</Link>
                  </li>
                </ul>
                <h1 className="content--title">Purchase. Step 2 of 3</h1>
                <article className="content--module module--item-details no-metadata content--menus">
                  <div className="content--container global-padding-wrapper branches-container">
                    <div id="PaymentOption">Select Payment option</div>
                    <div className="flex-row">
                      <div>{this.GetMainSection()}</div>

                      <div>{this.GetPlanOrder()}</div>
                    </div>
                    <div className="flex-row">
                      <div>
                        {' '}
                        <img
                          src="assets/images/WeAccept.png"
                          alt="Icon of current plan"
                        />
                      </div>
                    </div> 
                    <div className="flex-row">
                      <div>
                        <a href="https://www.stripe.com" target="_blank">
                          <img
                            src="assets/images/PoweredByStripe.png"
                            alt="Icon of current plan"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return {
    profile: state._profile.profile
  };
};
export default connect(mapStateToProps)(withRouter(PlansStepOne));
