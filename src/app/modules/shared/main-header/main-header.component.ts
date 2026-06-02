import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent implements OnInit {

  totalCount: any = 0;
  labTestCount: any = 0;
  allCount: any = 0;
  cartDeleteScription:Subscription;
  currentModule: any = '';
  isLoggedIn: any = 'false';
  UserName: any = '';
  CityName: any = '';
  DlMsg: any = '';
  PinCode: any = '';

  requestPincode: any = '';
  pinSubmit: boolean = false;
  pinDetectMsg: any ='';
  pinchangeForm!: FormGroup;
  geoBlock: boolean = false;
  geoBlockMsg: boolean = false;

  scrolled: boolean = false;

    @HostListener("window:scroll", [])
    onWindowScroll() {
        this.scrolled = window.scrollY > 0;
    }



  constructor(
    public CommonService: CommonService, 
    private dbService: NgxIndexedDBService, 
    private router: Router, 
    private activatedroute: ActivatedRoute,
    public authService: AuthService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder){
    this.cartDeleteScription = this.CommonService.getClickEvent().subscribe(()=>{
      this.count();
      this.setDetails();
    })
  }

  ngOnInit() {
    
    // this.router.events.subscribe((event: any) => {
    //   if (event instanceof NavigationEnd) {
    //     this.currentModule = this.activatedroute.snapshot.firstChild?.routeConfig?.path;
    //     // console.log('this.router.url', this.currentModule);
    //   }
    // });
    this.count();
    this.setDetails();
    this.generatePinform();
    this.setPinDetect();
  }

  count(){
    this.dbService.count('cartItems').subscribe((res: any) => {
      // console.log('totaCount', res);
      this.totalCount = res;
    });
    this.dbService.getAll('LabTests').subscribe((res: any) => {
      // console.log('totaCount', res);
      let ds : any = [];
      if(res.length>0){
        res.forEach((item: any)=>{
          if(item.PkgServiceId == undefined || item.PkgServiceId == null || item.PkgServiceId == ''){
            ds.push(item)
          }
        });
        this.labTestCount = ds.length;
        this.allCount = this.totalCount + this.labTestCount;
      }else{
        this.labTestCount = 0;
      }
      
    })
  }

  generatePinform() {
    this.pinchangeForm = this.formBuilder.group({
      Pincode: ['', Validators.required],
    })
  }

  get f() { return this.pinchangeForm.controls; }


  gotoCart(){
    // this.router.navigate(['CustomarCart/ViewCart']);
    let d: Date = new Date();
    this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
    window.location.href=this.CommonService.baseurl+"customercart";
  }

  gotoLab(){
    // this.router.navigate(['CustomarCart/ViewCart']);
    let d: Date = new Date();
    this.cookieService.set('labCartSynch', '0', d.getTime() + 86400 * 30, '/');
    window.location.href=this.CommonService.baseurl+"customerlabcart";
  }

  logOut(){
    // this.router.navigate(['CustomarCart/ViewCart']);
    // this.dbService.clear('cartItems').subscribe((res: any) => {
    //   if(res==true){
        this.cookieService.delete('isLoggedIn');
        this.isLoggedIn = 'false';
        this.UserName = '';
        this.PinCode = '';
        window.location.href=this.CommonService.baseurl+"index.php/user/logout";
      // }
    // })
  }

  setDetails(){
    this.isLoggedIn = this.cookieService.get('isLoggedIn');
    this.UserName = this.authService.UserName;
    this.PinCode = this.authService.PinCode;
    this.CityName = this.authService.PanIndiaCityName;
    this.DlMsg = this.cookieService.get('DeliveryDateVal');
  }

  ngOnDestroy() {
    this.cartDeleteScription.unsubscribe();
  }

  setPinDetect(){
    this.geoBlock = false;
    this.geoBlock = false;
    if(this.authService.LocationSkipped == 0){
      if((this.authService.PinCode == '' || this.authService.PinCode ==0)){       
        this.load_autodetect_location()
      }else{
        this.pinDetectMsg = `Deliver in &nbsp;<span class="fw-6">${this.authService.PanIndiaCityName}, ${this.authService.PinCode}</span>`;
      }
    }else if(this.authService.LocationSkipped ==1 ){
      this.pinDetectMsg = `We are detecting your location`
    }
  }

  load_autodetect_location() {
    this.CommonService.getLocation().subscribe({
      next: (position: GeolocationPosition) => {
        let lat = this.CommonService.getLatitude(position);
        let long = this.CommonService.getLongitude(position);

        let latitude = JSON.stringify(lat);
        let longitude = JSON.stringify(long);

        // console.log('Latitude: ', latitude);
        // console.log('Longitude: ', longitude);
        // this.pinDetectMsg = `We are detecting your location`;
        this.getCurrentLocation(latitude, longitude)
      },
      error: (error: any) => {
        this.pinDetectMsg = `We cannot detect your location`;
        this.geoBlock = true;
      }
    });
  }

  getCurrentLocation(latitude: any, longitude: any) {
    let fd = new FormData();
    // {latitude:crd.latitude,longitude:crd.longitude,'csrf_test_name':getCookie('sspl_csrf')}

    fd.append('latitude', latitude);
    fd.append('longitude', longitude);
    this.authService.getCurrentLocation('location/getLocationByPincode', fd).subscribe((resdata: any) => {
      // console.log(resdata);
      if (resdata['Status'] == 200) {
        let d: Date = new Date();
        this.pinDetectMsg = `Deliver in &nbsp;<span class="fw-6">${resdata['CityName']}, ${resdata['Pincode']}</span>`;
        if(resdata['Pincode'] != ''){
          this.pinchangeForm.setValue({PinCode: resdata['Pincode']});
          this.changePin();
        }
      }
    })
  }

  showGeoRes(){
    this.geoBlockMsg = !this.geoBlockMsg;
  }

  changePin() {
    // onPinchange();
    this.pinSubmit = true;
    if (this.pinchangeForm.invalid) {
      return;
    } else {
      // console.log(this.pinchangeForm.value);
      let pincode: any = this.pinchangeForm.controls['Pincode'].value;
      let fd = new FormData();
      fd.append('Pincode', pincode);
      this.authService.setUserLocation('webapi/location/set_user_location', fd).subscribe((resdata: any) => {
        // debugger
        if (resdata['Status'] == 200) {
          if (resdata['Location']['WarehouseId'] == '' || resdata['Location']['WarehouseId'] == null || resdata['Location']['WarehouseId'] == undefined) {
            alert('somthing went, please try after sometime ')
          } else {
            if (this.totalCount > 0) {
              let d: Date = new Date();
              this.cookieService.set('cartsynch', '0', d.getTime() + (86400 * 30), "/");
              window.location.reload();
            } else {
              this.CommonService.clearCart('webapi/cartapp/clearCart').subscribe((response: any) => {
                if (response['Status'] == 'Success') {
                  let d: Date = new Date();
                  this.cookieService.set('cartsynch', '0', d.getTime() + (86400 * 30), "/");
                  window.location.reload();
                }
              })
            }
          }
        }else{
          alert('somthing went, please try after sometime ');
          window.location.reload();
        }
      })
    }
  }

  login() {
    window.location.href = `${this.authService.baseurl}user/login`;
  }

  numCheck(event: any) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
  }

}
