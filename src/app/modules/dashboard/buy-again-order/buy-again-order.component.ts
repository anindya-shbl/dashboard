import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buy-again-order',
  templateUrl: './buy-again-order.component.html',
  styleUrl: './buy-again-order.component.scss'
})
export class BuyAgainOrderComponent implements OnInit {

  @Input() respData : any = [];
  OrderIDList : any = [];
  checkoutArr: any = [];
  @Output() byagainOrder = new EventEmitter<any>();

  constructor(public CommonService: CommonService, private orderService : OrderService, private authService: AuthService, private dbService: NgxIndexedDBService, private toastr: ToastrService){}

  ngOnInit(): void {
    let orderList = this.respData[0]['data']['orderIDList'];
    if (orderList.length > 0) {
      orderList.forEach((obj: any) => {
        obj.ItemList.forEach((dts: any) => {
          dts.addedQty = dts.ItemQuantity;
        })
      })
      this.OrderIDList = orderList;
    } else {
      this.OrderIDList = [];
    }

    // console.log(this.OrderIDList)
  }

  addUpdateItem(item: any){
    this.OrderIDList.forEach((obj:any)=>{
      obj.ItemList.forEach((dts:any)=>{
        if(dts.ProductId == item.ProductId && dts.OrderId == item.OrderId){
          dts.addedQty = dts.addedQty + 1;
        }
      })
    });
  }

  removeUpdateItem(item: any){
    if(item.addedQty >1){
      this.OrderIDList.forEach((obj:any)=>{
        obj.ItemList.forEach((dts:any)=>{
          if(dts.ProductId == item.ProductId && dts.OrderId == item.OrderId){
            dts.addedQty = dts.addedQty - 1;
          }
        })
      });
    }else{
      return;
    }
  }

  proceed(dts: any){
    this.checkoutArr = dts.ItemList;
    // console.log(this.checkoutArr)
    if(this.checkoutArr.length > 0){
      this.byagainOrder.emit(this.checkoutArr);
    }
  }

  calculateDiff(data : any){
    let date = new Date(data);
    let currentDate = new Date();

    let days = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) ) /(1000 * 60 * 60 * 24));

    return days;
  }

  requestNotify(item: any) {
    // console.log(item);
    let fd = new FormData();
    fd.append('ProductId', item.ProductId);
    fd.append('ProductName', item.DisplayName);
    fd.append('ProductType', item.PrescriptionOTC);
    fd.append('RequestSource', 'C');
    // fd.append('DeviceId', '');
    // fd.append('AppType', '');
    // fd.append('AppVersion', '');

    this.CommonService.requestNotify('webapi/request_product/productRequest', fd).subscribe((res: any) => {
      // console.log(res);      
      if(res && res.response_code == 0){
        this.toastr.success(res.message);
      }else{
        this.toastr.error(res.message);
      }
    })

  }


}
