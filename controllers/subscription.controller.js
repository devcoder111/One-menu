"use strict";

const Subscription = require('../models/subscription.model');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Company = require('../models/company.model');
const SubscriptionHelper = require('./subscription.helper')
const Menu = require('../models/menu.model');
const Languages = require('../models/language.model')


class SubscriptionController {

}

SubscriptionController.get = (req, res) => {
    //console.log(req.body);
    res.setHeader('Content-Type', 'application/json');

    Subscription.getAll().then(output => {
        // console.log(output);
        res.status(200).json({ success: true, message: 'Subscription successfully fetched', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Subscription get failed', obj: err });
    });
};

SubscriptionController.get = (req, res) => {
    //console.log(req.body);
    res.setHeader('Content-Type', 'application/json');

    Subscription.getAll().then(output => {
        // console.log(output);
        res.status(200).json({ success: true, message: 'Subscription successfully fetched', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Subscription get failed', obj: err });
    });
};

SubscriptionController.Cancel = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        let subscriptionId = req.body.id;
        let output = await Subscription.get({ SubscriptionStripeID: req.body.id });
        let results = output[0];
        let company = await Company.get({ CompanyID: results.CompanyID });
        let subs = await SubscriptionHelper.CancelSubscription(results, company, subscriptionId);
        res.status(200).json({ success: true, message: 'Subscription successfully cancelled', obj: subs });
    } catch (ex) {
        res.status(204).send({ success: false, message: 'Subscription get failed', obj: ex });
    }
    //console.log(req.body);



};

SubscriptionController.Reactivate = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        let subscriptionId = req.body.id;
        let output = await Subscription.get({ SubscriptionStripeID: req.body.id });
        let results = output[0];
        let company = await Company.get({ CompanyID: results.CompanyID });
        let subs = await SubscriptionHelper.ReactivateSubscription(results, company, subscriptionId);
        res.status(200).json({ success: true, message: 'Subscription successfully cancelled', obj: subs });
    } catch (ex) {
        res.status(204).send({ success: false, message: 'Subscription get failed', obj: ex });
    }
    //console.log(req.body);



};

SubscriptionController.getMySubscriptions = async(req, res) => {
    //console.log(req.body);
    res.setHeader('Content-Type', 'application/json');
    try {
        let output = await Subscription.get({ CompanyID: req.body.email });
        for (let i = 0; i < output.length; i++) {
            let currentSubs = output[i];
            let subs = await stripe.subscriptions.retrieve(currentSubs.SubscriptionStripeID, { expand: ['customer'] });
            if (subs.items.data[0] && subs.items.data[0].plan) {

                output[i].interval = subs.items.data[0].plan.interval;
                let invoices = await stripe.invoices.retrieve(subs.latest_invoice);
                let upcomingInvoice;
                if (subs.status != 'canceled') {
                    upcomingInvoice = await stripe.invoices.retrieveUpcoming({ subscription: subs.id });
                }
                output[i].upcomingInvoice = upcomingInvoice;
                output[i].LastInvoice = invoices;
            }
            output[i].status = subs.status;
        }

        res.status(200).json({ success: true, message: 'Subscription successfully fetched', obj: output });
    } catch (exception) {
        res.status(204).send({ success: false, message: 'Subscription get failed', obj: exception });
    }

};

SubscriptionController.post = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Subscription.create(req.body.obj).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Subscription successfully created', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Subscription creation failed', obj: err });
    });
};

SubscriptionController.put = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Subscription.update(req.body.id, req.body.updates).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Subscription successfully updated', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Subscription update failed', obj: err });
    });
};

