const express = require('express')
const router = express.Router()

const PaymentController = require('./controller/payment');

router.get('/api/customer_by_merchant_id', PaymentController.getCustomerByMerchantId);
router.post('/api/create_customer', PaymentController.createCustomer);
router.post('/api/create_single_user_customer_token', PaymentController.singleUserCustomerToken);
router.post('/api/process_payment', PaymentController.processPayment);

module.exports = router