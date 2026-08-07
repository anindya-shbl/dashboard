import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // ============ live ===============
  public baseurl = 'https://sastasundar.com/';
  public apiUrl = 'https://sastasundar.com/index.php/';
  public catalogUrl = 'https://serv-catalog.sastasundar.com/';

  // ================  stage ==========

  // public baseurl = 'https://stage.sastasundar.com/';
  // public apiUrl = 'https://stage.sastasundar.com/index.php/';
  // public catalogUrl = 'https://stage-serv-catalog.sastasundar.com/';

  // ===========  Local  ===========
  // public baseurl = 'http://192.168.5.236:8081/sspl_com/';
  // public apiUrl = 'http://192.168.5.236:8081/sspl_com/index.php/';
  // public catalogUrl = 'http://192.168.5.236:8003/';

  public PinCode: any = '';
  public WHId: any = '';
  public IsPanIndia: any = '';
  public UserName: any = '';
  public EmailId: any = '';
  public UserId: any = '';
  public Mobile: any = '';
  public Token: any = '';
  public PanIndiaStateName: any = '';
  public PanIndiaStateCode = '';
  public PanIndiaCityID: any = '';
  public PanIndiaCityName: any = '';
  public LocationSkipped: any = '';
  public IsLab: any = '';
  // public Warehouse: any = 1;

  public customerName: any = 'Guest';
  public totalSavings: any = 0;
  public totalOrders: any = 0;
  public labBookings: any = 0;
  public doctorConsultations: any = 0;
  public walletInfo: any = [];
  public walletBalance: any = 0;

  public HBContactNo: any = '';
  public HBEmail: any = '';
  public HBMaskingContactNo: any = '';
  public HBMobileNo: any = '';
  public HBName: any = '';
  public HealthBuddyCode: any = '';
  public HealthBuddyId: any = '';
  public HealthBuddyImage: any = '';
  public HealthBuddyName: any = '';
  public PersonInCharge: any = '';
  public DrugLicenseNo: any = '';
  public ConfigData: any = '';
  public currentModule: any = '';
  public CurrentLanguage: any = '';
  public OrganNames: any = [];
  public AllHealthConditions: any = [];
  // public CategoryList: any = [];
  private categoryListSubject = new BehaviorSubject<any[]>([]);
  public CategoryList$ = this.categoryListSubject.asObservable();

  private poularPackageSubject = new BehaviorSubject<any[]>([]);
  public PoularPackageList$ = this.poularPackageSubject.asObservable();

  // public isAuth = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    // this.autoSignIn();
  }

  setCategoryList(categories: any[]) {
    this.categoryListSubject.next(categories);
  }

  setPoularPckgList(packages: any[]) {
    this.poularPackageSubject.next(packages);
  }

  getLogindata(url: any) {
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
  }

  getCaptcha(url: any) {
    let gettUrl = this.apiUrl + url
    return this.http.get(gettUrl);
  }

  doLogin(url: any, postDataVal: any) {
    let postUrl = this.apiUrl + url
    let sspl_csrf = this.cookieService.get('sspl_csrf');
    postDataVal.append('csrf_test_name', sspl_csrf);
    // postDataVal.append('hasTestLogin', environment.hasTestLogin);
    return this.http.post(postUrl, postDataVal);
  }

  getOTP(url: any, postDataVal: any) {
    let postUrl = this.apiUrl + url
    let sspl_csrf = this.cookieService.get('sspl_csrf');
    postDataVal.append('csrf_test_name', sspl_csrf);
    // postDataVal.append('hasTestLogin', environment.hasTestLogin);
    return this.http.post(postUrl, postDataVal);
  }

  verifyOTP(url: any, postDataVal: any) {
    let postUrl = this.apiUrl + url
    let sspl_csrf = this.cookieService.get('sspl_csrf');
    postDataVal.append('csrf_test_name', sspl_csrf);
    // postDataVal.append('hasTestLogin', environment.hasTestLogin);
    return this.http.post(postUrl, postDataVal);
  }

  getCategoryDetails(url: any, postDataVal: any): Observable<any> {
    // let gettUrl = this.apiUrl + url;
    let postUrl = this.catalogUrl + url;
    return this.http.post(postUrl, postDataVal);
  }

  getConfigDetails(url: any): Observable<any> {
    let gettUrl = this.catalogUrl + url;
    return this.http.get(gettUrl);
  }

  getCurrentLocation(url: any, postDataVal: any) {
    let postUrl = this.catalogUrl + url;
    // let sspl_csrf = this.cookieService.get('sspl_csrf');
    // postDataVal.append('csrf_test_name', sspl_csrf);
    return this.http.post(postUrl, postDataVal);
  }

  setUserLocation(url: any, postDataVal: any) {
    let postUrl = this.apiUrl + url;
    let sspl_csrf = this.cookieService.get('sspl_csrf');
    postDataVal.append('csrf_test_name', sspl_csrf);
    // postDataVal.append('hasTestLogin', environment.hasTestLogin);
    return this.http.post(postUrl, postDataVal);
  }

  removeuserAccount(url: any, postDataVal: any) {
    let postUrl = this.apiUrl + url;
    let sspl_csrf = this.cookieService.get('sspl_csrf');
    postDataVal.append('csrf_test_name', sspl_csrf);
    return this.http.post(postUrl, postDataVal);
  }

}
