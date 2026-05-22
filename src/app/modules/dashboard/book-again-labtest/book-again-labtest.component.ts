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
      res = {"data":{"Details":{"BookingId":9178,"BookingNo":"SS-WFBYNX","BookingStatusDesc":"Appointment Cancelled","InitialBookingAmount":3020,"Discount":2021,"BookingAmount":1149,"BookingDate":"2026-05-22 11:54:17.010000","ServiceDeliveryAddressId":3140758,"BillingAddressId":null,"ApplicationType":"D","AppVersion":null,"ParentBookingId":null,"CustUserId":800027,"FullName":"Anindya Bhattacharya","MobileNo":9836370209,"EmailId":"anindyab30@gmail.com","LabId":3,"LabName":"Genu Path Labs Ltd. \u2013 Rajarhat","LabAddLine1":"Innovation Tower, DH 6\/32, DH Block (Newtown), Action Area 1D","LabAddLine2":"Newtown","LabAreaName":"Rajarhat","LabPincode":700156,"PatientId":1792179,"PatientName":"Anindya Bhattacharya","PatientMobileNo":9836370209,"PatientEmailId":"abhattacharya1@sastasundar.com","PDOB":"1986-11-10","PAgeYr":39,"PAgeMonth":6,"PAgeDay":12,"PatientAddline":"32, DH Block(Newtown), Action Area I, Newtown, New Town, Chakpachuria, West Bengal 700160, India,Opposite of Candor Techspce ( Gate 2),KOLKATA","PatientLandmark":"Opposite of Candor Techspce ( Gate 2)","PatientCity":"KOLKATA","PatientPinCode":700160,"IsHomeCollection":1,"TypeofPayment":"COD","PaymentMode":"","PaidAmount":0,"DueAmount":0,"PayStatus":null,"AlternativeContactNo":null,"Invoice":null,"IsEditable":0,"BillName":null,"IsCancellable":"N","AlternativeEmailId":"anindyab30@gmail.com","BookingStatusId":8,"IsFeedbackGiven":0,"PrescriptionId":null,"PrescriptionPath":null,"PrescriptionName":null,"SubscriptionId":null,"SubscriptionDiscount":null,"PromoId":null,"PromoName":null,"PromoCode":null,"DiscType":null,"DiscValue":null,"ReportFilePath":null,"ReportFileName":null,"AppointmentDate":"2026-05-23","BaseBookingAmount":3020,"IsEvening":0,"ConvenienceFees":0,"CollectionCharges":75,"ItemDiscount":2021,"PromoDiscount":0,"PaymentStatus":"Not Paid","PPin":"700160","PAddress":"32, DH Block(Newtown), Action Area I, Newtown, New Town, Chakpachuria, West Bengal 700160, India,Opposite of Candor Techspce ( Gate 2),KOLKATA","HardCopyReqd":1,"HardCopyAddressId":3140758,"HardCopyCharge":75,"PhleboName":null,"PhleboMobileNo":null,"IsConsultationBooked":false,"ConsultationId":null,"IsConsultation":false,"PatientDOB":"1986-11-10","PatientDerivedDOB":null,"PatientGender":"M","PhleboId":null,"ReportDate":null,"GiftCardAmount":null,"OnlineAmount":null,"ConsultationMsg":"","StrPaymentMode":"COD","Services":[{"BookingId":9178,"ServiceId":9258,"ServiceName":"GENU FULL BODY HEALTH CHECKUP (TOTAL 77 PARAMETERS)","InitialFees":3020,"Fees":3020,"DiscountedFees":999,"Discount":2021,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":null,"TestStatusDesc":null,"Report":null,"Report_Old":null,"ReportCP":null,"ReportDM":null,"ReportFileName":null,"ReportName":null,"PkgServicesName":" GLUCOSE FASTING, ESR, COMPLETE BLOOD COUNT(CBC), LIPID PROFILE, TSH, LIVER FUNCTION TEST, KIDNEY FUNCTION TEST (KFT), URINE RE","IsPackage":1,"ServicePreparation":"","PermaLink":"https:\/\/sastasundar.com\/health-packages\/9258\/GENU-FULL-BODY-CHECKUP","PermalinkNew":"https:\/\/sastasundar.com\/health-packages\/GENU-FULL-BODY-CHECKUP","IsDisplay":1,"ReportPeriod":1,"Collection_Charges":75,"ReportFilePath":null,"ProgressiveReportFileName":null,"IsEvening":0,"AppointmentDate":"2026-05-23"},{"BookingId":9178,"ServiceId":146,"ServiceName":"GLUCOSE FASTING","InitialFees":0,"Fees":0,"DiscountedFees":0,"Discount":0,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":9258,"TestStatusDesc":null,"Report":null,"Report_Old":null,"ReportCP":null,"ReportDM":null,"ReportFileName":null,"ReportName":null,"PkgServicesName":null,"IsPackage":0,"ServicePreparation":"Over night fasting","PermaLink":"https:\/\/sastasundar.com\/services\/146\/glucose-fasting","PermalinkNew":"https:\/\/sastasundar.com\/test\/glucose-fasting","IsDisplay":0,"ReportPeriod":0,"Collection_Charges":75,"ReportFilePath":null,"ProgressiveReportFileName":null,"IsEvening":0,"AppointmentDate":"2026-05-23"},{"BookingId":9178,"ServiceId":132,"ServiceName":"ESR","InitialFees":0,"Fees":0,"DiscountedFees":0,"Discount":0,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":9258,"TestStatusDesc":null,"Report":null,"Report_Old":null,"ReportCP":null,"ReportDM":null,"ReportFileName":null,"ReportName":null,"PkgServicesName":null,"IsPackage":0,"ServicePreparation":"No Preparation Needed","PermaLink":"https:\/\/sastasundar.com\/services\/132\/esr","PermalinkNew":"https:\/\/sastasundar.com\/test\/esr","IsDisplay":0,"ReportPeriod":0,"Collection_Charges":75,"ReportFilePath":null,"ProgressiveReportFileName":null,"IsEvening":0,"AppointmentDate":"2026-05-23"},{"BookingId":9178,"ServiceId":6324,"ServiceName":"COMPLETE BLOOD COUNT(CBC)","InitialFees":0,"Fees":0,"DiscountedFees":0,"Discount":0,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":9258,"TestStatusDesc":null,"Report":null,"Report_Old":null,"ReportCP":null,"ReportDM":null,"ReportFileName":null,"ReportName":null,"PkgServicesName":null,"IsPackage":0,"ServicePreparation":"","PermaLink":"https:\/\/sastasundar.com\/services\/6324\/COMPLETE-BLOOD-COUNT-CBC","PermalinkNew":"https:\/\/sastasundar.com\/test\/COMPLETE-BLOOD-COUNT-CBC","IsDisplay":0,"ReportPeriod":0,"Collection_Charges":75,"ReportFilePath":null,"ProgressiveReportFileName":null,"IsEvening":0,"AppointmentDate":"2026-05-23"},{"BookingId":9178,"ServiceId":182,"ServiceName":"LIPID PROFILE","InitialFees":0,"Fees":0,"DiscountedFees":0,"Discount":0,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":9258,"TestStatusDesc":null,"Report":null,"Report_Old":null,"ReportCP":null,"ReportDM":null,"ReportFileName":null,"ReportName":null,"PkgServicesName":null,"IsPackage":0,"ServicePreparation":"No Preparation Needed","PermaLink":"https:\/\/sastasundar.com\/services\/182\/lipid-profile","PermalinkNew":"https:\/\/sastasundar.com\/test\/lipid-profile","IsDisplay":0,"ReportPeriod":0,"Collection_Charges":75,"ReportFilePath":null,"ProgressiveReportFileName":null,"IsEvening":0,"AppointmentDate":"2026-05-23"},{"BookingId":9178,"ServiceId":270,"ServiceName":"TSH","InitialFees":0,"Fees":0,"DiscountedFees":0,"Discount":0,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":9258,"TestStatusDesc":null,"Report":null,"Report_Old":null,"ReportCP":null,"ReportDM":null,"ReportFileName":null,"ReportName":null,"PkgServicesName":null,"IsPackage":0,"ServicePreparation":"As instructed by referred doctor","PermaLink":"https:\/\/sastasundar.com\/services\/270\/tsh","PermalinkNew":"https:\/\/sastasundar.com\/test\/tsh","IsDisplay":0,"ReportPeriod":0,"Collection_Charges":75,"ReportFilePath":null,"ProgressiveReportFileName":null,"IsEvening":0,"AppointmentDate":"2026-05-23"},{"BookingId":9178,"ServiceId":186,"ServiceName":"LIVER FUNCTION TEST","InitialFees":0,"Fees":0,"DiscountedFees":0,"Discount":0,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":9258,"TestStatusDesc":null,"Report":null,"Report_Old":null,"ReportCP":null,"ReportDM":null,"ReportFileName":null,"ReportName":null,"PkgServicesName":null,"IsPackage":0,"ServicePreparation":"No Preparation","PermaLink":"https:\/\/sastasundar.com\/services\/186\/liver-function-test","PermalinkNew":"https:\/\/sastasundar.com\/test\/liver-function-test","IsDisplay":0,"ReportPeriod":0,"Collection_Charges":75,"ReportFilePath":null,"ProgressiveReportFileName":null,"IsEvening":0,"AppointmentDate":"2026-05-23"},{"BookingId":9178,"ServiceId":5686,"ServiceName":"KIDNEY FUNCTION TEST (KFT)","InitialFees":0,"Fees":0,"DiscountedFees":0,"Discount":0,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":9258,"TestStatusDesc":null,"Report":null,"Report_Old":null,"ReportCP":null,"ReportDM":null,"ReportFileName":null,"ReportName":null,"PkgServicesName":null,"IsPackage":0,"ServicePreparation":"10 to 12 hrs overnight fasting","PermaLink":"https:\/\/sastasundar.com\/services\/5686\/KIDNEY-FUNCTION-TEST-(KFT)","PermalinkNew":"https:\/\/sastasundar.com\/test\/KIDNEY-FUNCTION-TEST-(KFT)","IsDisplay":0,"ReportPeriod":0,"Collection_Charges":75,"ReportFilePath":null,"ProgressiveReportFileName":null,"IsEvening":0,"AppointmentDate":"2026-05-23"},{"BookingId":9178,"ServiceId":284,"ServiceName":"URINE RE","InitialFees":0,"Fees":0,"DiscountedFees":0,"Discount":0,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":9258,"TestStatusDesc":null,"Report":null,"Report_Old":null,"ReportCP":null,"ReportDM":null,"ReportFileName":null,"ReportName":null,"PkgServicesName":null,"IsPackage":0,"ServicePreparation":"As instructed by referred doctor","PermaLink":"https:\/\/sastasundar.com\/services\/284\/urine-re","PermalinkNew":"https:\/\/sastasundar.com\/test\/urine-re","IsDisplay":0,"ReportPeriod":0,"Collection_Charges":75,"ReportFilePath":null,"ProgressiveReportFileName":null,"IsEvening":0,"AppointmentDate":"2026-05-23"}],"SlotType":[{"IsMorningSlot":1,"Title":"Choose Time Slot for GENU FULL BODY HEALTH CHECKUP (TOTAL 77 PARAMETERS), GLUCOSE FASTING, ESR, COMPLETE BLOOD COUNT(CBC), LIPID PROFILE, TSH, LIVER FUNCTION TEST, KIDNEY FUNCTION TEST (KFT), URINE RE"},{"IsEveningSlot":0,"Title":""}],"Packages":[{"BookingId":9178,"ServiceId":9258,"ServiceName":"GENU FULL BODY HEALTH CHECKUP (TOTAL 77 PARAMETERS)","InitialFees":3020,"Fees":3020,"DiscountedFees":999,"Discount":2021,"IsPackage":1,"SlotId":232901,"BookingDate":"2026-05-23","SlotStartTime":"11:30:00","SlotEndTime":"12:00:00","IsHomeCollection":true,"PkgServiceId":null,"TestStatusDesc":null,"Report":null,"ReportName":null,"IsDisplay":1,"AppointmentDate":"2026-05-23","Collection_Charges":75,"ReportFilePath":null,"ReportFileName":null,"IsEvening":0}],"ReportFullPath":""}},"status":200,"message":"View successfully.","response_code":"0"};
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
