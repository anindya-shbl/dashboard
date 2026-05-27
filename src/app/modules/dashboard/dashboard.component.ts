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
