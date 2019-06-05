import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import * as actionCreators from '../action-creators';
import { Toast } from "./Toast";

Modal.setAppElement('#app-wrapper');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class SectionArticleCompany extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      modalIsOpen: false,
      password: '',
      passwordError: '',
			deleteResult: '',
      isSuccess: false,
		}

    this.renderPopup = this.renderPopup.bind(this);
    this.handleDeleteProfile = this.handleDeleteProfile.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.validation = this.validation.bind(this);
    this.renderToast = this.renderToast.bind(this);

	}

	handleDeleteProfile() {
		// console.log('handleDeleteProfile');
		this.setState({modalIsOpen: true});
	}

  closeModal() {
    this.setState({modalIsOpen: false, password: '', passwordError: ''});
  }

  validation() {
		this.setState({passwordError: this.state.password ? '' : 'Please enter your password'});
	}

  handleDelete() {
  	const {dispatch, component} = this.props;

  	if (this.state.password) {
      dispatch(actionCreators.deleteProfile(component, this.state.password, (res) => {
      	// console.log('handleDelete res', res);
				this.setState({ isSuccess: true, deleteResult: res && res.success ? 'Profile deleted' : 'Profile not deleted' })
        this.handleLogout()
			}));
      this.closeModal();
		} else {
      this.validation()
		}
	}

  handleChangePassword(e) {
  	this.setState({password: e.target.value}, () => {
      this.validation()
		})
	}

  renderToast() {
    return (
			<Toast onDismiss={e => this.setState({ isSuccess: false })}>
				<p>
          {this.state.deleteResult}
				</p>
			</Toast>
    );
  }

	renderPopup() {
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
							<div className="content--container--title">Delete Account</div>
						</header>
						<div className="alert--container content--container">
							<div className="grid alert--content">
								<div className="content--label">
										<span className="label--value">
											<p>Are you sure you want to permanently delete your account?<br/>
											This action cannot be undone and all account data will be permanently deleted!</p>
											<p>To delete account please enter you password and confirm</p>
										</span>
									<div className="content--edit">
										<input className="input--edit" onChange={this.handleChangePassword} name="password" type="password" placeholder="******"/>
										<div className="error">{this.state.passwordError}</div>
									</div>
								</div>
							</div>

							<footer className="alert--footer group-buttons global-padding-wrapper push-right">
								<button onClick={this.closeModal} className="alert button--action button--action-outline button--action--cancel">Cancel</button>
								<button onClick={this.handleDelete} className="alert button--action button--action-filled button--action--submit">Delete</button>
							</footer>
						</div>
					</article>
			</Modal>
		)
  }

	render() {
		const { title, dateUpdate, component } = this.props;
    // const popupComponent = (this.props && this.props.popup) ? (
			// <Popup isOpened={opened} type={this.props.popup.type} component={this.props.popup.component} text={this.props.popup.text} actions={this.props.popup.actions} />
    // ) : null;

		return (
			<article className="content--module module--item-details no-metadata content--company">
				<div className="content--container global-padding-wrapper">
					<header className="content--company--header">
						<div className="header--title-container">
								<h2 className="asset--title">
										{component.props.name}
								</h2>
							</div>
							<div className="header--actions">
							<ul>
								<li>
									<Link to="/profile/edit" className="action--edit">
										Edit
									</Link>
								</li>
							</ul>
						</div>
					</header>
				</div>

				{this.renderPopup()}

        {this.state.isSuccess && this.renderToast()}

				<div className="content--container global-padding-wrapper no-border-top">
						<div className="address-container">
								{component.props.name &&
										<div className="content--label">
												<h3 className="label--key">Website:</h3>
												<span className="label--value">
												<a href={component.props.website}>{component.props.name}</a></span>
										</div>
								}
								{component.props.logo.imgPath &&
										<div className="content--label address-image">
												<h3 className="label--key">Logo:</h3>
												<span className="label--value">
														<img src={component.props.logo.imgPath} alt={component.props.logo.altDesc} />
												</span>
										</div>
								}
								{component.props.website &&
										<div className="content--label">
												<h3 className="label--key">Website:</h3>
												<span className="label--value">
												<a href={component.props.website}>{component.props.website}</a></span>
										</div>
								}
								{component.props.email &&
										<div className="content--label">
												<h3 className="label--key">Email:</h3>
												<span className="label--value">
												<a href={"mailto:" + component.props.email}>{component.props.email}</a></span>
										</div>
								}
								{component.props.tel &&
										<div className="content--label">
												<h3 className="label--key">Phone:</h3>
												<span className="label--value">
												<a href={"tel:" + component.props.tel}>{component.props.tel}</a></span>
										</div>
								}
						</div>
						{component.props.social.twitter || component.props.social.facebook || component.props.social.instagram
							? (
								<div className="profile-social" style={{marginTop: 40}}>
									<ul>
                    {component.props.social.twitter &&
										<li>
											<a className="icon-twitter" href="#,">
												<img src="assets/images/social_icon_twitter.png" alt="Twitter" />
												<span>{component.props.social.twitter}</span>
											</a>
										</li>
                    }
                    {component.props.social.facebook &&
										<li>
											<a className="icon-facebook" href="#,">
												<img src="assets/images/social_icon_facebook.png" alt="Facebook" />
												<span>{component.props.social.facebook}</span>
											</a>
										</li>
                    }
                    {component.props.social.instagram &&
										<li>
											<a className="icon-instagram" href="#,">
												<img src="assets/images/social_icon_instagram.png" alt="Instagram" />
												<span>{component.props.social.instagram}</span>
											</a>
										</li>
                    }
									</ul>
								</div>
							) : null
						}
					<div className="profile-social" style={{marginBottom: 10, marginTop: 30}}>
						<span className="profile--delete" onClick={this.handleDeleteProfile}>Delete Account</span>
					</div>
				</div>
		</article>
		)
	}
};

SectionArticleCompany.propTypes = {
	title: PropTypes.string,
	dateUpdate: PropTypes.object,
    component: PropTypes.object
};

export default connect()(SectionArticleCompany);