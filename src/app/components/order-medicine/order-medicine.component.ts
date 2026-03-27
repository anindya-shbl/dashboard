import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebEngageService } from '../../services/web-engage.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-order-medicine',
  templateUrl: './order-medicine.component.html',
  styleUrl: './order-medicine.component.scss'
})
export class OrderMedicineComponent implements OnInit {

  parmalink: any = null;
  addedInCart: any = [];
  productDetails: any = [];
  imageArr: any = [];
  varietyArr: any = [];
  sellerInfo: any = [];
  showMore: boolean = false;
  showAlter: boolean = false;
  similarItems: any = [];
  // genericInfo:any = [];
  // genericWarnings: any = [];
  compositionInfo: any = []
  deliveryMsg: any = '';
  subscription!: Subscription;
  addEvntScription!: Subscription;


  constructor(
    public CommonService: CommonService,
    public authService: AuthService,
    private dbService: NgxIndexedDBService,
    private avtiveRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private webengageService: WebEngageService,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (router.navigated) {
          this.pageLoad()
        }
      }
    });
    this.addEvntScription = this.CommonService.getClickEvent().subscribe(() => {
      this.updatefromSearch();

    })
  }

  ngOnInit(): void {
    // this.pageLoad()
    // this.getSellerInfo()
  }

  pageLoad() {
    this.spinner.show()
    window.scrollTo(0, 0);
    this.parmalink = this.avtiveRoute.snapshot.paramMap.get('name');
    let pId: any = this.parmalink.substring(this.parmalink.lastIndexOf("-") + 1);
    this.getAllRecord();
    this.getOtcDetails(pId);
    this.getSellerInfo()
    this.getDeliveryDate();
  }

  getAllRecord() {
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      this.addedInCart = res;
    });
  }


  getOtcDetails(ProdId: any) {

    this.addedInCart = [];
    this.productDetails = [];
    this.imageArr = [];
    this.varietyArr = [];
    this.sellerInfo = [];
    this.showMore = false;
    this.similarItems = [];
    // this.genericInfo = [];
    // this.genericWarnings = [];
    this.compositionInfo = [];
    
    this.deliveryMsg = '';

    let data: any = {
      'productId': ProdId,
      'warehouseId': this.authService.WHId,
      'panindia': this.authService.IsPanIndia,
      'pincode': this.authService.PinCode,
    }

    this.CommonService.postProductData('product/getProductDetail', data).subscribe((res: any) => {
      // console.log(res);
      if (res && res.msgcode == 1) {
        if (res.product.length > 0) {
          let data = res.product[0];
          // data.forEach((elm: any) => {
          data.details.addedQty = 0;
          data.details.showVarient = 0;
          this.addedInCart.forEach((item: any) => {
            if (parseInt(data.details.ProductId) == item.ProductId) {
              data.details.addedQty = item.ProductCount;
            }
          });

          if((data.details.ProductStatus == 'D' || (data.details.ProductStatus == 'C' && data.details.IsOutOfStock == 'Y')) && data.details.RefProductDetails != null && data.details.RefProductDetails != undefined && data.details.RefProductDetails != ''){
            if(data.details.RefProductDetails.IsOutOfStock == 'N' && data.details.ProductStatus == 'C'){
              data.details.showVarient = 1;
            }
          }
          
          if(data.details.searchData != undefined && this.authService.ConfigData.IsDisplayGenericProduct == 1){
              let subs = this.setSubProduct(data.details.searchData);             
              if(subs.length > this.authService.ConfigData.MaxgenericProductList){
                let slicedArray = subs.slice(0, this.authService.ConfigData.MaxgenericProductList);
                data.details.PreferredSubtitute = slicedArray;
              }else{
                data.details.PreferredSubtitute = subs;
              }
          }
          
          if (data.product_images.length > 0) {
            this.imageArr = data.product_images;
          } else {
            this.imageArr.push(
              {
                "ProductId": data.details.ProductId,
                "ProductImage": "https://asset.sastasundar.com/incom/images/product/thumb/Med.svg",
                "DisplaySeq": 1,
                "ProductBigImageUrl": "https://asset.sastasundar.com/incom/images/product/thumb/Med.svg"
              }
            )
          }
          this.varietyArr = data.variety_details;          
          this.getGenericDetails(data);
          if(data.details.PreferredSubtitute && data.details.PreferredSubtitute.length == 0){
            this.getSimilarProducts(data.details.ProductId);
          }

          this.productDetails.push(data.details);
          this.spinner.hide();

          // console.log(this.productDetails, this.imageArr, this.varietyArr)
          // })
        } else {
          this.productDetails = [];
          this.imageArr = [];
          this.varietyArr = [];
          this.spinner.hide();
        }
      } else {
        this.productDetails = [];
        this.imageArr = [];
        this.varietyArr = [];
        this.spinner.hide();
      }
    })
  }

  getSellerInfo() {
    let data: any = {
      'warehouseId': this.authService.WHId,
      'panindia': this.authService.IsPanIndia,
      'pincode': this.authService.PinCode,
    }
    this.CommonService.postProductData('customer/v1/product/getsellername', data).subscribe((res: any) => {
      // console.log(res);
      if (res && res.response_code == 200) {
        if (res.data != undefined) {
          res.data.HBName = res.data.HBName.split('<br><br')[0].trim();
          this.sellerInfo.push(res.data)
        }
      }
    })
  }

  getGenericDetails(prd: any) {
    let data: any = {
      // "AppType" : "M",
      // "AppVersion" : "1.0.1",
      "GenericId" : prd.SaltId,
      "GenericName" : prd.SaltName,
      "PanIndia" : this.authService.IsPanIndia,
      "PinCode" : this.authService.PinCode,
      // "RouteId" : "",
      // "UserAgent" : "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
      // "UserId" : "",
      // "genericView" : "M",
      // "lang" : "e",
      "sourceType" : prd.PrescriptionOTC,
      'warehouseId': this.authService.WHId,
    }
    this.CommonService.postProductData('product/genericDetails', data).subscribe((res: any) => {
      // console.log(res);
      if (res && res.msgcode == 1) {
        if (res.results != undefined && res.results.GenericDetails.length>0) {
          this.compositionInfo = res.results.GenericDetails
          // res.results.GenericDetails.foreEach((dts:any)=>{
          //   if(dts.warning == 0){
          //     this.genericInfo.push(dts)
          //   }else{
          //     this.genericWarnings.push(dts)
          //   }
          // })
        }
      }
    })
  }

  getDeliveryDate() {
    let url = `customer/v1/location/getdeliverydate?page=H&Pincode=${this.authService.PinCode}`;
    this.CommonService.getDeliveryDays(url).subscribe((res: any) => {
      // console.log(res);
      if (res && res.response_code == 200) {
        this.deliveryMsg = res.data.Msg;
        // this.sellerInfo.push(res.data)
      }
    })

  }

  getSimilarProducts(pId: any) {
    let pincode = this.authService.PinCode;
    let werehouseId = this.authService.WHId;
    let searchUrl = `${this.CommonService.searchBaseUrl}similar_products?product_id=${pId}&m=1&wh=${werehouseId}&pincode=${pincode}&format=2`;

    this.CommonService.getSearchData(searchUrl).subscribe((res: any) => {
      // console.log(res);
      if (res) {
        this.similarItems = res.items
      }
    })
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
      ExpiryDate: productObj.ExpDate,
      ProductInteractiveModule: productObj.InteractiveModule,
      ProductInteractiveSubModule: productObj.InteractiveSubModule,
      IsNonReturnable: productObj.IsNonReturnable,
      RefOrderId: 0,
      Brand: productObj.Brand,
      DiscountPercent: productObj.DiscountPercent
    };

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
    let pro_id = productObj.ProductId;
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      if (item['DosageRestriction'] == 0 || item['DosageRestriction'] == null  || item['DosageRestriction'] == undefined ) {
        const updatedItem = { ...item, 'ProductCount': item['ProductCount'] + 1 }
        this.updateById(updatedItem)
      } else if(item['DosageRestriction'] > qty) {
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
        this.updateSearchList(tmp)
      }
    });
  }

  updateSearchList(tmp: any) {
    this.productDetails = this.productDetails.map((obj: any) => {
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
        // let objdata = { 'dts': pro_id, 'type': 'del' };
        // this.CommonService.AClicked(JSON.stringify(objdata))
        this.productDetails = this.productDetails.map((obj: any) => {
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
        this.productDetails.forEach((item: any) => {
          const match = this.addedInCart.find((elm: any) => parseInt(elm.ProductId) === parseInt(item.ProductId));
          if (match) {
            item.addedQty = match.ProductCount;
          } else {
            item.addedQty = 0;
            if(item.PreferredSubtitute.length>0){
              item.PreferredSubtitute.forEach((subs: any) => {
                const pMatch = this.addedInCart.find((elm: any) => parseInt(elm.ProductId) == subs.PreferredProductId);
                if(pMatch){
                  subs.addedQty = pMatch.ProductCount;
                }else{
                  subs.addedQty = 0;
                }
              })
            }
          }
        });
      } else {
        this.productDetails.forEach((elm: any) => {
          elm.addedQty = 0;
        })
      }
    });
  }

  // setSubProduct(mainobj: any){

  //   let mdLst : any =[]
  //   let data: any = mainobj.PreferredSubtitute;
  //   if(data.length>0){
  //     data.forEach((elm: any) => {
  //     if(elm.MRP != '' && elm.MRP != null && elm.MRP > 0){
  //       let mainProductConfigPrice: any = '';
  //       let subProductConfigPrice: any = '';
  //       let mainProductSize: any = mainobj.Size;
  //       let subProductSize: any = elm['Size'];

  //       if(this.authService.ConfigData.GenericPercentageCalOnOfferPrice == 'Y'){
  //         mainProductConfigPrice = mainobj.OfferPrice;
  //         subProductConfigPrice = elm['CustOfferPrice'];
  //       }else{
  //         mainProductConfigPrice = mainobj.MRP;
  //         subProductConfigPrice = elm['MRP'];
  //       }
        
  //       if(mainProductSize > 0 && subProductSize>0){
  //         let mainUnitPrice : any = mainProductConfigPrice / mainProductSize;
  //         let subUnitPrice : any = subProductConfigPrice / subProductSize;
  //         if(mainUnitPrice > subUnitPrice){
  //           let savingsPercentage = ((mainUnitPrice - subUnitPrice) / mainUnitPrice) * 100;
  //           let prNd =  Math.floor(savingsPercentage);
  //           if(prNd >= this.authService.ConfigData.GenericMinPercentage){
  //             let ds =  { ...elm, pricePerUnit: subUnitPrice, savingsPercent: prNd, isExisting: 0, addedQty:0};
  //             this.addedInCart.forEach((item: any) => {
  //               if(parseInt(ds['PreferredProductId']) == item.ProductId){                
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

  //   if(this.authService.ConfigData.SortOnSaving == 'Y'){
  //     mdLst.sort((a:any, b: any) => b.savingsPercent - a.savingsPercent)
  //   }else{
  //     mdLst.sort((a:any, b: any) => a.DisplaySeq - b.DisplaySeq)
  //   }
  //   }
  //   return mdLst;
  //   // console.log(mdLst);
  // }

  setSubProduct(mainobj: any) {
    let mdLst: any = []
    let data: any = mainobj.PreferredSubtitute;
    data.forEach((elm: any) => {
      elm.savingsPercent = 0,
      elm.addedQty = 0;
      elm.pricePerUnit = 0;
      this.addedInCart.forEach((item: any) => {
        if (parseInt(elm.PreferredProductId) == item.ProductId) {
          elm.addedQty = item.ProductCount;
        }
      });
      if (elm.MRP != '' && elm.MRP != null && elm.MRP > 0) {
        let mainProductConfigPrice: any = '';
        let mainProductSize: any = mainobj.Size;

        let subProductConfigPrice: any = '';
        let subProductSize: any = elm['Size'];

        if (this.authService.ConfigData.GenericPercentageCalOnOfferPrice == 'Y') {
          mainProductConfigPrice = mainobj.OfferPrice;
          subProductConfigPrice = elm['CustOfferPrice'];
        } else {
          mainProductConfigPrice = mainobj.MRP;
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


  alterAction(event: any){
    // console.log(event)
    if(event.type=='subNew'){
      this.addAlternative(event.dtls)
    }else if(event.type=='subPlus'){
      this.subAddPlus(event.dtls)
    }else if(event.type=='subMinus'){
      this.subAddMinus(event.dtls)
    }else if(event.type=='subReplace'){
      this.alterReplace(event.dtls)
    }else if(event.type=='redirect'){
      this.productRedirect(event.dtls)
    }
    else{
      return;
    }
  }

  alterReplace(prdct: any){
    // console.log(prdct);
    let ProductQty: any = prdct.replaceQty;
    let PrescriptionOTC: any = this.productDetails[0].PrescriptionOTC;
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
      this.CommonService.sendClickEvent();
      this.getAllRecord();
      this.updateSearchList(tmp);
      this.deleteById(this.productDetails[0].ProductId);
    });
  }

  subAddPlus(productObj : any){
    let pro_id = productObj.PreferredProductId;
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      if(item['DosageRestriction'] == 0 || (item['DosageRestriction'] != 0 && item['DosageRestriction']> qty)){
        const updatedItem = {...item, 'ProductCount': item['ProductCount'] + 1 }
      // console.log(updatedItem);
      this.updateById(updatedItem)
      }else{
        alert('max limit reached');
        // this.alertMsg = `You can order maximum ${item['DosageRestriction']} quantity`;
        // this.headerModal.nativeElement.click();
      }
    });
  }

  subAddMinus(productObj : any){
    let pro_id = productObj.PreferredProductId;
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      if(qty >1){
        const updatedItem = {...item, 'ProductCount': item['ProductCount'] - 1 };
      // console.log(updatedItem);
      this.updateById(updatedItem)
      }else{
        // alert('remove');
        this.deleteById(pro_id)
      }
    });
  }

  addAlternative(prdct: any){
    // console.log(prdct);
    let ProductQty: any = 1;
    let PrescriptionOTC: any = this.productDetails[0].PrescriptionOTC;
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
      this.CommonService.sendClickEvent();
      this.getAllRecord();
      this.updateSearchList(tmp)
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

  showHideMore() {
    this.showMore = !this.showMore
  }


  productRedirect(evnt: any) {
    // console.log(evnt)
    let encodedId = evnt.EncodeProdId;
    let displayname = evnt.DisplayName;
    let producttype = evnt.PrescriptionOTC;
    this.viewProductDetails(encodedId, displayname, producttype)
  }

  viewProductDetails(encodedId: any, displayname: any, producttype: any) {
    let prod_name = '';
    let pLink = '';

    if (displayname != '' && displayname != null && (encodedId != null && encodedId!=undefined && encodedId!= '')) {
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
    }else{
      alert('Something went wrong')
    }
  }

  getMaxSavings(data: any){
    let maxSavings : any = Math.max(...data.map((o: any) => o.savingsPercent));
    return maxSavings;
  }

  showHideAlter(){
    this.showAlter = !this.showAlter
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  buyNow() {
    if (this.productDetails[0].addedQty > 0) {
      let d: Date = new Date();
      this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
      window.location.href = this.CommonService.baseurl + "customercart";
    }else{
      this.addToCart(this.productDetails[0], 1);
      let d: Date = new Date();
      this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
      window.location.href = this.CommonService.baseurl + "customercart";
    }

  }

  viewbyBrand(data: any){
    let input = data
    .replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with '-'
    .replace(/^-+|-+$/g, '');
    this.router.navigate(['newbrand/brandlisting/', input])
  }

}

