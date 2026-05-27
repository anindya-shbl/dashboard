import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-book-again-labtest',
  templateUrl: './book-again-labtest.component.html',
  styleUrl: './book-again-labtest.component.scss'
})
export class BookAgainLabtestComponent implements OnInit {

  isloading: boolean = false;
  bookingDetails : any = '';
  serviceItems : any = [];
  packageDetails: any = [];
  selectedItems: any = [];
  selectedPkg: any = '';
  allSelected: boolean = false;

  // @ViewChild('pckgDtls') pckgDtls: any;

  constructor( private router: Router, 
    private activatedRoute : ActivatedRoute, 
    private orderService : OrderService, 
    private spinner: NgxSpinnerService, 
    public CommonService: CommonService,
    private dbService: NgxIndexedDBService,
    private cookieService: CookieService
  ){}

  ngOnInit(): void {
    let bookingID = this.activatedRoute.snapshot.params['bookingID'];

    if(bookingID != undefined && bookingID != '' && bookingID != null){
      let fd = new FormData();
      // fd.append('orderId', atob(orderId));
      fd.append('BookingNo', bookingID);
      this.bookingDetailById(fd);
    }  
  }

  bookingDetailById(param: any){
    this.spinner.show();
    this.isloading = true;
    // this.orderService.getOrderDetailById('customers/order/viewOrder', param).subscribe((res: any) => {
    this.orderService.getOrderDetailById('webapi/lab/order_view', param).subscribe((res: any) => {
      
      // console.log(res)
      if(res && res['status']==200){
        this.bookingDetails = res['data']['Details'];
        this.serviceItems = res['data']['Details']['Services'];
        this.setItems();
        this.spinner.hide();
        this.isloading = false;
      }else{
        this.spinner.hide();
        this.isloading = false;
      }
    })
  }

  setItems(){
    if(this.serviceItems.length > 0){
      this.serviceItems = this.serviceItems.map((obj: any) => {
        return { ...obj, selected: false };
      });
      // console.log(this.serviceItems)
    }
    this.allSelected = false;
    // console.log(this.selectedItems)
  }

  selectTest(item: any){
    this.allSelected = false;
    if(item.selected == false){
      this.addTemp(item)
    }else{
      this.delTemp(item)
    }
  }

  addTemp(tmp: any){
    if(tmp.IsPackage == 1){
      this.serviceItems.forEach((data: any)=>{
        if(data.PkgServiceId == tmp.ServiceId){
          this.selectedItems.push(data);
        }
      })
    }
    this.serviceItems = this.serviceItems.map((obj: any) => {
      if (obj.ServiceId == tmp.ServiceId) {
        this.selectedItems.push(obj);       
        return { ...obj, selected: true };
      }
      return obj;
    });

    if(this.selectedItems.length == this.serviceItems.length){
      this.allSelected = true;
    }
   
    // console.log(this.selectedItems)
  }

  delTemp(tmp: any){
    if(tmp.IsPackage == 1){
      this.serviceItems.forEach((data: any)=>{
        // if(data.PkgServiceId == tmp.ServiceId){
        //   this.selectedItems.push(data);
        // }
        this.selectedItems = this.selectedItems.filter((d: any) => d.PkgServiceId !== tmp.ServiceId);
      })
    }
    this.serviceItems = this.serviceItems.map((obj: any) => {
      if (obj.ServiceId == tmp.ServiceId) {
        // this.selectedItems.push(obj);
        this.selectedItems = this.selectedItems.filter((d: any) => d.ServiceId !== tmp.ServiceId);     
        return { ...obj, selected: false };
      }
      return obj;
    });
   
    // console.log(this.selectedItems)
  }

  selectAll(){
    this.selectedItems = [];
    this.serviceItems.forEach((data: any)=>{
      this.selectedItems.push(data);
    });
    this.serviceItems = this.serviceItems.map((obj: any) => {
      return { ...obj, selected: true };
    });
    this.allSelected = true;
    // console.log(this.selectedItems)
  }

  removeAll(){
    this.selectedItems = [];
    this.setItems();
    // this.allSelected = false;
  }

