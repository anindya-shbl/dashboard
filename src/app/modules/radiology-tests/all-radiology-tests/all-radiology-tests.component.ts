import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { WebEngageService } from '../../../services/web-engage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-all-radiology-tests',
  templateUrl: './all-radiology-tests.component.html',
  styleUrl: './all-radiology-tests.component.scss'
})
export class AllRadiologyTestsComponent implements OnInit {

  pageNo: any = 1;
  pageSize: any = 25;
  addedInLabCart: any = [];
  totalcount: any = 0;
  searchProducts: any = [];
  searchLoading: boolean = false;
  addedInCart: any = [];
  isExisting: any = 0;
  addedQty: any = 0;
  alertMsg: any = '';
  testEvntScription:Subscription;
  @ViewChild('radiologyMdl') radiologyMdl!: ElementRef;

  constructor(
    public CommonService: CommonService, 
    private dbService: NgxIndexedDBService, 
    private authService: AuthService,
    private router: Router, 
    private cookieService: CookieService, 
    private toastr: ToastrService, 
    private webengageService: WebEngageService,
    private spinner: NgxSpinnerService
  ){
      this.testEvntScription = this.CommonService.getClickEvent().subscribe(()=>{
      this.updatebySearch();
    })
    }

  ngOnInit() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    })
    // this.isLoggedIn = this.cookieService.get('isLoggedIn');
    this.spinner.show();
    this.searchLoading = true;
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInLabCart = res;
      this.getAllRadiologyTests()
    });
  }

  getLabRecord() {
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInLabCart = res;
    });
  }

  getAllRadiologyTests() {
    let pincodeTxt = ''
    if (this.authService.PinCode > 0) {
      pincodeTxt = '&pincode=' + this.authService.PinCode
    }
    // let searchtext = this.CommonService.searchUrl + '&q=' + this.searchTxt + '&panindia=' + this.authService.IsPanIndia + '&wh=' + this.authService.WHId + pincodeTxt;
    let searchtext =
      this.CommonService.searchBaseUrl +'service/filter?'+
      '&q=' + '' +
      '&sortorder=' + 'asc' +
      '&sortby=' + 'ServiceName' +
      '&is_radiology=' + 1 +
      '&is_package=' + 0 +
      pincodeTxt +
      '&page=' + this.pageNo +
      '&size=' + this.pageSize

      this.CommonService.getSearchData(searchtext).subscribe((res: any) => {
        // console.log(res);
        if(res){
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
            this.spinner.hide();

          } else {
            // this.ProductList = [];
            this.spinner.hide();
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

    if(this.addedInLabCart.length > 0){

      if(productObj.IsPackage == false){
        this.addedInLabCart.forEach((ds : any)=>{
          if(ds.ServiceId == productObj.ServiceId){
            // alert(`This test already included in selected package`);
            this.alertMsg = `This test already included in selected package`
            canAdd = false;
          }
        })    
      }
      if(productObj.IsPackage == true){
        this.addedInLabCart.forEach((ds : any)=>{
          if (productObj.PackageServices != undefined && productObj.PackageServices.length > 0) {
            productObj.PackageServices.forEach((dts: any) => {
              if(ds.ServiceId == dts.ServiceId){
                // alert(`Some test of this package already added in your cart, please remove them to add this package`);
                this.alertMsg = `Some test of this package already added in your cart, remove them to add this package`
                canAdd = false;
              }
            })
          }
        })    
      }

    }

    if(canAdd == true){
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
    }else{
      if(this.alertMsg != ''){
        this.radiologyMdl.nativeElement.click();
      }
    }
  }

  updateLabTestList(tmp: any){
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
      if(status == true){
        this.removeLabWebEngage(productObj);
        this.getLabRecord();         
        this.searchProducts = this.searchProducts.map((obj: any) => {
          if (obj.ServiceId == id) {
            obj.IsAdded = false;
          }
          return obj;
        });
        // this.newItemEvent.emit();


        if (this.addedInLabCart.length > 0 && productObj.IsPackage == true) {
          this.addedInLabCart.forEach((dts: any) => {
            if(dts.PkgServiceId == productObj.ServiceId){
              let ids = dts.ServiceId
              this.dbService.deleteByKey('LabTests', ids).subscribe((status: any) => {})
            }
          });
          this.getLabRecord();
        }
        this.CommonService.sendClickEvent();
      }else{
        // alert('some thing went wrong')
      }
    });

  }

  loadMore(){
    if(this.totalcount > this.searchProducts.length ){
      this.pageNo = this.pageNo + 1;
      this.spinner.show();
      this.getAllRadiologyTests();
    }
  }

  updatebySearch() {
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInLabCart = res;
      this.searchProducts.forEach((obj: any) => obj.IsAdded = false);

      if (this.addedInLabCart.length > 0) {
        this.searchProducts.forEach((elm: any) => {
          this.addedInLabCart.forEach((item: any) => {
            if ((elm.ServiceId == item.ServiceId) && (item.PkgServiceId == undefined || item.PkgServiceId == null || item.PkgServiceId == '')) {
              elm.IsAdded = true;
            }
          });
        });
      };
    });
  }


  viewPackageDetails(item: any){
    let plink = item.PermalinkNew;
    // window.open(plink)
    const path = plink.replace('https://sastasundar.com/test/', '');
    this.router.navigate(['newtest/', path])
  }

  addLabWebEngage(data: any){
    let webData = {
      'Lab Test Name' : data.ServiceName,
      'Preparation Needed' : data.ServicePreparation ? data.ServicePreparation : '' ,
      'Price' : data.OfferFees,
      // 'Booked From Category ' : category ? category : '',
    }
    this.webengageService.trackEvent('Lab Test Added to Cart', webData);
  }

  removeLabWebEngage(data: any){
    let webData = {
      'Lab Test Name' : data.ServiceName,
      'Preparation Needed' : data.ServicePreparation ? data.ServicePreparation : '' ,
      'Price' : data.OfferFees
    }
    this.webengageService.trackEvent('Lab Test Removed From Cart', webData);
  }

}