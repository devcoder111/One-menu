import React, { Component } from 'react';
import * as SubscriptionService from '../Subscriptions/subscription.service';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Navbar from '../Navbar';
import Aside from "../Aside";
import PageHeader from "../PageHeader";
import PlanCard from "./PlanCard";
import DigitalMenu from "./DigitalMenu";
import CustomOrder from "./CustomOrder";
import {withRouter} from "react-router-dom";
import * as SubscriptionActions from '../../actions/subscriptions';
import {bindActionCreators} from "redux";
import {sendCustomOrder} from "./plan.service";
import {Toast} from "../Toast";
import {getProfile} from "../Profile/profile.service"


const classNames = require('classnames');

class Plans extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSuccess: false,
            message: '',
            digitalMenuCost:0,
            digitalMenuPlan:[],
            activeTab:[]        
        };
        this.handleStart = this.handleStart.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCustomOrder = this.handleCustomOrder.bind(this);
        this.renderToast = this.renderToast.bind(this);
    }

    async componentDidMount() {
        // this.props.dispatch(actionCreators.getProfile(this.handlers.onProfileFetched));
        let state ={...this.state};       
        let  plans = await SubscriptionService.getAllPlans();
        let  products = await SubscriptionService.getAllProducts();
        let parameters = await SubscriptionService.GetStripeParameters();
        let profile = await getProfile();
        if(profile.SubscriptionStat)
        {
            if(profile.SubscriptionStat=='digital-menu')
            {
                state.digitalmenusubscription=true;
            }
        }
        //Select Digital Menu plan
        var digitalMenuPlan = plans.data.find(x => x.id == parameters.DIGITALMENU_PLAN_ID);

        var degustationPlan = plans.data.find(x => x.id == parameters.DEGUSTATION_PLAN_ID);
        var degustationPlanYearly = plans.data.find(x => x.id == parameters.DEGUSTATION_PLAN_ID_YEARLY);

        var degustationProduct =products.data.find(x => x.id == parameters.DEGUSTATION_PRODUCT_ID );

        var SignaturePlan = plans.data.find(x => x.id == parameters.MENUDUJOUR_PLAN_ID);
        var SignaturePlanYearly = plans.data.find(x => x.id == parameters.MENUDUJOUR_PLAN_ID_YEARLY);
        var SignatureProduct =products.data.find(x => x.id == parameters.MENUDUJOUR_PRODUCT_ID);

        var AlacartePlan = plans.data.find(x => x.id == parameters.ALACARTE_PLAN_ID);
        var AlacartePlanYearly = plans.data.find(x => x.id == parameters.ALACARTE_PLAN_ID_YEARLY);
        var AlaCarteProduct =products.data.find(x => x.id == parameters.ALACARTE_PRODUCT_ID);

        state.degustationPlan=degustationPlan;
        state.degustationPlanYearly=degustationPlanYearly
        state.degustationProduct=degustationProduct;
        state.SignaturePlan=SignaturePlan;
        state.SignaturePlanYearly=SignaturePlanYearly;
        state.SignatureProduct=SignatureProduct;
        state.AlacartePlan=AlacartePlan;
        state.AlacartePlanYearly=AlacartePlanYearly;
        state.AlaCarteProduct=AlaCarteProduct;
        state.SignatureProduct=SignatureProduct;
        state.digitalMenuPlan=digitalMenuPlan;
        //state.digitalMenuCost=amount;
        this.setState(state);
        //console.log(res);
    }

    handleStart(id) {
        const { history } = this.props;

        this.handleClick(id);
        history.push('/subscriptions/step-1?plan='+id)
    }

    handleClick(id) {
        let state = {...this.state};
        state.activeTab =id;
        this.props.selectPlan(id);
        this.setState(state);
    }

    handleCustomOrder(payload, cb) {
  
        sendCustomOrder(payload, (res) => {
            console.log('sent ', res)
            if(res) {
                this.setState({isSuccess: true, message: 'Email sent.'})
                cb(true)
            } else {
                this.setState({isSuccess: true, message: 'Email not sent. Please try one more time.'})
                cb(false)
            }
        });
    }

    renderToast() {
        return (
            <Toast onDismiss={() => this.setState({ isSuccess: false })}>
                <p>
                    {this.state.message}
                </p>
            </Toast>
        );
    }

    render () {
        //let { subscriptions, selected, current } = this.props;
        let newSubscriptions =[]
        if(this.state.degustationPlan)
        {
            let words =0;
            if(this.state.degustationProduct.metadata.words)
            {
                words=this.state.degustationProduct.metadata.words;
            }
            newSubscriptions.push({id:1,title:'Degustation',price:this.state.degustationPlan.amount,period:this.state.degustationPlan.interval,words:words});            
        }
        if(this.state.degustationPlan)
        {
            let words =0;
            if(this.state.SignatureProduct.metadata.words)
            {
                words=this.state.SignatureProduct.metadata.words;
            }
            newSubscriptions.push({id:2,title:'Menu du jour',price:this.state.SignaturePlan.amount,period:this.state.SignaturePlan.interval,words:words});            
        }
        if(this.state.AlacartePlan)
        {
            let words =0;
            if(this.state.AlaCarteProduct.metadata.words)
            {
                words=this.state.AlaCarteProduct.metadata.words;
            }
            newSubscriptions.push({id:3,title:'A la carte',price:this.state.AlacartePlan.amount,period:this.state.AlacartePlan.interval,words:words});            
        }
       
        const { isSuccess } = this.state;
        const action = this.props.match.params.action;

        const profile = (this.props.profile) ? this.props.profile : {};

        const branchRoot = (profile.branches && profile.branches.length > 0) ? profile.branches.find(branch => {
            return branch.HasHeadquarters == 1;
        }) : null;

        if (branchRoot) {
            branchRoot.mainContact = (branchRoot.contacts && branchRoot.contacts.length > 0) ? branchRoot.contacts.find(contact => {
                return contact.IsAdmin == 1;
            }) : null;
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

        const asideType = 'plan';

        const classes = classNames(
            'content--section',
            'section--dashboard',
            'section--type-plans'
        );

       
        return (
            <div>
                <Navbar logo={company.logo} />
                <div className="content">
                    <PageHeader company={company} />

                    <div className="main-content">
                        <Aside type={asideType} />

                        <main className="main">
                            <section className={classes}>
                                <h1 className="content--title">Plans</h1>
                                    <Tabs>
                                        <TabList>
                                            <Tab>Digital Menu</Tab>
                                            <Tab>Multilingual digital menu</Tab>
                                            <Tab>Custom Order</Tab>
                                        </TabList>

                                        <TabPanel>
                                            <DigitalMenu onClick={this.handleStart} currency={this.state.digitalMenuPlan.currency}  
                                                                                    price={this.state.digitalMenuPlan.amount} 
                                                                                    period={this.state.digitalMenuPlan.interval}
                                                                                    subscription={this.state.digitalmenusubscription}
                                                                                    />
                                        </TabPanel>
                                        <TabPanel>
                                            <div className="plan-wrapper">
                                                {newSubscriptions.map((item) => {
                                                    return <PlanCard
                                                        key={item.id}                                                      
                                                        price={item.price}
                                                        period={item.period}
                                                        words={item.words}
                                                        data={item}
                                                        activeid={this.state.activeTab}
                                                        onStart={() => this.handleStart(item.id)}
                                                        onClick={() => this.handleClick(item.id)}
                                                    />
                                                })}
                                            </div>
                                            <div className="notes">*5 months prepay in advance required on subscription</div>
                                        </TabPanel>
                                        <TabPanel>
                                            <CustomOrder onClick={this.handleCustomOrder} />
                                        </TabPanel>
                                    </Tabs>
                            </section>
                        </main>
                    </div>
                </div>
                {isSuccess && this.renderToast()}
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        profile: state._profile.profile,
        subscriptions: state._subscriptions.list,
        selected: state._subscriptions.selected,
        current: state._subscriptions.current
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        ...bindActionCreators(Object.assign({}, SubscriptionActions), dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Plans));
