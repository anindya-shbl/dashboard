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
      res = {"data":{"UserId":588795,"UserCode":"SSPLWBC00588795","EmailId":null,"MobileNo":9836370209,"OTP":null,"NeedToResetPass":"N","ActiveStatus":1,"Status":"Y","FName":"Anindya","MName":"","LName":"","CustFullName":"Anindya","DOB":null,"Age":null,"Gender":null,"MaritalStatus":null,"AnivDate":null,"WalletVal":null,"RewardPoint":null,"SSCurrencyValue":0,"Subscribed":null,"HealthBuddyId":11010,"HealthBuddyCode":"WB031","HealthBuddyName":"test HB","HealthBuddyImage":"1455664917Tulips.jpg","IsDeleted":0,"CreatedDate":"2025-03-25 10:07:01.417","ModificationReason":null,"UpdatedDate":"2026-03-24 19:43:34.920","RegisteredCity":"Hooghly","RegisteredStateCode":"WB","CreatedBy":588795,"RegisteredStateName":"West Bengal","RM":null,"ReferredBy":null,"GroupId":null,"GroupName":null,"RegistrationSourceId":null,"EnquirySourceId":null,"EnquirySourceOther":null,"ProfileId":null,"CustomerCategory":"Silver","CustGSTIN":null,"CustGSTINDate":null,"WellnessBuddyId":null,"WarehouseId":1,"WarehouseLocation":"Kolkata","AlternativeContactNo":null,"CustAffiliateMasId":0,"AlternativeEmailId":null,"TotalSavings":0,"XplorPoint":0,"EmailAWSStatus":null,"EmailAWSStatusUpdateDate":null,"PreviousTransactionCount":null,"EmailAWSStatusUpdateCNT":null,"IsRealCustomer":0,"IsEmailVerified":null,"IsPrimaryUncontactable":null,"IsAltUncontactable":null,"CardId":null,"CardType":null,"HBContactNo":"0332356025844,03325905856\/58,","RazorPayUserId":null,"LabCartPin":null,"EncodedUserId":"8io9iiio7iio7iiloiiiiio9o76","downtimeFlg":0,"downtimemsg":"We\u2019re updating GST% and MRP for your benefit. Checkout will be unavailable from 5 AM \u2013 7 AM on 21st Sept. Please shop again after 7 AM to enjoy updated rates."},"message":"success","response_code":"0","location":{"UserLocationPincode":"700156","CityName":"Kolkata","PanIndia":"N","WarehouseId":1,"HBId":"","LocationSkipped":0,"StateCode":"WB","StateId":35,"StateName":"West Bengal","CityId":806,"IsLab":0}};
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
        this.authService.EmailId = res['data']['EmailId'];
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
