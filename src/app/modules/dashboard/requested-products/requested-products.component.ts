import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-requested-products',
  templateUrl: './requested-products.component.html',
  styleUrl: './requested-products.component.scss'
})
export class RequestedProductsComponent implements OnInit {

  requestedList: any = [];
  inStockList: any = [];
  displayList: any = [];
  addedInCart: any = [];
  alternativeItems: any = [];
  isloading: boolean = false;
  selectedTab: any = 'requested';
  requestPage: any = 1;
  inStockPage: any = 1;
  RecordPerPage: any = 15;
  totalInStock: any = 0;
  totalRequested: any = 0;
  typingTimer: any = 0;
  searchTxt: any = '';
  RequestItem: any = '';
  ProductListKey: any = [];

  @Output() newItemEvent = new EventEmitter<any>();
  @ViewChild('alterItemsMod') alterItemsMod: any;

  constructor(private orderService: OrderService, private authService: AuthService, private dbService: NgxIndexedDBService, private spinner: NgxSpinnerService, public CommonService: CommonService, private webengageService: WebEngageService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getAllRecord();
    this.getRequestedProduct();
    this.getInstockProduct();
  }

  // getRequestedProduct(){
  //   this.spinner.show();
  //   this.isloading = true;
  //   // this.orderService.getRequestedProducts('customers/request_product/getRequestList').subscribe((data: any) => {
  //   this.orderService.getRequestedProducts('webapi/request_product/getRequestList').subscribe((data: any) => {
  //     // console.log(data);
  //     if(data){
  //       this.requestedList = data['result']['rs']['feedbackList'];
  //       this.isloading = false;
  //       this.spinner.hide();
  //     }else{
  //       this.requestedList = [];
  //       this.isloading = false;
  //       this.spinner.hide();
  //     }
  //   })
  // }

