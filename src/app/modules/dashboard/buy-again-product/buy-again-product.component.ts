import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buy-again-product',
  templateUrl: './buy-again-product.component.html',
  styleUrl: './buy-again-product.component.scss'
})
export class BuyAgainProductComponent implements OnInit {

  @Input() respData : any = [];
  ProductList : any = [];
  checkoutArr: any = [];
  scrollPosition: any = 0;
  @Output() byagainOrder = new EventEmitter<any>();

  @HostListener('window:scroll', ['$event'])
  doSomething(event: any) {
    // console.log("Scroll Event", window.scrollY );
    this.scrollPosition = window.scrollY;
  }

  constructor(public CommonService: CommonService, private orderService : OrderService, private authService: AuthService, private dbService: NgxIndexedDBService, private toastr: ToastrService){}

  ngOnInit(): void {
    let productList = this.respData[0]['data']['ProductList'];
    if (productList.length > 0) {
      productList.forEach((obj: any) => {
        obj.addedQty = 0;
      })
      this.ProductList = productList;
    } else {
      this.ProductList = [];
    }
  }

  AddUpdate(item: any){
    this.ProductList = this.ProductList.map((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        let qty = item.addedQty + 1;
        return { ...obj, addedQty: qty };
      }
      return obj;
    });

    if(item.addedQty == 0){
      let temp: any = {...item, addedQty: 1}
      this.checkoutArr.push(temp)
    }else{
      this.checkoutArr = this.checkoutArr.map((obj: any) => {
        if (obj.ProductId == item.ProductId) {
          let qty = item.addedQty + 1;
          return { ...obj, addedQty: qty };
        }
        return obj;
      });
    }

    // console.log(this.checkoutArr)
  }

  RemoveUpdate(item : any){
    this.ProductList = this.ProductList.map((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        let qty = item.addedQty - 1;
        return { ...obj, addedQty: qty };
      }
      return obj;
    });

    if(item.addedQty > 1){
      this.checkoutArr = this.checkoutArr.map((obj: any) => {
        if (obj.ProductId == item.ProductId) {
          let qty = item.addedQty - 1;
          return { ...obj, addedQty: qty };
        }
        return obj;
      });
    }else{
      this.checkoutArr = this.checkoutArr.filter((d: any) => d.ProductId !== item.ProductId);
    }

    // console.log(this.checkoutArr);
  }

  proceed(){
    this.byagainOrder.emit(this.checkoutArr);
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
