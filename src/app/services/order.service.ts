import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  // ========== Live ==========

  public apiUrl = 'https://sastasundar.com/index.php/';
  public genuPathApiUrl = 'https://serv.genupathlabs.com/';

  // =========== Stage ==========
  // public apiUrl = 'https://stage.sastasundar.com/index.php/';
  // public genuPathApiUrl = 'https://stage-serv.genupathlabs.com/';

  // =============  Local  ==================
  // private apiUrl = 'http://192.168.5.236:8081/sspl_com/index.php/';
  // public genuPathApiUrl = 'https://stage-serv.genupathlabs.com/';

  private authSecretKey = 'Bearer Token';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getHeaders(): HttpHeaders {
    // const authToken = localStorage.getItem(this.authSecretKey);
    const authToken = 12345;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    });
  }

  getRecentOrders(url: any): Observable<any> {
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
    // const headers = this.getHeaders();
    // return this.http.get<any[]>(`${this.apiUrl}/recent_orders`, { headers });
  }

  getAccountDetails(url: any): Observable<any> {
    let gettUrl = this.apiUrl + url;
    // let gettUrl = 'http://192.168.5.148:8074/sspl_com/' + url;
    return this.http.get(gettUrl);
  }

  // getAllOrders(url: any): Observable<any> {
  //   let gettUrl = this.apiUrl + url;
  //   return this.http.get(gettUrl);
  // }

  getAllOrders(url: any, params: any): Observable<any> {
    let gettUrl = this.apiUrl + url;
    return this.http.post(gettUrl, params);
  }

  getBuyAgainList(url: any): Observable<any> {
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
  }

  getOrderDetailById(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  openServiceRequest(url: any): Observable<any> {
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
  }

  saveServiceRequest(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  getSRdetailsById(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  // getRequestedProducts(url: any): Observable<any> {
  //   let gettUrl = this.apiUrl + url;
  //   return this.http.get(gettUrl);
  // }

  getRequestedProducts(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    // let postUrl = 'http://192.168.5.236:8081/sspl_com/index.php/' + url;
    return this.http.post(postUrl, fd);
  }

  getReturnRequest(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  submitReturnRequest(url: any, fd: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  getReorderItems(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  getcancelReasonList(url: any): Observable<any> {
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
  }

  cancelOrder(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  checkoutCart(url: any, postDataVal: any) {
    let postUrl = this.apiUrl + url
    let sspl_csrf = this.cookieService.get('sspl_csrf');
    postDataVal.append('csrf_test_name', sspl_csrf);
    return this.http.post(postUrl, postDataVal);
  }

  trackingStatus(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  rescheduledata(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  viewLabReport(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  getdoctorList(url: any) {
    let getUrl = this.apiUrl + url;
    return this.http.get(getUrl);
  }

  getPhleboDetails(url: any): Observable<any> {
    let getUrl = this.genuPathApiUrl + url;
    const headers = new HttpHeaders({
      'app-type': 'w'
    });
    return this.http.get(getUrl, { headers });
  }

  getDoctorDetails(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  getdoctorSlot(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  bookApointment(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  getDetails(url: any){
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
  }

  setDetails(url: any, params: any){
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }

  redirectToSuccess(){
    let url = this.apiUrl + 'customercart/paynow_order_success';
    window.open(url, '_self');
  }

  cfhPayment(url: any, params: any) {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, params);
  }
}
