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
import PlanOrder from "./PlanOrderModify";
import GenericDropDown from "../Plans/Presentational/GenericDropDown";
import Menu from "./Presentational/Menu";
const classNames = require("classnames");
import { GetMenus, GetLanguages } from "../Plans/Service/PlansService";
import {GetMultiLanguageSubscriptionTypes} from '../Subscriptions/subscription.service'

class PlansStepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      current: 2,
      subscriptions: [],
      menuList: [],
      orders: [],
      selected: null,
      current: 2,
      selectedItemsValues: [],
      languages: [],
      selectedMenus: [],
      title: "",
      originalLanguageDisabled: true,
      targetLanguageDisabled: true,
      englishAdded: false,
      selectOriginalLanguageID:'',
      SubscriptionTypes:[],
      CurrentSubscriptionType:'',
      SelectedLanguages:[],
      DefaultValues:[],
      LanguagesCount:0,
      OriginalSubscription:'',
      currentSelectedLanguagesId:[]
    };
    this.handleContinue = this.handleContinue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.GetMenu = this.GetMenu.bind(this);
    this.handleAddSubscription = this.handleAddSubscription.bind(this);

    this.changeHandler = this.changeHandler.bind(this);


  }

  async componentDidMount() {
    console.log(this.props)
    let menus = await GetMenus();
    let languages = await GetLanguages();
    let state = { ...this.state };
    let subsTypes=await GetMultiLanguageSubscriptionTypes()
    let test=1;
    let currentType=subsTypes.find(x=>x.title==this.props.history.location.state.data.Plan);
    state.SubscriptionTypes= subsTypes;
    state.currentType=currentType;
    for(let i=0;i<this.props.history.location.state.data.TranslatedTo.length;i++)
    {
      if(this.props.history.location.state.data.TranslatedTo[i].length>=1)
      {
        let currentLanguage = this.props.history.location.state.data.TranslatedTo[i][0].key;
        if(currentLanguage==23)
        {
          state.currentSelectedLanguagesId.push(23);
          state.englishAdded=true;

        }
        else
        { 
          if(this.props.history.location.state.data.TranslatedTo[i].key)
            state.currentSelectedLanguagesId.push(this.props.history.location.state.data.TranslatedTo[i][0].key);
          state.DefaultValues.push(this.props.history.location.state.data.TranslatedTo[i])
        }
        state.SelectedLanguages.push(currentLanguage);
      
      }
      
      console.log('test');
    }
    state.LanguagesCount=state.SelectedLanguages.length;
    if (menus) {
      state.menus = menus;
    }
    if (languages) {
      state.languages = languages;
    }
    state.OriginalSubscription=this.props.location.state.data.SubscriptionStripeID;
    this.setState(state);
    await this.AddSubscription();
  }
  
  async AddSubscription() {
    let state = { ...this.state };
    state.menuList.push({ id: state.menuList.length + 1 });
    this.setState(state);
  }

  handleContinue() {
    const { history } = this.props;
    history.push("/subscriptions/step-2");
  }

  handleClick(id) {
    this.setState({ selected: id });
    this.handleStart();
  }


  onChanges(type, obj) {
    //console.log(type, obj)
    //console.log('changing', this.props.menu);
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

  GetMenu() {
    return this.state.menuList;
  }
  handleAddSubscription() {
    this.AddSubscription();
  }
  async changeHandler(id, value) {
    console.log(id);
    let title = this.props.history.location.state.data.Plan;
    let currentType='';
    let state ={...this.state}
    if(value.value && value.value !="" && id =="subscription")
    {
     
      state.CurrentSubscriptionType = this.state.SubscriptionTypes.filter(x=>x.id==value.value)
      this.setState(state,()=>this.GenerateOrderElements(this.state.CurrentSubscriptionType[0].id, this.state.CurrentSubscriptionType[0].title,value.value));
     
    }
    if(id =="translate-language")
    {
      if(value.action=="add")
      {
        state.LanguagesCount++;
        state.SelectedLanguages.push(value.value)
      }
      else if(value.action=="remove"){
        state.LanguagesCount--;
        state.SelectedLanguages=state.SelectedLanguages.filter(function(item) {
          return item != +value.removedItem;
        });
      }
      this.setState(state,()=>this.GenerateOrderElements(this.state.CurrentSubscriptionType[0].id, this.state.CurrentSubscriptionType[0].title,value.value));
    }
   
    
  }
  async GenerateOrderElements(id,title,value)
  {let state = {...this.state};
    if(id==0)
    {
      return;
    }
    state.orders[1]={};  
    state.orders[1].id = id;; 
    state.orders[1].title = title;
    state.orders[1].type=this.state.currentType.id;
    state.orders[1].originaLanguageLabel=this.props.history.location.state.data.OriginalLanguage;
    state.orders[1].subscription=state.CurrentSubscriptionType[0].id;
    let languages =[];
    for(let i=0;i<state.LanguagesCount;i++)
    {
      languages.push({amount:state.CurrentSubscriptionType[0].extralanguage.amount})
    }
    state.orders[1].languages=languages;
    let countValidation=0;
    this.setState(state);
    
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
                <h1 className="content--title">Modify Subscription.</h1>
                <article className="content--module module--item-details no-metadata content--menus">
                  <div className="content--container global-padding-wrapper branches-container">
                    <div className="flex-row">
                      <div style={{ flex: 1 }}>
                        <h2
                          className="asset--subtitle"
                          style={{ marginBottom: 14 }}
                        >
                          {" "}

                        </h2>

                        <div className="article--branch">
                          <div className="branch--contact aside--section contacts--support">
                            <div className="global-padding-wrapper">
                              <div className="branch--currencies">
                                <GenericDropDown
                                  id={"subscription"}
                                  title={"Subscription Package"}
                                  label={"Choose a subscription package:"}
                                  text={"Choose subscription package"}
                                  elements={this.GetPackageTypes()}
                                  defaultValue={this.state.currentType}
                                  multiple={false}
                                  onChange={this.changeHandler}
                                  disabled={false}
                                  elementsSelectorVisible={false}
                                  hideDropDown={false}
                                />
                              </div>
                              <div className="branch--currencies" >
                              <p className="menu--title">Menus</p>
                             
                              <div className="menu--languages">
                                <div id="menu-branch-add" className="language--add">
                                  <label> Menu for this branch: </label>
                                  {this.props.history.location.state.data.Menu}
                                </div>
                              </div>  
                              <div className="menu--languages">
                                <div id="menu-branch-add" className="language--add">
                                  <label> Original Language: </label>
                                  {this.props.history.location.state.data.OriginalLanguage}
                                </div>
                              </div>      
                              </div>
                              
                              <div className="menu--languages">
                                <GenericDropDown
                                  id={"translate-language"}
                                  title={"Translated to"}
                                  label={"Add a language:"}
                                  text={"Choose a language..."}
                                  elements={this.state.languages}
                                  multiple={true}
                                  defaultValues={this.state.DefaultValues}
                                  onChange={this.changeHandler}
                                  maxSelectedItems={5}
                                  disabled={false}
                                  englishAdded={this.state.englishAdded}
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
                          currentPackageType={this.state.currentType? this.state.currentType.id :''}
                          OriginalSubscription={this.state.OriginalSubscription}
                          orders={this.state.orders}
                          total={"2,090"}
                          onClick={this.handleContinue}
                          history={this.props.history}
                          SelectedLanguages={this.state.SelectedLanguages}
                        />
                      </div>
                    </div>
                    <div style={{ overflow: "hidden", marginTop: 24 }} />
                  </div>
                </article>
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }

  GetPackageTypes() {

    let res= [
      { key: 1, text: "Degustation", value: 1 },
      { key: 2, text: "Menu du jour", value: 2 },
      { key: 3, text: "A la carte", value: 3 }
    ];    
    return res;
  }
}

const mapStateToProps = state => {
  return {
    profile: state._profile.profile
  };
};
export default connect(mapStateToProps)(withRouter(PlansStepOne));
