import React, { Component, PropTypes } from 'react';

class BranchMenu extends Component {
	render() {
		const { id, title } = this.props;

		return (
			<span id={"branch-menu-" + id} className="label--value">{title}</span>
		)
	}
};

BranchMenu.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string
};

export default BranchMenu;