SubscriptionController.remove = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Subscription.remove(req.body.id).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Subscription successfully removed', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Subscription remove failed', obj: err });
    });
};
SubscriptionController.removeLanguage = async(req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        let LanguageId = req.body.languageid;
        let output = await Subscription.get({ SubscriptionStripeID: req.body.id });
        output = output[0];
        let stripeSubscription = '';
        if (output.Language3 == LanguageId) {
            output.Language3 = null;
            stripeSubscription = output.SubscriptionAdditionalLanguageStripeID1;
            output.SubscriptionAdditionalLanguageStripeID1 = null;
            output.SubscriptionAdditionalLanguageAmount1 = 0;
            await Subscription.update(output.SubscriptionID, output);
            let subs = await stripe.subscriptions.del(stripeSubscription);
        }
        if (output.Language4 == LanguageId) {
            output.Language4 = null;
            stripeSubscription = output.SubscriptionAdditionalLanguageStripeID2;
            output.SubscriptionAdditionalLanguageStripeID2 = null;
            output.SubscriptionAdditionalLanguageAmount2 = 0;
            await Subscription.update(output.SubscriptionID, output);
            let subs = await stripe.subscriptions.del(stripeSubscription);
        }
        if (output.Language5 == LanguageId) {
            output.Language5 = null;
            stripeSubscription = output.SubscriptionAdditionalLanguageStripeID3;
            output.SubscriptionAdditionalLanguageStripeID3 = null;
            output.SubscriptionAdditionalLanguageAmount3 = 0;
            await Subscription.update(output.SubscriptionID, output);
            let subs = await stripe.subscriptions.del(stripeSubscription);
        }
        res.status(201).json({ success: true, message: 'Subscription successfully removed', obj: {} });
    } catch (ex) {
        res.status(204).send({ success: false, message: 'Subscription language remove failed', obj: ex });
    }
};
SubscriptionController.addLanguage = async(req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        let Languages = req.body.Languages;
        let Token = req.body.stripetoken.id;
        let LanguageStripePlan = req.body.LanguagesStripeSubscription;
        let StripeSubscription = req.body.CurrentStripeSubscription;
        let output = await Subscription.get({ SubscriptionStripeID: StripeSubscription });
        var company = await Company.getByEmail(req.body.email);
        let amount = req.body.amount / Languages.length;
        //Make a charge of the total amount (5x price of the add language plan)
        let source = await stripe.customers.createSource(company.CustomerID, {
            source: Token
        });
        await stripe.charges.create({
            customer: source.customer,
            amount: amount,
            currency: 'usd',
            description: 'one-menu',
            source: source.id,
        });
        //Add Subscriptions to stripe and database
        let trial_period_days = 5 * 30;
        output = output[0];
        for (let i = 0; i < Languages.length; i++) {
            let currentLanguage = Languages[i];
            if (!output.Language3) {
                let subscription = await stripe.subscriptions.create({
                    customer: company.CustomerID,
                    items: [{
                        plan: LanguageStripePlan,
                    }, ],
                    trial_period_days
                });
                output.Language3 = currentLanguage;
                output.SubscriptionAdditionalLanguageStripeID1 = subscription.id
                output.SubscriptionAdditionalLanguageAmount1 = amount;
                await Subscription.update(output.SubscriptionID, output);
                continue;
            }
            if (!output.Language4) {
                let subscription = await stripe.subscriptions.create({
                    customer: company.CustomerID,
                    items: [{
                        plan: LanguageStripePlan,
                    }, ],
                    trial_period_days
                });
                output.Language4 = currentLanguage;
                output.SubscriptionAdditionalLanguageStripeID2 = subscription.id
                output.SubscriptionAdditionalLanguageAmount2 = amount;
                await Subscription.update(output.SubscriptionID, output);
                continue;
            }
            if (!output.Language5) {
                let subscription = await stripe.subscriptions.create({
                    customer: company.CustomerID,
                    items: [{
                        plan: LanguageStripePlan,
                    }, ],
                    trial_period_days
                });
                output.Language5 = currentLanguage;
                output.SubscriptionAdditionalLanguageStripeID3 = subscription.id
                output.SubscriptionAdditionalLanguageAmount3 = amount;
                await Subscription.update(output.SubscriptionID, output);
                continue;
            }
        }





        res.status(201).json({ success: true, message: 'Subscription languages successfully added', obj: {} });
    } catch (ex) {
        res.status(204).send({ success: false, message: 'Subscription languages add failed', obj: ex });
    }
};

