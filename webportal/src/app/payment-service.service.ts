import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl;

  processPayment(data) {
    return this.http.post(`${this.baseUrl}process_payment`, data);
  }

  createSingleUserCustomerToken(data) {
    return this.http.post(`${this.baseUrl}create_single_user_customer_token`, data);
  }

  createCustomer(data) {
    return this.http.post(`${this.baseUrl}create_customer`, data);
  }

  getCustomerByMerchantId(customer_id) {
    return this.http.get(`${this.baseUrl}customer_by_merchant_id`, {
      params: {
        merchantCustomerId: customer_id
      }
    });
  }
  
}
