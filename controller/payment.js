const rp = require('request-promise');
const config = require('../config')

let _self = {
    getCustomerByMerchantId: (req, res) => {
        if (req.query.merchantCustomerId) {
            let options = {
                method: 'GET',
                uri: config.PAYSAFE_API_BASE_URL + config.END_POINTS.CUTOMER_BY_MERCHANT_ID,
                qs: {
                    merchantCustomerId: req.query.merchantCustomerId
                },
                auth: {
                    user: config.CREDENTIALS.USER_NAME,
                    pass: config.CREDENTIALS.PASSWORD,
                    sendImmediately: true
                }
            };
            rp(options)
                .then(async (response) => {
                    console.log("response", response)
                    res.status(200).send(response)
                })
                .catch((err) => {
                    console.log("getCustomerByMerchantId ERR>>>>", err.error)
                    res.status(400).send(err.error)
                });
        } else {
            return res.status(400).send({
                message: 'Merchant customer id is required'
            })
        }
    },

    createCustomer: (req, res) => {
        let options = {
            method: 'POST',
            uri: config.PAYSAFE_API_BASE_URL + config.END_POINTS.CREATE_CUSTOMER,
            body: req.body,
            auth: {
                user: config.CREDENTIALS.USER_NAME,
                pass: config.CREDENTIALS.PASSWORD,
                sendImmediately: true
            },
            json: true
        };
        rp(options)
            .then(async (response) => {
                console.log("response", response)
                res.status(200).send(response)
            })
            .catch((err) => {
                console.log("createCustomer ERR>>>>", err.error)
                res.status(400).send(err.error)
            });
    },

    singleUserCustomerToken: (req, res) => {
        if (req.body.customer_id) {
            let options = {
                method: 'POST',
                uri: config.PAYSAFE_API_BASE_URL + config.END_POINTS.CREATE_CUSTOMER + `/${req.body.customer_id}/` + config.END_POINTS.SINGLE_USE_CUSTOMER_TOKEN,
                body: req.body,
                auth: {
                    user: config.CREDENTIALS.USER_NAME,
                    pass: config.CREDENTIALS.PASSWORD,
                    sendImmediately: true
                },
                json: true
            };
            rp(options)
                .then(async (response) => {
                    console.log("response", response)
                    res.status(200).send(response)
                })
                .catch((err) => {
                    console.log("singleUserCustomerToken ERR>>>>", err.error)
                    res.status(400).send(err.error)
                });
        } else {
            return res.status(400).send({
                message: 'Customer id is required'
            })
        }
    },

    processPayment: (req, res) => {
        let options = {
            method: 'POST',
            uri: config.PAYSAFE_API_BASE_URL + config.END_POINTS.PAYMENT,
            body: req.body,
            auth: {
                user: config.CREDENTIALS.USER_NAME,
                pass: config.CREDENTIALS.PASSWORD,
                sendImmediately: true
            },
            json: true
        };
        rp(options)
            .then(async (response) => {
                console.log("response", response)
                res.status(200).send(response)
            })
            .catch((err) => {
                console.log("processPayment ERR>>>>", err.error)
                res.status(400).send(err.error)
            });
    },  
}

module.exports = _self;