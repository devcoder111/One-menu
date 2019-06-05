import React, { Component, PropTypes } from "react";
import { Dropdown } from "semantic-ui-react";
import { GetMenus, GetLanguages } from "../Service/PlansService";
import GenericDropDown from "../Presentational/GenericDropDown";
import {getMenus} from "../../Menu/menu.service";
import {GetMultiLanguageSubscriptionTypes} from '../../Subscriptions/subscription.service'


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      SubscriptionTypes:[]
    };

    this.changeHandler = this.changeHandler.bind(this);
  }
  async componentDidMount() {
    // this.props.dispatch(actionCreators.getProfile(this.handlers.onProfileFetched));
    //this.props.dispatch(actionCreators.getLanguages());
    let menus = await GetMenus();
    let languages = await GetLanguages();

    let state = { ...this.state };
    let subsTypes=await GetMultiLanguageSubscriptionTypes()
    let test=1;
    let currentType=subsTypes.find(x=>x.id==this.props.id);
    state.SubscriptionTypes= subsTypes;
    state.currentType=currentType;
    if (menus) {
      state.menus = menus;
    }
    if (languages) {
      state.languages = languages;
    }
    this.setState(state);
  }

  GetMenuName() {}
  async changeHandler(id, value) {
    //console.log(id);
    //console.log(value);
    let state = { ...this.state };
    let selectedPlanId = window.location.href.split("?plan=")[1];
    //var res = state.selectedItemsValues.where(function(t){ return t.id ==id }) ;
    state.selectedItemsValues[id] = value;
    if (id == "menu") {
      let menus = await GetMenus();
      //let allMenus = await getMenus();
      let currentMenu = menus.find(x => x.key == value.value)
      state.planId =  selectedPlanId;
      state.selectOriginalLanguageID=currentMenu.language;
      state.title = state.menus.find(x => x.key == value.value).text;
      state.originalLanguageDisabled = false;
      state.selectedItemsValues['original-language'] = [currentMenu.languageID];
      await this.UpdateStateEnglish();

      state.targetLanguageDisabled = false;
      //If English has not been selected we add it to the languages to be translated
      if (currentMenu.languageID != 23) {
        state.englishAdded = true;
      } else {
        state.englishAdded = false;
      }
    }
    await this.setState(state);
    this.props.onChange(this.props.id, this.state.title,state,state.selectOriginalLanguageID);
    
  }
  UpdateStateEnglish() {
    let state2 = { ...this.state };
    state2.englishAdded = false;
    state2.englishAdded = false;
    this.setState(state2);
  }
  onRemoveItemClick(event) {
    const id = event.target.id;
    this.props.onRemoveItemClick(id);
  }
  render() {
    //Get the selected index from Url
    let selectedPlanId = window.location.href.split("?plan=")[1];
    return (
      <div style={{flex: 1}}>
        <div>
          <div>
            <h2 className="asset--subtitle" style={{marginBottom: 14}}>
              <span style={{float:"left"}}>
                {' '}
                Menu #{this.props.id}: {this.state.title}{' '}
              </span>
            </h2>
          </div>
          <div>
            <div id="branch-language-4" className="content--label">
              <div>
                <h3 className="label--key" />

                <span
                  className="status status--issue remove"
                  id={this.props.id}
                  onClick={this.onRemoveItemClick.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="article--branch">
          <div className="branch--contact aside--section contacts--support">
            <div className="global-padding-wrapper">
              <div className="branch--currencies">
                <GenericDropDown
                  id={'subscription'}
                  title={'Subscription Package'}
                  label={'Choose a subscription package:'}
                  text={'Choose subscription package'}
                  elements={[
                    {key: 1, text: 'Degustation', value: 1},
                    {key: 2, text: 'Menu du jour', value: 2},
                    {key: 3, text: 'A la carte', value: 3},
                  ]}
                  defaultValue={selectedPlanId}
                  multiple={false}
                  onChange={this.changeHandler}
                  disabled={false}
                  elementsSelectorVisible={false}
                  hideDropDown={false}
                />
              </div>
              <div className="branch--currencies">
                <GenericDropDown
                  id={'menu'}
                  title={'Menus'}
                  label={'Add a menu for this branch:'}
                  text={'Choose a Menu...'}
                  elements={this.state.menus}
                  multiple={false}
                  onChange={this.changeHandler}
                  disabled={false}
                  elementsSelectorVisible={false}
                  hideDropDown={false}
                />
              </div>
              <div className="menu--languages">
                <div id="menu-branch-add" className="language--add">
                  <label> Original Language: </label>
                  {this.state.selectOriginalLanguageID}
                </div>
              </div>
              <div className="menu--languages">
                <GenericDropDown
                  id={'translate-language'}
                  title={'Translate to'}
                  label={'Add a language:'}
                  text={'Choose a language...'}
                  elements={this.state.languages}
                  multiple={true}
                  onChange={this.changeHandler}
                  maxSelectedItems={5}
                  disabled={this.state.targetLanguageDisabled}
                  englishAdded={this.state.englishAdded}
                  elementsSelectorVisible={true}
                  hideDropDown={false}
                  upward={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Menu;
