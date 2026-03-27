import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebEngageService } from '../../services/web-engage.service';

@Component({
  selector: 'app-labcart-summary',
  templateUrl: './labcart-summary.component.html',
  styleUrl: './labcart-summary.component.scss'
})
export class LabcartSummaryComponent implements OnInit {
  isLoggedIn: any = 'false';
  responseData: any = [];
  selectedTests: any = [];
  totalCount: any = 0;
  clickEventsubscription: Subscription;
  infoMsg: any = '';
  packageDetails: any = [];
  showPackageDetails : boolean = false;
  displayPckgId: any = '';

  // @ViewChild('infoMdl') infoMdl: any;

  constructor(
    public CommonService: CommonService,
    private dbService: NgxIndexedDBService,
    private cookieService: CookieService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private webengageService: WebEngageService
  ) {
    this.clickEventsubscription = this.CommonService.getClickEvent().subscribe(() => {
        this.getLocalCart();
      }
    );
  }

  ngOnInit() {
    // debugger
    this.getLocalCart();
    this.isLoggedIn = this.cookieService.get('isLoggedIn');
  }

  getLocalCart() {
    this.infoMsg = '';
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('all records', res);
      this.selectedTests = res;
      this.count();
      if (this.selectedTests.length == 0) {
        // let d: Date = new Date();
        // this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
      }
      this.spinner.hide();
    });
  }

  count() {
    this.infoMsg = '';
    if (this.selectedTests.length > 0) {
      let ds : any = [];
      this.selectedTests.forEach((item: any) => {
        if (item.PkgServiceId == undefined || item.PkgServiceId == null || item.PkgServiceId == '') {
          ds.push(item)
        }
      });
      this.totalCount = ds.length;
    } else {
      this.totalCount = 0;
    }
  }

  deleteById(productObj: any) {
    let id = productObj.ServiceId;
    this.dbService.deleteByKey('LabTests', id).subscribe((status: any) => {
      if (status == true) {
        this.removeLabWebEngage(productObj);
        this.getLocalCart();
        this.CommonService.sendClickEvent();
        if (this.selectedTests.length > 0 && productObj.IsPackage == true) {
          this.selectedTests.forEach((dts: any) => {
            if(dts.PkgServiceId == productObj.ServiceId){
              let ids = dts.ServiceId
              this.dbService.deleteByKey('LabTests', ids).subscribe((status: any) => {})
            }
          });
          this.getLocalCart();
        }
      } else {
        alert('some thing went wrong');
      }
    });
  }

  proceed() {
    if (this.isLoggedIn == 'true') {
      // this.CommonService.cartSynchCall = true;
      let d: Date = new Date();
      this.cookieService.set('labCartSynch', '0', d.getTime() + 86400 * 30, '/');
      this.router.navigate(['customerlabcart']);
    } else {
      this.router.navigate(['newlogin']);
      // this.openLogin.nativeElement.click();
    }
  }

  ngOnDestroy() {
    this.clickEventsubscription.unsubscribe();
  }

  // LoginModClose(){
  //   this.closelogin.nativeElement.click();
  // }

  SearchOTCMEDProduct() {
    // this.Searchchild.searchOTCMed();
  }
  

  bookbyPrescriptions(){
    let d: Date = new Date();
    this.cookieService.set('labCartSynch', '0', d.getTime() + 86400 * 30, '/');
    this.router.navigate(['bookbyprescription']);
  }

  viewPackageDetails(testId: any){
    // console.log(testId);
    let pkArr : any = [];
    // this.dbService.getAll('LabTests').subscribe((res: any) => {
      // localLabItems = res;
      if(this.selectedTests.length > 0) {
        this.selectedTests.forEach((elm : any)=>{
          if(elm.PkgServiceId == testId){
            pkArr.push(elm);
          }
        });
        this.packageDetails = pkArr;
        // console.log(this.packageDetails)
        this.displayPckgId = testId;
        this.showPackageDetails = !this.showPackageDetails
      }
    // })
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