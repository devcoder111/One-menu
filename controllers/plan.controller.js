'use strict';
const nodemailer = require('nodemailer');
const constants = require('../constants');
const Company = require('../models/company.model');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

class PlanController {

}

PlanController.postCustomOrder = (req, res) => {
    const data = req.body;
    res.setHeader('Content-Type', 'application/json');
    var transporter = nodemailer.createTransport({
        host: constants.SMTP_HOST,
        auth: {
            user: constants.SMTP_USER,
            pass: constants.SMTP_PASSWORD
        }
    });
    var menus = data.menus && data.menus.map(item => `${item.MenuID}: ${item.Title}` );
    var mailOptions = {
        from: 'no-reply@one-menu.com',
        to: constants.CUSTOM_ORDER_EMAIL,
        subject: 'Custom Order',
        text: `Words: ${data.words} \n` +
           `Comments: ${data.comments} \n` +
           `Menus: ${menus && menus.join(', ')} \n`
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            // console.log(error);
            res.status(400).json({
                success: false,
                message: error
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Reset link has been sent to your registered email.'
            });
        }
    });
};


module.exports = PlanController;