import React, { Component, PropTypes } from "react";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Navbar from "../Navbar";
import Aside from "../Aside";
import PageHeader from "../PageHeader";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as SubscriptionActions from "../../actions/subscriptions";
import {GetBilling,GetInvoice}  from "../Subscriptions/subscription.service";
import { getProfile } from "../Profile/profile.service";
import ReactTable from "react-table";
import { makeData, Tips } from "./Utils";

const classNames = require("classnames");

class Billing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      message: "",
      digitalMenuCost: 0,
      digitalMenuPlan: [],
      activeTab: [],
      data: makeData()
    };
    this.Invoice= this.Invoice.bind(this);
    this.getInvoice=this.getInvoice.bind(this)
  }
  async componentWillMount() {
    let state = { ...this.state };
    state.profile = await getProfile();
    state.Billing = await GetBilling(  state.profile.Email);
    this.setState(state);
  }
  render() {
    let profile = this.state.profile;
    if (!profile) {
      return <div />;
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
      }
    };
    const asideType = "plan";

    const classes = classNames(
      "content--section",
      "section--dashboard",
      "section--type-plans"
    );
    const { data } = this.state;
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
                <div>
                  <ReactTable
                    data={this.state.Billing}
                    columns={[
                      
                        {
                          Header: "Date/ChargeID",
                          accessor: "ChargeId", 
                          Cell: row => (
                            <span>
                              {
                                this.DataChargeId(row)
                              }
                            </span>
                          )
                        },
                        {
                          Header: "Plan",
                          accessor: "Plan"
                        },
                        {
                          Header: "Menu",
                          accessor: "Menu"
                        },
                        {
                          Header: "Payment Method",
                          accessor: "PaymentMethod",
                          Cell: row => (
                            <span>
                              {
                                this.GetPaymentMethod(row)
                              }
                            </span>
                          )
                        },
                        {
                          Header: "Status",
                          accessor: "Status",
                          Cell: row => (
                            <span>
                              <span style={this.GetStatusColors(row)}>
                                &#x25cf;
                              </span> {
                                this.GetStatusRowValue(row)
                              }
                            </span>
                          )
                        },
                        {
                          Header: "Languages",
                          accessor: "Languages",
                          Cell: row => (
                            <span>
                              {
                                this.GetLanguages(row)
                              }
                            </span>
                          )
                        },
                        {
                          Header: "Total",
                          accessor: "Amount",
                          Cell: row => (
                            <span>
                              {
                                this.GetTotal(row)
                              }
                            </span>
                          )
                          
                        },
                        {
                          Header: "",
                          accessor: "ChargeId",
                          Cell: row => (
                            <span>
                              {
                                this.Invoice(row)
                              }
                            </span>
                        )
                        },
                      
                      
                      
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                  />
                  <br />
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }
  getInvoice(e)
  {   
    let currentValue = e.target.id;
    //window.location.replace('/#/invoice?'+currentValue);
    var win = window.open('/#/invoice?'+currentValue, '_blank');
  }
  Invoice(row){
  return(
    <button onClick={this.getInvoice} id={row.value} style={{
      marginRight: 0,
    }} className="notification button--action button--action-outline" >
      Invoice
    </button>
);
  }
  DataChargeId(row) {
    let split = row.value.split('-');
    let originalDate = new Date(+row.value.split('-')[1]);
    const months = ["Jan", "Fen", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let current_datetime = originalDate;
    let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()

    let newControl = (
      <div>
        <div>{formatted_date}</div>
        <div style={{fontSize:"9px"}}>{split[0]}</div>

      </div>
    );
    return (newControl);
  }
  GetTotal(row) {
    return '$'+(row.value/100);
  }
  GetPaymentMethod(row) {
    return '****'+(row.value);
  }
  GetLanguages(row){
    let languages = row.value;
    if(row.value.length>=1)
    {
      var csv = row.value.length+"("+languages.join(",")+")";
    }
    return csv;
  }
GetStatusColors(row)
{
  if(row.value=='succeeded')
    {
      return {
        color: 'green',
        transition: 'all .3s ease'
      }
    }
    else if(row.value=='pending')
    {
      return {
        color: 'yellow',
        transition: 'all .3s ease'
      }
    }
    else(row.value=='failed')
    {
      return {
        color: 'red',
        transition: 'all .3s ease'
      }
    }
 
}
  GetStatusRowValue(row) {
    if(row.value=='succeeded')
    {
      return 'Paid';
    }
    else if(row.value=='pending')
    {
      return 'Pending';
    }
    else(row.value=='failed')
    {
      return 'Failed';
    }
   
  }
}

const mapStateToProps = state => {
  return {
    profile: state._profile.profile,
    subscriptions: state._subscriptions.list,
    selected: state._subscriptions.selected,
    current: state._subscriptions.current
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators(Object.assign({}, SubscriptionActions), dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Billing));
