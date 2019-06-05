import React, { Component, PropTypes } from 'react';
import {GetMultiLanguageSubscriptionTypes} from '../Subscriptions/subscription.service'
import StripeCheckout from 'react-stripe-checkout';
import {getProfile} from '../Profile/profile.service'
import {chargeMultilanguageplan} from '../Subscriptions/subscription.service'
import Modal from "react-modal";
import { Grid, Image } from 'semantic-ui-react'
const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)"
    }
  };

class PlanOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SubscriptionTypes: [],
      profile: [],
      price: 0,
      valid: false,
      subscriptions: [],
      modalIsOpen: false
    };
    this.onToken = this.onToken.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }
  async componentDidMount() {
    let state = { ...this.state };
    state.SubscriptionTypes = await GetMultiLanguageSubscriptionTypes();
    let profile = await getProfile();
    state.profile = profile;
    this.setState(state);
  }
  async onToken(token) {
    let subscription = await chargeMultilanguageplan(
      this.state.profile.Email,
      token,
      this.state.subscriptions
    );
  }
  async componentWillReceiveProps(nextprops) {
    let price = 0;
    let state = { ...this.state };
    let subscriptions = [];
    if (nextprops.orders && nextprops.orders.length > 0) {
      let controllist = [];
      for (let i = 1; i < this.props.orders.length; i++) {
        let currentSubscription = {};
        let currentOrder = this.props.orders[i];
        let types = this.state.SubscriptionTypes;
        let suscriptionType = types.find(
          x => x.id == currentOrder.subscription
        );
        let languages = currentOrder.languages.length;
        let additionalLanguages = languages - 2;
        let additionaLanguagesControl = <div />;
        let currentpriceAditionalLanguages = 0;

        //set up the subscription
        currentSubscription.price_additionalanguages = 0;
        if (additionalLanguages >= 1) {
          currentpriceAditionalLanguages =
            suscriptionType.extralanguage.amount * additionalLanguages;
          additionaLanguagesControl =  additionaLanguagesControl=( 
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
          currentSubscription.price_additionalanguages = currentpriceAditionalLanguages;
        }

        price += currentpriceAditionalLanguages + suscriptionType.amount;
        currentSubscription.originaLanguageLabel =
          currentOrder.originaLanguageLabel;
        currentSubscription.price = suscriptionType.amount;
        currentSubscription.type = suscriptionType.title;
        currentSubscription.total = 5 * price;
        currentSubscription.additionallanguagesubscription =
          suscriptionType.extralanguage.stripeid;
        currentSubscription.suscription = suscriptionType.stripeid;
        currentSubscription.languages = currentOrder.languages;
        currentSubscription.additionalLanguages = additionalLanguages;
        currentSubscription.MenuId = currentOrder.menu;
        currentSubscription.Menu = currentOrder.title;
        subscriptions.push(currentSubscription);

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
      state.subscriptions = subscriptions;
      state.subscriptions[0].languages=this.props.SelectedLanguages;
      state.price = price;
      state.controlList = controllist;
      state.valid = true;
    } else {
      state.valid = false;
    }

    this.setState(state);
  }

  renderPopup() {
    const { crop, zoom, allImages } = this.state;

    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        // onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <article className="module--alert">
          <header className="content--container--header header--alert">
            <div className="content--container--title">
              {this.state.modalTitle}
            </div>
          </header>
          <div className="alert--container content--container">
            <div className="grid alert--content">
              <div className="content--label">
                <span>{this.state.modalContent}</span>
              </div>
            </div>

            <footer className="alert--footer group-buttons global-padding-wrapper push-right">
              <button
                onClick={() => {
                  this.state.modalConfirm(this);
                }}
                className="alert button--action button--action-filled button--action--submit"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  this.state.modalCancel(this);
                }}
                className="alert button--action button--action-outline button--action--cancel"
              >
                Cancel
              </button>
            </footer>
          </div>
        </article>
      </Modal>
    );
  }
  closeModal(currentThis) {
    let state = { ...currentThis.state };
    state.modalIsOpen = false;
    currentThis.loading = false;
    currentThis.setState(state);
  }
  handleContinue() {
    let state = { ...this.state };
    if (this.props.orders[1].id < this.props.currentPackageType) {
      state.modalTitle = "Plan downgrade";
      state.mode = "downgrade";
      state.modalContent = (
        <p>
          You are about to downgrade plan, updated price will be applied on the
          next billing period.
          <br />
          However, we won't able to refund or reimburse plan's price difference.
          <br />
          Would you like to perform plan downgrade?
        </p>
      );
     
      state.modalConfirm = this.handleConfirm;
      //state.selectedSubscriptionToCancel = e.target.id;
      state.modalCancel = this.closeModal;
      state.modalIsOpen = true;
      this.setState(state);
    } 
    if (this.props.orders[1].id == this.props.currentPackageType) {
        state.modalTitle = "Current Plan";
        state.mode = "downgrade";
        state.modalContent = (
          <p>
            Current Plan can't be modified, to add languages you can use the "My Subscriptions page".
          </p>
        );

      state.modalConfirm = this.closeModal;
      //state.selectedSubscriptionToCancel = e.target.id;
      state.modalCancel = this.closeModal;
      state.modalIsOpen = true;
      this.setState(state);
    }
    else {
      state.mode = "upgrade";
      this.setState(state,()=>this.handleConfirm());
      
    }
  }
  handleConfirm() {
    const { history } = this.props;
    var pageType = {
      pathname: "/subscriptions/step-2",
      state: {
        data: {
          price: this.state.price,
          email: this.state.profile.Email,
          subscription: this.state.subscriptions,
          OriginalSubscription:this.props.OriginalSubscription,
          mode:this.state.mode
        }
      }
    };
    history.push(pageType);
  }
  render() {
    //console.log(controllist);
    return (
      <div className={`plan-order`}>
        <div className="header">
          <img src={`assets/images/cart.png`} />{" "}
          <span className="title">Your Order</span>
        </div>
        {this.state.controlList}
        <div className="footer">
          <span className="title">Total</span>
          <span className="title">
            ${this.state.price ? this.state.price : "0,0"}
          </span>
        </div>
        {this.state.valid ? (
          <div
            style={{ paddingLeft: 50, paddingRight: 50 }}
            className={"notification button--action button--action-filled "}
            onClick={this.handleContinue}
          >
            Continue
          </div>
        ) : (
          ""
        )}
        {this.renderPopup()}
      </div>
    );
  }
};

export default PlanOrder;