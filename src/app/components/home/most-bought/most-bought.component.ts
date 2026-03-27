import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { WebEngageService } from '../../../services/web-engage.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-most-bought',
  templateUrl: './most-bought.component.html',
  styleUrl: './most-bought.component.scss'
})
export class MostBoughtComponent implements OnInit {

  addedInCart: any = [];
  @Input() mstBgt: any = [];
  @Output() viewSimilar = new EventEmitter<any>();
  addEvntScription!: Subscription;

  constructor(
    private avtiveRoute: ActivatedRoute,
    public authService: AuthService,
    public CommonService: CommonService,
    private dbService: NgxIndexedDBService,
    private webengageService: WebEngageService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.addEvntScription = this.CommonService.getClickEvent().subscribe(() => {
      this.updatefromSearch();

    })
  }

  customOptions: OwlOptions = {
    autoWidth: true,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    lazyLoad: true,
    nav: true,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-chevron-left fs-18 pt-1 px-1"></i>', '<i class="fa-solid fa-chevron-right fs-18 pt-1 px-1"></i>'],
    responsive: {
      0: {
        items: 4
      },
      // 1024: {
      //   items: 4
      // },
      1280: {
        items: 5
      },
      1440: {
        items: 6
      },
      1600: {
        items: 7
      },
      1900: {
        items: 8
      },
    },
  }


