import React, {Component} from 'react';

import Navbar from '../Navbar';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import * as SubscriptionActions from '../../actions/subscriptions';
import {GetBilling, GetInvoice} from '../Subscriptions/subscription.service';
import {getProfile} from '../Profile/profile.service';
import {makeData} from './Utils';
import {Grid, Image, Table} from 'semantic-ui-react';

class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      message: '',
      digitalMenuCost: 0,
      digitalMenuPlan: [],
      activeTab: [],
      data: makeData(),
    };
    this.Invoice = this.Invoice.bind(this);
    this.getInvoice = this.getInvoice.bind(this);
  }
  async componentWillMount() {
    let state = {...this.state};
    state.profile = await getProfile();
    state.Billing = await GetBilling(state.profile.Email);
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
        altDesc: profile.LogoAltDesc,
      },
      website: profile.Website,
      tel: profile.Tel,
      email: profile.Email,
      social: {
        twitter: profile.Twitter,
        facebook: profile.Facebook,
        instagram: profile.Instagram,
        youtube: profile.Youtube,
      },
    };

    return (
      <div style={{color: 'black'}}>
        
        <Grid columns={1} divided>
          <Grid.Row>
            <Grid.Column>
              {' '}
              <img
                src="assets/images/logo-one-menu-bluegrey.png"
                alt="Logo of One Menu"
                style={{height: '100px'}}
              />
              <span>INVOICE #:</span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              {this.GetClientInfo()}
            </Grid.Column>
            <Grid.Column>
              {this.GetInvoiceInfo()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table very basic>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Service ID</Table.HeaderCell>
              <Table.HeaderCell>Sevice Name</Table.HeaderCell>
              <Table.HeaderCell>Bill Period</Table.HeaderCell>
              <Table.HeaderCell>Billing Cycle</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Unit Price</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>John</Table.Cell>
              <Table.Cell>Approved</Table.Cell>
              <Table.Cell>None</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        {this.GetBottom()}
      </div>
    );
  }
  GetClientInfo() {
    return <Grid columns={2}>
      <Grid.Row>
        <Grid.Column>To:</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>Martin Cowles</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>Starts and moons inc</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>address</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>Illinois USA</Grid.Column>
      </Grid.Row>
    </Grid>;
  }

  GetBottom() {
    return <div style={{display:"flex",justifyContent:"flex-end"}}>Prepayment for new subscription (5 mo): $2,000</div>;
  }
  GetInvoiceInfo() {
    return <Grid columns={2}>
      <Grid.Row>
        <Grid.Column>Invoice Status:</Grid.Column>
        <Grid.Column>123</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>Issue Date</Grid.Column>
        <Grid.Column>123</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>Payment Method:</Grid.Column>
        <Grid.Column>123</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>Payment Date:</Grid.Column>
        <Grid.Column>123</Grid.Column>
      </Grid.Row>
    </Grid>;
  }

  getInvoice(e) {
    let currentValue = e.target.id;
  }
  Invoice(row) {
    return (
      <button
        onClick={this.getInvoice}
        id={row.value}
        style={{
          marginRight: 0,
        }}
        className="notification button--action button--action-outline"
      >
        Invoice
      </button>
    );
  }
  DataChargeId(row) {
    let split = row.value.split('-');
    let originalDate = new Date(+row.value.split('-')[1]);
    const months = [
      'Jan',
      'Fen',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let current_datetime = originalDate;
    let formatted_date =
      current_datetime.getDate() +
      ' ' +
      months[current_datetime.getMonth()] +
      ' ' +
      current_datetime.getFullYear();

    let newControl = (
      <div>
        <div>{formatted_date}</div>
        <div style={{fontSize: '9px'}}>{split[0]}</div>
      </div>
    );
    return newControl;
  }
  GetTotal(row) {
    return '$' + row.value / 100;
  }
  GetPaymentMethod(row) {
    return '****' + row.value;
  }
  GetLanguages(row) {
    let languages = row.value;
    if (row.value.length >= 1) {
      var csv = row.value.length + '(' + languages.join(',') + ')';
    }
    return csv;
  }
  GetStatusColors(row) {
    if (row.value == 'succeeded') {
      return {
        color: 'green',
        transition: 'all .3s ease',
      };
    } else if (row.value == 'pending') {
      return {
        color: 'yellow',
        transition: 'all .3s ease',
      };
    } else row.value == 'failed';
    {
      return {
        color: 'red',
        transition: 'all .3s ease',
      };
    }
  }
  GetStatusRowValue(row) {
    if (row.value == 'succeeded') {
      return 'Paid';
    } else if (row.value == 'pending') {
      return 'Pending';
    } else row.value == 'failed';
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
    current: state._subscriptions.current,
  };
};

export default Invoice;
