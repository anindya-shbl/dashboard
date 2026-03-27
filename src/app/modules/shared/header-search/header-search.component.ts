import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrl: './header-search.component.scss'
})
export class HeaderSearchComponent implements OnInit {

  ProductList: any = [];
  ProductListKey: any = [];
  searchTxt: any = '';
  typingTimer: any = 0;

  searchProducts: any = [];
  pageNo: any = 1;
  pageSize: any = 50;
  includeGiftable: any = 0;
  totalcount: any = 0;

  productIndex: any = 0;
  OfferPriceIndex: any = 0;
  MRPIndex: any = 0;
  IsOutOfStock: any = 0;
  PrescriptionOTC: any = 0;
  DiscountPercent: any = 0;
  ProductId: any = 0;
  MfgGroup: any = '';
  ProductImage: any = '';
  SubtituteIndex: any = 0;
  SizeIndex: any = 0;
  ProductStatus: any = '';
  RefProductDetails: any = '';
  showSubs: any = '';
  showRefPrd: any = 0;
  showVar: any = '';

  searchResult: boolean = false;
  searchLoading: boolean = false;
  addedInCart: any = [];
  isExisting: any = 0;
  addedQty: any = 0;

  alertMsg: any = '';

  isLoggedIn = 'false';
  @ViewChild('headerModal') headerModal!: ElementRef;

  @Output() newItemEvent = new EventEmitter<any>();


  inside = false;

  tabList: any = [];
  searchType: any = '';

  addedInLabCart: any = [];

  @HostListener("click")
  clicked() {
    this.inside = true;
  }

  @HostListener("document:click")
  clickedOut() {
    if (!this.inside) {
      this.resetSearch()
    }
    this.inside = false;
  }

  constructor(public CommonService: CommonService, private dbService: NgxIndexedDBService, private authService: AuthService,
    private cookieService: CookieService, private toastr: ToastrService, private webengageService: WebEngageService) { }

  ngOnInit() {
    this.isLoggedIn = this.cookieService.get('isLoggedIn');
  }

