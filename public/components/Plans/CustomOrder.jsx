import React, { Component, PropTypes } from 'react';
import BranchMenusEdit from "../BranchMenusEdit";

const initialState = {
    words: undefined,
    comments: '',
    menus: [],
}
class CustomOrder extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleStart = this.handleStart.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeMenu = this.onChangeMenu.bind(this);
    }

    handleStart() {
        const { words, comments, menus } = this.state;
        const payload = {
            words: words || 0,
            comments,
            menus
        }

        this.props.onClick(payload, (res) => {
            if (res) {
                this.setState({...initialState, words: 0})
            }
        });
    }

    onChange(title, event) {
        this.setState({[title]: event.target.value});
    }

    onChangeMenu(type, data) {
        this.setState({menus: data && data.data || []});
    }

    render() {
        const { availableMenus } = this.props;
        const { words, comments, menus } = this.state;

        return (
            <div className="custom-plan-wrapper">
                <div className="custom-plan-text">
                    <div className="title">Need more than 2 000 words?</div>
                    <div className="body">Tell us how many words you need to translate or just choose one of your menus and we’ll create a custom offer for you!</div>
                    <div className="words">
                        <div className="content--edit">
                            <div className="edit--block">
                                <label className="label--edit">Number of words:</label>
                                <input className="input--edit" type="text" name="words" placeholder="2600..." value={words} onChange={(e) => this.onChange('words', e)} />
                            </div>
                        </div>
                    </div>
                    <div style={{marginBottom: 30}}>
                        <BranchMenusEdit simple menus={menus} availableCurrencies={availableMenus} onChange={this.onChangeMenu} />
                    </div>
                    <div className="words">
                        <div className="content--edit">
                            <div className="edit--block">
                                <label className="label--edit">Comments:</label>
                                <textarea value={comments} style={{height: 100}} className="input--edit" type="text" name="comments" placeholder="Any questions or comments?" onChange={(e) => this.onChange('comments', e)} ></textarea>
                            </div>
                        </div>
                    </div>
                    <button style={{marginRight: 'auto'}} className="notification button--action button--action-filled" onClick={this.handleStart}>Get my custom offer</button>
                </div>
                <div className="custom-plan-banner">
                    <div className="title">You custom offer:</div>
                    <div className="custom-plan-card">
                        <div className="desc">Fill in the form and in a few days your custom offer will wait for you here...</div>
                        <img src="assets/images/stars.png" />
                    </div>
                </div>
            </div>
        )
    }
};

export default CustomOrder;