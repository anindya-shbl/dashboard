import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService, private orderService : OrderService, private spinner: NgxSpinnerService, public CommonService: CommonService){}

  // accountdata: any = [];
  currentOrders : any=[];
  // walletInfo: any = [];
  // walletBalance: any = 0;

  ngOnInit(): void {
    // this.getWalletBalance();
    this.recenrOrders();
  }


  recenrOrders(){
    this.spinner.show()
    // this.currentOrders = [];
    this.orderService.getRecentOrders('webapi/order/currentOrders').subscribe((data: any) => {

      if(data && data['result']['rs']['currentOrders'].length > 0){
        this.currentOrders = data['result']['rs']['currentOrders'];
        this.spinner.hide();
      }else{
        this.currentOrders = [];
        this.spinner.hide();
      }
      // console.log('ttt',data['result']['rs']['currentOrders']);
    });
  }

  viewAllorders(){
    this.router.navigate(['customers/dashboard/orderlist']);
  }

  viewDetails(id: any){
    let orderId = btoa(id);
    this.router.navigate(['customers/dashboard/orderview', orderId]);
  }

  // getWalletBalance() {
  //   this.CommonService.custWalletBalance('webapi/wallet/getWalletBalance').subscribe((res: any) => {
  //     // console.log('saved prsc List', data, data['results']);
  //     if (res && res['response_code'] == 0) {
  //       this.walletInfo = res['data'][0];
  //       this.walletBalance = this.walletInfo['balance'];
  //     } else {
  //       this.walletInfo = [];
  //       this.walletBalance = 0;
  //     }
  //     // console.log('wallet info',res, this.walletInfo['balance']);
  //   });
  // }

  getWalletRecords(){
    this.router.navigate(['customers/wallet']);    
  }

}
