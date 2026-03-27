import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AnimationPlayer } from '@angular/animations';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Subscription } from 'rxjs';
import { WebEngageService } from '../../../services/web-engage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-tests',
  templateUrl: './home-tests.component.html',
  styleUrl: './home-tests.component.scss'
})
export class HomeTestsComponent implements OnInit {


  // @ViewChild('stepModal') stepModal!: ElementRef;

  popularTests: any = [];
  addedInLabCart: any = [];
  isLoading: boolean = false;
  alertMsg: any = '';
  tempData: any = [];
  testEvntScription:Subscription;
  @ViewChild('labAddInfoModal') labAddInfoModal!: ElementRef;

  constructor(
    private authService: AuthService, 
    private CommonService: CommonService, 
    private dbService: NgxIndexedDBService,
    private webengageService: WebEngageService,
    private router: Router
  ) {
    this.testEvntScription = this.CommonService.getClickEvent().subscribe(()=>{
      this.updatebySearch();
    })
   }

  ngOnInit(): void {
    this.isLoading = true;
    this.getLabRecord();
    this.getpopularTests();
  }

  customOptions: OwlOptions = {
    // autoWidth: true,
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
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      },
      1024: {
        items: 4
      },
      // 1280: {
      //   items: 5
      // },
      1400: {
        items: 5
      },
      1600: {
        items: 6
      },
      1900: {
        items: 7
      },
    },
  }

  getLabRecord() {
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInLabCart = res;
    });
  }

  getpopularTests() {
    this.tempData=[];
    this.CommonService.getLabData('home/popular-test').subscribe((res: any) => {
      if (res && res.data.Item.length > 0) {
        let id = 0
        if (res.data.Item.length > 0) {
          res.data.Item.forEach((item: any) => {

            let Id: any = (id + 1).toString();
            if(item.PermalinkNew != null && item.PermalinkNew != '' && item.PermalinkNew != undefined){}
            let img = '';
            if(item.PermalinkNew != null && item.PermalinkNew != '' && item.PermalinkNew != undefined){
              img = this.setImg(item.PermalinkNew);
            }else{
              img = 'https://asset.sastasundar.com/incom/sspl_website/images/test_image170x170.png';
            }
            item.IsAdded = false;
      
            if (this.addedInLabCart.length > 0) {
              this.addedInLabCart.forEach((em: any) => {
                if ((item.ServiceId == em.ServiceId) && (em.PkgServiceId == undefined || em.PkgServiceId == null || em.PkgServiceId == '')) {
                  item.IsAdded = true;
                }
              });
            };

            this.popularTests.push({ ...item, id: Id, showImg: img })
            // this.tempData.push({ ...item, id: Id, showImg: img });
          });
          // this.getLabRecord()
        }else{
          this.isLoading = false;
          this.popularTests = [];
        }
      }else{
        this.isLoading = false;
        this.popularTests = [];
      }
      // console.log(this.popularTests)
    });
  }

  viewPckgDtls(plink: any) {
    // window.open(plink, '_blank');
    const path = plink.replace('https://sastasundar.com/test/', '');
    this.router.navigate(['newtest/', path])
  }

  setImg(input: any) {
    let parts = input.split("/");
    let lastPart = parts[parts.length - 1];
    let path: any = lastPart
      .split("-") // split by '-'
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
      .join("_"); // join with '_'
    let imgPath: any = `https://asset.sastasundar.com/genu_path_lab/images/test_n_packages/icon250x250/web/${path}.png`;
    // console.log(imgPath)
    return imgPath;
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
        this.CommonService.sendClickEvent();
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
    }else{
      if(this.alertMsg != ''){
        this.labAddInfoModal.nativeElement.click();
      }
    }
  }

  updateLabTestList(tmp: any){
    this.popularTests = this.popularTests.map((obj: any) => {
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
        this.popularTests = this.popularTests.map((obj: any) => {
          if (obj.ServiceId == id) {
            obj.IsAdded = false;
          }
          return obj;
        });
        // this.newItemEvent.emit();
        this.CommonService.sendClickEvent();

        if (this.addedInLabCart.length > 0 && productObj.IsPackage == true) {
          this.addedInLabCart.forEach((dts: any) => {
            if(dts.PkgServiceId == productObj.ServiceId){
              let ids = dts.ServiceId
              this.dbService.deleteByKey('LabTests', ids).subscribe((status: any) => {})
            }
          });
          this.getLabRecord();
        }
      }else{
        // alert('some thing went wrong')
      }
    });
    
  }

  updatebySearch() {
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInLabCart = res;
      this.popularTests.forEach((obj: any) => obj.IsAdded = false);

      if (this.addedInLabCart.length > 0) {
        this.popularTests.forEach((elm: any) => {
          this.addedInLabCart.forEach((item: any) => {
            if ((elm.ServiceId == item.ServiceId) && (item.PkgServiceId == undefined || item.PkgServiceId == null || item.PkgServiceId == '')) {
              elm.IsAdded = true;
            }
          });
        });
      };
    });
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

  viewAllTests(){
    this.router.navigate(['/newdiagnostic-test']);
  }
}