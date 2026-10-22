import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) { }
  public loyaltyBalance : number = 0;
  ngOnInit(): void {

    if (this.authService.ConfigData.LoyaltyPointsEnable == 'Y') {
          this.getLoyaltyBalance();
        }
  }

  getWalletRecords(){
    this.router.navigate(['customers/wallet']);    
  }

getLoyaltyBalance() {
    // this.spinner.show();
    this.authService.getLoyaltyBalance('loyalty/get_loyalty_balance').subscribe((res: any) => {
      res = { "data": { "total_cr": 25, "total_dr": 0, "expired_point": 0, "actual_balance": 25, "soft_redeemed_points": 0, "usable_balance": 25, "nearby_expiry_message": "10 coins expiring on 22 Mar 2027" }, "message": "Loyalty balance retrieved successfully", "response_code": "1" };
      if (res && res['response_code'] == 1) {
        this.loyaltyBalance = res['data']['usable_balance'];
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

}
