import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { map } from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import Menu from './Menu';
import Translation from './Translation';
import BranchLanguagesEdit from './BranchLanguagesEdit';
import MenuCategoriesEdit from './MenuCategoriesEdit';
import MenuBranchEdit from './MenuBranchEdit';
import MenuBranchesEdit from "./MenuBranchesEdit";
import { StorageManagerInstance } from '../shared/storage.utils';

let createHandlers = (ctx) => {
	let onImageUpload = () => {
		// console.log('uploaded image!!');
	};

	let onSaveChanges = () => {

	};

	let onChanges = (type, obj) => {
    console.log(type, obj)
    console.log('changing', ctx.props.menu);
		let dataToUpdate = {};
		switch (type) {
			case 'main':
				dataToUpdate[obj.key] = obj.target.target.value;
				// console.log(dataToUpdate);

				ctx.props.dispatch(actionCreators.setMenu({
					...ctx.props.menu,
					languages: ctx.props.languages,
					originalLanguages: ctx.props.originalLanguages,
				}, dataToUpdate));
				break
			default:
				dataToUpdate[type] = obj.data;

				// console.log(obj);
				// console.log(dataToUpdate);
				ctx.props.dispatch(actionCreators.setMenu({
					...ctx.props.menu,
				}, dataToUpdate));

		}
	};

	let getMenu = (data) => {
    	ctx.props.dispatch(actionCreators.setMenu(data));
  	};

	return {
		onImageUpload,
		onSaveChanges,
		onChanges,
		getMenu
	};
};

class SectionArticleEditMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: true,
		};
		this.handlers = createHandlers(this);
		this.componentDidMount = this.componentDidMount.bind(this);
	}


	componentDidMount() {
		this.props.dispatch(actionCreators.getLanguages());
		this.handlers.getMenu({
			...this.props,
			languages: this.props.languages,
		});
		var body  = {
			CompanyID:this.props.profile.CompanyID
		}
		var headers = {
				"content-type": "application/json",
				"cache-control": "no-cache",
				"x-access-token": StorageManagerInstance.read('token')
		}

		// axios.post("/menuBranch", body, {headers})
		//   .then(res => {
		// 	const branches = res.data;
		// })
	}

	render() {
		const {
			id,
			title,
			description,
			price,
			categories,
			originalLanguages,
			languages,
			translations,
			currency,
			profile,
			menu
		} = this.props;

		// console.log('languages', languages);
		// console.log('originalLanguages', originalLanguages);
		// console.log('profile', profile, menu);

		let languagesList = (translations && translations.length > 0) ? translations.map((translation, index) => {
			return (index < translations.length - 1)
				? (
					<span className="language--name" key={index}>
						<span>{translation.BranchLanguageName}</span>
						,&nbsp;
					</span>
				) : (
					<span className="language--name" key={index}>
						<span>{translation.BranchLanguageName}</span>
					</span>
				);
		}) : null;

		let translationsContainer = (translations && translations.length > 0) ?
			<div>
				<header className="article--menu--translations--header">
					<p className="menu--title">
						Translations
					</p>
					<div>
						<div className="content--label">
							<h3 className="label--key">Total:</h3>
							<span className="label--value">{translations.length}</span>
						</div>
						<div className="content--label">
							<h3 className="label--key">Languages:</h3>
							<span className="label--value">{languagesList}</span>
						</div>
					</div>
				</header>
				<Link to="/translations" >
					<button className="button--action button--action-filled">See translations</button>
				</Link>
			</div>
		: null;


		// console.log('menuOriginalLanguages', originalLanguages, languages)
		const menuOriginalLanguages = <BranchLanguagesEdit single className="style-7" languages={(originalLanguages && originalLanguages.length > 0) ? originalLanguages.map(language => {if (language.Language) return language.Language}) : []} label="Original Language" name="originalLanguages" onChange={this.handlers.onChanges} />
		const menuLanguages = <BranchLanguagesEdit className="style-7" languages={(languages && languages.length > 0) ? languages.map(language => {if (language.Language) return language.Language}) : []} name="languages" onChange={this.handlers.onChanges} />

		const menuCategories = <MenuCategoriesEdit categories={(categories && categories.length > 0) ? categories : []} onChange={this.handlers.onChanges} />

    const branches = menu && menu.branches;
    const branchesIds = map(branches, item => item.BranchID) || [];
		const menuBranches = (
      <MenuBranchesEdit
        branches={branchesIds}
        onChange={this.handlers.onChanges}
      />
    );

		return (
			<div>
	            <div className="content--container global-padding-wrapper">
	                <h2 className="asset--title">
	                    Content
	                </h2>
	            </div>

	            <div className="content--container global-padding-wrapper no-border-top">
	                <form id="form-menu-content" className="content--edit">
	                    <div className="edit--block">
	                        <label className="label--edit">Enter new Title:</label>
	                        <input className="input--edit" type="text" name="menu--price" id="menu-title" defaultValue={title} onChange={(e) => this.handlers.onChanges('main', {target: e, key: 'title'})} />
	                    </div>
	                    <div className="edit--block">
	                        <label className="label--edit">Enter new Description:</label>
	                        <input className="input--edit" type="text" name="menu--description" id="menu-description" defaultValue={description} onChange={(e) => this.handlers.onChanges('main', {target: e, key: 'description'})} />
	                    </div>
	                    <div className="edit--block">
	                        <label className="label--edit">Enter new Price:</label>
	                        <input className="input--edit" type="text" name="menu--price" id="menu-price" defaultValue={price} onChange={(e) => this.handlers.onChanges('main', {target: e, key: 'price'})} />
	                    </div>
	                </form>

	                <div className="menu--languages">
		                {menuOriginalLanguages}
					</div>
	                <div className="menu--languages">
		                {menuLanguages}
					</div>

									<div className="menu--languages">
										{menuBranches}
									</div>

									<div className="menu--categories">
											{menuCategories}
									</div>
	            </div>
			</div>
		)
	}
};

SectionArticleEditMenu.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	description: PropTypes.string,
	menu: PropTypes.object,
	profile: PropTypes.object,
	price: PropTypes.number,
	categories: PropTypes.array,
	languages: PropTypes.array,
	translations: PropTypes.array,
	currency: PropTypes.object,
	companyID: PropTypes.number
};

const mapStateToProps = (state) => {
	// console.log(state._profile.profile);
  return {
    menu: state._menu.menu,
    profile: state._profile.profile
  };
};

export default connect(mapStateToProps)(SectionArticleEditMenu);
