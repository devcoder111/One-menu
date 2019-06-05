import { Ajax } from '../../shared/ajax.utils';
import { StorageManagerInstance } from '../../shared/storage.utils';
import { debug } from 'util';

export function getDigitalMenuPlans() {
    return Ajax().get('/plans/digital-menu', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}

export function getAllPlans() {
    return Ajax().get('/plans/all', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}

export function getAllProducts() {
    return Ajax().get('/products/all', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read('token')
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}

export function chargeDigitalMenuPlan(email, stripetoken, isTrial, amount) {

    let trial = 0;
    if (isTrial) {
        trial = 90;
    }
    return Ajax().post('/charge/digital-menu', {
        body: JSON.stringify({ email: email, stripetoken: stripetoken, trial: trial, amount: amount }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}
export function chargeMultilanguageplan(email, token, subscriptions, coupon, BillinCycle) {


    return Ajax().post('/charge/multi-language-menu', {
        body: JSON.stringify({ email: email, stripetoken: token, subscriptions: subscriptions, coupon: coupon, BillinCycle: BillinCycle }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}

export function ModifySubscription(email, token, subscriptions, coupon, mode, OriginalSubscription) {


    return Ajax().post('/subscriptions/modify', {
        body: JSON.stringify({ email: email, stripetoken: token, subscriptions: subscriptions, coupon: coupon, mode: mode, OriginalSubscription: OriginalSubscription }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}


export function AddLanguageToSubscription(email, token, CurrentStripeSubscription, LanguagesStripeSubscription, Languages, Amount) {


    return Ajax().post('/subscriptions/add-language', {
        body: JSON.stringify({ email: email, stripetoken: token, CurrentStripeSubscription: CurrentStripeSubscription, LanguagesStripeSubscription: LanguagesStripeSubscription, Languages: Languages, amount: Amount }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}


export function CancelSubscription(SubscriptionStripeID) {


    return Ajax().post('/subscriptions/cancel', {
        body: JSON.stringify({ id: SubscriptionStripeID, }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}
export function ReactivateSubscription(SubscriptionStripeID) {


    return Ajax().post('/subscriptions/reactivate', {
        body: JSON.stringify({ id: SubscriptionStripeID, }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}
export function RemoveLanguage(SubscriptionStripeID, languageid) {


    return Ajax().post('/subscriptions/remove-language', {
        body: JSON.stringify({ id: SubscriptionStripeID, languageid: languageid }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}



export function GetMySubscriptions(email) {


    return Ajax().post('/subscriptions/me', {
        body: JSON.stringify({ email: email }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}

export function ValidateCoupon(coupon) {


    return Ajax().post('/stripe/validatecoupon', {
        body: JSON.stringify({ coupon: coupon }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}

export function GetSubscription(id) {


    return Ajax().post('/subscriptions/getsubscription', {
        body: JSON.stringify({ id: id }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}
export function GetBilling(email) {


    return Ajax().post('/subscription/billing', {
        body: JSON.stringify({ email: email }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}

export function GetInvoice(invoice) {


    return Ajax().post('/subscription/invoice', {
        body: JSON.stringify({ invoice: invoice }),
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}



export function GetStripeParameters() {


    return Ajax().get('/stripe/parameters', {
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
        }
    }).then((res) => {
        if (!res || !res.success) {
            return Promise.reject(res);
        }

        let plan = res.obj;

        return plan;
    });
}

export async function GetMultiLanguageSubscriptionTypes() {
    let plans = await getAllPlans();
    let products = await getAllProducts();
    let parameters = await GetStripeParameters();
    //console.log(products)
    // console.log(plans)
    debug;
    let DegustationMonthly = plans.data.find(x => x.id == parameters.DEGUSTATION_PLAN_ID);
    let DegustationYearly = plans.data.find(x => x.id == parameters.DEGUSTATION_PLAN_ID_YEARLY);
    let DegustationExtraLanguage = plans.data.find(x => x.id == parameters.DEGUSTATION_ADD_LANGUAGE_PLAN_ID);
    let DegustationExtraLanguageYearly = plans.data.find(x => x.id == parameters.DEGUSTATION_ADD_LANGUAGE_PLAN_ID_YEARLY);
    let AlaCarte = plans.data.find(x => x.id == parameters.ALACARTE_PLAN_ID);
    let AlaCarteYearly = plans.data.find(x => x.id == parameters.ALACARTE_PLAN_ID_YEARLY);
    let AlaCarteExtraLanguage = plans.data.find(x => x.id == parameters.ALACARTE_ADD_LANGUAGE_PLAN_ID);
    let AlaCarteExtraLanguageYearly = plans.data.find(x => x.id == parameters.ALACARTE_ADD_LANGUAGE_PLAN_ID_YEARLY);
    let MenuDuJour = plans.data.find(x => x.id == parameters.MENUDUJOUR_PLAN_ID);
    let MenuDuJourYearly = plans.data.find(x => x.id == parameters.MENUDUJOUR_PLAN_ID_YEARLY);
    let MenuDuJourLanguage = plans.data.find(x => x.id == parameters.MENUDUJOUR_ADD_LANGUAGE_PLAN_ID);
    let MenuDuJourLanguageYearly = plans.data.find(x => x.id == parameters.MENUDUJOUR_ADD_LANGUAGE_PLAN_ID_YEARLY);
    /*console.log(plans);
    console.log(products);
    console.log('DegustationMonthly');*/
    let types = [{
            id: 1,
            stripeid: DegustationMonthly.id,
            stripeidyearly: DegustationYearly.id,
            title: 'Degustation',
            amount: DegustationMonthly.amount / 100,
            amount_yearly: DegustationYearly.amount / 100,
            currency: DegustationMonthly.currency,
            interval: DegustationMonthly.interval,
            extralanguage: {
                stripeid: DegustationExtraLanguage.id,
                stripeidyearly: DegustationExtraLanguageYearly.id,
                amount: DegustationExtraLanguage.amount / 100,
                amount_yearly: DegustationExtraLanguageYearly.amount / 100,
                currency: DegustationExtraLanguage.currency,
                interval: DegustationExtraLanguage.interval
            }
        },
        {
            id: 2,
            title: 'Menu du jour',
            stripeid: MenuDuJour.id,
            stripeidyearly: MenuDuJourYearly.id,
            amount: MenuDuJour.amount / 100,
            amount_yearly: MenuDuJourYearly.amount / 100,
            currency: MenuDuJour.currency,
            interval: MenuDuJour.interval,
            extralanguage: {
                stripeid: MenuDuJourLanguage.id,
                stripeidyearly: MenuDuJourLanguageYearly.id,
                amount: MenuDuJourLanguage.amount / 100,
                amount_yearly: MenuDuJourLanguageYearly.amount / 100,
                currency: MenuDuJourLanguage.currency,
                interval: MenuDuJourLanguage.interval
            }
        },
        {
            id: 3,
            title: 'A la carte',
            stripeid: AlaCarte.id,
            stripeidyearly: AlaCarteYearly.id,
            amount: AlaCarte.amount / 100,
            amount_yearly: AlaCarteYearly.amount / 100,
            currency: AlaCarte.currency,
            interval: AlaCarte.interval,
            extralanguage: {
                stripeid: AlaCarteExtraLanguage.id,
                stripeidyearly: AlaCarteExtraLanguageYearly.id,
                amount: AlaCarteExtraLanguage.amount / 100,
                amount_yearly: AlaCarteExtraLanguageYearly.amount / 100,
                currency: AlaCarteExtraLanguage.currency,
                interval: AlaCarteExtraLanguage.interval
            }
        },
    ];
    return (types);

};