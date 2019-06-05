'use strict';

const constants = require('../constants');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Company = require('../models/company.model');
const dateUtils = require('../shared/date-utils');
const Subscription = require('../models/subscription.model');
const SubscriptionHelper = require('./subscription.helper')
class StripeController {

}

function GetTrialPeriod(data) {
    let trial_period_days;
    if (data.trial) {
        trial_period_days = data.trial;
    } else {
        trial_period_days = 90;
    }
    return trial_period_days;
}


StripeController.chargeDigitalMenuPlan = async(req, res) => {
    try {

        res.setHeader('Content-Type', 'application/json');

        const data = JSON.parse(JSON.stringify(req.body));

        const email = data.email;
        const token = data.stripetoken;
        const amount = data.amount;

        let trial_period_days = GetTrialPeriod(data);

        await GetOrCreateCustomer(email, token);

        let company = await Company.getByEmail(email);
        let source = await stripe.customers.createSource(company.CustomerID, { source: token.id });

        let subscription = await stripe.subscriptions.create({
            customer: company.CustomerID,
            items: [{
                plan: process.env.DIGITALMENU_PLAN_ID,
            }, ],
            trial_period_days
        });

        company.SubscriptionStat = 'digital-menu';
        company.SubscriptionDate = dateUtils.toMysqlDate(new Date());

        await Company.update(company.CompanyID, company);

        let subscriptionResult = await AddDigitalMenuSubscription(amount, company, subscription);

        res.status(200).json({ success: true, message: 'digital menu plan subscription added', obj: subscriptionResult });

    } catch (exception) {
        res.status(204).send({ success: false, message: 'digital subscription add failed', obj: exception });
    }
};

async function AddDigitalMenuSubscription(amount, company, subscription) {
    let newSubscription = {};
    newSubscription.Title = "Digital Menu";
    newSubscription.Description = "";
    newSubscription.Price = amount / 100;
    newSubscription.Date = dateUtils.toMysqlDate(new Date());
    newSubscription.DateUpdated = dateUtils.toMysqlDate(new Date());
    newSubscription.CompanyID = company.CompanyID;
    newSubscription.SubscriptionStripeID = subscription.id;
    let res = await Subscription.create(newSubscription);
    return res;
}

StripeController.chargeMultilanguageMenu = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        let trial_period_days = 30 * 5;
        const email = data.email;
        const token = data.stripetoken.id
        const subscriptions = data.subscriptions;
        const charges = [];
        const coupon = data.coupon;
        let results = [];

        await GetOrCreateCustomer(email, token);

        var company = await Company.getByEmail(email);
        let source = await stripe.customers.createSource(company.CustomerID, {
            source: token
        });

        await CreateMultiLanguageSubscription(subscriptions, company, trial_period_days, source, coupon, charges, results);
        res.status(200).json({
            success: true,
            message: 'Subscription and Charges sucesful',
            obj: results
        });
    } catch (exception) {
        res.status(204).send({
            success: false,
            message: 'digital menu plan get failed',
            obj: exception
        });
    }
};


StripeController.modifySubscription = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        let trial_period_days = 30 * 5;
        const OriginalSubscription = data.OriginalSubscription;
        const email = data.email;
        const token = data.stripetoken.id
        const subscriptions = data.subscriptions;
        const coupon = data.coupon;


        await GetOrCreateCustomer(email, token);

        var company = await Company.getByEmail(email);
        let source = await stripe.customers.createSource(company.CustomerID, {
            source: token
        });

        let output = await Subscription.get({ SubscriptionStripeID: OriginalSubscription });
        let results = output[0];

        //Reimburse unused months
        //Get Charges
        let charges = await stripe.charges.list({ limit: 1000, customer: company.CustomerID });
        await RefundSubscriptions(company, results, charges);

        //Cancel Current Subscription

        await SubscriptionHelper.CancelSubscription(results, company, OriginalSubscription);
        let newCharges = [];
        //Create New Subscription
        let newResults = [];
        let MenuID = charges.data.filter(x => x.metadata.subscription == results.SubscriptionStripeID)[0].metadata.MenuID;
        subscriptions[0].MenuId = MenuID;

        await CreateMultiLanguageSubscription(subscriptions, company, trial_period_days, source, coupon, newCharges, newResults);

        res.status(200).json({
            success: true,
            message: 'Subscription and Charges modified sucesful',
            obj: results
        });
    } catch (exception) {
        res.status(204).send({
            success: false,
            message: 'modify of Subscription and Charges  failed',
            obj: exception
        });
    }
};