  getAllRecord() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      this.addedInCart = res;
    });
  }

  getRequestedProduct() {
    this.spinner.show();
    this.isloading = true;

    let fd = new FormData();
    fd.append('PageNumber', this.requestPage);
    fd.append('RecordPerPage', this.RecordPerPage);

    this.orderService.getRequestedProducts('webapi/request_product/getProductRequestList', fd).subscribe((res: any) => {
      // console.log(res);
      if (res && res['result']['rs']['feedbackList']['status'] == 2000) {
        let tempList = res['result']['rs']['feedbackList']['data']['Response']['Lists'];
        this.totalRequested = res['result']['rs']['feedbackList']['data']['Response']['TotalRecords'];
        if (tempList.length > 0) {
          // this.requestedList.push(tempList);
          this.requestedList = [...this.requestedList, ...tempList]
        }
        this.displayList = this.requestedList;
        this.isloading = false;
        this.spinner.hide();
      } else {
        this.requestedList = [];
        this.displayList = [];
        this.isloading = false;
        this.spinner.hide();
      }
    })
  }

  getInstockProduct() {
    this.spinner.show();
    this.isloading = true;

    let fd = new FormData();
    fd.append('PageNumber', this.inStockPage);
    fd.append('RecordPerPage', this.RecordPerPage);

    this.orderService.getRequestedProducts('webapi/request_product/getProductInStockList', fd).subscribe((res: any) => {
      // console.log(res);
      if (res && res['result']['rs']['feedbackList']['status'] == 2000) {
        // this.inStockList = res['result']['rs']['feedbackList']['data']['Response']['Lists'];
        let List = res['result']['rs']['feedbackList']['data']['Response']['Lists'];
        this.totalInStock = res['result']['rs']['feedbackList']['data']['Response']['TotalRecords'];
        if (List.length > 0) {
          this.setList(List)
        } else {
          this.isloading = false;
          this.spinner.hide();
        }

      } else {
        this.inStockList = [];
        this.isloading = false;
        this.spinner.hide();
      }
    })

  }

  setList(list: any) {
    list.forEach((elm: any) => {
      elm.addedQty = 0;
      if (this.addedInCart.length > 0) {
        this.addedInCart.forEach((item: any) => {
          if (elm.ProductId == item.ProductId) {
            elm.addedQty = item.ProductCount;
          }
        });
      }
    });
    this.inStockList = [...this.inStockList, ...list];
    if (this.selectedTab == 'instock') {
      this.displayList = this.inStockList;
    }
    this.isloading = false;
    this.spinner.hide();
  }

  showTab(tab: any) {
    this.selectedTab = tab;
    this.searchTxt = '';
    if (tab == 'requested') {
      this.displayList = this.requestedList;
    } else if (tab == 'instock') {
      this.displayList = this.inStockList;
    }
  }

  loadMoreRequest() {
    this.requestPage = this.requestPage + 1;
    this.getRequestedProduct();
  }

  loadMoreInstock() {
    this.inStockPage = this.inStockPage + 1;
    this.getInstockProduct();
  }

  addToCart(productObj: any, ProductQty: any) {
    let productId = productObj.ProductId;
    let LotId = 0;
    let CPId = 0;

    let tmp = {
      id: productId + '_' + CPId + '_' + LotId,
      ProductId: parseInt(productId),
      ProductName: productObj.ProductName,
      CustProductName: '',
      InteractiveHealthProfileId: '',
      DosageRestriction: productObj.DosageRestriction,
      OfferPrice: productObj.OfferPrice,
      ProductCount: ProductQty,
      ItemVal: productObj.OfferPrice,
      SSCurrencyValue: ".00",
      Iscourierable: productObj.IsCourierable,
      ProductImage: productObj.ProductImage,
      ProductPrice: productObj.Mrp,
      // IsGiftProduct: productObj[this.getKeyIndex("IsGiftableProduct")],
      PrescriptionOTC: productObj.ProductType,
      WarehouseId: this.authService.WHId,
      CPId: 0,
      MyFamilyId: 0,
      PKLotId: parseInt(productObj.PKLotId),
      MfgGroup: productObj.MfgGroup,
      ExpiryDate: productObj.ExpiryDate,
      ProductInteractiveModule: productObj.InteractiveModule,
      ProductInteractiveSubModule: productObj.InteractiveSubModule,
      IsNonReturnable: productObj.IsNonReturnable,
      RefOrderId: 0,
      Brand: '',
      DiscountPercent: productObj.DiscountPercent
    };

    // this.getContraIndecatedSaltAgainstCart(productId , productObj.DisplayName)

    this.dbService.add('cartItems', tmp).subscribe((res: any) => {
      // this.newItemEvent.emit();
      this.CommonService.sendClickEvent();
      this.getAllRecord();
      if (this.selectedTab == 'requested') {
        this.updateAlternativeList(tmp)
      } else {
        this.updateInstockList(tmp)
      }
      this.addProductWebEngage(tmp, tmp['ProductCount'])
    })
  }

  cartAddPlus(productObj: any) {
    let pro_id = productObj.ProductId;
    let id = `${pro_id}_0_0`;
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      let qty = item['ProductCount'];
      if (item['DosageRestriction'] == 0 || (item['DosageRestriction'] != 0 && item['DosageRestriction'] > qty)) {
        const updatedItem = { ...item, 'ProductCount': item['ProductCount'] + 1 }
        this.updateCart(updatedItem);
        // this.updateInstockList(productObj);
      } else {
        alert(`You can order maximum ${item['DosageRestriction']} quantity`);
        // this.alertMsg = `You can order maximum ${item['DosageRestriction']} quantity`;
        // this.headerModal.nativeElement.click();
      }
    });
  }

  cartAddMinus(productObj: any) {
    let pro_id = productObj.ProductId;
    let id = `${pro_id}_0_0`;
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      let qty = item['ProductCount'];
      if (qty > 1) {
        const updatedItem = { ...item, 'ProductCount': item['ProductCount'] - 1 };
        this.updateCart(updatedItem);
      } else {
        this.deleteById(pro_id);
      }
    });
  }

  updateCart(obj: any) {
    this.dbService.update('cartItems', obj).subscribe((res: any) => {
      // console.log('storeData: ', res);
      if (res) {
        this.getAllRecord();
        if (this.selectedTab == 'requested') {
          this.updateAlternativeList(obj)
        } else {
          this.updateInstockList(obj)
        }
      }
    });
  }

  updateInstockList(item: any) {
    this.inStockList = this.inStockList.map((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        let qty = item.ProductCount;
        return { ...obj, addedQty: qty };
      }
      return obj;
    });
    this.displayList = this.inStockList;
  }

  deleteById(pro_id: any) {
    let id = `${pro_id}_0_0`;
    let item = this.addedInCart.find((prd:any) => prd.ProductId == pro_id);
    this.dbService.deleteByKey('cartItems', id).subscribe((status: any) => {
      if (status == true) {
        this.getAllRecord();
        if (this.selectedTab == 'requested') {
          this.alternativeItems = this.alternativeItems.map((obj: any) => {
            if (obj.ProductId == pro_id) {
              obj.addedQty = 0;
            }
            return obj;
          });
        } else {
          this.inStockList = this.inStockList.map((obj: any) => {
            if (obj.ProductId == pro_id) {
              obj.addedQty = 0;
            }
            return obj;
          });
        }
        this.CommonService.sendClickEvent();
        this.removeProductWebEngage(item)
      }
    });
  }

  // getAletnatives1(item: any) {
  //   let list: any = [];
  //   let id = item.ProductId;
  //   this.RequestItem = item;
  //   let url = `similar_products?product_id=${id}&wh=${this.authService.WHId}&panindia=${this.authService.IsPanIndia}&pincode=${this.authService.PinCode}`
  //   this.CommonService.getAlternativeList(url).subscribe((data: any) => {
  //     // console.log(data)

  //     if(data && data['items'].length >0){
  //       list = data['items'][0]['PreferredSubtitute'];
  //       if (list.length > 0) {
  //         list.forEach((elm: any) => {
  //           elm.addedQty = 0;
  //           elm.PrescriptionOTC = data['items'][0]['PrescriptionOTC'];
  //           elm.ProductId = elm.PreferredProductId;
  //           elm.Mrp = elm.MRP;
  //           elm.DosageRestriction = 0;
  //           elm.DiscountPercent = elm.CustDiscPercent;
  //           elm.OfferPrice = elm.CustOfferPrice;
  //           elm.PricePerUnit = elm.OfferPrice/elm.Size;
  
  //           if (this.addedInCart.length > 0) {
  //             this.addedInCart.forEach((item: any) => {
  //               if (elm.PreferredProductId == item.ProductId) {
  //                 elm.addedQty = item.ProductCount;
  //               }
  //             });
  //           }
  //         });
  //       }
  //     }
  //     this.alternativeItems = list;
  //     this.alterItemsMod.nativeElement.click();
  //   })
  // }

  updateAlternativeList(item: any) {
    this.alternativeItems = this.alternativeItems.map((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        let qty = item.ProductCount;
        return { ...obj, addedQty: qty };
      }
      return obj;
    });
  }

  resetAlter() {
    this.alternativeItems = [];
    this.RequestItem = '';
  }


  onSearchChange(evnt: any) {
    let str = evnt.target.value;
    clearTimeout(this.typingTimer);
    if (str.length > 2) {
      this.searchTxt = str;
      this.typingTimer = setTimeout(() => {
        this.doneTyping();
      }, 500);
    } else {
      if (this.selectedTab == 'requested') {
        this.displayList = this.requestedList;
      } else if (this.selectedTab == 'instock') {
        this.displayList = this.inStockList;
      }
    }
  };

  doneTyping() {
    if (this.selectedTab == 'requested') {
      this.displayList = this.requestedList.filter((product: any) =>
        product.ProductName.includes(this.searchTxt)
      );
    } else if (this.selectedTab == 'instock') {
      this.displayList = this.inStockList.filter((product: any) =>
        product.ProductName.includes(this.searchTxt)
      );
    }
  }

  onKeydown() {
    clearTimeout(this.typingTimer);
  }


  getAletnatives(item: any) {
    console.log('getAlternative',item);
    this.spinner.show();
    let list: any = [];
    let id = item.ProductId;
    this.RequestItem = item;

    let url = `similar_products?product_id=${id}&wh=${this.authService.WHId}&panindia=${this.authService.IsPanIndia}&pincode=${this.authService.PinCode}`;

    this.CommonService.getAlternativeList(url).subscribe((data: any) => {
      if(data['products'].length > 0) {
        // this.emptyResult = false;
        // this.searchResult = true;
        data['keys'].push('addedQty');

        this.ProductListKey = data['keys'];

        data['products'].forEach((productObj: any) => {
          let obj = {
            ProductId: productObj[this.getKeyIndex('ProductId')],
            ProductName: productObj[this.getKeyIndex("DisplayName")],
            CustProductName: '',
            InteractiveHealthProfileId: '',
            DosageRestriction: productObj[this.getKeyIndex("DosageRestriction")],
            OfferPrice: productObj[this.getKeyIndex("OfferPrice")],
            ItemVal: productObj[this.getKeyIndex("OfferPrice")],
            SSCurrencyValue: ".00",
            Iscourierable: productObj[this.getKeyIndex("IsCourierable")],
            ProductImage: productObj[this.getKeyIndex("ProductImage")],
            Mrp: productObj[this.getKeyIndex("MRP")],
            // IsGiftProduct: productObj[this.getKeyIndex("IsGiftableProduct")],
            PrescriptionOTC: productObj[this.getKeyIndex("PrescriptionOTC")],
            WarehouseId: this.authService.WHId,
            CPId: 0,
            MyFamilyId: 0,
            PKLotId: parseInt(productObj[this.getKeyIndex("PKLotId")]),
            MfgGroup: productObj[this.getKeyIndex("MfgGroup")],
            ExpiryDate: productObj[this.getKeyIndex("ExpiryDate")],
            ProductInteractiveModule: productObj[this.getKeyIndex("InteractiveModule")],
            ProductInteractiveSubModule: productObj[this.getKeyIndex("InteractiveSubModule")],
            IsNonReturnable: productObj[this.getKeyIndex("IsNonReturnable")],
            IsOutOfStock: productObj[this.getKeyIndex("IsOutOfStock")],
            RefOrderId: 0,
            Brand: productObj[this.getKeyIndex("Brand")],
            DiscountPercent: productObj[this.getKeyIndex('DiscountPercent')],
            addedQty : 0
          }

          // console.log('pID', elm[pID])
          this.addedInCart.forEach((item: any) => {
            if(obj.ProductId == item.ProductId){                
              obj.addedQty = item.ProductCount;
            }             
          });

          list.push(obj);          
        });
        // console.log(list);
        this.alternativeItems = list;
        this.alterItemsMod.nativeElement.click();
        this.spinner.hide();
    
      }else {
        this.alternativeItems = [];
        this.alterItemsMod.nativeElement.click();
        this.spinner.hide();
      }
    })
  }

  getKeyIndex(key: any) {
    let indexval = this.ProductListKey.indexOf(key);
    return indexval;
  }

  addProductWebEngage(data: any, Qty: any){
    let returnable : boolean= false;
    if(data.IsNonReturnable == 0){
      returnable = true;
    }else{
      returnable = false;
    }
    let dscPrcnt = `${data.DiscountPercent}%`;
    let webData = {
      'Product Name': data.ProductName,
      'Brand': data.MfgGroup? data.MfgGroup :'',
      'Returnable': returnable,
      'Product Expiry Date': data.ExpiryDate,
      'Delivery Pincode': this.authService.PinCode,
      'Variant Selected': '',
      'Quantity': Qty,
      'Retail Price': data.OfferPrice,
      'Discount Percentage': dscPrcnt,
      'Price': data.ProductPrice,
      'Image': data.ProductImage? data.ProductImage :'',
    }
    this.webengageService.trackEvent('Product Added To Cart', webData);
  }

  removeProductWebEngage(data: any){

    let returnable : boolean= false;
    if(data.IsNonReturnable == 0){
      returnable = true;
    }else{
      returnable = false;
    }
    let dscPrcnt = `${data.DiscountPercent}%`;
    let webData = {
      'Product Name': data.ProductName,
      'Brand': data.MfgGroup,
      'Returnable': returnable,
      'Product Expiry Date': data.ExpiryDate,
      'Delivery Pincode': this.authService.PinCode,
      'Variant Selected': '',
      'Quantity': data.ProductCount,
      'Retail Price': data.OfferPrice,
      'Discount Percentage': dscPrcnt,
      'Price': data.ProductPrice,
      'Image': data.ProductImage,
    }
    this.webengageService.trackEvent('Product Removed From Cart', webData);
  }

}
