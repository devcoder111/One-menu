const Subscription = require('../models/subscription.model');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Company = require('../models/company.model');

let SubscriptionHelper = {
    async CancelSubscription(results, company, subscriptionId) {
        if (results.Title == "Digital Menu") {
            company[0].SubscriptionStat = null;
            await Company.update(results.CompanyID, company[0]);
        }
        if (results.SubscriptionAdditionalLanguageStripeID1) {
            await stripe.subscriptions.del(results.SubscriptionAdditionalLanguageStripeID1);
        }
        if (results.SubscriptionAdditionalLanguageStripeID2) {
            await stripe.subscriptions.del(results.SubscriptionAdditionalLanguageStripeID2);
        }
        if (results.SubscriptionAdditionalLanguageStripeID3) {
            await stripe.subscriptions.del(results.SubscriptionAdditionalLanguageStripeID3);
        }
        let subs = await stripe.subscriptions.del(subscriptionId);
        return subs;
    },
    async ReactivateSubscription(results, company, subscriptionId) {
        let currentSubscription = await Subscription.getById(results.SubscriptionID)
        if (results.Title == "Digital Menu") {
            company[0].SubscriptionStat = 'digital-menu';
            await Company.update(results.CompanyID, company[0]);
        }
        if (results.SubscriptionAdditionalLanguageStripeID1) {
            let currentSubs = await stripe.subscriptions.retrieve(results.SubscriptionAdditionalLanguageStripeID1, { expand: ['customer'] });

            let newSubs = await stripe.subscriptions.create({
                customer: company[0].CustomerID,
                items: [{
                    plan: currentSubs.plan.id,
                }, ],
            });
            currentSubscription.SubscriptionAdditionalLanguageStripeID1 = newSubs.id;
        }
        if (results.SubscriptionAdditionalLanguageStripeID2) {
            let currentSubs = await stripe.subscriptions.retrieve(results.SubscriptionAdditionalLanguageStripeID2, { expand: ['customer'] });
            let newSubs = await stripe.subscriptions.create({
                customer: company[0].CustomerID,
                items: [{
                    plan: currentSubs.plan.id,
                }, ],
            });
            currentSubscription.SubscriptionAdditionalLanguageStripeID2 = newSubs.id;


        }
        if (results.SubscriptionAdditionalLanguageStripeID3) {
            let currentSubs = await stripe.subscriptions.retrieve(results.SubscriptionAdditionalLanguageStripeID3, { expand: ['customer'] });
            let newSubs = await stripe.subscriptions.create({
                customer: company[0].CustomerID,
                items: [{
                    plan: currentSubs.plan.id,
                }, ],
            });
            currentSubscription.SubscriptionAdditionalLanguageStripeID3 = newSubs.id;

        }
        let currentSubs = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['customer'] });
        let subs = await stripe.subscriptions.create({
            customer: company[0].CustomerID,
            items: [{
                plan: currentSubs.plan.id,
            }, ],
        });
        currentSubscription.SubscriptionStripeID = subs.id;
        await Subscription.update(results.SubscriptionID, currentSubscription)
        return subs;
    }
}
module.exports = SubscriptionHelper;