  ngOnInit(): void {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      if (res) {
        this.addedInCart = res;
        this.getProductsDetails()
      }
    });

  }


  getAllRecord() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      this.addedInCart = res;
    });
  }

  getProductsDetails() {
    // let timenow = new Date().getTime();
    if (this.mstBgt.length > 0) {
      this.mstBgt.forEach((elm: any) => {
        elm.addedQty = 0
        this.addedInCart.forEach((item: any) => {
          if (parseInt(elm.ProductId) == item.ProductId) {
            elm.addedQty = item.ProductCount;
          }
        });
        this.spinner.hide();
      })
    } else {
      this.mstBgt = [];
      // this.isLoading = false;
      this.spinner.hide();
    }
    // console.log(this.mstBgt)
  }


  addToCart(productObj: any, ProductQty: any) {
    // console.log(productObj, ProductQty);
    let productId = productObj.ProductId;
    // let LotId = parseInt(productObj.PKLotId);
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
      ProductCount: parseInt(ProductQty),
      ItemVal: productObj.OfferPrice,
      SSCurrencyValue: ".00",
      Iscourierable: productObj.IsCourierable,
      ProductImage: productObj.ProductImage,
      ProductPrice: productObj.MRP,
      // IsGiftProduct: productObj.IsGiftableProduct,
      PrescriptionOTC: productObj.PrescriptionOTC,
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
      Brand: productObj.Brand,
      DiscountPercent: productObj.Discountpercentage
    };

    // this.getContraIndecatedSaltAgainstCart(productId , productObj.DisplayName)

    this.dbService.add('cartItems', tmp).subscribe((res: any) => {
      // console.log('Record added successfully.', res);
      // this.newItemEvent.emit();
      this.CommonService.sendClickEvent();
      // let objdata = { 'dts': tmp, 'type': 'update' };
      // this.CommonService.AClicked(JSON.stringify(objdata))
      this.getAllRecord();
      this.updatemostBought(tmp)
    });

    this.addProductWebEngage(tmp, tmp['ProductCount'])

  }

  cartAddPlus(productObj: any) {
    let pro_id = productObj.ProductId;
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      if (item['DosageRestriction'] == 0 || (item['DosageRestriction'] != 0 && item['DosageRestriction'] > qty)) {
        const updatedItem = { ...item, 'ProductCount': item['ProductCount'] + 1 }
        // console.log(updatedItem);
        this.updateById(updatedItem)
      } else {
        // alert('max limit reached');
        alert(`You can order maximum ${item['DosageRestriction']} quantity`);
        // this.headerModal.nativeElement.click();
      }
    });
  }

  cartAddMinus(productObj: any) {
    let pro_id = productObj.ProductId;
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      if (qty > 1) {
        const updatedItem = { ...item, 'ProductCount': item['ProductCount'] - 1 };
        // console.log(updatedItem);
        this.updateById(updatedItem)
      } else {
        // alert('remove');
        this.deleteById(pro_id);
      }
    });
  }

  updateById(tmp: any) {
    this.dbService.update('cartItems', tmp).subscribe((res: any) => {
      // console.log('storeData: ', res);
      if (res) {
        this.getAllRecord();
        // let objdata = { 'dts': tmp, 'type': 'update' };
        // this.CommonService.AClicked(JSON.stringify(objdata))
        this.updatemostBought(tmp)
      }
    });
  }

  updatemostBought(tmp: any) {
    this.mstBgt = this.mstBgt.map((obj: any) => {
      if (obj.ProductId == tmp.ProductId) {
        obj.addedQty = tmp.ProductCount;
      } 
      // else {
      //   if (obj.PreferredSubtitute.length > 0) {
      //     obj.PreferredSubtitute = obj.PreferredSubtitute.map((obj1: any) => {
      //       if (obj1.PreferredProductId == tmp.ProductId) {
      //         obj1.addedQty = tmp.ProductCount;
      //       }
      //       return obj1;
      //     });
      //   }
      // }
      return obj;
    });
  }

  deleteById(pro_id: any) {
    let id = `${pro_id}_0_0`;
    let item = this.addedInCart.find((prd: any) => prd.ProductId == pro_id);
    this.dbService.deleteByKey('cartItems', id).subscribe((status: any) => {
      // console.log('Deleted?:', status);
      this.removeProductWebEngage(item)
      if (status == true) {
        this.getAllRecord();
        // let objdata = { 'dts': pro_id, 'type': 'del' };
        // this.CommonService.AClicked(JSON.stringify(objdata))
        this.mstBgt = this.mstBgt.map((obj: any) => {
          if (obj.ProductId == pro_id) {
            obj.addedQty = 0;
          } 
          // else {
          //   if (obj.PreferredSubtitute.length > 0) {
          //     obj.PreferredSubtitute = obj.PreferredSubtitute.map((obj1: any) => {
          //       if (obj1.PreferredProductId == pro_id) {
          //         obj1.addedQty = 0;
          //       }
          //       return obj1;
          //     });
          //   }
          // }
          return obj;
        });
        // this.newItemEvent.emit();
        this.CommonService.sendClickEvent();
      } else {
        // alert('some thing went wrong')
      }
    });
  }

  // loadMore() {
  //   if (this.totalcount > this.mstBgt.length) {
  //     this.pageNo = this.pageNo + 1;
  //     this.getProductsDetails();
  //   }
  // }

  requestNotify(item: any) {
    // console.log(item);
    let fd = new FormData();
    fd.append('ProductId', item.ProductId);
    fd.append('ProductName', item.DisplayName);
    fd.append('ProductType', item.PrescriptionOTC);
    fd.append('RequestSource', 'S');
    // fd.append('DeviceId', '');
    // fd.append('AppType', '');
    // fd.append('AppVersion', '');


    this.CommonService.requestNotify('webapi/request_product/productRequest', fd).subscribe((res: any) => {
      // console.log(res);      
      if (res && res.response_code == 0) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    })

  }

  updatefromSearch() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      this.addedInCart = res;
      // console.log(res)
      if (this.addedInCart.length > 0) {
        this.mstBgt.forEach((item: any) => {
          const match = this.addedInCart.find((elm: any) => parseInt(elm.ProductId) === parseInt(item.ProductId));
          if (match) {
            item.addedQty = match.ProductCount;
          } else {
            item.addedQty = 0;
          }
        });
      } else {
        this.mstBgt.forEach((elm: any) => {
          elm.addedQty = 0;
        })
      }
    });
  }

  viewProductDetails(encodedId: any, displayname: any, producttype: any) {
    let prod_name = '';
    let pLink = '';

    if (displayname != '' && displayname != null) {
      prod_name = this.CommonService.get_seo_url_string(displayname);
      pLink = prod_name + '-' + encodedId;
      if (prod_name != '' && pLink != '') {
        if (producttype == 'P') {
          this.router.navigate(['neworder-medicine/', pLink]);
        } else {
          this.router.navigate(['neworder-otc/', pLink]);
        }
      } else {
        this.router.navigate([''])
      }
    }
  }

  selectSimilar(item: any){
    this.viewSimilar.emit(item);
  }

  // ngOnDestroy(): void {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //   }
  //   if (this.categorySub) this.categorySub.unsubscribe();
  // }


  addProductWebEngage(data: any, Qty: any) {
    let returnable: boolean = false;
    if (data.IsNonReturnable == 0) {
      returnable = true;
    } else {
      returnable = false;
    }
    let dscPrcnt = `${data.DiscountPercent}%`;
    let webData = {
      'Product Name': data.ProductName,
      'Brand': data.MfgGroup ? data.MfgGroup : '',
      'Returnable': returnable,
      'Product Expiry Date': data.ExpiryDate,
      'Delivery Pincode': this.authService.PinCode,
      'Variant Selected': '',
      'Quantity': Qty,
      'Retail Price': data.OfferPrice,
      'Discount Percentage': dscPrcnt,
      'Price': data.ProductPrice,
      'Image': data.ProductImage ? data.ProductImage : '',
    }
    this.webengageService.trackEvent('Product Added To Cart', webData);
  }

  removeProductWebEngage(data: any) {

    let returnable: boolean = false;
    if (data.IsNonReturnable == 0) {
      returnable = true;
    } else {
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