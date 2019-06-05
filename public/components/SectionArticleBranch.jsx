import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import Switch from "react-switch";
import BranchMenu from "./BranchMenu";
const classNames = require('classnames');
import Checkbox from 'react-simple-checkbox';

import Contact from './Contact';
import BranchCuisine from './BranchCuisine';
import BranchLanguage from './BranchLanguage';
import BranchImage from './BranchImage';
import BranchCurrency from './BranchCurrency';
import * as actionCreators from '../action-creators';

let createHandlers = (ctx) => {
  let headerOnClick = () => {
    ctx.setState((prevState) => {
		return {
			expanded: !prevState.expanded
		};
	});
  };

  let goToBranch = () => {
  	ctx.setState({
  		redirect: true
  	});
  };

  return {
    headerOnClick,
    goToBranch
  };
};

class SectionArticleBranch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
      checked: false
		};
		this.handlers = createHandlers(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickToggle = this.handleClickToggle.bind(this);
    this.handleClickSelection = this.handleClickSelection.bind(this);
	}

  handleChange(checked, e) {
    this.setState({ checked });
    const payload = {
    	BranchID: this.props.id,
			IsEnabled: checked
    };

    this.props.dispatch(actionCreators.saveBranch(payload, (res) => {
      if (res.success) {
      	this.setState({isEnabled: res.data && res.data.IsEnabled})
			}
    }));
    // this.props.dispatch(actionCreators.toggleBranch(this.props.id, checked));
  }

  handleClickToggle(e) {
    e.preventDefault();
    e.stopPropagation();
	}

  handleClickSelection(e) {
		// e.preventDefault();
		e.stopPropagation();
	}

	componentWillMount() {
    this.setState({isEnabled: this.props.isEnabled})
	}

	render() {
		const {
			id,
			address,
			city,
			contacts,
			zipcode,
			country,
			cuisines,
			currencies,
			email,
			hasHeadquarters,
			images,
			languages,
			menus,
			isEnabled,
      selected,
      onToggleSelection,
			name
		} = this.props;

		if (this.state.redirect) {
			return <Redirect push to={"/branch/get/" + id} />;
		}

		const contactComponents = (contacts.length > 0) ? contacts.map((contact, index) => {
			return <Contact id={contact.BranchContactID} imgPath={contact.ImagePath} altDesc={contact.ImageAltDesc} firstname={contact.Firstname} lastname={contact.Lastname} isAdmin={contact.IsAdmin} email={contact.Email} tel={contact.Tel} key={index} />;
		}) : '';

		const cuisineComponents = (cuisines.length > 0) ? cuisines.map((cuisine, index) => {
			const finalCuisine = (cuisine.Cuisine && Object.keys(cuisine.Cuisine).length > 0) ? cuisine.Cuisine : cuisine;
			return (index < cuisines.length - 1)
				? (
					<div key={cuisine.BranchCuisineID}>
						<BranchCuisine id={cuisine.BranchCuisineID} description={finalCuisine.Description} title={finalCuisine.Title} key={index} />
						,&nbsp;
					</div>
				) : (
					<div key={cuisine.BranchCuisineID}>
						<BranchCuisine id={cuisine.BranchCuisineID} description={finalCuisine.Description} title={finalCuisine.Title} key={index} />
					</div>
				)
		}) : '';

		const languageComponents = (languages.length > 0) ? languages.map((language, index) => {
			const finalLanguage = (language.Language && Object.keys(language.Language).length > 0) ? language.Language : language;
			return <BranchLanguage id={language.BranchLanguageID} code={finalLanguage.Code} codeFull={finalLanguage.CodeFull} name={finalLanguage.Name} title={finalLanguage.Title} key={index} />;
		}) : '';

		// const menuComponents = (menus.length > 0) ? menus.map((menu, index) => {
		// 	return <BranchMenu id={menu.MenuID} title={menu.Title} key={index} />;
		// }) : '';

    const menuComponents = (menus && menus.length > 0) ? menus.map((menu, index) => {
      return (index < menus.length - 1)
        ? (
					<div key={index}>
						<BranchMenu id={menu.MenuID} title={menu.Title} key={index} />
						,&nbsp;
					</div>
        ) : (
					<div key={index}>
						<BranchMenu id={menu.MenuID} title={menu.Title} key={index} />
					</div>
        )
    }) : '';

		const currencyComponents = (currencies && currencies.length > 0) ? currencies.map((currency, index) => {
			const finalCurrency = (currency.Currency && Object.keys(currency.Currency).length > 0) ? currency.Currency : currency;
			return (index < currencies.length - 1)
				? (
					<div key={index}>
						<BranchCurrency id={currency.BranchCurrencyID} name={finalCurrency.Name} nameShort={finalCurrency.NameShort} symbol={finalCurrency.Symbol} description={finalCurrency.Description} />
						,&nbsp;
					</div>
				) : (
					<div key={index}>
						<BranchCurrency id={currency.BranchCurrencyID} name={finalCurrency.Name} nameShort={finalCurrency.NameShort} symbol={finalCurrency.Symbol} description={finalCurrency.Description} />
					</div>
				)
		}) : '';

		const imageComponents = (images.length > 0) ? images.map((image, index) => {
			return (
				<li key={index}>
					<BranchImage id={image.BranchImageID} imgPath={image.Path} altDesc={image.AltDesc} key={image.BranchImageID} />
				</li>
			)
		}) : '';

		const isHqComponent = (hasHeadquarters)
			? <span className="label--value">Main Branch</span>
			: <span className="label--value">Normal Branch</span>
		;

		const classes = classNames(
			'branch--contact--header',
			'collapsable',
			(this.state.expanded) ? 'opened' : ''
		);


		return (
			<div className="article--branch">
				<div className="branch--contact aside--section contacts--support">
					<header className={classes} onClick={this.handlers.headerOnClick}>
						<div className="branch--header-wrap">
							<div className="branch--selected" onClick={this.handleClickSelection}>
								<Checkbox
									id="all-branch-selected"
									size={3}
									tickSize={2}
									color="#727B9C"
									checked={selected[id]}
									onChange={(e) => onToggleSelection(e, id)}
								/>
							</div>
							<div className="header--title-container">
								<h1 className="aside--title collapsable--title">
									{name}
								</h1>
							</div>
						</div>
						<div className="header--actions">
							<ul>
								<li>
									<div className="branch--enabled">{this.state.isEnabled ? 'Enabled' : 'Disabled'}
										<span onClick={this.handleClickToggle}>
											<Switch
												checked={this.state.isEnabled}
												onChange={this.handleChange}
												onColor="#c1c7d6"
												onHandleColor="#727b9c"
												handleDiameter={25}
												uncheckedIcon={false}
												checkedIcon={false}
												boxShadow="0px 1px 3px rgba(0, 0, 0, 0.6)"
												// activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
												height={18}
												width={40}
												className="react-switch"
												id="material-switch"
											/>
										</span>
									</div>
								</li>
								<li><Link to={"/branch/edit/" + id} className="action--edit">Edit</Link></li>
								<li><Link to={"/branch/delete/" + id} className="action--delete">Delete</Link></li>
							</ul>
						</div>
					</header>
					<div className="global-padding-wrapper">
						<div>
							{
								/*
								<div className="branch--menus">
									<Link to={"/menu/branch/" + id}>
										<p>Menus</p>
										<img src="assets/images/icon-menu-white.svg" alt={"Icon of " + name + " branch menus"} />
									</Link>
								</div>
								*/
							}
							<div className="branch--hq">
								<p className="menu--title">Enabled</p>
								{isEnabled
									? <span className="label--value">Yes</span>
									: <span className="label--value">No</span>
								}
							</div>
							<div className="branch--hq">
								<p className="menu--title">Branch Type</p>
								{isHqComponent}
							</div>
							<div className="branch--currencies">
								<p className="menu--title">Currency</p>
								{currencyComponents}
							</div>
							<div className="branch--cuisines">
								<p className="menu--title">Cuisine Types</p>
								{cuisineComponents}
							</div>
							{/*<div className="branch--languages">*/}
								{/*<p className="menu--title">Languages</p>*/}
								{/*{languageComponents}*/}
							{/*</div>*/}
							<div className="branch--cuisines">
								<p className="menu--title">Menus</p>
								{menuComponents}
							</div>
							<div className="branch--address">
					            <p className="menu--title">Address</p>
					            <address className="label--key">
					                {address}<br />
					                {zipcode} {city}<br />
					                {country}<br />
					            </address>
					        </div>
					        <div className="branch--images">
								<ul>
									{imageComponents}
								</ul>
							</div>
							<div className="branch--contacts">
								<h3 className="branch--contacts--name">Contacts</h3>
								{contactComponents}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
};

SectionArticleBranch.propTypes = {
	title: PropTypes.string,
	dateUpdate: PropTypes.object,
    component: PropTypes.object
};

export default connect()(SectionArticleBranch);