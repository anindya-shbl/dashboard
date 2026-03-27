import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { WebEngageService } from '../../services/web-engage.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-brand-listing',
  templateUrl: './brand-listing.component.html',
  styleUrl: './brand-listing.component.scss'
})
export class BrandListingComponent implements OnInit {

  brandList: any = [];
  responseList: any = [];
  addedInCart: any = [];
  searchList: any = [];
  title: any = '';
  prdType: any = '';
  brndName: any = '';
  isLoading: boolean = false;
  subscription: Subscription;
  addEvntScription!: Subscription;

  constructor(
    private activeRoute: ActivatedRoute,
    public authService: AuthService,
    public CommonService: CommonService,
    private dbService: NgxIndexedDBService,
    private webengageService: WebEngageService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.pageLoad()
      }
    });
    this.addEvntScription = this.CommonService.getClickEvent().subscribe(() => {
      this.updatefromSearch();
    })
  }

  ngOnInit(): void {
  }

  pageLoad(): void {
    this.spinner.show();
    window.scrollTo(0, 0);
    this.brndName = this.activeRoute.snapshot.paramMap.get('brand');

    if (this.brndName != null && this.brndName != '' && this.brndName != undefined) {
      this.getAllRecord();
      this.gebrndList();
      this.getBrandProducts();
    } else {
      this.spinner.hide();
      // this.router.navigate(['/category/listing'])
    }
  }

  getAllRecord() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      this.addedInCart = res;
    });
  }


  gebrndList() {
    let listdata = {
      warehouseId: this.authService.WHId,
      PinCode: this.authService.PinCode,
      PanIndia: this.authService.IsPanIndia,
    }
    this.CommonService.postCatalogData('brand/getAllBrands', listdata).subscribe((data: any) => {
      if (data && data.msgcode == 1) {
        this.brandList = data.results.Brands
      }
      // console.log(data);

    })
    // console.log(this.categoryNow);
  }

  getBrandProducts() {
    this.isLoading = true;
    let timenow = new Date().getTime();
    let brand = this.brndName.replace(/-/g, " ");
    let url = `brand/getBrandProductListing/?brand=${brand}&panindia=${this, this.authService.IsPanIndia}&warehouseId=${this, this.authService.WHId}&pincode=${this, this.authService.PinCode}&_t=${timenow}`;
    this.CommonService.getCatalogData(url).subscribe((data: any) => {
      if (data && data.msgcode == 1) {
        this.responseList = data.results;
        this.title = data.title;
        this.prdType = this.responseList[0].ProductType;
        this.getProductsDetails(this.responseList[0])
      }
      // console.log(data);

    })
  }

  getProductsDetails(res: any) {
    this.searchList = [];
    // console.log(res);
    if (res) {
      let data: any = res.Products;
      if (data.length > 0) {
        data.forEach((elm: any) => {
          elm.addedQty = 0
          this.addedInCart.forEach((item: any) => {
            if (parseInt(elm.productId) == item.ProductId) {
              elm.addedQty = item.ProductCount;
            }
          });

          this.searchList.push(elm);
          this.isLoading = false;
          this.spinner.hide();
        })
        // this.categoryViewWebEngage();
        // console.log('searchList', this.searchList);
      } else {
        this.searchList = [];
        this.isLoading = false;
        this.spinner.hide();
      }
    }

  }

  onSortChange(event: any) {
    // console.log(event.target.value);
    this.prdType = event.target.value;

    let data = this.responseList.find((item: any) => item.ProductType == this.prdType);
    this.spinner.show();
    this.getProductsDetails(data)

  }


  addToCart(productObj: any, ProductQty: any) {
    // console.log(productObj, ProductQty);
    let productId = productObj.productId;
    // let LotId = parseInt(productObj.PKLotId);
    let LotId = 0;
    let CPId = 0;

    let tmp = {
      id: productId + '_' + CPId + '_' + LotId,
      ProductId: parseInt(productId),
      ProductName: productObj.displayname,
      CustProductName: '',
      InteractiveHealthProfileId: '',
      DosageRestriction: productObj.DosageRestriction ? productObj.DosageRestriction : 0,
      OfferPrice: productObj.offerprice,
      ProductCount: parseInt(ProductQty),
      ItemVal: productObj.offerprice,
      SSCurrencyValue: ".00",
      Iscourierable: productObj.isCourierable,
      ProductImage: productObj.productimage,
      ProductPrice: productObj.mrp,
      // IsGiftProduct: productObj.IsGiftableProduct,
      PrescriptionOTC: productObj.PrescriptionOTC,
      WarehouseId: this.authService.WHId,
      CPId: 0,
      MyFamilyId: 0,
      PKLotId: productObj.PKLotId?parseInt(productObj.PKLotId):0,
      MfgGroup: productObj.MfgGroup,
      ExpiryDate: productObj.ExpiryDate,
      ProductInteractiveModule: productObj.InteractiveModule,
      ProductInteractiveSubModule: productObj.InteractiveSubModule,
      IsNonReturnable: productObj.IsNonReturnable,
      RefOrderId: 0,
      Brand: productObj.Brand,
      DiscountPercent: productObj.discountpercentage
    };

    // this.getContraIndecatedSaltAgainstCart(productId , productObj.DisplayName)

    this.dbService.add('cartItems', tmp).subscribe((res: any) => {
      // console.log('Record added successfully.', res);
      // this.newItemEvent.emit();
      this.CommonService.sendClickEvent();
      // let objdata = { 'dts': tmp, 'type': 'update' };
      // this.CommonService.AClicked(JSON.stringify(objdata))
      this.getAllRecord();
      this.updateSearchList(tmp)
    });

    this.addProductWebEngage(tmp, tmp['ProductCount'])

  }

  cartAddPlus(productObj: any) {
    let pro_id = productObj.productId;
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      const updatedItem = { ...item, 'ProductCount': item['ProductCount'] + 1 }
      // console.log(updatedItem);
      this.updateById(updatedItem)
      // if (item['DosageRestriction'] == 0 || (item['DosageRestriction'] != 0 && item['DosageRestriction'] > qty)) {
      //   const updatedItem = { ...item, 'ProductCount': item['ProductCount'] + 1 }
      //   // console.log(updatedItem);
      //   this.updateById(updatedItem)
      // } else {
      //   // alert('max limit reached');
      //   alert(`You can order maximum ${item['DosageRestriction']} quantity`);
      //   // this.headerModal.nativeElement.click();
      // }
    });
  }

  cartAddMinus(productObj: any) {
    let pro_id = productObj.productId;
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
        this.updateSearchList(tmp)
      }
    });
  }

  updateSearchList(tmp: any) {
    this.searchList = this.searchList.map((obj: any) => {
      if (obj.productId == tmp.ProductId) {
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
        this.searchList = this.searchList.map((obj: any) => {
          if (obj.productId == pro_id) {
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


  requestNotify(item: any) {
    // console.log(item);
    let fd = new FormData();
    fd.append('ProductId', item.productId);
    fd.append('ProductName', item.displayname);
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


  updatefromSearch() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      this.addedInCart = res;
      // console.log(res)
      if (this.addedInCart.length > 0) {
        this.searchList.forEach((item: any) => {
          const match = this.addedInCart.find((elm: any) => parseInt(elm.ProductId) === parseInt(item.productId));
          if (match) {
            item.addedQty = match.ProductCount;
          } else {
            item.addedQty = 0;
          }
        });
      } else {
        this.searchList.forEach((elm: any) => {
          elm.addedQty = 0;
        })
      }
    });
  }

  changeBrand(plink: any) {
    this.router.navigate(['newbrand/brandlisting/', plink])
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