  proceedCart() {
// debugger
    // this.dbService.clear('LabTests').subscribe((successDeleted) => {
      // console.log('success? ', successDeleted);
      if(this.selectedItems.length > 0) {
        this.spinner.show();
        this.dbService.clear('LabTests').subscribe((res: any) => {
          if (res == true) {
            this.selectedItems.forEach((productObj : any) => {

              let productId = productObj.ServiceId;
    
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
                "Fees": productObj.InitialFees,
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
                "IsHomeCollectionAvailable": productObj.IsHomeCollection,
                "ReportPeriod": productObj.ReportPeriod,
                "OfferFees": productObj.DiscountedFees,
                "DiscPercent": productObj.DiscPercent,
                "PkgServiceId": productObj.PkgServiceId,
                "PkgServicesName": productObj.PkgServicesName,
                "IsPackage": productObj.IsPackage == 0 ? false : true,
                "Permalink": productObj.Permalink,
                "PromoApplicable": productObj.PromoApplicable,
                "PermalinkNew": productObj.PermalinkNew,
                "RefBookingId": this.bookingDetails.BookingNo,
                "IsEvening": productObj.IsEvening
              };
              // debugger
    
              this.dbService.add('LabTests', tmp).subscribe((res: any) => {
                // console.log('Record added successfully.', res);
                // Redirect
              });
    
              // if(productObj.PkgServiceList != undefined && productObj.PkgServiceList.length > 0) {
              //   productObj.PkgServiceList.forEach((productObj_pkg: any) => {
              //     let productId = productObj_pkg.ServiceId;
    
              //     let tmp_pkg = {
              //       "id": productId,
              //       "ProductId": productId,
              //       "CartItemId": productObj_pkg.CartItemId,
              //       "CartId": productObj_pkg.CartId,
              //       "CustUserId": productObj_pkg.CustUserId,
              //       "SlotId": productObj_pkg.SlotId,
              //       "LabId": productObj_pkg.LabId,
              //       "LabName": productObj_pkg.LabName,
              //       "ServiceName": productObj_pkg.ServiceName,
              //       "Fees": productObj_pkg.InitialFees,
              //       "Discount": productObj_pkg.Discount,
              //       "GuestId": productObj_pkg.GuestId,
              //       "UpdatedDate": productObj_pkg.UpdatedDate,
              //       "ApplicationType": productObj_pkg.ApplicationType,
              //       "AppVersion": productObj_pkg.AppVersion,
              //       "ServiceId": productObj_pkg.ServiceId,
              //       "ServiceDesc": productObj_pkg.ServiceDesc,
              //       "BookingDate": productObj_pkg.BookingDate,
              //       "StartTime": productObj_pkg.StartTime,
              //       "EndTime": productObj_pkg.EndTime,
              //       "ServicePreparation": productObj_pkg.ServicePreparation,
              //       "IsHomeCollectionAvailable": productObj_pkg.IsHomeCollection,
              //       "ReportPeriod": productObj_pkg.ReportPeriod,
              //       "OfferFees": productObj_pkg.DiscountedFees,
              //       "DiscPercent": productObj_pkg.DiscPercent,
              //       "PkgServiceId": productObj_pkg.PkgServiceId,
              //       "PkgServicesName": productObj_pkg.PkgServicesName,
              //       "IsPackage": productObj_pkg.IsPackage,
              //       "Permalink": productObj_pkg.Permalink,
              //       "PromoApplicable": productObj_pkg.PromoApplicable,
              //       "PermalinkNew": productObj_pkg.PermalinkNew,
              //       "RefBookingId": productObj_pkg.RefBookingId,
              //       "IsEvening": productObj_pkg.IsEvening
              //     };
    
              //     this.dbService.add('LabTests', tmp_pkg).subscribe((res: any) => {
              //       console.log('Record added successfully.', res);
              //     });
              //   })
              // }
            });
            let d: Date = new Date();
            this.cookieService.set('labCartSynch', '0', d.getTime() + 86400 * 30, '/');
            window.location.href=this.CommonService.baseurl +"customerlabcart";
          }else{
            this.spinner.hide();
            alert('something went wrong')
          }
        })
      // console.log(res);
      }
    // })
  }

}
