import React, { Component, PropTypes } from "react";

import { connect } from "react-redux";
import Modal from "react-modal";
import { map } from "lodash";
import * as actionCreators from "../../action-creators";
import Navbar from "../Navbar";
import Aside from "../Aside";
import PageHeader from "../PageHeader";
import { withRouter } from "react-router-dom";
import BranchLanguagesEdit from "../BranchLanguagesEdit";
const classNames = require("classnames");
import { getProfile } from "../Profile/profile.service";
import {
  GetMySubscriptions,
  CancelSubscription,
  RemoveLanguage,
  ReactivateSubscription
} from "../Subscriptions/subscription.service";
import GenericDropDown from "../Plans/Presentational/GenericDropDown";
import { GetLanguages } from "../Plans/Service/PlansService";
import { Icon, Loader } from "semantic-ui-react";
import { Dropdown, Grid, Segment, Dimmer,Image } from "semantic-ui-react";

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

const states = [
  { key: 0, text: "All", value: 0 },
  { key: 1, text: "Active", value: 1 },
  { key: 2, text: "Canceled", value: 2 },
  { key: 3, text: "Expired", value: 3 }
];

class MySubscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      current: 2,
      modalIsOpen: false,
      Languages: [],
      selectedSubscriptionToCancel: "",
      SubscriptionIdRemoveLanguage: "",
      menuList: [],
      modalTitle: "",
      modalContent: "",
      modalConfirm: "",
      modalCancel: "",
      selectedFilterValue: "",
      alert: [],
      loading: true
    };
    this.handleContinue = this.handleContinue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onChanges = this.onChanges.bind(this);
    this.handleAddSubscription = this.handleAddSubscription.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderPopup = this.renderPopup.bind(this);
    this.handleCancelSubscription = this.handleCancelSubscription.bind(this);
    this.handleRemoveLanguage = this.handleRemoveLanguage.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.handleActivateSubscription = this.handleActivateSubscription.bind(
      this
    );
    this.CancelRemoveLanguage = this.CancelRemoveLanguage.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.getAlarms = this.getAlarms.bind(this);
    this.handleReactivateSubscription = this.handleReactivateSubscription.bind(this);
  }

  async componentDidMount() {
    // this.props.dispatch(actionCreators.getProfile(this.handlers.onProfileFetched));
    this.props.dispatch(actionCreators.getLanguages());
    await this.LoadData();

  }

  async LoadData() {
    let profile = await getProfile();
    let MySubscriptions = await GetMySubscriptions(profile.CompanyID);
    let languages = await GetLanguages();
    let state = { ...state };
    state.Languages = languages;
    state.menuList = [];
    for (let i = 0; i < MySubscriptions.length; i++) {
      let currentSubscription = MySubscriptions[i];
      let subscriptionItem = {};
      subscriptionItem.Menu = currentSubscription.Description;
      subscriptionItem.Plan = currentSubscription.Title;
      if (subscriptionItem.Plan == "Digital Menu") {
        subscriptionItem.DigitalMenu = true;
      } else {
        subscriptionItem.DigitalMenu = false;
      }
      subscriptionItem.RegistrationDate = new Date(
        currentSubscription.Date
      ).toLocaleDateString();
      subscriptionItem.LastPayment = "";
      subscriptionItem.BillingCycle = "";
      subscriptionItem.RenewsOn = "";
      subscriptionItem.OriginalLanguage =
        currentSubscription.OriginalLanguageLabel;
      subscriptionItem.TranslatedTo = [];
      subscriptionItem.interval = currentSubscription.interval;
      subscriptionItem.SubscriptionStripeID =
        currentSubscription.SubscriptionStripeID;
      subscriptionItem.status = currentSubscription.status;
      if (
        currentSubscription.upcomingInvoice &&
        currentSubscription.upcomingInvoice.next_payment_attempt
      )
        subscriptionItem.UpComingPayment = new Date(
          currentSubscription.upcomingInvoice.next_payment_attempt * 1000
        ).toLocaleDateString();
      if (
        currentSubscription.upcomingInvoice &&
        currentSubscription.upcomingInvoice.amount_due
      ) {
        subscriptionItem.Amount =
          currentSubscription.upcomingInvoice.amount_due;
        if (subscriptionItem.Amount > 0)
          subscriptionItem.Amount = subscriptionItem.Amount / 100;
      } else {
        subscriptionItem.Amount = 0;
      }
      if (
        currentSubscription.upcomingInvoice &&
        currentSubscription.LastInvoice.created
      )
        subscriptionItem.LastInvoice = new Date(
          currentSubscription.LastInvoice.created * 1000
        ).toLocaleDateString();
      if (
        currentSubscription.LastInvoice &&
        currentSubscription.LastInvoice.amount_paid
      ) {
        subscriptionItem.LastAmount = +currentSubscription.LastInvoice
          .amount_paid;
        if (subscriptionItem.LastAmount > 0)
          subscriptionItem.LastAmount = subscriptionItem.LastAmount / 100;
      } else {
        subscriptionItem.LastAmount = 0;
      }
      let Language1 = languages.filter(
        x => x.key == currentSubscription.Language1
      );
      let Language2 = languages.filter(
        x => x.key == currentSubscription.Language2
      );
      let Language3 = languages.filter(
        x => x.key == currentSubscription.Language3
      );
      let Language4 = languages.filter(
        x => x.key == currentSubscription.Language4
      );
      let Language5 = languages.filter(
        x => x.key == currentSubscription.Language5
      );
      if (Language1) {
        subscriptionItem.TranslatedTo.push(Language1);
      }
      if (Language2) {
        subscriptionItem.TranslatedTo.push(Language2);
      }
      if (Language3) {
        subscriptionItem.TranslatedTo.push(Language3);
      }
      if (Language4) {
        subscriptionItem.TranslatedTo.push(Language4);
      }
      if (Language5) {
        subscriptionItem.TranslatedTo.push(Language5);
      }
      state.menuList.push(subscriptionItem);
    }
    state.loading=false;
    await this.setState(state);
  }

  handleContinue() {
    console.log("123");
    const { history } = this.props;
    history.push("/subscriptions/step-2");
  }

  handleClick(id) {
    this.setState({ selected: id });
    this.handleStart();
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

  handleAddSubscription(e,item) {

    const { history } = this.props;
    var pageType = {
        pathname: '/subscriptions/step-1-modify',
        state: {
          data:{
            'Menu':item.Menu,
            'OriginalLanguage': item.OriginalLanguage,
            'SubscriptionStripeID':item.SubscriptionStripeID,
            'TranslatedTo':item.TranslatedTo,
            'Plan':item.Plan
          }
        }
      }
      history.push(pageType);
      
  }
  async handleActivateSubscription() {}

  async handleRemoveLanguage(currentThis) {
    let cancellation = await RemoveLanguage(
      currentThis.state.SubscriptionIdRemoveLanguage,
      currentThis.state.valueToBeRemoved
    );
    alert("Language Removed");

    currentThis.closeModal(currentThis);
    await this.LoadData();
  }
  async handleCancel(currentThis) {
    let cancellation = await CancelSubscription(
      currentThis.state.selectedSubscriptionToCancel
    );
    alert("Subscription Canceled");
    currentThis.closeModal(currentThis);
    await this.LoadData();
  }

  handleCancelSubscription(e) {
    let state = { ...this.state };
    state.modalTitle = "Cancel Subscription";
    state.modalContent = (
      <p>
        Would you like to cancel current subscription?
        <br />
        In case of subscriptioncancelation, prepaid months couldn't be
        reimbursed or refunded.
      </p>
    );
    state.modalConfirm = this.handleCancel;
    state.selectedSubscriptionToCancel = e.target.id;
    state.modalCancel = this.closeModal;
    state.modalIsOpen = true;
    this.setState(state);
  }
  async handleReactivateSubscription(e){
    let SubscriptionToReactivate= e.target.id;
    let cancellation = await ReactivateSubscription(
      SubscriptionToReactivate
    );
    alert("Subscription Reactivated");
    //currentThis.closeModal(currentThis);
    await this.LoadData();
  }

  closeModal(currentThis) {
    let state = { ...currentThis.state };
    state.modalIsOpen = false;
    currentThis.loading = false;
    currentThis.setState(state);
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
  CancelRemoveLanguage(currentThis) {
    let state = { ...currentThis.state };
    state.modalIsOpen = false;
    state.AddValue(state.valueToBeRemoved);
    currentThis.setState(state);
  }
  async changeHandler(id, value, addValueFunction, SubscriptionStripeID) {
    let state = { ...this.state };
    state.AddValue = addValueFunction;
    if (value.action == "remove") {
      //We only have two elements left
      if (value.selectedItemList.length + 1 <= 2) {
        state.valueToBeRemoved = value.removedItem;
        state.alert = [];
        state.alert[SubscriptionStripeID] =
          "The minimum amount of translation languages is 2, unfortunately you are not able to delete this language";
        this.setState(state, () => this.CancelRemoveLanguage(this));

        return;
      }
      state.modalTitle = "Remove language";
      state.modalContent = (
        <p>
          {" "}
          You are about to remove additional language, updated price will be
          applied on the next billing period. <br />
          However, we won't able to refund or reimburse plan's price difference.
          <br />
          Would you like to remove language?
        </p>
      );
      state.modalConfirm = this.handleRemoveLanguage;

      state.modalCancel = this.CancelRemoveLanguage;
      state.SubscriptionIdRemoveLanguage = SubscriptionStripeID;
      state.loading = true;
      state.modalIsOpen = true;
      state.valueToBeRemoved = value.removedItem;
      state.alert[SubscriptionStripeID] = "";
      this.setState(state);
    }
  }
  handleDropDownChange(e, { value }) {
    let newstate = { ...this.state };
    newstate.selectedFilterValue = value;
    this.setState( newstate);
  }
  getAlarms(SubscriptionStripeID) {
    if (
      SubscriptionStripeID &&
      this.state.alert &&
      this.state.alert[SubscriptionStripeID]
    ) {
      return <span>{this.state.alert[SubscriptionStripeID]}</span>;
    }
    return "";
  }
  render() {
    const { selected, current } = this.state;
    const action = this.props.match.params.action;
    const profileType =
      typeof this.props.match.params.action !== "undefined"
        ? "profile-" + action
        : "profile";

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

    const menus = [];
    const originalLanguages = [];
    const languages = [];
    let currentState= this;
    return <div>
  <Navbar logo={company.logo} />
  <div className="content">
    <PageHeader company={company} />

    <div className="main-content">
      <Aside type={asideType} />

      <main className="main">
        <section className={classes}>
          <h1 className="content--title">My Subscriptions</h1>

          <Dropdown
            onChange={this.handleDropDownChange}
            options={states}
            placeholder="All"
            selection
            value={this.state.selectedFilterValue}
          />
          {this.state.loading
            ? <Segment>
                <Dimmer active inverted>
                  <Loader size="large">Loading</Loader>
                </Dimmer>

                <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
              </Segment>
            : ''}
          {
            this.GenerateList()
          }
        </section>
      </main>
    </div>
  </div>
  {this.renderPopup ()}
</div>;
;
  }

  GenerateList() {
    let currentState=this;

    let value= this.state.menuList.map((item, index, currentM,test) => {
      let filterStatus = this.state.selectedFilterValue;
      if(filterStatus==0)
      {
        console.log('no filter');
      }
      else if(item.status=="canceled" && filterStatus !=2)
      {
        return;
      }
      else if(item.status=="active" && filterStatus !=1)
      {
        return;
      }
      else  if(item.status=="trialing" && filterStatus !=1)
      {
        return;
      }
      let TranslateToEnglish = false;
      for (let i = 0; i < item.TranslatedTo.length; i++) {
        let currentItem = item.TranslatedTo[i];
        if (currentItem[0] && currentItem[0].key == 23) {
          TranslateToEnglish = true;
          break;
        }
      }
      return (<article key={index} className="content--module module--item-details no-metadata content--menus">
        <div className="content--container global-padding-wrapper branches-container">
          <div className="flex-row">
            <div style={{ flex: 1 }}>
              <div className="menu-header-wrapper">
                <img src={`assets/images/menu-icon.png`} />
                <div>
                  <div className="title">{item.Menu}</div>
                  <div className="menu-plan">
                    Plan: {item.Plan}
                  </div>
                  <div className="active" style={this.GetStatusStyle(item.status)}>{this.GetStatus(item.status)}</div>
                </div>
              </div>

              <div className="article--branch">
                <div className="branch--contact aside--section contacts--support" style={{
                  backgroundColor: '#fff',
                }}>
                  <div className="global-padding-wrapper">
                    <div className="menu-row">
                      <div className="row-title">
                        Billing Cycle:
                      </div>
                      <div className="row-value">
                        {item.interval}
                      </div>
                    </div>
                    <div className="menu-row">
                      <div className="row-title">
                        Registration Date:
                      </div>
                      <div className="row-value">
                        {item.RegistrationDate}
                      </div>
                    </div>
                    <div className="menu-row">
                      <div className="row-title">
                        Renews on:
                      </div>
                      <div className="row-value">
                        {item.UpComingPayment}
                        <span style={{paddingLeft:'30px'}}>({''}${item.Amount})</span>
                      </div>
                    </div>
                    <div className="menu-row">
                      <div className="row-title">
                        Last Payment:
                      </div>
                      <div className="row-value">
                        {item.LastInvoice}  <span style={{paddingLeft:'30px'}}>(${item.LastAmount})</span>
                      </div>
                    </div>
                    {item.DigitalMenu
                      ? ''
                      : <div className="menu-row">
                        <div className="row-title">
                          Original Language:
                        </div>
                        <div className="row-value">
                          {item.OriginalLanguage}
                        </div>
                      </div>}

                    <div className="menu-row">
                      <div className="row-value"  >
                        {item.status == 'canceled' || item.DigitalMenu
                          ? ''
                          : <GenericDropDown className="row-value" id={'translate-language'} title={'Translate to'} label={'Add a language:'} text={'Choose a language...'} elements={this.state.Languages} multiple={true} defaultValues={item.TranslatedTo} onChange={this.changeHandler} maxSelectedItems={5} hideDropDown={true} SubscriptionStripeID={item.SubscriptionStripeID}
                            //disabled={this.state.targetLanguageDisabled}
                            addValue={this.addValue} englishAdded={TranslateToEnglish} elementsSelectorVisible={true} />}
                      </div>
                    </div>
                    <div className="menu-row">
                      {item.status == 'canceled' || item.DigitalMenu
                        ? ''
                        : <a href={'#/subscriptions/step-1-language?subscription=' +
                          item.SubscriptionStripeID} id="AddLanguage">
                          <Icon name="plus circle" size="small" />
                          {' '}
                          Add new language
                        </a>}
                    </div>
                    <div className="menu-notification">
                      {this.getAlarms(item.SubscriptionStripeID)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                overflow: 'hidden',
                marginTop: 24,
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                {item.status == 'canceled' || item.DigitalMenu
                  ? ''
                  : <button style={{
                    marginRight: 16,
                  }} item={item} className="notification button--action button--action-outline" onClick={e => {
                    this.handleAddSubscription(e, item);
                  } }>
                    Modify
                  </button>}
                {item.status == 'expired'
                  ? <button style={{
                    marginRight: 0,
                  }} className="notification button--action button--action-outline" onClick={this.handleActivateSubscription} id={item.SubscriptionStripeID}>
                    Activate Subscription
                  </button>
                  : ''}
                {item.status == 'canceled'
                  ? ''
                  : <button style={{
                    marginRight: 0,
                  }} className="notification button--action button--action-outline" onClick={this.handleCancelSubscription} id={item.SubscriptionStripeID}>
                    Cancel Subscription
                  </button>}
                  {item.status == 'canceled'
                  ? 
                  <button style={{
                    marginRight: 0,
                  }} className="notification button--action button--action-outline" onClick={this.handleReactivateSubscription} id={item.SubscriptionStripeID}>
                    Reactivate Subscription
                  </button>
                  :''}
              </div>
            </div>
            <div />
          </div>
        </div>
      </article>);
    });
    return value;
  }

  GetStatus(status) {
     if(status=='canceled'){
      return "Canceled";
     }
     if(status=='trialing'){
      return "Active";
     }
     if(status=='active'){
      return "Active";
     }
  }

  GetStatusStyle(status) {
    if(status=='canceled')
    {
      return { color: 'red' };
    }
    else
    {
      return { color: 'green' };
    }

  }

  MainContent(company, asideType, classes) {
    return 
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return {
    profile: state._profile.profile
  };
};
export default connect(mapStateToProps)(withRouter(MySubscriptions));