async function RefundSubscriptions(company, results, charges) {

    let currenSubscriptionCharges = charges.data.filter(x => x.metadata.subscription == results.SubscriptionStripeID);
    let AdditionalLanguage1Charges = charges.data.filter(x => x.metadata.subscription == results.SubscriptionAdditionalLanguageStripeID1);
    let AdditionalLanguage2Charges = charges.data.filter(x => x.metadata.subscription == results.SubscriptionAdditionalLanguageStripeID2);
    let AdditionalLanguage3Charges = charges.data.filter(x => x.metadata.subscription == results.SubscriptionAdditionalLanguageStripeID3);
    //Get current data or differnce of days
    let OriginalSubscriptionDate = results.Date;
    let CurrentData = new Date();
    const diffTime = Math.abs(CurrentData.getTime() - OriginalSubscriptionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //If the trial time has passed, then we reimbourse a pro rata of the one time charge.
    if (diffDays < 30.0 * 5.0) {
        let proRata = 30 * 5 - diffDays;
        let MainReimbourseAmount = Math.round(((currenSubscriptionCharges[0].amount / 100) * ((proRata * 100) / 150)));
        await stripe.refunds.create({
            charge: currenSubscriptionCharges[0].id,
            amount: MainReimbourseAmount
        });
        if (results.SubscriptionAdditionalLanguageStripeID1) {
            let LanguageChargesReimbourse1 = Math.round(((AdditionalLanguage1Charges[0].amount / 100) * ((proRata * 100) / 150)));
            await stripe.refunds.create({
                charge: AdditionalLanguage1Charges[0].id,
                amount: LanguageChargesReimbourse1
            });
        }
        if (results.SubscriptionAdditionalLanguageStripeID2) {
            let LanguageChargesReimbourse2 = Math.round(((AdditionalLanguage2Charges[0].amount / 100) * ((proRata * 100) / 150)));
            await stripe.refunds.create({
                charge: AdditionalLanguage2Charges[0].id,
                amount: LanguageChargesReimbourse2
            });
        }
        if (results.SubscriptionAdditionalLanguageStripeID3) {
            let LanguageChargesReimbourse3 = Math.round(((AdditionalLanguage3Charges[0].amount / 100) * ((proRata * 100) / 150)));
            await stripe.refunds.create({
                charge: AdditionalLanguage3Charges[0].id,
                amount: LanguageChargesReimbourse3
            });
        }
    }
}

async function CreateMultiLanguageSubscription(subscriptions, company, trial_period_days, source, coupon, charges, results, planType) {
    for (let i = 0; i < subscriptions.length; i++) {
        let currentSubscription = subscriptions[i];
        if (planType == "yearly") {
            console.log('test');
        }
        //Create subscription for main plan with trial 5 months
        const { subscription, AmountSubscription } = await SubscribeMainPlan(company, currentSubscription, trial_period_days, source, coupon, planType);
        let additionalLanguageSubscriptions = [];
        //Create subscription for additional languages if any
        if (currentSubscription.additionallanguagesubscription && currentSubscription.price_additionalanguages) {
            for (let i = 0; i < currentSubscription.additionalLanguages; i++) {
                let additionalLanguageSubscription = await SubscribeAdditionalLanguage(company, currentSubscription, trial_period_days, source, charges, AmountSubscription, coupon, planType);
                additionalLanguageSubscriptions.push(additionalLanguageSubscription);
            }
        }
        let newSubscription = GetSubscriptionObject(currentSubscription, company, AmountSubscription, subscription, additionalLanguageSubscriptions);
        let result = await Subscription.create(newSubscription);
        results.push(result);
    }
}

function GetSubscriptionObject(currentSubscription, company, AmountSubscription, subscription, additionalLanguageSubscriptions) {
    let newSubscription = {};
    newSubscription.OriginalLanguageLabel = currentSubscription.originaLanguageLabel;
    newSubscription.CompanyID = company.CompanyID;
    newSubscription.Title = currentSubscription.type;
    newSubscription.Description = currentSubscription.Menu;
    newSubscription.Price = AmountSubscription;
    newSubscription.Date = dateUtils.toMysqlDate(new Date());
    newSubscription.DateUpdated = dateUtils.toMysqlDate(new Date());
    newSubscription.MenuID = currentSubscription.MenuId;
    newSubscription.CompanyID = company.CompanyID;
    newSubscription.SubscriptionStripeID = subscription.id;
    if (currentSubscription.languages) {
        if (currentSubscription.languages[0]) {
            newSubscription.Language1 = currentSubscription.languages[0];
        }
        if (currentSubscription.languages[1]) {
            newSubscription.Language2 = currentSubscription.languages[1];
        }
        if (currentSubscription.languages[2]) {
            let currentStripeId = additionalLanguageSubscriptions[0];
            newSubscription.SubscriptionAdditionalLanguageStripeID1 = currentStripeId.id;
            newSubscription.Language3 = currentSubscription.languages[2];
            newSubscription.SubscriptionAdditionalLanguageAmount1 = currentSubscription.price_additionalanguages;
        }
        if (currentSubscription.languages[3]) {
            let currentStripeId = additionalLanguageSubscriptions[1];
            newSubscription.SubscriptionAdditionalLanguageStripeID2 = currentStripeId.id;
            newSubscription.Language4 = currentSubscription.languages[3]
            newSubscription.SubscriptionAdditionalLanguageAmount2 = currentSubscription.price_additionalanguages;
        }
        if (currentSubscription.languages[4]) {
            let currentStripeId = additionalLanguageSubscriptions[2];
            newSubscription.SubscriptionAdditionalLanguageStripeID3 = currentStripeId.id;
            newSubscription.Language5 = currentSubscription.languages[4];
            newSubscription.SubscriptionAdditionalLanguageAmount3 = currentSubscription.price_additionalanguages;
        }
    }
    return newSubscription;
}

async function SubscribeAdditionalLanguage(company, currentSubscription, trial_period_days, source, charges, AmountSubscription, coupon) {
    let subscription = await stripe.subscriptions.create({
        customer: company.CustomerID,
        items: [{
            plan: currentSubscription.additionallanguagesubscription,
        }, ],
        trial_period_days
    });
    let AmountAdditionalLanguages = 0;
    if (currentSubscription.cycle == 'yearly') {
        AmountAdditionalLanguages = currentSubscription.price_additionalanguages;
    } else {
        AmountAdditionalLanguages = 5 * currentSubscription.price_additionalanguages;
    }

    let CouponFromStripe = '';
    if (coupon) {
        CouponFromStripe = await stripe.coupons.retrieve(coupon);
    }
    if (CouponFromStripe && CouponFromStripe.valid) {
        AmountAdditionalLanguages = AmountAdditionalLanguages - AmountAdditionalLanguages * (CouponFromStripe.percent_off / 100);
    }
    if (CouponFromStripe && !CouponFromStripe.valid)
        throw Exception('coupon invalid:' + coupon);

    //Create one time charge
    await stripe.charges.create({
        customer: source.customer,
        amount: AmountAdditionalLanguages * 100,
        currency: 'usd',
        description: 'one-menu',
        source: source.id,
        metadata: { plan: currentSubscription.additionallanguagesubscription, subscription: subscription.id, MenuID: currentSubscription.MenuId },
    });
    charges.push({ type: 'subscription', 'amount': AmountSubscription });
    charges.push({ type: 'additional-languages', 'amount': AmountAdditionalLanguages });
    return subscription;
}

StripeController.getDigitalMenuPlan = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    stripe.plans.retrieve('digital-menu', function(err, plan) {
        if (err) {
            res.status(204).send({ success: false, message: 'digital menu plan get failed', obj: err });
        } else {
            res.status(200).json({ success: true, message: 'digital menu plan successfully fetched', obj: plan });
        }
    });
}

