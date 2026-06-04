import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

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


  // proceed_buyAgain_bkp_040626(evnt: any){
  //   let reorderItems : any = evnt;
  //   // console.log('checkout', reorderItems);
  //   // debugger
  //   this.spinner.show();
  //   this.dbService.clear('cartItems').subscribe((res: any) => {
  //     // console.log(res);
  //     if (res == true) {
  //       reorderItems.forEach((productObj: any) => {

  //         let productId = productObj.ProductId;
  //         let LotId = 0;
  //         let CPId = 0;

  //         let tmp = {
  //           id: productId + '_' + CPId + '_' + LotId,
  //           ProductId: parseInt(productId),
  //           ProductName: productObj.DisplayName,
  //           CustProductName: '',
  //           InteractiveHealthProfileId: '',
  //           DosageRestriction: productObj.DosageRestriction,
  //           OfferPrice: productObj.OfferPrice,
  //           ProductCount: productObj.addedQty,
  //           ItemVal: productObj.OfferPrice,
  //           SSCurrencyValue: ".00",
  //           Iscourierable: productObj.IsCourierable,
  //           ProductImage: productObj.ProductImage,
  //           ProductPrice: productObj.MRP,
  //           // IsGiftProduct: productObj[this.getKeyIndex("IsGiftableProduct")],
  //           PrescriptionOTC: productObj.PrescriptionOTC,
  //           WarehouseId: this.authService.WHId,
  //           CPId: 0,
  //           MyFamilyId: 0,
  //           PKLotId: LotId,
  //           MfgGroup: productObj.MfgGroup,
  //           ExpiryDate: productObj.ExpiryDate,
  //           ProductInteractiveModule: '',
  //           ProductInteractiveSubModule: '',
  //           IsNonReturnable: '',
  //           RefOrderId: productObj.RefOrderId,
  //           Brand: productObj.Brand,
  //           DiscountPercent: productObj.DiscountPercent
  //         };

  //         this.dbService.add('cartItems', tmp).subscribe((res: any) => {
  //           // console.log('Record added successfully.', res);
  //         });

  //       });
  //       let d: Date = new Date();
  //       this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
  //       window.location.href=this.CommonService.baseurl +"customercart";
  //     }else{
  //       this.spinner.hide();
  //       alert('something went wrong')
  //     }
  //   })
  // }

  proceed_buyAgain(evnt: any) {
    let reorderItems: any = evnt;
    console.log('reorderItems', reorderItems);
    console.log('indexDB', this.dbService);

    this.spinner.show();

    // Build all upsert observables
    const upsertObservables = reorderItems.map((productObj: any) => {
      let productId = productObj.ProductId;
      let LotId = 0;
      let CPId = 0;

      const tmp = {
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

      // For each product: check if exists → update or add
      return this.dbService.getByIndex<any>('cartItems', 'ProductId_idx', parseInt(productId))
        .pipe(
          switchMap((existingItem: any) => {
            if (existingItem) {
              //  Product exists → update, preserve IDB primary key
              const updatedItem = {
                ...existingItem,   // keep existing fields + IDB key
                ...tmp,            // overwrite with new Buy Again values
                id: existingItem.id  // preserve primary key (autoIncrement id)
              };
              console.log('Updating existing cart item:', updatedItem);
              return this.dbService.update<any>('cartItems', updatedItem);
            } else {
              // Product not in cart → add fresh
              console.log('Adding new cart item:', tmp);
              return this.dbService.add<any>('cartItems', tmp);
            }
          }),
          catchError((err) => {
            console.error('Upsert failed for ProductId:', productId, err);
            return of(null); // don't break forkJoin if one fails
          })
        );
    });

    // Wait for ALL upserts to complete, then redirect
    forkJoin(upsertObservables).subscribe({
      next: (results: any) => {
        console.log('All cart items processed:', results);
        let d: Date = new Date();
        this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
        window.location.href = this.CommonService.baseurl + "customercart";
      },
      error: (err) => {
        console.error('Cart update failed:', err);
        this.spinner.hide();
        alert('Something went wrong');
      }
    });
  }

}