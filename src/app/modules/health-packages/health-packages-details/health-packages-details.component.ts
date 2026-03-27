import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-health-packages-details',
  templateUrl: './health-packages-details.component.html',
  styleUrl: './health-packages-details.component.scss'
})
export class HealthPackagesDetailsComponent implements OnInit {

  parmalink: any = null;
  packageDetails: any = [];
  steps: any = [];
  faqs: any = [];
  popularPackages: any = [];
  addedInLabCart: any = [];
  alertMsg: any = '';
  testEvntScription:Subscription;
  packageSub!: Subscription;
  subscription!: Subscription

  @ViewChild('allPckgDtlMdl') allPckgDtlMdl!: ElementRef;

  constructor(
    public CommonService: CommonService,
    public authService: AuthService,
    private avtiveRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dbService: NgxIndexedDBService,
    private webengageService: WebEngageService
  ) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (router.navigated) {
          this.pageReLoad()
        }
      }
    });
    this.testEvntScription = this.CommonService.getClickEvent().subscribe(()=>{
      this.updatebySearch();
    })
  }

  ngOnInit(): void {
    this.pageReLoad()
  }

  pageReLoad() {
    this.spinner.show()
    window.scrollTo(0, 0);
    this.packageDetails = [];
    this.steps = [];
    this.faqs = [];
    this.popularPackages = [];
    this.parmalink = this.avtiveRoute.snapshot.paramMap.get('parmalink');
    if (this.parmalink != null) {
      this.getLabRecord();
      this.getPackageDetails();
      this.packageSub = this.authService.PoularPackageList$.subscribe(pckgLst => {
        if (pckgLst.length === 0) {
          this.getpopularPackages()
        } else {
          this.popularPackages = pckgLst;
        }
      });
      this.getSteps()
    } else {
      this.spinner.hide();
      this.router.navigate(['/newlab-test'])
    }
  }

  getLabRecord() {
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInLabCart = res;
    });
  }

  getPackageDetails() {
    let data = {
      PermaName: this.parmalink,
      isPackage: '1'
    };

    this.CommonService.postLabData('lab/service/view', data).subscribe((res: any) => {
      // console.log(res);
      if (res && res.response_code == 0) {
        if (res.data.Items) {
          res.data.Items.IsAdded = false;
          if (this.addedInLabCart.length > 0) {
            this.addedInLabCart.forEach((item: any) => {
              if ((res.data.Items.ServiceId == item.ServiceId)) {
                res.data.Items.IsAdded = true;
              }
            });
          };
          this.packageDetails.push(res.data.Items);
          // this.getFaqs(this.packageDetails[0].ServiceId)

        }
        this.spinner.hide();
      } else {
        this.packageDetails = [];
        this.spinner.hide();
      }
    })
  }

  getSteps() {
    let pincodeTxt = ''
    if (this.authService.PinCode > 0) {
      pincodeTxt = this.authService.PinCode
    }
    let url = `lab/home/homeCollectionWorks?PinCode=${pincodeTxt}&warehouseId=${this.authService.WHId}&PanIndia=${this.authService.IsPanIndia}`

    this.CommonService.getLabData(url).subscribe((res: any) => {
      // console.log(res);
      if (res && res.response_code == 0) {
        this.steps = res.data;
      } else {
        this.steps = []
      }
    })
  }

  getpopularPackages() {
    this.CommonService.getLabData('home/popular-package').subscribe((res: any) => {
      if (res && res.data.length > 0) {
        let id = 0
        if (res.data.length > 0) {
          res.data.forEach((item: any) => {
            let Id: any = (id + 1).toString()
            this.popularPackages.push({ ...item, id: Id })
          });
        }
        this.authService.setPoularPckgList(this.popularPackages);
      }
      // console.log(this.popularCategory)
    });
  }

  getFaqs(serviceId: any) {
    let pincodeTxt = ''
    if (this.authService.PinCode > 0) {
      pincodeTxt = this.authService.PinCode
    }

    let url = `lab/service/faq?PinCode=${pincodeTxt}&warehouseId=${this.authService.WHId}&PanIndia=${this.authService.IsPanIndia}&id=${serviceId}`

    this.CommonService.getLabData(url).subscribe((res: any) => {
      if (res && res.response_code == 0) {
        this.faqs = res.data;
      } else {
        this.faqs = []
      }
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
          if (productObj.Services != undefined && productObj.Services.length > 0) {
            productObj.Services.forEach((dts: any) => {
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
        // this.resetSearch();
        this.getLabRecord();
        this.CommonService.sendClickEvent();
        this.updateLabTestList(tmp);
        this.addLabWebEngage(tmp);
      });

      if (productObj.Services != undefined && productObj.Services.length > 0) {
        productObj.Services.forEach((productObj_pkg: any) => {
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
        this.allPckgDtlMdl.nativeElement.click();
      }
    }
  }

  updateLabTestList(tmp: any) {
    this.packageDetails = this.packageDetails.map((obj: any) => {
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
        this.packageDetails = this.packageDetails.map((obj: any) => {
          if (obj.ServiceId == id) {
            obj.IsAdded = false;
          }
          return obj;
        });
        // this.newItemEvent.emit();


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


  updatebySearch() {
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInLabCart = res;
      this.packageDetails.forEach((obj: any) => obj.IsAdded = false);

      if (this.addedInLabCart.length > 0) {
        this.packageDetails.forEach((elm: any) => {
          this.addedInLabCart.forEach((item: any) => {
            if ((elm.ServiceId == item.ServiceId)) {
              elm.IsAdded = true;
            }
          });
        });
      };
    });
  }

  changePackage(evnt: any) {
    const path = evnt.replace('https://sastasundar.com/health-packages/', '');
    this.router.navigate(['newhealth-packages/', path])
  }

  viewPackageDetails(item: any) {
    let plink = item.PermalinkNew;
    // this.router.navigate(['healtharticle', plink]);
    // window.open(plink)
    const path = plink.replace('https://sastasundar.com/test/', '');
    this.router.navigate(['newtest/', path])
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.packageSub) this.packageSub.unsubscribe();
  }

}
