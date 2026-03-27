import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-buy-again',
  templateUrl: './buy-again.component.html',
  styleUrl: './buy-again.component.scss'
})
export class BuyAgainComponent implements OnInit {

  constructor(
    public CommonService: CommonService, 
    private orderService : OrderService, 
    private authService: AuthService, 
    private dbService: NgxIndexedDBService,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService
  ){}

  buyAgainList : any= [];
  selectedTab: any = 'patient';
  respMsg: any = '';
  isResp: boolean = false; 

  @ViewChild('buyagainModal') buyagainModal: any;
  // @Output() newItemEvent = new EventEmitter<any>();

  ngOnInit(): void {
    this.isResp = false;
    this.recenrOrders();
  }

  recenrOrders(){
    this.spinner.show();
    this.buyAgainList = []; 
    this.orderService.getBuyAgainList('webapi/order/reOrderList').subscribe((res: any) => {
    //   console.log('reorder list', res);
      if(res && res['response_code']==0){
        this.buyAgainList.push(res);
        this.isResp = true;
        this.spinner.hide();
      }else{
        this.isResp = true;
        this.spinner.hide();
      }
    })
  }

  showTab(tab: any){
    this.selectedTab = tab;
  }


  proceed_buyAgain(evnt: any){
    let reorderItems : any = evnt;
    // console.log('checkout', reorderItems);
    // debugger
    this.spinner.show();
    this.dbService.clear('cartItems').subscribe((res: any) => {
      // console.log(res);
      if (res == true) {
        reorderItems.forEach((productObj: any) => {

          let productId = productObj.ProductId;
          let LotId = 0;
          let CPId = 0;

          let tmp = {
            id: productId + '_' + CPId + '_' + LotId,
            ProductId: parseInt(productId),
            ProductName: productObj.DisplayName,
            CustProductName: '',
            InteractiveHealthProfileId: '',
            DosageRestriction: productObj.DosageRestriction,
            OfferPrice: productObj.OfferPrice,
            ProductCount: productObj.addedQty,
            ItemVal: productObj.OfferPrice,
            SSCurrencyValue: ".00",
            Iscourierable: productObj.IsCourierable,
            ProductImage: productObj.ProductImage,
            ProductPrice: productObj.MRP,
            // IsGiftProduct: productObj[this.getKeyIndex("IsGiftableProduct")],
            PrescriptionOTC: productObj.PrescriptionOTC,
            WarehouseId: this.authService.WHId,
            CPId: 0,
            MyFamilyId: 0,
            PKLotId: LotId,
            MfgGroup: productObj.MfgGroup,
            ExpiryDate: productObj.ExpiryDate,
            ProductInteractiveModule: '',
            ProductInteractiveSubModule: '',
            IsNonReturnable: '',
            RefOrderId: productObj.RefOrderId,
            Brand: productObj.Brand,
            DiscountPercent: productObj.DiscountPercent
          };

          this.dbService.add('cartItems', tmp).subscribe((res: any) => {
            // console.log('Record added successfully.', res);
          });

        });
        let d: Date = new Date();
        this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
        window.location.href=this.CommonService.baseurl +"customercart";
      }else{
        this.spinner.hide();
        alert('something went wrong')
      }
    })
  }

}