StripeController.getAllPlans = async(req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        let plansList = [];
        console.log('test')
        plansList = await stripe.plans.list({ limit: 100 });

        res.status(200).json({ success: true, message: 'plans successfully fetched', obj: plansList });
    } catch (exception) {
        res.status(204).send({ success: false, message: 'digital menu plan get failed', obj: exception });
    }

}

StripeController.getAllProducts = async(req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        let plansList = [];

        plansList = await stripe.products.list({ limit: 100 });
        console.log(stripe)
        console.log(plansList)

        res.status(200).json({ success: true, message: 'plans successfully fetched', obj: plansList });
    } catch (exception) {
        res.status(204).send({ success: false, message: 'digital menu plan get failed', obj: exception });
    }

}

StripeController.GetSubscriptions = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const email = data.email;
        let existingCustomers = await stripe.customers.list({ email: email });
        res.status(200).json({ success: true, message: 'plans successfully fetched', obj: existingCustomers });
    } catch (exception) {
        res.status(204).send({ success: false, message: 'get subscriptions failed', obj: exception });
    }

}


StripeController.GetSubscription = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const id = data.id;
        let existingCustomers = await stripe.subscriptions.retrieve(id);
        res.status(200).json({ success: true, message: 'subscriptions successfully fetched', obj: existingCustomers });
    } catch (exception) {
        res.status(204).send({ success: false, message: 'subscriptions subscriptions failed', obj: exception });
    }

}

