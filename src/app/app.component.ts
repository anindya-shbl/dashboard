import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthService } from './services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Dashboard_Web';
  cookieValue: any = '';

  loading: boolean = false;
  isUser: boolean = false

  constructor(
    private dbService: NgxIndexedDBService,
    private cookieService: CookieService,
    private authService: AuthService,
    private spinner: NgxSpinnerService) {
  }



  ngOnInit(): void {
    this.loading = true;
    this.spinner.show();
    this.cookieService.set('isLoggedIn', 'false');
    this.setConfig();
    this.getCategory();
    this.chkloggingStatus();
  }

  chkloggingStatus() {
    this.authService.getLogindata('webapi/users/dochkLogging').subscribe((res: any) => {
      this.loading = false;
      this.spinner.hide();
      // console.log(res)
      // res['response_code'] = 1;
      if (res && res['response_code'] == 0) {
        this.isUser = true;
        this.cookieService.set('isLoggedIn', 'true');
        if (res['data']['FName'] != undefined && res['data']['FName'] != null && res['data']['FName'] != '') {
          this.authService.UserName = res['data']['FName'];
        } else {
          this.authService.UserName = 'ME'
        }
        this.authService.Mobile = res['data']['MobileNo'];
        this.authService.UserId = res['data']['UserId'];
        this.authService.Token = res['data']['EncodedUserId'];
        // this.authService.Warehouse = res['location']['HealthBuddyName'];

        if (res['location'] != undefined) {
          this.authService.PinCode = res['location']['UserLocationPincode'];
          this.authService.WHId = res['location']['WarehouseId'];
          this.authService.PanIndiaStateName = res['location']['StateName'];
          this.authService.PanIndiaStateCode = res['location']['StateCode'];
          this.authService.PanIndiaCityID = res['location']['CityId'];
          this.authService.PanIndiaCityName = res['location']['CityName'];
          this.authService.LocationSkipped = res['location']['LocationSkipped'];
          this.authService.IsLab = res['location']['IsLab'];


          if (res['location']['PanIndia'] == 0 || res['location']['PanIndia'] == 1) {
            this.authService.IsPanIndia = res['location']['PanIndia'];
          } else {
            if (res['location']['PanIndia'] == 'Y') {
              this.authService.IsPanIndia = 1
            } else {
              this.authService.IsPanIndia = 0
            }
          }
        }
      } else {
        // alert('not login');
        this.isUser = false;
        this.cookieService.set('isLoggedIn', 'false');
        // window.location.href = `${this.authService.baseurl}user/login`
      }
    })
  }

  setConfig() {
    this.authService.getConfigDetails('home/getconfig').subscribe((res: any) => {
      if (res && res['msgcode'] == 1) {
        this.authService.ConfigData = res['results']
      }
    })
  }

  getCategory(){
    let fd = new FormData();
    fd.append('panindia', '0');
    fd.append('warehouseId', '1');
    fd.append('categoryLevel', '2');
    this.authService.getCategoryDetails('category/getAllCategoryList/', fd).subscribe((data: any) => {
      if(data && data.msgcode == 1){
        // this.authService.CategoryList = data.results;
        this.authService.setCategoryList(data.results);
        // console.log(this.ctgryList);
      }
    });
  }

}
