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
  loyaltyConfig:any [] = this.authService.LoyaltyConfigData.LoyaltyConfig;

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
      res = {"data":{"PatientmedorderList":[{"MyFamilyId":744983,"PatientName":"","LastOrderId":101002687578,"LastOrderLatestDate":"2026-04-01 00:00:00","ItemList":[{"OrderId":101002687578,"OrderType":"P","OrderDate":"2026-04-01 00:00:00","CustUserId":738341,"ItemQuantity":1,"MyFamilyId":744983,"ProductId":12936,"SltProdCategory":null,"SourceProductId":10012904,"IsPrescriptionUploaded":0,"PatientName":"","PrescriptionOTC":"P","MRP":52.5,"DisplayName":"Cal 360 Tab (10 Tab)","ProductName":"Cal 360","ProductImage":"","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101002687578,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":0,"IsOutOfStock":"N","DiscountPercent":15,"OfferPrice":44.63,"EncodeProdId":"sx6r74","CustomProductName":"","Brand":"Cipla Ltd","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2030-01-01","Salts":{"NameSearch":"calcium carbonate + minerals","SaltStrengthRaw":"","SaltSchedule":"","SaltStrength":"CALCIUMCARBONATEMINERALSTAB","Id":2046,"Code":"SN02117","Name":"CALCIUM CARBONATE + MINERALS","SaltCategory":""},"MfgGroup":"CIPLA LTD"}],"ItemListOFS":[]}],"otcHouseHoldList":[],"orderIDList":[{"OrderId":101002687578,"ItemList":[{"OrderId":101002687578,"OrderType":"P","OrderDate":"2026-04-01 00:00:00","CustUserId":738341,"ItemQuantity":1,"MyFamilyId":744983,"ProductId":12936,"SltProdCategory":null,"SourceProductId":10012904,"IsPrescriptionUploaded":0,"PatientName":"","PrescriptionOTC":"P","MRP":52.5,"DisplayName":"Cal 360 Tab (10 Tab)","ProductName":"Cal 360","ProductImage":"","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101002687578,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":0,"IsOutOfStock":"N","DiscountPercent":15,"OfferPrice":44.63,"EncodeProdId":"sx6r74","CustomProductName":"","Brand":"Cipla Ltd","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2030-01-01","Salts":{"NameSearch":"calcium carbonate + minerals","SaltStrengthRaw":"","SaltSchedule":"","SaltStrength":"CALCIUMCARBONATEMINERALSTAB","Id":2046,"Code":"SN02117","Name":"CALCIUM CARBONATE + MINERALS","SaltCategory":""},"MfgGroup":"CIPLA LTD"}]}],"ProductList":[{"OrderId":101002687578,"OrderType":"P","OrderDate":"2026-04-01 00:00:00","CustUserId":738341,"ItemQuantity":1,"MyFamilyId":744983,"ProductId":12936,"SltProdCategory":null,"SourceProductId":10012904,"IsPrescriptionUploaded":0,"PatientName":"","PrescriptionOTC":"P","MRP":52.5,"DisplayName":"Cal 360 Tab (10 Tab)","ProductName":"Cal 360","ProductImage":"","DosageAlert":0,"DosageRestriction":0,"RefOrderId":101002687578,"ProductStatus":"C","IsGiftableProduct":0,"IsCourierable":0,"IsOutOfStock":"N","DiscountPercent":15,"OfferPrice":44.63,"EncodeProdId":"sx6r74","CustomProductName":"","Brand":"Cipla Ltd","LastMRP":null,"AvgRating":0,"NumRating":0,"ExpiryDate":"2030-01-01","Salts":{"NameSearch":"calcium carbonate + minerals","SaltStrengthRaw":"","SaltSchedule":"","SaltStrength":"CALCIUMCARBONATEMINERALSTAB","Id":2046,"Code":"SN02117","Name":"CALCIUM CARBONATE + MINERALS","SaltCategory":""},"MfgGroup":"CIPLA LTD"}]},"message":null,"response_code":0}
      console.log("buyAgainList",res);
      if(res && res['response_code']==0){
        // needs to query each product to find their type for loyalty balance purpose
        let productList:any = res.data.ProductList;
        console.log("productList",productList);
        let productIds:any = productList.map((item:any)=>{
          return item.ProductId
        }).join("|");
        console.log("productIds",productIds);
        let url = `product_find?product_id=${productIds}&wh=${this.authService.WHId}&token=${this.authService.Token}&panindia=${this.authService.IsPanIndia}&pincode=${this.authService.PinCode}`
        this.authService.getProductDetails(url).subscribe((response: any) => {
          console.log("getProductDetails",response);
          if(response.items.length > 0){
            const enriched = this.addProductFlagsToOrder(res,response.items,this.loyaltyConfig);
            console.log("buyAgainList enriched",enriched);
            // console.log('loyalty',this.authService.LoyaltyConfigData);
            this.buyAgainList.push(enriched);
          }
          else{
            this.buyAgainList.push(res);
          }
        })
        
        //end
        
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

  addProductFlagsToOrder_bkp(order: any, masterProducts: any[]): any {
  const masterById = new Map<string, any>(
    masterProducts.map(p => [String(p.ProductId), p])
  );

  const enrichItem = (item: any) => {
    const master = masterById.get(String(item.ProductId));
    if (!master) return item;

    return {
      ...item,
      IsOwnProduct: master.IsOwnProduct,
      IsGenericNew: master.IsGenericNew
    };
  };

  const data = order.data;

  return {
    ...order,
    data: {
      ...data,
      PatientmedorderList: data.PatientmedorderList.map((pat: any) => ({
        ...pat,
        ItemList: pat.ItemList.map(enrichItem)
      })),
      orderIDList: data.orderIDList.map((o: any) => ({
        ...o,
        ItemList: o.ItemList.map(enrichItem)
      })),
      ProductList: data.ProductList.map(enrichItem)
    }
  };
  }

  addProductFlagsToOrder(order: any, masterProducts: any, loyaltyConfig: any): any {
    const masterArray: any[] = Array.isArray(masterProducts)
      ? masterProducts
      : Array.isArray(masterProducts?.data)
        ? masterProducts.data
        : [];

    if (masterArray.length === 0) {
      console.warn('addProductFlagsToOrder: master product list is empty or invalid', masterProducts);
      return order;
    }

    const masterById = new Map<string, any>(
      masterArray.map((p): [string, any] => [String(p.ProductId), p])
    );

    // API values may be booleans, 0/1, or strings
    const isTrue = (v: any): boolean => v === true || v === 1 || v === '1' || v === 'true';

    // Numeric values may come as strings
    const toNum = (v: any): number => {
      const n = parseFloat(v);
      return isNaN(n) ? 0 : n;
    };

    // Priority: own product -> generic -> branded (P) -> OTC
    const getPercentage = (master: any, item: any): number => {
      if (isTrue(master.IsOwnProduct)) {
        return toNum(loyaltyConfig.jito_percentage);
      }
      if (isTrue(master.IsGenericNew)) {
        return toNum(loyaltyConfig.gereric_percentage); // key spelled as in the API
      }
      if (item.PrescriptionOTC === 'P') {
        return toNum(loyaltyConfig.branded_percentage);
      }
      return toNum(loyaltyConfig.otc_percentage);
    };

    // Use OfferPrice; fall back to MRP if OfferPrice is null, undefined, or empty
    const getBasePrice = (item: any): number => {
      const hasOffer = item.OfferPrice !== null && item.OfferPrice !== undefined && item.OfferPrice !== '';
      return toNum(hasOffer ? item.OfferPrice : item.MRP);
    };

    const enrichItem = (item: any) => {
      const master = masterById.get(String(item.ProductId));
      if (!master) return item;

      const percentage = getPercentage(master, item);
      const basePrice = getBasePrice(item);
      // const pointValue = toNum(loyaltyConfig.point_value);

      // points = price × percentage / 100 × point value, rounded to 2 decimals
      // const loyaltyPoints = Math.round((basePrice * percentage / 100) * pointValue * 100) / 100;
      const loyaltyPoints = Math.round((basePrice * percentage)/100)

      return {
        ...item,
        IsOwnProduct: master.IsOwnProduct,
        IsGenericNew: master.IsGenericNew,
        LoyaltyPointValue: loyaltyPoints
      };
    };

    const data = order.data;

    return {
      ...order,
      data: {
        ...data,
        PatientmedorderList: data.PatientmedorderList.map((pat: any) => ({
          ...pat,
          ItemList: pat.ItemList.map(enrichItem)
        })),
        orderIDList: data.orderIDList.map((o: any) => ({
          ...o,
          ItemList: o.ItemList.map(enrichItem)
        })),
        ProductList: data.ProductList.map(enrichItem)
      }
    };
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
    // debugger;
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