StripeController.ValidateCoupon = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const data = JSON.parse(JSON.stringify(req.body));
        const coupon = data.coupon;
        let CouponFromStripe = await stripe.coupons.retrieve(coupon);
        res.status(200).json({ success: true, message: 'subscriptions successfully fetched', obj: { valid: CouponFromStripe.valid, coupon: CouponFromStripe } });
    } catch (exception) {
        res.status(204).send({ success: false, message: 'subscriptions subscriptions failed', obj: { exception: exception, valid: false } });
    }

}


StripeController.GetParameters = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        var stripeParameters = {};

        stripeParameters.DIGITALMENU_PRODUCT_ID = process.env.DIGITALMENU_PRODUCT_ID;
        stripeParameters.DIGITALMENU_PLAN_ID = process.env.DIGITALMENU_PLAN_ID

        stripeParameters.DEGUSTATION_PRODUCT_ID = process.env.DEGUSTATION_PRODUCT_ID;
        stripeParameters.DEGUSTATION_PLAN_ID = process.env.DEGUSTATION_PLAN_ID;
        stripeParameters.DEGUSTATION_ADD_LANGUAGE_PRODUCT_ID = process.env.DEGUSTATION_ADD_LANGUAGE_PRODUCT_ID;
        stripeParameters.DEGUSTATION_ADD_LANGUAGE_PLAN_ID = process.env.DEGUSTATION_ADD_LANGUAGE_PLAN_ID;
        stripeParameters.DEGUSTATION_ADD_LANGUAGE_PLAN_ID_YEARLY = process.env.DEGUSTATION_ADD_LANGUAGE_PLAN_ID_YEARLY;
        stripeParameters.DEGUSTATION_PLAN_ID_YEARLY = process.env.DEGUSTATION_PLAN_ID_YEARLY;

        stripeParameters.MENUDUJOUR_PRODUCT_ID = process.env.MENUDUJOUR_PRODUCT_ID;
        stripeParameters.MENUDUJOUR_PLAN_ID = process.env.MENUDUJOUR_PLAN_ID;
        stripeParameters.MENUDUJOUR_ADD_LANGUAGE_PRODUCT_ID = process.env.MENUDUJOUR_ADD_LANGUAGE_PRODUCT_ID
        stripeParameters.MENUDUJOUR_ADD_LANGUAGE_PLAN_ID = process.env.MENUDUJOUR_ADD_LANGUAGE_PLAN_ID
        stripeParameters.MENUDUJOUR_ADD_LANGUAGE_PLAN_ID_YEARLY = process.env.MENUDUJOUR_ADD_LANGUAGE_PLAN_ID_YEARLY
        stripeParameters.MENUDUJOUR_PLAN_ID_YEARLY = process.env.MENUDUJOUR_PLAN_ID_YEARLY

        stripeParameters.ALACARTE_PRODUCT_ID = process.env.ALACARTE_PRODUCT_ID
        stripeParameters.ALACARTE_PLAN_ID = process.env.ALACARTE_PLAN_ID
        stripeParameters.ALACARTE_ADD_LANGUAGE_PRODUCT_ID = process.env.ALACARTE_ADD_LANGUAGE_PRODUCT_ID
        stripeParameters.ALACARTE_ADD_LANGUAGE_PLAN_ID = process.env.ALACARTE_ADD_LANGUAGE_PLAN_ID
        stripeParameters.ALACARTE_ADD_LANGUAGE_PLAN_ID_YEARLY = process.env.ALACARTE_ADD_LANGUAGE_PLAN_ID_YEARLY
        stripeParameters.ALACARTE_PLAN_ID_YEARLY = process.env.ALACARTE_PLAN_ID_YEARLY

        stripeParameters.STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY

        res.status(200).json({ success: true, message: 'Parameters fetched', obj: stripeParameters });
    } catch (exception) {
        res.status(204).send({ success: false, message: 'get subscriptions failed', obj: exception });
    }

}





