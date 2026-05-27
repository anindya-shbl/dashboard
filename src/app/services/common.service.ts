import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  // ===============  Live ==========

  public baseurl = 'https://sastasundar.com/';
  public apiUrl = 'https://sastasundar.com/index.php/';
  public searchUrl = 'https://search.sastasundar.com/search_list/?';
  public searchTab = 'https://search.sastasundar.com/searchv2/?';
  public labsearch = 'https://search.sastasundar.com/service/search/?';
  public ImageUrl = 'https://asset.sastasundar.com/';
  public catalogUrl = 'https://serv-catalog.sastasundar.com/';
  public searchBaseUrl = 'https://search.sastasundar.com/';


  // ================ stage ==============
  // public baseurl = 'https://stage.sastasundar.com/';
  // public apiUrl = 'https://stage.sastasundar.com/index.php/';
  // public searchUrl = 'https://stage-search.sastasundar.com/search_list/?';
  // public searchTab = 'https://stage-search.sastasundar.com/searchv2/?';
  // public labsearch = 'https://stage-search.sastasundar.com/service/search/?';
  // public ImageUrl = 'https://res.sastasundar.com/';
  // public catalogUrl = 'https://stage-serv-catalog.sastasundar.com/';
  // public searchBaseUrl = 'https://stage-search.sastasundar.com/';

  // ================= Local =============
  // public baseurl = 'http://192.168.5.236:8081/sspl_com/';
  // public apiUrl = 'http://192.168.5.236:8081/sspl_com/index.php/';
  // public searchUrl = 'http://192.168.5.192:4200/search_list/?';
  // public searchTab = 'http://192.168.5.192:4200/searchv2/?';
  // public labsearch = 'http://192.168.5.192:4200/service/search/?';
  // public ImageUrl = 'https://res.sastasundar.com/';
  // public catalogUrl = 'http://192.168.5.236:8003/';
  // public searchBaseUrl = 'http://192.168.5.192:4200/';

  private subject: any = new Subject<any>();

  @Output() aClickedEvent = new EventEmitter<any>();

  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public data$: Observable<any> = this.dataSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  setData(data: any) {
    this.dataSubject.next(data);
  }

  AClicked(data: any) {
    this.aClickedEvent.emit(data);
  }

  sendClickEvent() {
    this.subject.next();
  }
  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  getSearchData(url: any) {
    return this.http.get(url);
  }

  getSavedPrescription(url: any): Observable<any> {
    let gettUrl = this.apiUrl + url;
    // let gettUrl = 'http://192.168.5.148:8074/sspl_com/webapi/' + url;
    return this.http.get(gettUrl);
  }

  uploadImage(url: any, refFiles: any) {
    let postUrl = this.catalogUrl + url;
    return this.http.post(postUrl, refFiles);
  }

  clearCart(url: any) {
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
  }

  getRelivantHBList(url: any, fd: any){
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  changeHealthBuddy(url: any, fd: any){
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  // getMinOrderValue(url: any){
  //   let gettUrl = this.apiUrl + url;
  //   return this.http.get(gettUrl);
  // }

  // getCouponList(url: any) {
  //   let gettUrl = this.apiUrl + url
  //   return this.http.get(gettUrl);
  // }

  getLocation(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            observer.next(position);
            observer.complete();
          },
          (error: GeolocationPositionError) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not supported by this browser.');
      }
    });
  }

  getLatitude(position: GeolocationPosition): number {
    return position.coords.latitude;
  }

  getLongitude(position: GeolocationPosition): number {
    return position.coords.longitude;
  }

  getPosition(position: GeolocationPosition) {
    // console.log(position);
  }

  custWalletBalance(url: any){
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
  }

  custWalletHistory(url: any, fd: any){
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  getProductDetailsPageURL(productid: any, displayname: any, producttype: any) {
    var urisegment1 = '';
    var urisegment2 = '';
    if (displayname != '' && displayname != null) {
      var prod_name = this.get_seo_url_string(displayname);
      urisegment2 = prod_name + '-' + productid;
    }
    if (producttype == 'P') {
      urisegment1 = 'order-medicine';
    } else {
      urisegment1 = 'order-otc';
    }
    if (productid != '' && urisegment1 != '') {
      var product_url = this.baseurl + urisegment1 + '/' + urisegment2;
    } else {
      var product_url = this.baseurl;
    }
    // return product_url;
     window.open(product_url)
  }

  get_seo_url_string(name: any, charsize = 0) {
    name = name.trim(); // Trim String
    name = name.toLowerCase(); //Unwanted:  {UPPERCASE} ; / ? : @ & = + $ , . ! ~ * ' ( )
    name = name.replace(/[^a-z0-9_\s-]/g, '');
    name = name.replace(/[\s-]+/g, ' ');
    name = name.replace(/[\s_]/g, '-');
    if (charsize > 0) {
      name = name.substr(name, 0, charsize);
    }
    return name;
  }

  // getLabTestDetailsPageURL(ProductId: any, ProductName: any, Ispackage: any) {
  //   // debugger
  //   let prod_name = ProductName.toLowerCase();
  //   prod_name = prod_name.trim(prod_name);
  //   prod_name = prod_name.replace(/\~/g, ' ');
  //   prod_name = prod_name.replace(/\`/g, ' ');
  //   prod_name = prod_name.replace(/\!/g, ' ');
  //   prod_name = prod_name.replace(/\@/g, ' ');
  //   prod_name = prod_name.replace(/\#/g, ' ');
  //   prod_name = prod_name.replace(/\$/g, ' ');
  //   prod_name = prod_name.replace(/\%/g, ' ');
  //   prod_name = prod_name.replace(/\^/g, ' ');
  //   prod_name = prod_name.replace(/\&/g, ' and ');
  //   prod_name = prod_name.replace(/\*/g, ' ');
  //   prod_name = prod_name.replace(/\(/g, ' ');
  //   prod_name = prod_name.replace(/\)/g, ' ');
  //   prod_name = prod_name.replace(/\-/g, ' ');
  //   prod_name = prod_name.replace(/\_/g, ' ');
  //   prod_name = prod_name.replace(/\+/g, ' ');
  //   prod_name = prod_name.replace(/\=/g, ' ');
  //   prod_name = prod_name.replace(/\{/g, ' ');
  //   prod_name = prod_name.replace(/\}/g, ' ');
  //   prod_name = prod_name.replace(/\[/g, ' ');
  //   prod_name = prod_name.replace(/\]/g, ' ');
  //   prod_name = prod_name.replace(/\:/g, ' ');
  //   prod_name = prod_name.replace(/\;/g, ' ');
  //   prod_name = prod_name.replace(/\"/g, ' ');
  //   prod_name = prod_name.replace(/\>/g, ' ');
  //   prod_name = prod_name.replace(/\</g, ' ');
  //   prod_name = prod_name.replace(/\,/g, ' ');
  //   prod_name = prod_name.replace(/\./g, ' ');
  //   prod_name = prod_name.replace(/\?/g, ' ');
  //   prod_name = prod_name.replace(/\//g, ' ');
  //   prod_name = prod_name.replace('\\', ' ');
  //   prod_name = prod_name.replace(/\|/g, ' ');
  //   prod_name = prod_name.replace(/\  /g, ' ');
  //   prod_name = prod_name.trim();
  //   prod_name = prod_name.replace(/\ /g, '-');
  //   prod_name = prod_name.substr(0, 200);

  //   let product_Id = btoa(ProductId);

  //   if( Ispackage == 1){
  //     // let product_url = this.baseurl + 'health-packages/' + prod_name + '/' + product_Id;
  //     let product_url = this.baseurl + 'health-packages/' + prod_name ;
  //     window.open(product_url, "_blank")
  //   }else{
  //     // let product_url = this.baseurl + 'test/' + prod_name+ '/' + product_Id;
  //     let product_url = this.baseurl + 'test/' + prod_name ;
  //     window.open(product_url, "_blank")
  //   }

  // }

  getLabTestDetailsPageURL(product_url: any) {
    window.open(product_url)
  }

  requestNotify(url: any, fd: any){
    let postUrl = this.apiUrl + url;
    // let postUrl = 'http://192.168.5.236:8081/sspl_com/index.php/' + url;
    return this.http.post(postUrl, fd);
  }

  getAlternativeList(url: any){
    let gettUrl = this.searchBaseUrl + url;
    return this.http.get(gettUrl);
  }

  getmedicineComparison(url: any, fd: any) {
    let getUrl = this.catalogUrl + url;
    return this.http.get(getUrl, fd);
  }

  postLabData(url: any, fd: any) {
    let postUrl = this.catalogUrl + url;
    return this.http.post(postUrl, fd);
  }

  getLabData(url: any) {
    let getUrl = this.catalogUrl + url;
    return this.http.get(getUrl);
  }

  postProductData(url: any, fd: any) {
    let postUrl = this.catalogUrl + url;
    return this.http.post(postUrl, fd);
  }

  getDeliveryDays(url: any){
    let getUrl = this.catalogUrl + url;
    return this.http.get(getUrl);
  }

  getJitoHeader(url: any){
    let getUrl = this.catalogUrl + url;
    return this.http.get(getUrl);
  }

  getCatalogData(url: any){
    let getUrl = this.catalogUrl + url;
    return this.http.get(getUrl);
  }

   postCatalogData(url: any, fd: any) {
    let postUrl = this.catalogUrl + url;
    return this.http.post(postUrl, fd);
  }

}