SubscriptionController.GetBilling = async(req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        var company = await Company.getByEmail(req.body.email);
        let charges = await stripe.charges.list({ limit: 1000, customer: company.CustomerID });
        let subscriptions = await Subscription.get({ CompanyID: company.CompanyID });
        let billing = [];
        let LanguageList = await Languages.getAll();

        for (let i = 0; i < charges.data.length; i++) {
            let currentCharge = charges.data[i];
            let ChargeId = charges.data[i].id;
            let ChargeDate = new Date(charges.data[i].created * 1000);
            let Metadata = charges.data[i].metadata;
            let PaymentMethod = charges.data[i].payment_method_details.card.last4
            let Status = charges.data[i].status;
            let Amount = charges.data[i].amount
            let CurrentMenu = '';
            let Languages = [];
            let Plan = '';

            //Menu

            //Subscription
            let SubscriptionMainPlan = subscriptions.filter(x => x.SubscriptionStripeID == Metadata.subscription)
            if (SubscriptionMainPlan.length >= 1) {
                if (SubscriptionMainPlan[0].Title != "Digital Menu") {
                    let MenuMainPlan = await Menu.get({ MenuID: SubscriptionMainPlan[0].MenuID })
                    CurrentMenu = MenuMainPlan[0].Title;
                    let Language1 = SubscriptionMainPlan[0].Language1;
                    let Language2 = SubscriptionMainPlan[0].Language2;
                    let Language1Label = LanguageList.filter(x => x.LanguageID == Language1)[0].Code
                    let Language2Label = LanguageList.filter(x => x.LanguageID == Language2)[0].Code
                    Languages.push(Language1Label);
                    Languages.push(Language2Label);
                    Plan = SubscriptionMainPlan[0].Title;
                } else {
                    CurrentMenu = "Digital Menu";
                }

            }

            let SubscriptionLanguage1 = subscriptions.filter(x => x.SubscriptionAdditionalLanguageStripeID1 == Metadata.subscription)
            if (SubscriptionLanguage1.length >= 1) {
                let MenuMainLanguage1 = await Menu.get({ MenuID: SubscriptionLanguage1[0].MenuID })
                let Language3 = SubscriptionLanguage1[0].Language3;
                let Language3Label = LanguageList.filter(x => x.LanguageID == Language3)[0].Code
                CurrentMenu = MenuMainLanguage1[0].Title;
                Languages.push(Language3Label);
                Plan = SubscriptionLanguage1[0].Title;

            }
            let SubscriptionLanguage2 = subscriptions.filter(x => x.SubscriptionAdditionalLanguageStripeID2 == Metadata.subscription)
            if (SubscriptionLanguage2.length >= 1) {
                let MenuMainLanguage2 = await Menu.get({ MenuID: SubscriptionLanguage2[0].MenuID });
                let Language4 = SubscriptionLanguage2[0].Language4;
                let Language4Label = LanguageList.filter(x => x.LanguageID == Language4)[0].Code
                CurrentMenu = MenuMainLanguage2[0].Title;
                Languages.push(Language4Label);
                Plan = SubscriptionLanguage2[0].Title;
            }


            let SubscriptionLanguage3 = subscriptions.filter(x => x.SubscriptionAdditionalLanguageStripeID3 == Metadata.subscription)
            if (SubscriptionLanguage3.length >= 1) {
                let MenuMainLanguage3 = await Menu.get({ MenuID: SubscriptionLanguage3[0].MenuID })
                let Language5 = SubscriptionLanguage3[0].Language5;
                let Language5Label = LanguageList.filter(x => x.LanguageID == Language5)[0].Code
                CurrentMenu = MenuMainLanguage3[0].Title;
                Languages.push(Language5Label);
                Plan = SubscriptionLanguage3[0].Title;
            }
            billing.push({
                ChargeId: ChargeId + '-' + ChargeDate.getTime(),
                ChargeDate: ChargeDate,
                PaymentMethod: PaymentMethod,
                Status: Status,
                Amount: Amount,
                Menu: CurrentMenu,
                Languages: Languages,
                Plan: Plan
            })

        }




        res.status(201).json({ success: true, message: 'Subscription languages successfully added', obj: billing });
    } catch (ex) {
        res.status(204).send({ success: false, message: 'Subscription languages add failed', obj: ex });
    }
};

SubscriptionController.GetInvoice = async(req, res) => {
    try {


        res.status(201).json({ success: true, message: 'Subscription languages successfully added', obj: [] })
    } catch (ex) {
        console.log(ex);
        res.status(204).send({ success: false, message: 'Subscription languages add failed', obj: ex });
    }
}
module.exports = SubscriptionController;