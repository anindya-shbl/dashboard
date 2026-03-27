import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { WebEngageService } from '../../../services/web-engage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  searchText: any = '';
  // searchStart: boolean = false;
  searchList: any = [];
  labtestList: any = [];
  typingTimer: any = 0;
  showSearchArea: boolean = false;
  // activeSearchbtn: boolean = false;
  pageNo: any = 1;
  size: any = 50;
  totalcount: any = 0;
  labcount: any = 0
  isLoading: boolean = false;
  labLoading: boolean = false;
  inside: boolean = false;
  addedInCart: any = [];
  addedInLabCart: any = [];
  showSubs: any = '';
  alertMsg: any = '';

  @ViewChild('srchInput')
  srchInput!: ElementRef;

  @Output() newItemEvent = new EventEmitter<any>();

  @HostListener("click")
  clicked() {
    this.inside = true;
  }

  @HostListener("document:click")
  clickedOut() {
    // console.log('outside') 
    if (!this.inside) {
      this.cleareSearch()
    }
    this.inside = false;
  }

  constructor(
    private router: Router,
    public authService: AuthService,
    public CommonService: CommonService,
    private cookieService: CookieService,
    private dbService: NgxIndexedDBService,
    private webengageService: WebEngageService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    let d: Date = new Date();
    this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
    // this.getAllRecord();
  }

  ngAfterViewInit() {
    this.srchInput.nativeElement.focus();
  }

  getAllRecord() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
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
    this.isLoading = true;
    this.searchList = [];
    this.labtestList = [];
    this.labLoading = true;
    clearTimeout(this.typingTimer);
    if (str.length > 2) {
      this.showSearchArea = true;
      this.searchText = str;
      this.getAllRecord();
      this.getLabRecord();
      this.typingTimer = setTimeout(() => {
        this.onSearch();
        this.getLabTests();
      }, 300);
    } else {
      this.isLoading = false;
      this.showSearchArea = false;
      this.searchList = [];
      this.labtestList = [];
      this.labLoading = false;

    }
  }

  onSearch() {
    // console.log('Search text:', this.searchText);
    let timenow = new Date().getTime();
    let pincode = this.authService.PinCode;
    let werehouseId = this.authService.WHId;
    let panindia = this.authService.IsPanIndia;
    let device = '';
    // this.searchStart = true;
    let searchUrl = `${this.CommonService.searchBaseUrl}product_list_v2?q=${this.searchText}&page=${this.pageNo}&size=${this.size}&ptype='P'&wh=${werehouseId}&panindia=${panindia}&pincode=${pincode}&strict_match=1&mtype='P'&includeGiftable=0&include_discontinued=0&timestamp=${timenow}&format=2`;

    this.CommonService.getSearchData(searchUrl).subscribe((res: any) => {
      // console.log(res)
      if (res) {
        let data: any = res.items;
        this.totalcount = res.total;
        if (data.length > 0) {
          data.forEach((elm: any) => {
            elm.addedQty = 0
            this.addedInCart.forEach((item: any) => {
              if (parseInt(elm.ProductId) == item.ProductId) {
                elm.addedQty = item.ProductCount;
              }
            });
            if (elm.PreferredSubtitute.length > 0 && this.authService.ConfigData.IsDisplayGenericProduct == 1) {
              let subs = this.setSubProduct(elm);
              if (subs.length > this.authService.ConfigData.MaxgenericProductList) {
                let slicedArray = subs.slice(0, this.authService.ConfigData.MaxgenericProductList);
                elm.PreferredSubtitute = slicedArray;
              } else {
                elm.PreferredSubtitute = subs;
              }
            }
            this.searchList.push(elm);
            this.isLoading = false;
          })
          // console.log('searchList', this.searchList);
        }else{
          this.searchList = [];
          this.isLoading = false;
        }
      } else {
        this.searchList = [];
        this.isLoading = false;
      }
    })



    // this.searchStart = false;
  }

  setSubProduct(mainobj: any) {

    let mdLst: any = []
    let data: any = mainobj.PreferredSubtitute;
    data.forEach((elm: any) => {
      if (elm.MRP != '' && elm.MRP != null && elm.MRP > 0) {
        let mainProductConfigPrice: any = '';
        let subProductConfigPrice: any = '';
        let mainProductSize: any = mainobj.Size;
        let subProductSize: any = elm.Size;


        if (this.authService.ConfigData.GenericPercentageCalOnOfferPrice == 'Y') {
          mainProductConfigPrice = mainobj.OfferPrice;
          subProductConfigPrice = elm.CustOfferPrice;
        } else {
          mainProductConfigPrice = mainobj.MRP;
          subProductConfigPrice = elm.MRP;
        }

        if (mainProductSize > 0 && subProductSize > 0) {
          let mainUnitPrice: any = mainProductConfigPrice / mainProductSize;
          let subUnitPrice: any = subProductConfigPrice / subProductSize;
          if (mainUnitPrice > subUnitPrice) {
            let savingsPercentage = ((mainUnitPrice - subUnitPrice) / mainUnitPrice) * 100;
            let prNd = Math.floor(savingsPercentage);
            if (prNd >= this.authService.ConfigData.GenericMinPercentage) {
              let ds = { ...elm, savingsPercent: prNd, isExisting: 0, addedQty: 0 };
              this.addedInCart.forEach((item: any) => {
                if (parseInt(ds.PreferredProductId) == item.ProductId) {
                  ds.isExisting = 1;
                  ds.addedQty = item.ProductCount;
                }
              });
              mdLst.push(ds)
            }
          }
        }
      }
    });

    if (this.authService.ConfigData.SortOnSaving == 'Y') {
      mdLst.sort((a: any, b: any) => b.savingsPercent - a.savingsPercent)
    } else {
      mdLst.sort((a: any, b: any) => a.DisplaySeq - b.DisplaySeq)
    }
    return mdLst;
    // console.log(mdLst);
  }

  loadMore() {
    if (this.totalcount > this.searchList.length) {
      this.pageNo = this.pageNo + 1;
      this.onSearch();
    }
  }

  cleareSearch() {
    this.searchText = '';
    // this.searchStart = false;
    this.searchList = [];
    this.showSearchArea = false;
    this.isLoading = false;
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
      DiscountPercent: productObj.DiscountPercent
    };

    // this.getContraIndecatedSaltAgainstCart(productId , productObj.DisplayName)

    this.dbService.add('cartItems', tmp).subscribe((res: any) => {
      // console.log('Record added successfully.', res);
      // this.newItemEvent.emit();
      this.CommonService.sendClickEvent();
      let objdata = { 'dts': tmp, 'type': 'update' };
      this.CommonService.AClicked(JSON.stringify(objdata))
      this.getAllRecord();
      this.updateSearchList(tmp)
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
        let objdata = { 'dts': tmp, 'type': 'update' };
        this.CommonService.AClicked(JSON.stringify(objdata))
        this.updateSearchList(tmp)
      }
    });
  }

  updateSearchList(tmp: any) {
    this.searchList = this.searchList.map((obj: any) => {
      if (obj.ProductId == tmp.ProductId) {
        obj.addedQty = tmp.ProductCount;
      } else {
        if (obj.PreferredSubtitute.length > 0) {
          obj.PreferredSubtitute = obj.PreferredSubtitute.map((obj1: any) => {
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
        let objdata = { 'dts': pro_id, 'type': 'del' };
        this.CommonService.AClicked(JSON.stringify(objdata))
        this.searchList = this.searchList.map((obj: any) => {
          if (obj.ProductId == pro_id) {
            obj.addedQty = 0;
          } else {
            if (obj.PreferredSubtitute.length > 0) {
              obj.PreferredSubtitute = obj.PreferredSubtitute.map((obj1: any) => {
                if (obj1.PreferredProductId == pro_id) {
                  obj1.addedQty = 0;
                }
                return obj1;
              });
            }
          }
          return obj;
        });
        // this.newItemEvent.emit();
        this.CommonService.sendClickEvent();
      } else {
        // alert('some thing went wrong')
      }
    });
  }

  onKeydown() {
    clearTimeout(this.typingTimer);
  }

  getMaxSavings(data: any) {
    let maxSavings: any = Math.max(...data.map((o: any) => o.savingsPercent));
    return maxSavings;
  }

  displaySubs(ds: any) {
    this.showSubs = ds.ProductId;
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
      // this.newItemEvent.emit();
      this.CommonService.sendClickEvent();
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
        alert(`You can order maximum ${item['DosageRestriction']} quantity`);
        // this.headerModal.nativeElement.click();
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
    let addedNow = mainProd.addedQty * mainProd.Size;
    let tobeAdd = addedNow / altr.Size;
    let alteQty = Math.ceil(tobeAdd);
    // console.log(addedNow, alteQty);
    this.addAlternative(altr, alteQty, mainProd.PrescriptionOTC);
    this.deleteById(mainProd.ProductId);
  }

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

  requestAddNew() {
    let fd = new FormData();
    // fd.append('ProductName', this.searchTxt);
    // fd.append('ProductType', '');
    fd.append('ProductId', '');
    fd.append('ProductName', this.searchText);
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

  getLabTests() {
    let pincodeTxt = ''
    if (this.authService.PinCode > 0) {
      pincodeTxt = '&pincode=' + this.authService.PinCode
    }
    // let searchtext = this.CommonService.searchUrl + '&q=' + this.searchTxt + '&panindia=' + this.authService.IsPanIndia + '&wh=' + this.authService.WHId + pincodeTxt;
    let searchtext =
      this.CommonService.labsearch +
      '&q=' + this.searchText +
      '&strict_match=' + 1 +
      '&wh=' + this.authService.WHId +
      '&panindia=' + this.authService.IsPanIndia +
      pincodeTxt +
      '&page=1' +
      '&size=50' 

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

          this.labtestList.push(...temp);
          this.labLoading = false;

        } else {
          this.labtestList = [];
          this.labLoading = false;
        }
      } else {
          this.labtestList = [];
          this.labLoading = false;
        }
      // console.log(this.labtestList)
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
        // this.newItemEvent.emit();
        this.CommonService.sendClickEvent()
        // this.resetSearch();
        this.getLabRecord();
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
        alert(this.alertMsg);
      }
    }
  }

  updateLabTestList(tmp: any) {
    this.labtestList = this.labtestList.map((obj: any) => {
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
        this.labtestList = this.labtestList.map((obj: any) => {
          if (obj.ServiceId == id) {
            obj.IsAdded = false;
          }
          return obj;
        });
        // this.newItemEvent.emit();
        this.CommonService.sendClickEvent();

        if (this.addedInLabCart.length > 0 && productObj.IsPackage == true) {
          this.addedInLabCart.forEach((dts: any) => {
            if (dts.PkgServiceId == productObj.ServiceId) {
              let ids = dts.ServiceId
              this.dbService.deleteByKey('LabTests', ids).subscribe((status: any) => { })
            }
          });
          this.getLabRecord();
        }
      } else {
        // alert('some thing went wrong')
      }
    });

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
