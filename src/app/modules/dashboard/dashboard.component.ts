import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderService } from '../../services/order.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  isLoggedIn :any = '';
  canLoad: boolean = false;
  
  constructor(private router: Router, private authService: AuthService,private orderService : OrderService, private spinner: NgxSpinnerService, private cookieService: CookieService, private CommonService: CommonService) {
    this.authService.currentModule = 'Dashboard';
  }

  ngOnInit(): void {
    // this.chkloggingStatus();
    this.isLoggedIn = this.cookieService.get('isLoggedIn');
    // console.log(this.isLoggedIn)
    if(this.isLoggedIn == 'true'){
      this.accountData();
    }else{
      // this.router.navigate(['CustomarCart/ViewCart'])
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }

  accountData(){
    // this.currentOrders = [];
    this.spinner.show();
    // this.orderService.getAccountDetails('customers/user/dashboard').subscribe((data: any) => {
    this.orderService.getAccountDetails('webapi/user/dashboard').subscribe((data: any) => {
      // console.log(data)
      data = {"result":{"rs":{"UserId":"588795","UserCode":"SSPLWBC00588795","EmailId":null,"MobileNo":"9836370209","OTP":null,"NeedToResetPass":"N","ActiveStatus":1,"Status":"Y","FName":"Anindya","MName":"","LName":"","CustFullName":"Anindya","DOB":null,"Age":null,"Gender":null,"MaritalStatus":null,"AnivDate":null,"WalletVal":null,"RewardPoint":null,"SSCurrencyValue":".00","Subscribed":null,"HealthBuddyId":"11010","HealthBuddyCode":"WB031","HealthBuddyName":"test HB","HealthBuddyImage":"1455664917Tulips.jpg","IsDeleted":0,"CreatedDate":"2025-03-25 10:07:01.417","ModificationReason":null,"UpdatedDate":"2026-03-31 12:06:30.987","RegisteredCity":"Hooghly","RegisteredStateCode":"WB","CreatedBy":"588795","RegisteredStateName":"West Bengal","RM":null,"ReferredBy":null,"GroupId":null,"GroupName":null,"RegistrationSourceId":null,"EnquirySourceId":null,"EnquirySourceOther":null,"ProfileId":null,"CustomerCategory":"Silver","CustGSTIN":null,"CustGSTINDate":null,"WellnessBuddyId":null,"WarehouseId":1,"WarehouseLocation":"Kolkata","AlternativeContactNo":null,"CustAffiliateMasId":0,"AlternativeEmailId":null,"TotalSavings":null,"XplorPoint":".00","EmailAWSStatus":null,"EmailAWSStatusUpdateDate":"2026-04-01 12:42:37.437","PreviousTransactionCount":21,"EmailAWSStatusUpdateCNT":1,"IsRealCustomer":0,"IsEmailVerified":null,"IsPrimaryUncontactable":null,"IsAltUncontactable":null,"CardId":null,"CardType":null,"HBContactNo":"0332356025844,03325905856\/58,","OrderCount":21,"HBName":"test HB","HBMobileNo":"9143232104","HBEmail":"testhb@sastasundar.com","DrugLicenseNo":"BACD=5489 \/E,ABCD=5252 \/NH","ProfileImage":"1455664917Tulips.jpg","PersonInCharge":"Health Buddy","HBMaskingContactNo":"0332356025844,03325905856\/58,","RazorPayUserId":null,"UserTypeId":"C"}}};
      if(data){
        let accountdata = data['result']['rs'];
        // console.log('ttt1',accountdata);
        if(accountdata.CustFullName == null || accountdata.CustFullName == ''){
          this.authService.customerName  = 'Guest'
        }else{
          this.authService.customerName  = accountdata.CustFullName;
        }

        // this.authService.customerName  = accountdata.CustFullName == null ? 'Guest' : accountdata.CustFullName;
        this.authService.totalSavings = accountdata.TotalSavings == null ? 0 : accountdata.TotalSavings;
        this.authService.totalOrders = accountdata.OrderCount == null ? 0 : accountdata.OrderCount;
        // this.authService.labBookings = accountdata. == null ? 0 : ;
        // this.authService.doctorConsultations = accountdata.== null ? 0 : ;
        this.authService.HBContactNo = accountdata.HBContactNo;
        this.authService.HBEmail  = accountdata.HBEmail;
        this.authService.HBMaskingContactNo  = accountdata.HBMaskingContactNo;
        this.authService.HBMobileNo  = accountdata.HBMobileNo;
        this.authService.HBName  = accountdata.HBName;
        this.authService.HealthBuddyCode  = accountdata.HealthBuddyCode;
        this.authService.HealthBuddyId  = accountdata.HealthBuddyId;
        this.authService.HealthBuddyImage  = accountdata.HealthBuddyImage;
        this.authService.HealthBuddyName  = accountdata.HealthBuddyName;
        this.authService.PersonInCharge  = accountdata.PersonInCharge;
        this.authService.DrugLicenseNo = accountdata.DrugLicenseNo;
        if(this.authService.ConfigData != '' && this.authService.ConfigData.WalletEnable == 'Y'){
          this.getWalletBalance();
        }else{
          this.spinner.hide();
        }
      }
      
    });
  }

  getWalletBalance() {
    this.CommonService.custWalletBalance('webapi/wallet/getWalletBalance').subscribe((res: any) => {
      // console.log('saved prsc List', data, data['results']);
      if (res && res['response_code'] == 0) {
        this.authService.walletInfo = res['data'][0];
        this.authService.walletBalance = this.authService.walletInfo['balance'];
      } else {
        this.authService.walletInfo = [];
        this.authService.walletBalance = 0;
      }
    });
    this.spinner.hide();
  }


}