  getAllRecord() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInCart = res;
    });
  }

  getLabRecord() {
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInLabCart = res;
    });
  }

  onSearchChange(evnt: any) {
    let str = evnt.target.value;
    this.pageNo = 1;
    this.totalcount = 0;
    // console.log(str)
    clearTimeout(this.typingTimer);
    if (str.length > 2) {
      this.searchTxt = str;
      this.webengageService.trackEvent('Product Searched', { 'Search Keyword': this.searchTxt });
      // this.getAllRecord();
      this.searchLoading = true;
      this.searchResult = true;
      this.searchProducts = [];
      this.typingTimer = setTimeout(() => {
        this.searchV2();
        // this.doneTyping();
      }, 500);
    } else {
      this.ProductList = [];
      this.searchProducts = [];
      this.searchResult = false;
      // this.emptyResult = false;
    }
  };

  searchV2() {

    let pincodeTxt = ''
    if (this.authService.PinCode > 0) {
      pincodeTxt = '&pincode=' + this.authService.PinCode;
      if (this.authService.IsPanIndia == 1) {
        pincodeTxt = pincodeTxt + '&panindia=1'
      }
    }

    let searchtext =
      this.CommonService.searchTab +
      '&q=' + this.searchTxt +
      '&token=' + this.authService.Token +
      '&wh=' + this.authService.WHId +
      pincodeTxt +
      '&mtype=' + 1 +
      '&include_discontinued=' + 1 +
      '&strict_match=' + 1 +
      '&includeGiftable=' + 1 +
      '&_t=' + new Date().getTime();

    this.CommonService.getSearchData(searchtext).subscribe((res: any) => {
      // console.log(res);
      if (res) {
        var keys = [];
        for (var key in res['tab_display']) {
          if (res['tab_display'][key]['display'] == 1) {
            keys.push(key)
          }
        }

        if (keys.includes('medicine')) {
          let lst = keys.filter(item => item !== 'medicine');
          lst.unshift('medicine');
          this.tabList = lst;
        } else {
          this.tabList = keys;
        }

        if (this.tabList.length > 0) {
          this.setSearcType(this.tabList[0]);
        } else {
          this.searchLoading = false;
        }
      }
    })

  }

  setSearcType(bts: any) {
    this.searchLoading = true;
    this.searchResult = true;
    this.searchProducts = [];
    this.showSubs = '';
    this.showVar = '';
    this.pageNo = 1;
    if (bts == 'medicine') {
      this.searchType = 'P';
      this.getAllRecord();
      this.doneTyping();
    } else if (bts == 'household') {
      this.searchType = 'O';
      this.getAllRecord();
      this.doneTyping();
    } else if (bts == 'labservice') {
      this.searchType = 'L';
      this.getLabRecord();
      this.getLabTests();
    } else if (bts == 'doctor') {
      this.searchType = 'D'
    } else if (bts == 'article') {
      this.searchType = 'A'
    } else {
      this.searchType = ''
    }
  }

  doneTyping() {

    // this.searchStart = true;
    // this.CartService.cartList().subscribe(data => {

    let pincodeTxt = ''
    if (this.authService.PinCode > 0) {
      pincodeTxt = '&pincode=' + this.authService.PinCode;
      if (this.authService.IsPanIndia == 1) {
        pincodeTxt = pincodeTxt + '&panindia=1'
      }
    }
    // let searchtext = this.CommonService.searchUrl + '&q=' + this.searchTxt + '&panindia=' + this.authService.IsPanIndia + '&wh=' + this.authService.WHId + pincodeTxt;
    let searchtext =
      this.CommonService.searchUrl +
      '&q=' + this.searchTxt +
      '&ptype=' + this.searchType +
      '&mtype=' + this.searchType +
      '&wh=' + this.authService.WHId +
      pincodeTxt +
      '&strict_match=' + 1 +
      '&include_discontinued=' + 1 +
      '&includeGiftable=' + 1 +
      '&token=' + this.authService.Token +
      '&page=' + this.pageNo +
      '&size=' + this.pageSize


    // '&panindia=' + this.authService.IsPanIndia +      
    // '&_t=' + new Date().getTime();
    // debugger

    this.CommonService.getSearchData(searchtext).subscribe((data: any) => {
      if (data['products'].length > 0) {
        // this.emptyResult = false;
        // this.searchResult = true;
        data['keys'].push('isAdded');
        data['keys'].push('addedQty');
        data['keys'].push('showRefPrd');
        this.ProductList = data['products'];
        this.ProductListKey = data['keys'];
        this.totalcount = data['total'];
        this.productIndex = this.getKeyIndex("DisplayName");
        this.OfferPriceIndex = this.getKeyIndex("OfferPrice");
        this.MRPIndex = this.getKeyIndex("MRP");
        this.IsOutOfStock = this.getKeyIndex("IsOutOfStock");
        this.PrescriptionOTC = this.getKeyIndex("PrescriptionOTC");
        this.isExisting = this.getKeyIndex('isAdded');
        this.addedQty = this.getKeyIndex('addedQty');
        this.DiscountPercent = this.getKeyIndex('DiscountPercent');
        this.ProductId = this.getKeyIndex('ProductId');
        this.MfgGroup = this.getKeyIndex('MfgGroup');
        this.ProductImage = this.getKeyIndex('ProductImage');
        this.SubtituteIndex = this.getKeyIndex('PreferredSubtitute');
        this.SizeIndex = this.getKeyIndex('Size');
        this.ProductStatus = this.getKeyIndex('ProductStatus');
        this.RefProductDetails = this.getKeyIndex('RefProductDetails');
        this.showRefPrd = this.getKeyIndex('showRefPrd');


        data['products'].forEach((elm: any) => {
          let pID = this.getKeyIndex('ProductId');
          elm.push(0);
          elm[this.addedQty] = 0;
          elm[this.showRefPrd] = 0;
          // console.log('pID', elm[pID])
          this.addedInCart.forEach((item: any) => {
            if (parseInt(elm[pID]) == item.ProductId) {
              elm[this.isExisting] = 1;
              elm[this.addedQty] = item.ProductCount;
            }
          });
          if ((elm[this.ProductStatus] == 'D' || (elm[this.ProductStatus] == 'C' && elm[this.IsOutOfStock] == 'Y')) && elm[this.RefProductDetails] != null && elm[this.RefProductDetails] != undefined && elm[this.RefProductDetails] != '') {
            if (elm[this.RefProductDetails]['IsOutOfStock'] == 'N' && elm[this.RefProductDetails]['ProductStatus'] == 'C') {
              elm[this.showRefPrd] = 1;
              elm[this.RefProductDetails].addedQty = 0;
              elm[this.SubtituteIndex] = [];
              this.addedInCart.forEach((itm: any) => {
                if (parseInt(elm[this.RefProductDetails]['ProductId']) == itm.ProductId) {
                  elm[this.RefProductDetails].addedQty = itm.ProductCount;
                }
              });
            } else {
              if (elm[this.SubtituteIndex].length > 0 && this.authService.ConfigData.IsDisplayGenericProduct == 1) {
                let subs = this.setSubProduct(elm);
                if (subs.length > this.authService.ConfigData.MaxgenericProductList) {
                  let slicedArray = subs.slice(0, this.authService.ConfigData.MaxgenericProductList);
                  elm[this.SubtituteIndex] = slicedArray;
                } else {
                  elm[this.SubtituteIndex] = subs;
                }
              }
            }
          } else if (elm[this.SubtituteIndex].length > 0 && this.authService.ConfigData.IsDisplayGenericProduct == 1) {
            let subs = this.setSubProduct(elm);
            if (subs.length > this.authService.ConfigData.MaxgenericProductList) {
              let slicedArray = subs.slice(0, this.authService.ConfigData.MaxgenericProductList);
              elm[this.SubtituteIndex] = slicedArray;
            } else {
              elm[this.SubtituteIndex] = subs;
            }
          }
          this.searchProducts.push(elm);
          this.searchLoading = false;
        });

      } else {
        // this.searchResult = true;
        this.ProductList = [];
        this.searchLoading = false;
        // this.emptyResult = true;
      }
    });

    // });
  }

  onKeydown() {
    clearTimeout(this.typingTimer);
  }

  getKeyIndex(key: any) {
    let indexval = this.ProductListKey.indexOf(key);
    return indexval;
  }

  addToCart(productObj: any, ProductQty: any) {
    // console.log(productObj, ProductQty);
    let productId = productObj[this.getKeyIndex("ProductId")];
    // let LotId = parseInt(productObj[this.getKeyIndex("PKLotId")]);
    let LotId = 0;
    let CPId = 0;

    let tmp = {
      id: productId + '_' + CPId + '_' + LotId,
      ProductId: parseInt(productId),
      ProductName: productObj[this.getKeyIndex("DisplayName")],
      CustProductName: '',
      InteractiveHealthProfileId: '',
      DosageRestriction: productObj[this.getKeyIndex("DosageRestriction")],
      OfferPrice: productObj[this.getKeyIndex("OfferPrice")],
      ProductCount: parseInt(ProductQty),
      ItemVal: productObj[this.getKeyIndex("OfferPrice")],
      SSCurrencyValue: ".00",
      Iscourierable: productObj[this.getKeyIndex("IsCourierable")],
      ProductImage: productObj[this.getKeyIndex("ProductImage")],
      ProductPrice: productObj[this.getKeyIndex("MRP")],
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
      RefOrderId: 0,
      Brand: productObj[this.getKeyIndex("Brand")],
      DiscountPercent: productObj[this.getKeyIndex('DiscountPercent')]
    };

    // this.getContraIndecatedSaltAgainstCart(productId , productObj.DisplayName)

    this.dbService.add('cartItems', tmp).subscribe((res: any) => {
      // console.log('Record added successfully.', res);
      this.newItemEvent.emit();
      this.CommonService.sendClickEvent();
      // this.searchResult = false;
      // this.searchTxt = '';
      // this.ProductList = [];
      let objdata = { 'dts': tmp, 'type': 'update' };
      this.CommonService.AClicked(JSON.stringify(objdata))
      this.getAllRecord();
      this.updateSearchList(tmp)
    });

    this.addProductWebEngage(tmp, tmp['ProductCount'])

  }

  resetSearch() {
    this.searchResult = false;
    this.searchTxt = '';
    this.ProductList = [];
    this.searchProducts = [];
    this.tabList = [];
    this.searchType = '';
  }

  cartAddPlus(productObj: any) {
    let pro_id = productObj[this.getKeyIndex("ProductId")];
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
        this.alertMsg = `You can order maximum ${item['DosageRestriction']} quantity`;
        this.headerModal.nativeElement.click();
      }
    });
  }

  cartAddMinus(productObj: any) {
    let pro_id = productObj[this.getKeyIndex("ProductId")];
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
        this.CommonService.sendClickEvent();
        let objdata = { 'dts': tmp, 'type': 'update' };
        this.CommonService.AClicked(JSON.stringify(objdata))
        this.updateSearchList(tmp)
      }
    });
  }

  updateSearchList(tmp: any) {
    this.searchProducts = this.searchProducts.map((obj: any) => {
      if (obj[this.getKeyIndex("ProductId")] == tmp.ProductId) {
        obj[this.addedQty] = tmp.ProductCount;
      } else {
        if (obj[this.RefProductDetails] != null && obj[this.RefProductDetails] != '' && obj[this.RefProductDetails] != undefined) {
          if (obj[this.RefProductDetails].ProductId == tmp.ProductId) {
            obj[this.RefProductDetails].addedQty = tmp.ProductCount;
          }
        }
         if (obj[this.SubtituteIndex].length > 0) {
          obj[this.SubtituteIndex] = obj[this.SubtituteIndex].map((obj1: any) => {
            if (obj1.PreferredProductId == tmp.ProductId) {
              obj1.addedQty = tmp.ProductCount;
            }
            return obj1;
          });
        }
      }
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
        this.CommonService.sendClickEvent();
        let objdata = { 'dts': pro_id, 'type': 'del' };
        this.CommonService.AClicked(JSON.stringify(objdata))
        this.searchProducts = this.searchProducts.map((obj: any) => {
          if (obj[this.getKeyIndex("ProductId")] == pro_id) {
            obj[this.addedQty] = 0;
          } else {
            if (obj[this.RefProductDetails] != null && obj[this.RefProductDetails] != '' && obj[this.RefProductDetails] != undefined) {
              if (obj[this.RefProductDetails].ProductId == pro_id) {
                obj[this.RefProductDetails].addedQty = 0;
              }
            } else if (obj[this.SubtituteIndex].length > 0) {
              obj[this.SubtituteIndex] = obj[this.SubtituteIndex].map((obj1: any) => {
                if (obj1.PreferredProductId == pro_id) {
                  obj1.addedQty = 0;
                }
                return obj1;
              });
            }
          }
          return obj;
        });
        this.newItemEvent.emit();

      } else {
        // alert('some thing went wrong')
      }
    });
  }

  loadMore() {
    if (this.totalcount > this.searchProducts.length) {
      this.pageNo = this.pageNo + 1;
      this.doneTyping();
    }
  }

  getLabTests() {
    let pincodeTxt = ''
    if (this.authService.PinCode > 0) {
      pincodeTxt = '&pincode=' + this.authService.PinCode
    }
    // let searchtext = this.CommonService.searchUrl + '&q=' + this.searchTxt + '&panindia=' + this.authService.IsPanIndia + '&wh=' + this.authService.WHId + pincodeTxt;
    let searchtext =
      this.CommonService.labsearch +
      '&q=' + this.searchTxt +
      '&strict_match=' + 1 +
      '&wh=' + this.authService.WHId +
      '&panindia=' + this.authService.IsPanIndia +
      pincodeTxt +
      '&page=' + this.pageNo +
      '&size=' + this.pageSize

    this.CommonService.getSearchData(searchtext).subscribe((res: any) => {
      // console.log(res);
      if (res) {
        this.totalcount = res['total_match'];
        let data: any = res.items;

        if (data.length > 0) {
          let temp = data;

          temp.forEach((obj: any) => obj.IsAdded = false);

          if (this.addedInLabCart.length > 0) {
            temp.forEach((elm: any) => {
              this.addedInLabCart.forEach((item: any) => {
                if ((elm.ServiceId == item.ServiceId) && (item.PkgServiceId == undefined || item.PkgServiceId == null || item.PkgServiceId == '')) {
                  elm.IsAdded = true;
                }
              });
            });
          };

          this.searchProducts.push(...temp);
          this.searchLoading = false;

        } else {
          this.ProductList = [];
          this.searchLoading = false;
        }
      }
      // console.log(this.searchProducts)
    })

  }


  addLabTest(productObj: any) {

    this.alertMsg = '';

    let productId = productObj.ServiceId;

    let canAdd = true;

    if (this.addedInLabCart.length > 0) {

      if (productObj.IsPackage == false) {
        this.addedInLabCart.forEach((ds: any) => {
          if (ds.ServiceId == productObj.ServiceId) {
            // alert(`This test already included in selected package`);
            this.alertMsg = `This test already included in selected package`
            canAdd = false;
          }
        })
      }
      if (productObj.IsPackage == true) {
        this.addedInLabCart.forEach((ds: any) => {
          if (productObj.PackageServices != undefined && productObj.PackageServices.length > 0) {
            productObj.PackageServices.forEach((dts: any) => {
              if (ds.ServiceId == dts.ServiceId) {
                // alert(`Some test of this package already added in your cart, please remove them to add this package`);
                this.alertMsg = `Some test of this package already added in your cart, remove them to add this package`
                canAdd = false;
              }
            })
          }
        })
      }

    }

    if (canAdd == true) {
      let tmp = {
        "id": productId,
        "ProductId": productId,
        "CartItemId": productObj.CartItemId,
        "CartId": productObj.CartId,
        "CustUserId": productObj.CustUserId,
        "SlotId": productObj.SlotId,
        "LabId": productObj.LabId,
        "LabName": productObj.LabName,
        "ServiceName": productObj.ServiceName,
        "Fees": productObj.Fees,
        "Discount": productObj.Discount,
        "GuestId": productObj.GuestId,
        "UpdatedDate": productObj.UpdatedDate,
        "ApplicationType": productObj.ApplicationType,
        "AppVersion": productObj.AppVersion,
        "ServiceId": productObj.ServiceId,
        "ServiceDesc": productObj.ServiceDesc,
        "BookingDate": productObj.BookingDate,
        "StartTime": productObj.StartTime,
        "EndTime": productObj.EndTime,
        "ServicePreparation": productObj.ServicePreparation,
        "IsHomeCollectionAvailable": productObj.IsHomeCollectionAvailable,
        "ReportPeriod": productObj.ReportPeriod,
        "OfferFees": productObj.OfferFees,
        "DiscPercent": productObj.DiscPercent,
        "PkgServiceId": productObj.PkgServiceId,
        "PkgServicesName": productObj.PkgServicesName,
        "IsPackage": productObj.IsPackage,
        "Permalink": productObj.Permalink,
        "PromoApplicable": productObj.PromoApplicable,
        "PermalinkNew": productObj.PermalinkNew,
        "RefBookingId": productObj.RefBookingId,
        "IsEvening": productObj.IsEvening
      };

      this.dbService.add('LabTests', tmp).subscribe((res: any) => {
        // console.log('Record added successfully.', res);
        this.newItemEvent.emit();
        // this.resetSearch();
        this.getLabRecord();
        this.CommonService.sendClickEvent();
        this.updateLabTestList(tmp);
        this.addLabWebEngage(tmp);
      });

      if (productObj.PackageServices != undefined && productObj.PackageServices.length > 0) {
        productObj.PackageServices.forEach((productObj_pkg: any) => {
          let productId = productObj_pkg.ServiceId;

          let tmp_pkg = {
            "id": productId,
            "ProductId": productId,
            "CartItemId": productObj_pkg.CartItemId,
            "CartId": productObj_pkg.CartId,
            "CustUserId": productObj_pkg.CustUserId,
            "SlotId": productObj_pkg.SlotId,
            "LabId": productObj_pkg.LabId,
            "LabName": productObj_pkg.LabName,
            "ServiceName": productObj_pkg.ServiceName,
            "Fees": productObj_pkg.Fees,
            "Discount": productObj_pkg.Discount,
            "GuestId": productObj_pkg.GuestId,
            "UpdatedDate": productObj_pkg.UpdatedDate,
            "ApplicationType": productObj_pkg.ApplicationType,
            "AppVersion": productObj_pkg.AppVersion,
            "ServiceId": productObj_pkg.ServiceId,
            "ServiceDesc": productObj_pkg.ServiceDesc,
            "BookingDate": productObj_pkg.BookingDate,
            "StartTime": productObj_pkg.StartTime,
            "EndTime": productObj_pkg.EndTime,
            "ServicePreparation": productObj_pkg.ServicePreparation,
            "IsHomeCollectionAvailable": productObj_pkg.IsHomeCollectionAvailable,
            "ReportPeriod": productObj_pkg.ReportPeriod,
            "OfferFees": productObj_pkg.OfferFees,
            "DiscPercent": productObj_pkg.DiscPercent,
            "PkgServiceId": productObj.ServiceId,
            "PkgServicesName": productObj_pkg.PkgServicesName,
            "IsPackage": productObj_pkg.IsPackage,
            "Permalink": productObj_pkg.Permalink,
            "PromoApplicable": productObj_pkg.PromoApplicable,
            "PermalinkNew": productObj_pkg.PermalinkNew,
            "RefBookingId": productObj_pkg.RefBookingId,
            "IsEvening": productObj_pkg.IsEvening
          };

          this.dbService.add('LabTests', tmp_pkg).subscribe((res: any) => {
            // console.log('Record added successfully.', res);
          });
        })
      }
    } else {
      if (this.alertMsg != '') {
        this.headerModal.nativeElement.click();
      }
    }
  }

  updateLabTestList(tmp: any) {
    this.searchProducts = this.searchProducts.map((obj: any) => {
      if (obj.ServiceId == tmp.ServiceId) {
        obj.IsAdded = true;
        // return { ...obj, adqt: tmp.ProductCount };
      }
      return obj;
    });
  }

  deleteLabTest(productObj: any) {

    let id = productObj.ServiceId;

    this.dbService.deleteByKey('LabTests', id).subscribe((status: any) => {
      if (status == true) {
        this.removeLabWebEngage(productObj);
        this.getLabRecord();
        this.searchProducts = this.searchProducts.map((obj: any) => {
          if (obj.ServiceId == id) {
            obj.IsAdded = false;
          }
          return obj;
        });
        this.newItemEvent.emit();


        if (this.addedInLabCart.length > 0 && productObj.IsPackage == true) {
          this.addedInLabCart.forEach((dts: any) => {
            if (dts.PkgServiceId == productObj.ServiceId) {
              let ids = dts.ServiceId
              this.dbService.deleteByKey('LabTests', ids).subscribe((status: any) => { })
            }
          });
          this.getLabRecord();
        }
        this.CommonService.sendClickEvent();
      } else {
        // alert('some thing went wrong')
      }
    });

  }

  // setSubProduct(mainobj: any) {

  //   let mdLst: any = []
  //   let data: any = mainobj[this.getKeyIndex("PreferredSubtitute")];
  //   data.forEach((elm: any) => {
  //     if (elm.MRP != '' && elm.MRP != null && elm.MRP > 0) {
  //       let mainProductConfigPrice: any = '';
  //       let subProductConfigPrice: any = '';
  //       let mainProductSize: any = mainobj[this.getKeyIndex("Size")];
  //       let subProductSize: any = elm['Size'];

  //       if (this.authService.ConfigData.GenericPercentageCalOnOfferPrice == 'Y') {
  //         mainProductConfigPrice = mainobj[this.getKeyIndex("OfferPrice")];
  //         subProductConfigPrice = elm['CustOfferPrice'];
  //       } else {
  //         mainProductConfigPrice = mainobj[this.getKeyIndex("MRP")];
  //         subProductConfigPrice = elm['MRP'];
  //       }

  //       if (mainProductSize > 0 && subProductSize > 0) {
  //         let mainUnitPrice: any = mainProductConfigPrice / mainProductSize;
  //         let subUnitPrice: any = subProductConfigPrice / subProductSize;
  //         if (mainUnitPrice > subUnitPrice) {
  //           let savingsPercentage = ((mainUnitPrice - subUnitPrice) / mainUnitPrice) * 100;
  //           let prNd = Math.floor(savingsPercentage);
  //           if (prNd >= this.authService.ConfigData.GenericMinPercentage) {
  //             let ds = { ...elm, savingsPercent: prNd, isExisting: 0, addedQty: 0 };
  //             this.addedInCart.forEach((item: any) => {
  //               if (parseInt(ds['PreferredProductId']) == item.ProductId) {
  //                 ds.isExisting = 1;
  //                 ds.addedQty = item.ProductCount;
  //               }
  //             });
  //             mdLst.push(ds)
  //           }
  //         }
  //       }
  //     }
  //   });

  //   if (this.authService.ConfigData.SortOnSaving == 'Y') {
  //     mdLst.sort((a: any, b: any) => b.savingsPercent - a.savingsPercent)
  //   } else {
  //     mdLst.sort((a: any, b: any) => a.DisplaySeq - b.DisplaySeq)
  //   }
  //   return mdLst;
  //   // console.log(mdLst);
  // }

  setSubProduct(mainobj: any) {
    let mdLst: any = []
    let data: any = mainobj[this.getKeyIndex("PreferredSubtitute")];
    data.forEach((elm: any) => {
      elm.savingsPercent = 0,
        elm.isExisting = 0,
        elm.addedQty = 0;
      elm.pricePerUnit = 0;
      this.addedInCart.forEach((item: any) => {
        if (parseInt(elm.PreferredProductId) == item.ProductId) {
          elm.isExisting = 1;
          elm.addedQty = item.ProductCount;
        }
      });
      if (elm.MRP != '' && elm.MRP != null && elm.MRP > 0) {
        let mainProductConfigPrice: any = '';
        let mainProductSize: any = mainobj[this.getKeyIndex("Size")];

        let subProductConfigPrice: any = '';
        let subProductSize: any = elm['Size'];

        if (this.authService.ConfigData.GenericPercentageCalOnOfferPrice == 'Y') {
          mainProductConfigPrice = mainobj[this.getKeyIndex("OfferPrice")];
          subProductConfigPrice = elm['CustOfferPrice'];
        } else {
          mainProductConfigPrice = mainobj[this.getKeyIndex("MRP")];
          subProductConfigPrice = elm['MRP'];
        }

        if (mainProductSize > 0 && subProductSize > 0) {
          let mainUnitPrice: any = 0;
          let subUnitPrice: any = subProductConfigPrice / subProductSize;
          elm.pricePerUnit = subUnitPrice;
          if (mainProductConfigPrice > 0) {
            mainUnitPrice = mainProductConfigPrice / mainProductSize;
            if (mainUnitPrice > subUnitPrice) {
              let savingsPercentage = ((mainUnitPrice - subUnitPrice) / mainUnitPrice) * 100;
              let prNd = Math.floor(savingsPercentage);
              if (prNd >= this.authService.ConfigData.GenericMinPercentage) {
                elm.savingsPercent = prNd;
                mdLst.push(elm)
              }
            }
          } else {
            mdLst.push(elm)
          }

        }
      }
    });
    if (this.authService.ConfigData.SortOnSaving == 'Y') {
      // mdLst.sort((a: any, b: any) => b.savingsPercent - a.savingsPercent)
      mdLst.sort((a: any, b: any) => {
        if (a.savingsPercent !== b.savingsPercent) {
          return b.savingsPercent - a.savingsPercent;
        }
        return a.pricePerUnit - b.pricePerUnit;
      });
    } else {
      mdLst.sort((a: any, b: any) => a.DisplaySeq - b.DisplaySeq)
    }
    return mdLst;
    // console.log(mdLst);
  }

  getMaxSavings(data: any) {
    let maxSavings: any = Math.max(...data.map((o: any) => o.savingsPercent));
    return maxSavings;
  }

  displaySubs(ds: any) {
    this.showVar = '';
    this.showSubs = ds[this.getKeyIndex("ProductId")];
  }

  hideSub() {
    this.showSubs = '';
  }

  addAlternative(prdct: any, ProductQty: any, PrescriptionOTC: any) {
    // console.log(prdct);
    let productId = prdct.PreferredProductId;
    // let LotId = parseInt(productObj[this.getKeyIndex("PKLotId")]);
    let LotId = 0;
    let CPId = 0;

    let tmp = {
      id: productId + '_' + CPId + '_' + LotId,
      ProductId: parseInt(productId),
      ProductName: prdct.DisplayName,
      CustProductName: '',
      InteractiveHealthProfileId: '',
      // DosageRestriction: productObj[this.getKeyIndex("DosageRestriction")],
      DosageRestriction: prdct.DosageRestriction ? prdct.DosageRestriction : 0,
      OfferPrice: prdct.CustOfferPrice,
      ProductCount: parseInt(ProductQty),
      ItemVal: prdct.CustOfferPrice,
      SSCurrencyValue: ".00",
      // Iscourierable: productObj[this.getKeyIndex("IsCourierable")],
      Iscourierable: prdct.IsCourierable ? prdct.IsCourierable : 'N',
      ProductImage: prdct.ProductImage,
      ProductPrice: prdct.MRP,
      // PrescriptionOTC: productObj[this.getKeyIndex("PrescriptionOTC")],
      PrescriptionOTC: PrescriptionOTC,
      WarehouseId: this.authService.WHId,
      CPId: 0,
      MyFamilyId: 0,
      PKLotId: '',
      MfgGroup: prdct.MfgGroup ? prdct.MfgGroup : '',
      // ExpiryDate: productObj[this.getKeyIndex("ExpiryDate")],
      ExpiryDate: prdct.ExpiryDate ? prdct.ExpiryDate : '',
      ProductInteractiveModule: '',
      ProductInteractiveSubModule: '',
      // IsNonReturnable: productObj[this.getKeyIndex("IsNonReturnable")],
      IsNonReturnable: prdct.IsNonReturnable ? prdct.IsNonReturnable : 'N',
      RefOrderId: 0,
      Brand: '',
      DiscountPercent: prdct.CustDiscPercent
    };

    // this.getContraIndecatedSaltAgainstCart(productId , productObj.DisplayName)
    this.dbService.add('cartItems', tmp).subscribe((res: any) => {
      // console.log('Record added successfully.', res);
      this.newItemEvent.emit();
      let objdata = { 'dts': tmp, 'type': 'update' };
      this.CommonService.AClicked(JSON.stringify(objdata))
      this.getAllRecord();
      this.updateSearchList(tmp)
    });
  }

  subAddPlus(productObj: any) {
    let pro_id = productObj.PreferredProductId;
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
        this.alertMsg = `You can order maximum ${item['DosageRestriction']} quantity`;
        this.headerModal.nativeElement.click();
      }
    });
  }

  subAddMinus(productObj: any) {
    let pro_id = productObj.PreferredProductId;
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
        this.deleteById(pro_id)
      }
    });
  }

  replaceAlternative(altr: any, mainProd: any) {
    // console.log(altr, mainProd);
    let addedNow = mainProd[this.addedQty] * mainProd[this.SizeIndex];
    let tobeAdd = addedNow / altr.Size;
    let alteQty = Math.ceil(tobeAdd);
    // console.log(addedNow, alteQty);
    this.addAlternative(altr, alteQty, mainProd[this.PrescriptionOTC]);
    this.deleteById(mainProd[this.getKeyIndex("ProductId")]);
  }

  displayVrnt(ds: any) {
    this.showVar = ds[this.getKeyIndex("ProductId")];
    this.showSubs = '';
  }

  hideVrnt() {
    this.showVar = '';
  }

  addVarient(prdct: any, ProductQty: any) {
    // console.log(prdct);
    let productId = prdct.ProductId;
    // let LotId = parseInt(productObj[this.getKeyIndex("PKLotId")]);
    let LotId = 0;
    let CPId = 0;

    let tmp = {
      id: productId + '_' + CPId + '_' + LotId,
      ProductId: parseInt(productId),
      ProductName: prdct.DisplayName,
      CustProductName: '',
      InteractiveHealthProfileId: '',
      // DosageRestriction: productObj[this.getKeyIndex("DosageRestriction")],
      DosageRestriction: prdct.DosageRestriction ? prdct.DosageRestriction : 0,
      OfferPrice: prdct.CustOfferPrice,
      ProductCount: parseInt(ProductQty),
      ItemVal: prdct.CustOfferPrice,
      SSCurrencyValue: ".00",
      // Iscourierable: productObj[this.getKeyIndex("IsCourierable")],
      Iscourierable: prdct.IsCourierable ? prdct.IsCourierable : 'N',
      ProductImage: prdct.ProductImage,
      ProductPrice: prdct.MRP,
      // PrescriptionOTC: productObj[this.getKeyIndex("PrescriptionOTC")],
      PrescriptionOTC: prdct.PrescriptionOTC,
      WarehouseId: this.authService.WHId,
      CPId: 0,
      MyFamilyId: 0,
      PKLotId: '',
      MfgGroup: prdct.MfgGroup ? prdct.MfgGroup : '',
      // ExpiryDate: productObj[this.getKeyIndex("ExpiryDate")],
      ExpiryDate: prdct.ExpiryDate ? prdct.ExpiryDate : '',
      ProductInteractiveModule: '',
      ProductInteractiveSubModule: '',
      // IsNonReturnable: productObj[this.getKeyIndex("IsNonReturnable")],
      IsNonReturnable: prdct.IsNonReturnable ? prdct.IsNonReturnable : 'N',
      RefOrderId: 0,
      Brand: '',
      DiscountPercent: prdct.CustDiscPercent
    };

    // this.getContraIndecatedSaltAgainstCart(productId , productObj.DisplayName)
    this.dbService.add('cartItems', tmp).subscribe((res: any) => {
      // console.log('Record added successfully.', res);
      this.newItemEvent.emit();
      let objdata = { 'dts': tmp, 'type': 'update' };
      this.CommonService.AClicked(JSON.stringify(objdata))
      this.getAllRecord();
      this.updateSearchList(tmp)
    });
  }

  varientAddPlus(productObj: any) {
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
        this.alertMsg = `You can order maximum ${item['DosageRestriction']} quantity`;
        this.headerModal.nativeElement.click();
      }
    });
  }

  varientAddMinus(productObj: any) {
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
        this.deleteById(pro_id)
      }
    });
  }

  requestNotify(item: any) {
    // console.log(item);
    let fd = new FormData();
    fd.append('ProductId', item[this.getKeyIndex("ProductId")]);
    fd.append('ProductName', item[this.getKeyIndex("DisplayName")]);
    fd.append('ProductType', item[this.getKeyIndex("PrescriptionOTC")]);
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

  requestAddNew() {
    let fd = new FormData();
    // fd.append('ProductName', this.searchTxt);
    // fd.append('ProductType', '');
    fd.append('ProductId', '');
    fd.append('ProductName', this.searchTxt);
    fd.append('ProductType', '');
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

  addLabWebEngage(data: any) {
    let webData = {
      'Lab Test Name': data.ServiceName,
      'Preparation Needed': data.ServicePreparation ? data.ServicePreparation : '',
      'Price': data.OfferFees,
      // 'Booked From Category ' : category ? category : '',
    }
    this.webengageService.trackEvent('Lab Test Added to Cart', webData);
  }

  removeLabWebEngage(data: any) {
    let webData = {
      'Lab Test Name': data.ServiceName,
      'Preparation Needed': data.ServicePreparation ? data.ServicePreparation : '',
      'Price': data.OfferFees
    }
    this.webengageService.trackEvent('Lab Test Removed From Cart', webData);
  }

}
