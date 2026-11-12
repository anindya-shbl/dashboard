import { Component } from '@angular/core';
// import { CommonService } from '../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebEngageService } from '../../../services/web-engage.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-loyalty-coins-history',
  templateUrl: './my-loyalty-coins-history.component.html',
  styleUrl: './my-loyalty-coins-history.component.scss'
})
export class MyLoyaltyCoinsHistory {

  tabName: any = '';
  isloading: boolean = false;

  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private webengageService: WebEngageService) { }
  public loyaltyBalance : number = 0;
  public loyaltyHistory : any = [];
  public loyaltyCredit : number = 0;
  public loyaltyDebit : number = 0;
  public loyaltyExpired : number = 0;
  public expiry_message : string = '';
  public totalNoOfRecords : number = 0;
  public totalNoOfDisplayedRecords : number = 0;
  public totalNoOfPages : number = 0;
  public currentPage: number = 1;
  public recordsPerPage: number = 20;

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalNoOfPages }, (_, index) => index + 1);
  }

  ngOnInit(): void {
    this.tabName = 'Loyalty Coins';
    this.getLoyaltyCoinsHistory();
    this.getLoyaltyBalance();
  }

  getLoyaltyBalance() {
    // this.spinner.show();
    this.authService.getLoyaltyBalance('loyalty/get_loyalty_balance').subscribe((res: any) => {
      res = {"data":{"total_cr":591,"total_dr":393.35,"expired_point":0,"actual_balance":197.65,"soft_redeemed_points":41.87,"usable_balance":155.78,"nearby_expiry_message":"17.66 coins expiring on 24 Mar 2027"},"message":"Loyalty balance retrieved successfully","response_code":"1"};
      if (res && res['response_code'] == 1) {
        this.loyaltyBalance = res['data']['usable_balance'];
        this.loyaltyCredit = res['data']['total_cr'];
        this.loyaltyDebit = res['data']['total_dr'];
        this.loyaltyExpired = res['data']['expired_point'];
        this.expiry_message = res['data']['nearby_expiry_message'];
        
        if (this.loyaltyBalance > 0) {
          // this.useLoyaltyCoin = true;
        } else {
          // this.useLoyaltyCoin = false;
        }
        // this.spinner.hide();
      } else {
        // this.walletInfo = [];
        this.loyaltyBalance = 0;
        // this.useLoyaltyCoin = false;
        // this.spinner.hide();
      }
      console.log('loyaltyBalance info',res, this.loyaltyBalance);
    });
  }
  
  getLoyaltyCoinsHistory() {
    this.authService.getLoyaltyInterface(
      `loyalty/get_loyalty_transaction_history?PageNo=${this.currentPage}&PageSize=${this.recordsPerPage}`
    ).subscribe((res: any) => {
      res = {"data":[{"order_id":"101002598895","customer_id":588439,"dr_cr_indicator":"DR","points":2.2,"balance_after":161.97,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-12"},{"order_id":"101002598893","customer_id":588439,"dr_cr_indicator":"DR","points":11.16,"balance_after":164.17,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-12"},{"order_id":"101002598892","customer_id":588439,"dr_cr_indicator":"DR","points":11.16,"balance_after":175.33,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-12"},{"order_id":"101002598887","customer_id":588439,"dr_cr_indicator":"DR","points":26.99,"balance_after":159.5,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-12"},{"order_id":"101002598886","customer_id":588439,"dr_cr_indicator":"DR","points":11.16,"balance_after":186.49,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-12"},{"order_id":"101002598878","customer_id":588439,"dr_cr_indicator":"DR","points":26.99,"balance_after":170.66,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-12"},{"order_id":"101002598872","customer_id":588439,"dr_cr_indicator":"DR","points":26.99,"balance_after":170.66,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-12"},{"order_id":"101002598837","customer_id":588439,"dr_cr_indicator":"DR","points":22.31,"balance_after":197.65,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-06"},{"order_id":"101002598833","customer_id":588439,"dr_cr_indicator":"DR","points":11.16,"balance_after":219.96,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-06"},{"order_id":"101002598807","customer_id":588439,"dr_cr_indicator":"DR","points":14.88,"balance_after":231.12,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-05"},{"order_id":"102002598778","customer_id":588439,"dr_cr_indicator":"DR","points":11,"balance_after":246,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-03"},{"order_id":"101002598735","customer_id":588439,"dr_cr_indicator":"DR","points":9.24,"balance_after":247.76,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-02"},{"order_id":"101002598736","customer_id":588439,"dr_cr_indicator":"DR","points":14.76,"balance_after":233,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-11-02"},{"order_id":"101002598693","customer_id":588439,"dr_cr_indicator":"CR","points":12,"balance_after":257,"expiry_date":"2027-04-28","remarks":"SS Coin Earn","created_at":"2026-10-30"},{"order_id":"101002598693","customer_id":588439,"dr_cr_indicator":"DR","points":30,"balance_after":188,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-10-30"},{"order_id":"101002598692","customer_id":588439,"dr_cr_indicator":"DR","points":27,"balance_after":218,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-10-30"},{"order_id":"101002598691","customer_id":588439,"dr_cr_indicator":"DR","points":15,"balance_after":245,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-10-30"},{"order_id":"101002598686","customer_id":588439,"dr_cr_indicator":"DR","points":15,"balance_after":260,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-10-29"},{"order_id":"101002598684","customer_id":588439,"dr_cr_indicator":"DR","points":15,"balance_after":275,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-10-29"},{"order_id":"101002598679","customer_id":588439,"dr_cr_indicator":"DR","points":11,"balance_after":290,"expiry_date":null,"remarks":"Redeemed on order","created_at":"2026-10-29"}],"totalRecords":70,"message":"Success","response_code":"1"};
      if (res && res['response_code'] == 1) {
          this.loyaltyHistory = res['data'];
          this.totalNoOfRecords = res['totalRecords'];
          this.totalNoOfDisplayedRecords = this.loyaltyHistory.length;
          this.totalNoOfPages = Math.ceil(this.totalNoOfRecords / this.recordsPerPage);
          console.log('loyaltyHistory info',res, this.loyaltyHistory);
       }
       else {
        console.log('something went wrong');
       }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalNoOfPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.getLoyaltyCoinsHistory();
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  trackByIndex(index: number): number {
    return index;
  }
  gotoJitoSearch() {
    window.location.href = 'https://stage.sastasundar.com/jitosearch';
  }

}