module.exports = StripeController

async function SubscribeMainPlan(company, currentSubscription, trial_period_days, source, coupon) {
    let subscription = await stripe.subscriptions.create({
        customer: company.CustomerID,
        items: [{
            plan: currentSubscription.suscription,
        }, ],
        trial_period_days
    });
    let AmountSubscription = 0;
    if (currentSubscription.cycle == 'yearly') {
        AmountSubscription = currentSubscription.price;
        /*if(currentSubscription.additionalLanguages && currentSubscription.additionalLanguages>=1)
        AmountSubscription+=currentSubscription.price_additionalanguages*currentSubscription.additionalLanguages;*/
    } else {
        AmountSubscription = 5 * currentSubscription.price;
    }

    if (coupon) {
        let CouponFromStripe = await stripe.coupons.retrieve(coupon);
        if (CouponFromStripe.valid) {
            AmountSubscription = AmountSubscription - AmountSubscription * (CouponFromStripe.percent_off / 100);
        } else {
            throw exception('coupon invalid:' + coupon);
        }
    }
    //Create one time charge and apply coupon if needed
    await stripe.charges.create({
        customer: source.customer,
        amount: AmountSubscription * 100,
        currency: 'usd',
        description: 'one-menu',
        source: source.id,
        metadata: { plan: currentSubscription.suscription, subscription: subscription.id, MenuID: currentSubscription.MenuId },
    });
    return { subscription, AmountSubscription };
}



async function GetOrCreateCustomer(email, token) {
    let customerIDExists = await Company.customerIDExists(email);
    if (!customerIDExists) {
        let customer = await stripe.customers.create({
            description: 'Customer for ' + email,
            email: email
        });
        await Company.getByEmail(email).then(company => {
            company.CustomerID = customer.id;
            Company.update(company.CompanyID, company);
        });
    }
}