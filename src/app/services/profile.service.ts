import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  // ========== Live ==========
  // public apiUrl = 'https://sastasundar.com/index.php/';

  // =========== Stage ==========
  // public apiUrl = 'https://stage.sastasundar.com/index.php/';

  // =============  Local  ==================
  private apiUrl = 'http://192.168.5.236/sspl_com/index.php/';

  private authSecretKey = 'Bearer Token';

  constructor(private http: HttpClient) {}

  updateProfile(url: any, fd: any): Observable<any> {
    let gettUrl = this.apiUrl + url;
    // let gettUrl = 'http://192.168.5.148:8074/sspl_com/' + url;
    return this.http.post(gettUrl, fd);
  }

  getUserOTP(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  verifyUserOTP(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  getAddressList(url: any): Observable<any> {
    // let gettUrl = 'http://192.168.5.29:8074/sspl_com/index.php/' + url;
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
  }

  checkServiceArea(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    let sspl_csrf = '';
    fd.append('csrf_test_name', sspl_csrf);
    return this.http.post(postUrl, fd);
  }

  saveNewAddress(url: any, fd: any): Observable<any> {
    // let postUrl = 'http://192.168.5.29:8074/sspl_com/index.php/' + url;
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  editAddress(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  setDefaultAddress(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  removeAddress(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  getFamilyMembers(url: any): Observable<any> {
    let gettUrl = this.apiUrl + url;
    return this.http.get(gettUrl);
  }

  addFamilyMember(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  getFmOTP(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  verifyFmOTP(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  editFamilyMember(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }

  removeMember(url: any, fd: any): Observable<any> {
    let postUrl = this.apiUrl + url;
    return this.http.post(postUrl, fd);
  }
}
