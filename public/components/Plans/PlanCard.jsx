import React, { Component, PropTypes } from 'react';

class PlanCard extends Component {
    render() {
        const { data = {}, active, current, onClick, onStart } = this.props;
        let currentActive=false;
        if(data.id==this.props.activeid)
        {
            currentActive=true;
        }
        return (
            <div className={`plan-card shadow ${currentActive ? 'active' : ''} ${current ? 'current' : ''}`} onClick={onClick}>
                <div className="title">{data.title}</div>
                <div className="version"><img src={`assets/images/plan_${data.id}${currentActive ? '_white' : ''}.png`} /></div>
                <div className="fee">Starting from</div>
                <div className="price"><span>${this.props.price/100}</span><span className="period">/{this.props.period}</span></div>
                <div className="line"></div>
                <div className="devices">
                    <div>{this.props.words} words</div>
                    <div className="per-year">per {this.props.period}</div>
                </div>
                <div className="plus"><img src={`assets/images/plus${currentActive ? '_white' : ''}.png`} /></div>
                <div className="description">2 languages</div>
                <div className="plan-button" onClick={onStart}>Get started</div>
                <img className="current-sticker" src="assets/images/current_plan.png" />
            </div>
        )
    }
};

PlanCard.propTypes = {
    component: PropTypes.object
};

export default PlanCard;