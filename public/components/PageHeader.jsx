import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import * as AuthService from "./Auth/auth.service";

class PageHeader extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    AuthService.logout()
  }

	render () {
		const { company } = this.props;
		const logo = company && company.logo || {}

		// console.log('company', company)
		const adminComponent = (company.branchRoot && company.branchRoot.mainContact) ? (
			<div>
				<h4 className="login">
					{company.branchRoot.mainContact.Firstname} {company.branchRoot.mainContact.Lastname}
					<span>Admin</span>
				</h4>
				<img src={company.branchRoot.mainContact.ImagePath || 'assets/images/icon-anonymous.svg'} alt={company.branchRoot.mainContact.ImageAltDesc} />
			</div>
		) : (
			<div style={{display: 'flex', alignItems: 'center'}}>
				<h4 className="login">
          {company.name}
          <span>Profile</span>
				</h4>
				{logo.imgPath
					? <img  src={logo.imgPath} alt={logo.altDesc} />
					: <img src="assets/images/icon-anonymous.svg" alt="" />
				}
			</div>
		);

		return (
			<section className="toolbar clearfix">
	            <h3 className="content--container--title">{company.name} Management Portal</h3>
	            <nav className="admin-nav">
								<Dropdown>
									<DropdownTrigger>{adminComponent}</DropdownTrigger>
									<DropdownContent>
										<div className="dropdown--item" onClick={this.handleLogout}>Log out
											<img src={'assets/images/logout.png'} width={24} height={24} />
										</div>
									</DropdownContent>
								</Dropdown>
	            </nav>
	        </section>
		)
	}
};

PageHeader.propTypes = {
	company: PropTypes.object
};

export default PageHeader;