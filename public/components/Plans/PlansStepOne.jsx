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
import PlanOrder from "./PlanOrder";

import Menu from "./Presentational/Menu";
const classNames = require("classnames");

class PlansStepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      current: 2,
      subscriptions: [],
      menuList: [],
      orders:[]
    };
    this.handleContinue = this.handleContinue.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.GetMenu = this.GetMenu.bind(this);
    this.handleAddSubscription = this.handleAddSubscription.bind(this);
    this.RenderMenulist = this.RenderMenulist.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.GenerateOrderElements = this.GenerateOrderElements.bind(this);
    this.onRemoveItemClick=this.onRemoveItemClick.bind(this);
  }

  async componentDidMount() {
    this.AddSubscription();
  }
  RenderMenulist(){
    let state = { ...this.state };
    let rows = [];
    for(let i=0;i<state.menuList.length;i++)
    {
      rows.push(<Grid.Row>
        <Grid.Column>
          <Menu id={state.menuList[i].id}  onChange={this.changeHandler} profile={this.props.profile} onRemoveItemClick={this.onRemoveItemClick}/>
        </Grid.Column>
      </Grid.Row>);
    }    
    let res = (<Grid columns={1} divided>
      {rows}
    </Grid>);
    return res;
  }
  onRemoveItemClick(id)
  {
    let state ={...this.state}
    state.orders=state.orders.filter(function(item){
      if(+item.id !== +id){
        return true
      }
    })
    state.menuList=state.menuList.filter(function(item){
      if(+item.id !== +id){
        return true
      }
    })
    this.setState(state);

  }
  AddSubscription() {
    let state = { ...this.state };
    state.menuList.push({ "id": state.menuList.length+1});
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
  async changeHandler(id, title,value) {
    var test=2;
    //console.log(value);
    let currentType='';
    if(value.currentType)
    {
    currentType=   value.currentType.title
    }
    var res = await this.GenerateOrderElements(id, title,value.selectedItemsValues,currentType,value.selectOriginalLanguageID);

  }

  async GenerateOrderElements(id,title,elements,type,originalLanguage)
  {
    if(id==0)
    {
      return;
    }
    let state = {...this.state};
    state.orders[id]={};  
    state.orders[id].id = id;; 
    state.orders[id].title = title;
    state.orders[id].type=type;
    state.orders[id].originaLanguageLabel=originalLanguage;
    let countValidation=0;
    if(elements.menu){
      state.orders[id].menu = elements.menu.value;
      countValidation++;
    }
    if(elements.subscription){
      state.orders[id].subscription = elements.subscription.value;
      countValidation++;
    }    
    if(elements['original-language']){
      state.orders[id].originalLanguage = elements['original-language'].value;
      countValidation++;
    } 
    if(elements['translate-language']){
      state.orders[id].languages = elements['translate-language'].selectedItemList;
      countValidation++;
    }
    const NumberofFormElements = 4;
    if(countValidation>=NumberofFormElements)
    {
      this.setState(state);
    }
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
  handleAddSubscription(){
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
                    {"<"}{" "}
                    <Link to="/subscriptions/plans">Back to Package</Link>
                  </li>
                </ul>
                <h1 className="content--title">Purchase. Step 1 of 3</h1>
                <article className="content--module module--item-details no-metadata content--menus">
                  <div className="content--container global-padding-wrapper branches-container">
                    <div className="flex-row">
                      {this.RenderMenulist()}

                      <div>
                        <PlanOrder
                          orders={this.state.orders}
                          total={"2,090"}
                          onClick={this.handleContinue}
                          history={this.props.history}
                        />
                      </div>
                    </div>
                    <div style={{ overflow: "hidden", marginTop: 24 }}>
                      <button
                        style={{ marginRight: "auto" }}
                        className="notification button--action button--action-outline"
                        onClick={this.handleAddSubscription}
                      >
                        Add another Subscription
                      </button>
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
  return {
    profile: state._profile.profile
  };
};
export default connect(mapStateToProps)(withRouter(PlansStepOne));
