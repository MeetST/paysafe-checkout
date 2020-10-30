import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentServiceService } from './payment-service.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare let paysafe: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @BlockUI() blockUI: NgBlockUI;
  title = 'angularbootstrap';
  checkoutForm: FormGroup;
  submitted: boolean = false;
  customer_id = "";
  singleUseCustomerToken = "";
  API_KEY = "cHVibGljLTc3NTE6Qi1xYTItMC01ZjAzMWNiZS0wLTMwMmQwMjE1MDA4OTBlZjI2MjI5NjU2M2FjY2QxY2I0YWFiNzkwMzIzZDJmZDU3MGQzMDIxNDUxMGJjZGFjZGFhNGYwM2Y1OTQ3N2VlZjEzZjJhZjVhZDEzZTMwNDQ=";

  constructor(private formBuilder: FormBuilder,
    private paymentService: PaymentServiceService) { }

  ngOnInit() {
    this.checkoutForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      user_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      amount: ['', [Validators.required]]
    });
  }

  get f() { return this.checkoutForm.controls; }

  checkoutFormSubmit() {
    this.submitted = true;
    if (this.checkoutForm.invalid) {
      return;
    }
    this.blockUI.start('Loading...');
    this.paymentService.getCustomerByMerchantId(this.checkoutForm.value.user_name).subscribe(
      (res: any) => {
        this.submitted = false;
        console.log('customer found', res)
        this.customer_id = res.id;

        // create single user customer token
        let submitSUCT = {
          customer_id: this.customer_id,
          merchantRefNum: this.checkoutForm.value.user_name,
          paymentTypes: ["CARD"],
        }
        this.paymentService.createSingleUserCustomerToken(submitSUCT).subscribe(
          (res: any) => {
            console.log('CustomerToken created', res)
            this.singleUseCustomerToken = res.singleUseCustomerToken;
            this.blockUI.stop();
            this.checkout()
          },
          (err) => {
            console.log('CustomerToken create error', err)
          }
        )
      },
      (err) => {
        console.log('customer not found', err)
        let defaultCusomerObj = {
          "merchantCustomerId": this.checkoutForm.value.user_name,
          "locale": "en_US",
          "firstName": this.checkoutForm.value.first_name,
          "middleName": "James",
          "lastName": "Smith",
          "dateOfBirth": {
            "year": 1981,
            "month": 10,
            "day": 24
          },
          "phone": "777-444-8888",
          "ip": "192.0.126.111",
          "gender": "M",
          "nationality": "Canadian",
          "cellPhone": "777-555-8888"
        }

        let submitCustomer = Object.assign({}, defaultCusomerObj, this.checkoutForm.value.user_name)
        this.paymentService.createCustomer(submitCustomer).subscribe(
          (res: any) => {
            console.log('customer created', res)
            this.customer_id = res.id;

            // create single user customer token
            let submitSUCT = {
              customer_id: this.customer_id,
              merchantRefNum: this.checkoutForm.value.user_name,
              paymentTypes: ["CARD"],
            }
            this.paymentService.createSingleUserCustomerToken(submitSUCT).subscribe(
              (res: any) => {
                console.log('CustomerToken created', res)
                this.singleUseCustomerToken = res.singleUseCustomerToken;
                this.blockUI.stop();
                this.checkout()
              },
              (err) => {
                console.log('CustomerToken create error', err)
                this.blockUI.stop();
              }
            )

          },
          (err) => {
            console.log('customer create error', err)
            this.blockUI.stop();
          }
        )


      }
    )
  }

  checkout() {
    let _this= this;
    paysafe.checkout.setup(this.API_KEY, {
      "currency": "USD",
      "amount": this.checkoutForm.value.amount * 100,
      "singleUseCustomerToken": this.singleUseCustomerToken,
      "locale": "en_US",
      "customer": {
        "firstName": this.checkoutForm.value.first_name,
        "lastName": "Dee",
        "email": this.checkoutForm.value.email,
        "phone": "1234567890",
        "dateOfBirth": {
          "day": 1,
          "month": 7,
          "year": 1990
        }
      },
      "billingAddress": {
        "nickName": this.checkoutForm.value.user_name,
        "street": "20735 Stevens Creek Blvd",
        "street2": "Montessori",
        "city": "Cupertino",
        "zip": "95014",
        "country": "US",
        "state": "CA"
      },
      "environment": "TEST",
      "merchantRefNum": this.customer_id,
      "canEditAmount": true,
      "merchantDescriptor": {
        "dynamicDescriptor": "XYZ",
        "phone": "1234567890"
      },
      "displayPaymentMethods": ["skrill", "card"],
      "paymentMethodDetails": {
        "paysafecard": {
          "consumerId": "1232323"
        },
        "paysafecash": {
          "consumerId": "123456"
        },
        "sightline": {
          "consumerId": "123456",
          "SSN": "123456789",
          "last4ssn": "6789",
          "accountId": "1009688222"
        },
        "vippreferred": {
          "consumerId": "550726575",
          "accountId": "1679688456"
        }
      }
    }, function (instance, error, result) {
      if (result && result.paymentHandleToken) {
        console.log(result.paymentHandleToken);

        let processPaymentObj = {
          "merchantRefNum": `${_this.customer_id}${new Date().getTime()}` ,
          "amount": _this.checkoutForm.value.amount * 100,
          "currencyCode": "USD",
          "dupCheck": true,
          "settleWithAuth": false,
          "paymentHandleToken": result.paymentHandleToken,
          "customerIp": "10.10.12.64",
          "description": "Paysafe Checkout"
        }

        // process payment
        _this.paymentService.processPayment(processPaymentObj).subscribe(
          (res: any) => {
            console.log('process payment succ', res)
            instance.showSuccessScreen();
            _this.checkoutForm.reset();
          },
          (err) => {
            console.log('process payment error', err)
            instance.showFailureScreen();
          }
        )
      } else {
        console.error(error);
        // Handle the error
      }
    }, function (stage, expired) {
      switch (stage) {
        case "PAYMENT_HANDLE_NOT_CREATED": 
        case "PAYMENT_HANDLE_CREATED": // Handle the scenario
        case "PAYMENT_HANDLE_REDIRECT": // Handle the scenario
        case "PAYMENT_HANDLE_PAYABLE": // Handle the scenario
        default: // Handle the scenario
      }
    });
  }

}
