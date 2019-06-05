import React, { Component } from "react";
require("linqjs");
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Grid, Image } from "semantic-ui-react";
import * as actionCreators from "../../action-creators";
import Navbar from "../Navbar";
import Aside from "../Aside";
import PageHeader from "../PageHeader";
import { withRouter } from "react-router-dom";
import PlanOrder from './PlanOrderLanguages';
import GenericDropDown from "../Plans/Presentational/GenericDropDown";
import Menu from "./Presentational/Menu";
const classNames = require("classnames");
import { GetLanguages } from "../Plans/Service/PlansService";
import {GetMySubscriptions,GetMultiLanguageSubscriptionTypes,GetSubscription} from "../Subscriptions/subscription.service"
import {getMenus} from "../Menu/menu.service"


class PlansStepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      current: 2,
      subscriptions: [],
      menuList: [],
      orders: [],
      languages: [],
      selectedLanguages: [],
      selectedLanguagesId: [],
      languages:[],
      englishAdded: false,
      MySubscriptions: [],
      originalSelectedLanguages:[],
      currentSelectedLanguagesId:[],
      maxElements:0,
      CurrentMenuTitle:''
    };
    this.handleContinue = this.handleContinue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.GetMenu = this.GetMenu.bind(this);
    this.handleAddSubscription = this.handleAddSubscription.bind(this);
    this.RenderMenulist = this.RenderMenulist.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.GenerateOrderElements = this.GenerateOrderElements.bind(this);
    this.GetOriginalLanguages=this.GetOriginalLanguages.bind(this);
    
  }

  async componentDidMount() {
    let languages = await GetLanguages();
    let profile = this.props.profile;
    let Subscriptions = await GetMySubscriptions(profile.CompanyID);
    let subsTypes=await GetMultiLanguageSubscriptionTypes()
    let Menus = await getMenus();
    let state = { ...this.state };
    let selectedStripeSubscriptionID = window.location.href.split("?subscription=")[1];
    let stripeSubscription = await GetSubscription(selectedStripeSubscriptionID);
    state.MySubscriptions = Subscriptions.find(
      x => x.SubscriptionStripeID == selectedStripeSubscriptionID
    );
    state.currentSubscription = subsTypes.find(x=>x.stripeid==stripeSubscription.plan.id);
    state.CurrentMenuTitle=Menus.filter(x=>x.id==state.MySubscriptions.MenuID)[0].title
    state.languages=languages;
    if (languages) {
      state.languages = languages;
    }
    state.selectedLanguagesId=[];
    state.selectedLanguages = [];
    
    if (state.MySubscriptions.Language1) {
      if (state.MySubscriptions.Language1 == 23) {
        state.englishAdded = true;
        state.selectedLanguagesId.push(state.MySubscriptions.Language1)
      } else {
        state.selectedLanguages.push([
          { key: state.MySubscriptions.Language1 }
        ]);
        state.selectedLanguagesId.push(state.MySubscriptions.Language1)
      }
    }
    if (state.MySubscriptions.Language2) {
      if (state.MySubscriptions.Language2 == 23) {
        state.selectedLanguagesId.push(state.MySubscriptions.Language2)
        state.englishAdded = true;
      } else {
        state.selectedLanguages.push([
          { key: state.MySubscriptions.Language2 }
        ]);
        state.selectedLanguagesId.push(state.MySubscriptions.Language2)
      }
    }
    if (state.MySubscriptions.Language3) {
      if (state.MySubscriptions.Language3 == 23) {
        state.selectedLanguagesId.push(state.MySubscriptions.Language3)
        state.englishAdded = true;
      } else {
        state.selectedLanguages.push([
          { key: state.MySubscriptions.Language3 }
        ]);
        state.selectedLanguagesId.push(state.MySubscriptions.Language3)
      }
    }
    if (state.MySubscriptions.Language4) {
      if (state.MySubscriptions.Language4 == 23) {
        state.selectedLanguagesId.push(state.MySubscriptions.Language4)
        state.englishAdded = true;
      } else {
        state.selectedLanguages.push([
          { key: state.MySubscriptions.Language4 }
        ]);
        state.selectedLanguagesId.push(state.MySubscriptions.Language4)
      }
    }
    if (state.MySubscriptions.Language5) {
      if (state.MySubscriptions.Language5 == 23) {
        state.selectedLanguagesId.push(state.MySubscriptions.Language5)
        state.englishAdded = true;
      } else {
        state.selectedLanguages.push([
          { key: state.MySubscriptions.Language5 }
        ]);
        state.selectedLanguagesId.push(state.MySubscriptions.Language5)
      }
    }
    state.originalSelectedLanguages=JSON.parse(JSON.stringify((state.selectedLanguagesId)));
    state.maxElements=5-state.originalSelectedLanguages.length;

    this.setState(state);
  }

  RenderMenulist() {
    let state = { ...this.state };
    let rows = [];
    for (let i = 0; i < state.menuList.length; i++) {
      rows.push(
        <Grid.Row>
          <Grid.Column>
            <Menu
              id={state.menuList[i].id}
              onChange={this.changeHandler}
              profile={this.props.profile}
            />
          </Grid.Column>
        </Grid.Row>
      );
    }
    let res = (
      <Grid columns={1} divided>
        {rows}
      </Grid>
    );
    return res;
  }

  handleContinue() {
    const { history } = this.props;
    history.push("/subscriptions/step-2");
  }

  handleClick(id) {
    this.setState({ selected: id });
    this.handleStart();
  }
  async changeHandler(id,value,addValueFunction) {
    if(value.action=="add")
    {
      var test2=value;
      //console.log(value);
      let currentType = "";
      let state ={...this.state}
      state.currentSelectedLanguagesId.push(value.value)
      await this.setState(state,()=>this.GenerateOrderElements(id));
      
    }
    if(value.action=="remove")
    {
      let newState ={...this.state}
      newState.currentSelectedLanguagesId=newState.currentSelectedLanguagesId.filter(function(item) {
        return item !== value.value;
      });
      await this.setState(newState,()=>this.GenerateOrderElements(id));
    }
    
  }

  async GenerateOrderElements(id) {
    if (id == 0) {
      return;
    }
    let state = { ...this.state };
    state.orders[id] = {};
    let countValidation = 0;
    let selectedStripeSubscriptionID = window.location.href.split("?subscription=")[1];
    state.orders[id].elementCount =state.currentSelectedLanguagesId.length; 
    state.orders[id].currentstripesubscription =selectedStripeSubscriptionID; 
    state.orders[id].amount = 5*state.orders[id].elementCount*this.state.currentSubscription.extralanguage.amount;
    state.orders[id].languagesstripesubscription = this.state.currentSubscription.extralanguage.stripeid;
    state.orders[id].title =this.state.CurrentMenuTitle;
    state.orders[id].plan =this.state.currentSubscription.title
    state.orders[id].languages = this.state.currentSelectedLanguagesId;

    await this.setState(state);

  }



  GetMenu() {
    return this.state.menuList;
  }
  handleAddSubscription() {
    this.AddSubscription();
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

    //Get Menus using the service

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
                    {"<"} <Link to="/subscriptions/plans">Back to Package</Link>
                  </li>
                </ul>
                <h1 className="content--title">Purchase. Step 1 of 1</h1>
                <article className="content--module module--item-details no-metadata content--menus">
                  <div className="content--container global-padding-wrapper branches-container">
                    <div className="flex-row">
                      <div style={{ flex: 1 }}>
                      <h2 className="asset--subtitle" style={{ marginBottom: 14 }}>
                        {" "}
                        Menu: {this.state.CurrentMenuTitle}
                      </h2>
                        <div className="article--branch">
                          
                          <div className="branch--contact aside--section contacts--support">
                            <div className="global-padding-wrapper">
                              <div className="branch--currencies" />
                              <div className="menu-row">
                                <div className="row-title">Current Languages:</div>
                                 { this.GetOriginalLanguages()
                                }
                                </div>
                              <div className="menu--languages">
                                <GenericDropDown
                                  id={"translate-language"}
                                  title={"Translate to"}
                                  label={"Add a language:"}
                                  text={"Choose a language..."}
                                  elements={this.state.languages}
                                  multiple={true}
                                  onChange={this.changeHandler}
                                  maxSelectedItems={this.state.maxElements}
                                  disabled={false}
                                  englishAdded={false}
                                  elementsSelectorVisible={true}
                                  hideDropDown={false}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <PlanOrder
                          orders={this.state.orders}
                          total={"2,090"}
                          onClick={this.handleContinue}
                        />
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

 
  GetOriginalLanguages() {
    let controList=[];
    let currentThis= this;
    this.state.originalSelectedLanguages.forEach(function(val,index){ 
      let label = currentThis.state.languages.find(x=>x.key==val);
      let control =(<div>
        <div id="branch-language-4" className="content--label">
          <h3 className="label--key" />
          <span className="label--value">{label.text}</span>
          <span className='status status--issue DisabledRemoveButton' />
        </div>
      </div>);
      controList.push(control);
    })  
    return controList;
  }
}

const mapStateToProps = state => {
  return {
    profile: state._profile.profile
  };
};
export default connect(mapStateToProps)(withRouter(PlansStepOne));
