"use strict";

const Profile = require('../models/profile.model');
const Company = require('../models/company.model');

class ProfileController {

}

ProfileController.get = (req, res) => {
    //console.log(req.body);
    res.setHeader('Content-Type', 'application/json');

    if (req.decoded) {
        Profile.getByEmail(req.decoded).then(output => {
            // console.log(output);
            res.status(200).json({ success: true, message: 'Profile successfully fetched', obj: output });
        }).catch(err => {
            console.error(err);
            res.status(204).send({ success: false, message: 'Profile get failed', obj: err });
        });
    } else {
        Profile.getAll().then(output => {
            // console.log(output);
            res.status(200).json({ success: true, message: 'Profile successfully fetched', obj: output });
        }).catch(err => {
            console.error(err);
            res.status(204).send({ success: false, message: 'Profile get failed', obj: err });
        });
    }
};

ProfileController.put = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.decoded) {
        Profile.update(req.decoded, req.body.updates).then(output => {
            // console.log(output);
            res.status(201).json({ success: true, message: 'Profile successfully updated', obj: output });
        }).catch(err => {
            console.error(err);
            res.status(204).send({ success: false, message: 'Profile update failed', obj: err });
        });
    } else {
        Profile.update(req.body.email, req.body.updates).then(output => {
            // console.log(output);
            res.status(201).json({ success: true, message: 'Profile successfully updated', obj: output });
        }).catch(err => {
            console.error(err);
            res.status(204).send({ success: false, message: 'Profile update failed', obj: err });
        });
    }
};

ProfileController.delete = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // console.log('email, pass', req.body.email, req.body.password);
    const email = req.body.email;
    const password = req.body.password;
    Company.emailExists(email).then(emailExists => {
        // console.log(emailExists);
        if (!emailExists) {
            res.status(400).json({ success: false, message: 'Invalid Email/Password.' });
            throw new Error(400);
        }

        return Company.auth(email, password);
    }).then((isPwdValid) => {
        if (!isPwdValid) {
            res.status(400).json({ success: false, message: 'Invalid Email/Password.' });
            throw new Error(400);
        }

        console.log('Deleting profile')
        Profile.delete(email);

        // Return the information including token as JSON
        res.status(200).json({
            success: true,
            message: 'Profile successfully deleted',
        });
    }).catch(err => {
        console.error(err);
        // Check if headers are not already sent earlier in the flow
        if (!res.headersSent) {
            res.status(204).json({ success: false, message: 'Authentication failed.', obj: err });
        }
    });
};

module.exports = ProfileController;