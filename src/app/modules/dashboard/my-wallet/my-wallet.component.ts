import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-wallet',
  templateUrl: './my-wallet.component.html',
  styleUrl: './my-wallet.component.scss'
})
export class MyWalletComponent implements OnInit{

  isLoggedIn :any = '';
  isloading: boolean = false;
  walletInfo: any = [];
  walletBalance: any = 0;
  walletHistory : any =[];
  pageNo: any = 1;
  loadMoreBtn: boolean = false;
  // totalCount: any = 0;
  
  constructor(
    private router: Router, 
    private spinner: NgxSpinnerService, 
    private cookieService: CookieService, 
    public CommonService: CommonService, 
    public authService: AuthService) {}

  ngOnInit(): void {
    // this.chkloggingStatus();
    this.isLoggedIn = this.cookieService.get('isLoggedIn');
    if(this.isLoggedIn == 'true'){
      if(this.authService.ConfigData !='' && this.authService.ConfigData.WalletEnable == 'Y'){
        this.getWalletBalance();
        this.getWalletRecords();
      }else{
        this.router.navigate(['customers/dashboard'])
      }
    }else{
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }

  getWalletBalance() {
    this.spinner.show();
    this.CommonService.custWalletBalance('webapi/wallet/getWalletBalance').subscribe((res: any) => {
      // console.log('saved prsc List', data, data['results']);
      if (res && res['response_code'] == 0) {
        this.walletInfo = res['data'][0];
        this.walletBalance = this.walletInfo['balance'];
        this.spinner.hide();
      } else {
        this.walletInfo = [];
        this.walletBalance = 0;
        this.spinner.hide();
      }
      // console.log('wallet info',res, this.walletInfo['balance']);
    });
  }



  getWalletRecords() {
    this.spinner.show();
    if(this.pageNo == 1){
      this.isloading = true;
    };    
    let fd = new FormData();
    fd.append('PageNo', this.pageNo);
    this.CommonService.custWalletHistory('webapi/wallet/getWalletLedgerRecords', fd).subscribe((res: any) => {
      if (res && res['response_code'] == 0) {
        let timeNow = Date.now();
        // this.walletHistory = res['data']['items'];
        if (res['data']['items'].length > 0) {
          let mdLst = res['data']['items'].map((obj: any) => {
            if (obj.gift_card != undefined) {
              let exp = timeNow > Number(obj.gift_card['expire_at']) * 1000 ? 'Y' : 'N';
              return { ...obj, expired: exp };
            }
            return obj;
          });
          this.walletHistory = [...this.walletHistory, ...mdLst];
          // this.totalCount = res['data']['count'];
          this.loadMoreBtn = true;
        }else{
          this.loadMoreBtn = false;
        }
        this.isloading = false;
        this.spinner.hide();
      } else {
        // this.walletHistory = [];
        this.isloading = false;
        this.spinner.hide();
      }
      // console.log('wallet history',this.walletHistory);
    });
  }

  loadMore(){
    this.pageNo = this.pageNo + 1;
    this.getWalletRecords();
  }
}
