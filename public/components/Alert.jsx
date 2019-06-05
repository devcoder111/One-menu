import React, { Component, PropTypes } from 'react';

import { Redirect, Route } from 'react-router';
import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import BranchLanguage from './BranchLanguage';
import Modal from "react-modal";

let createHandlers = (ctx) => {
	let onTranslate = (props) => {
		console.log('menu to be translated!', props);

		if (props.hasOwnProperty('menu')) {
			ctx.props.dispatch(actionCreators.translateMenu(props.component.props, onMenuTranslateRequestDone));
		}
	};

	let onMenuTranslateRequestDone = (obj) => {
		console.log('translation request done! ', obj);

		ctx.setState({
			isTranslateRequestDone: true,
			component: {
				type: 'menu',
				obj: ctx.props.component
			}
		});

    ctx.props.dispatch(actionCreators.getProfile());
	};

	return {
		onTranslate,
		onMenuTranslateRequestDone
	};
};

class Alert extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isTranslateRequestDone: false,
			requestComesFromMenuCreation: (props.component.props && props.component.props.languages && props.component.props.languages.length > 0) ? true : false,
			component: {},
      showRemoveConfirm: true,
		};
		this.handlers = createHandlers(this);
		this.handlePurchase = this.handlePurchase.bind(this);
	}

  handlePurchase() {
    this.handlers.onTranslate(this.props);

    // this.props.dispatch(actionCreators.getTranslation(1, (res) => {
    // 	console.log('getTranslation', res)
    // }));
    this.setState({ showRemoveConfirm: false });
	}

  renderConfirm() {
		const { history } = this.props;
    const { loading, showRemoveConfirm } = this.state;
    const quote = 3000;
    const type = 1;
    // TODO check subscription and limits
    let message = null;
    let title = null;
    let buttons = null;

    switch (type) {
			case 1: // no subscription with translation is purchased
				title = 'Translation Subscription Required';
				message = 'Translation subscription is required in order to process with menu translation';
				buttons = [<button
						key="1"
						disabled={loading}
						onClick={this.handlePurchase}
						className="button--action button--action-filled"
					>
            Purchase
					</button>,
          <button
						key="2"
						disabled={loading}
						className="button--action button--action-outline"
						onClick={() => this.setState({ showRemoveConfirm: false })}
					>
						Cancel
					</button>
				];
				break;
			case 2: // subscription is purchased for this menu and new translation doesn't exceed annual quota
				break;
			case 3: // If subscription is purchased, but new translation exceed annual quota of words
				title = 'Words Limit Exceeded';
				message = `${700} words required to translate, while ${500} words remain in your current subscription. Would you like to upgrade subscription?`;
				buttons = [<button
						key="1"
						disabled={loading}
						onClick={() => {history.push('/subscriptions')}}
						className="button--action button--action-filled"
					>
            Purchase
					</button>,
          <button
						key="2"
						disabled={loading}
						className="button--action button--action-outline"
						onClick={() => this.setState({ showRemoveConfirm: false })}
					>
						Cancel & Save Changes
					</button>,
          <button
						key="3"
						disabled={loading}
						className="button--action button--action-outline"
						onClick={() => this.setState({ showRemoveConfirm: false })}
					>
						Cancel & Discard Changes
					</button>
				];
				break;
			case 4:
				title = 'Expand Current Subscription';
				message = `You've added a new language, that is require to expand your current subscription. Would you like to expand subscription?`;
				buttons = [<button
						key="1"
						disabled={loading}
						onClick={() => {history.push('/subscriptions')}}
						className="button--action button--action-filled"
					>
					Expand
					</button>,
          <button
						key="2"
						disabled={loading}
						className="button--action button--action-outline"
						onClick={() => this.setState({ showRemoveConfirm: false })}
					>
						Cancel
					</button>
				];
				break;
			default:
		}
    return message && title ? (
			<Modal ariaHideApp={false} isOpen={showRemoveConfirm}>
				<h2>{title}</h2>
				<p>
					{message}
				</p>
				<footer className="group-buttons">
					{buttons}
				</footer>
			</Modal>
    ) : null;
  }

	componentDidMount() {
		console.log('history', this.props.history)
	}

	render() {
		const { type, component } = this.props;

		// console.log(this.props);

		const languageProps = (component.props && component.props.languages && component.props.languages.length > 0) ? component.props.languages : (this.props.menu && this.props.menu.languages && this.props.menu.languages.length > 0) ? this.props.menu.languages : [];

		const languages = (languageProps && languageProps.length > 0) ? languageProps.map((lang, index) => {
			const finalLanguage = (lang.Language) ? lang.Language : lang;
			return <BranchLanguage id={finalLanguage.LanguageID} code={finalLanguage.Code} codeFull={finalLanguage.CodeFull} name={finalLanguage.Name} title={finalLanguage.Title} key={index} />;
		}) : null;

		const alertComponent = (this.state.isTranslateRequestDone || !this.state.requestComesFromMenuCreation)
			? (
				<Redirect to={{
					pathname: '/translations'
				}} />
			) : (
				<article className="content--module module--alert">
					{this.renderConfirm()}
						<header className="content--container--header header--green">
								<h2 className="content--container--title">Menu saved!</h2>
						</header>
						<div className="alert--container content--container">
								<div className="grid alert--content">
										<div className="content--label">
												<span className="label--value">Your menu has been saved successfully! Do you want to translate your changes immediately? <br/> (You can always do so later)</span>
										</div>
										<div className="content--label">
											<h3>Languages to be translated in:</h3>
											{languages}
										</div>
								</div>

								<footer className="alert--footer group-buttons global-padding-wrapper push-right">
									<button id="menu-translate" className="button--action button--action-filled" onClick={(e) => this.handlers.onTranslate(this.props)}>Translate your menu</button>
								</footer>
						</div>
				</article>
			);

		return alertComponent;
	}
};

Alert.propTypes = {
	type: PropTypes.string,
	component: PropTypes.object
};

const mapStateToProps = (state) => {
	// console.log(state);
	return {
		menu: state._menu.menu
	}
};

export default connect(mapStateToProps)(withRouter(Alert));