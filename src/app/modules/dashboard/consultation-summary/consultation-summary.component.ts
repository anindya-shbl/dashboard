import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { UploadImagesService } from '../../../services/upload-images.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-consultation-summary',
  templateUrl: './consultation-summary.component.html',
  styleUrl: './consultation-summary.component.scss'
})
export class ConsultationSummaryComponent implements OnInit {

  isloading: boolean = false;
  apmntDetails: any = '';
  @ViewChild('clsVitalMdl') clsVitalMdl: any;
  infoText: any = '';
  ReportDocuments: any = [];

  prscFiles: any = [];
  prscImages: any = [];

  referMeds: any = [];
  referedLabs: any = [];

  selectedTests: any = [];
  // selectedMeds: any = [];
  bookingNo: any = '';
  proceedMed: boolean = false;
  inputRating: any = '';
  ratingRes: any = '';

  @ViewChild('addLabsMdl') addLabsMdl: any;
  @ViewChild('addMedsMdl') addMedsMdl: any;
  @ViewChild('ratingMdl') ratingMdl: any;
  @ViewChild('clsaddLab') clsaddLab: any;
  @ViewChild('clsaddMeds') clsaddMeds: any;
  @ViewChild('clsrating') clsrating: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public CommonService: CommonService,
    private imagesService: UploadImagesService,
    private dbService: NgxIndexedDBService,
    private cookieService: CookieService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.bookingNo = this.activatedRoute.snapshot.params['bookingNo'];

    if (this.bookingNo != undefined && this.bookingNo != '' && this.bookingNo != null) {
      this.spinner.show();
      this.isloading = true;
      this.getRatings();
      this.getAppointmentDetails();

    }
  }

  getAppointmentDetails() {
    this.referMeds = [];
    this.referedLabs = [];
    this.ReportDocuments = [];
    this.orderService.getDetails(`webapi/consultation/appointment_details?bookingNo=${this.bookingNo}`).subscribe((res: any) => {

    if (res && res['status'] == 200) {
      this.apmntDetails = res['data'];
      if (res['data'].PatientVitalsInfo.ReportDocuments.length > 0) {
        res['data'].PatientVitalsInfo.ReportDocuments.forEach((d: any) => {
          this.ReportDocuments.push({ "FilePath": d.Filename })
        })
      };
      if (res['data'].PrescriptionDetails.Medicines.length > 0) {
        res['data'].PrescriptionDetails.Medicines.forEach((med: any) => {
          if (med.IsOutOfStock == 'N') {
            med.addedQty = 1;
          } else {
            med.addedQty = 0;
          }
          this.referMeds.push(med)
        })
        this.hasAddedQty()
      }
      if (res['data'].PrescriptionDetails.LabTests.length > 0) {
        res['data'].PrescriptionDetails.LabTests.forEach((lab: any) => {
          lab.selected = true;
          this.referedLabs.push(lab)
        })
      }
      this.isloading = false;
      this.spinner.hide()
    } else {
      this.apmntDetails = '';
      this.isloading = false;
      this.spinner.hide()
    }
    })
  }

  vitalAction(event: any) {
    // console.log(event)
    if (event.type == 'edit') {
      let fd = new FormData();
      fd.append('bookingNo', event.dtls.bookingNo),
        fd.append('height', event.dtls.height),
        fd.append('bodyWeight', event.dtls.bodyWeight),
        fd.append('bodyTemp', event.dtls.bodyTemp),
        fd.append('bloodPressure', event.dtls.bloodPressure),
        fd.append('pulse', event.dtls.pulse),
        fd.append('bmi', event.dtls.bmi),
        fd.append('ChronicConditionsId', event.dtls.ChronicConditionsId),
        fd.append('CommonAllergiesId', event.dtls.CommonAllergiesId),
        fd.append('spO2', event.dtls.spO2)
      // fd.append('reportDocuments', event.data.reportDocuments)
      this.addEdit(fd)
    }
  }

  addEdit(dts: any) {
    this.spinner.show()
    this.orderService.setDetails('webapi/consultation/update_vitals', dts).subscribe((res: any) => {
      console.log(res)
      if (res && res['status'] == 200) {
        this.toastr.success('Record updated successfully');
        this.clsVitalMdl.nativeElement.click();
        this.getAppointmentDetails();
      } else {
        this.clsVitalMdl.nativeElement.click();
        this.toastr.error(res['message']);
        this.spinner.hide();
      }
    })
  }

  selectPrescription(evt: any) {
    var file = evt.target.files[0];
    if (file) {

      this.infoText = '';
      let resp = this.imagesService.onSelectFile(evt, 5, this.prscFiles, this.prscImages);
      if (resp.msg == 'success') {
        this.prscFiles = resp.fileDetails;
        this.prscImages = resp.Images;
      } else {
        this.infoText = resp.msg;
        // this.open.nativeElement.click();
        alert(this.infoText)
        this.prscFiles = resp.fileDetails;
        this.prscImages = resp.Images;
      }
      // console.log(resp);
    }
  }

  delFile(img: any) {
    const index = this.prscImages.indexOf(img);
    this.prscImages.splice(index, 1);
    this.prscFiles.splice(index, 1);
  }

  uploadPrescription() {
    this.spinner.show();
    let uploadFiles: any = [];
    const formData = new FormData();
    if (this.prscFiles.length > 0) {
      uploadFiles = this.prscFiles;
      for (var i = 0; i < uploadFiles.length; i++) {
        formData.append('refFiles', uploadFiles[i]);
      }

      this.CommonService.uploadImage('jito-upload/document', formData).subscribe((res: any) => {
        if (res && (res['msgcode'] == 1)) {
          this.prscFiles = [];
          this.prscImages = [];
          this.toastr.success(res['message'])
          this.ReportDocuments.push({ "FilePath": res['data']['UploadedFileName'] })
          let fd = new FormData();
          fd.append('reportDocuments', this.ReportDocuments);
          this.addEdit(fd);
        } else {
          this.prscFiles = [];
          this.prscImages = [];
          this.toastr.error(res['message']);
          this.spinner.hide()
        }
      })
    }
  }

  removeReport(dts: any) {
    this.spinner.show()
    let fd = new FormData();
    fd.append('bookingNo', this.apmntDetails.BookingNo);
    fd.append('fileName', dts.FilePath);
    this.orderService.setDetails('webapi/consultation/remove_vital_report', dts).subscribe((res: any) => {
      console.log(res)
      if (res && res['status'] == 200) {
        this.toastr.success(res['message']);
        // this.clsVitalMdl.nativeElement.click();
        this.getAppointmentDetails();
      } else {
        // this.clsVitalMdl.nativeElement.click();
        this.toastr.error(res['message']);
        this.spinner.hide();
      }
    })
  }

  joinVideocall(dts: any) {
  }

  getPrescription(dts: any) {
    if (dts.PrescriptionFileName != null && dts.PrescriptionFileName != '' && dts.PrescriptionFileName != undefined) {
      window.open(`${this.CommonService.catalogUrl}lab/prescription/download?pname=${dts.PrescriptionFileName}&BookingNo=${dts.BookingNo}`)
    }
  }

  bookLabTests() {
    this.selectedTests = this.referedLabs;
    this.addLabsMdl.nativeElement.click()
  }

  addTest(test: any) {
    this.selectedTests.push(test);
    this.referedLabs = this.referedLabs.map((obj: any) => {
      if (obj.ServiceId == test.ServiceId) {
        obj.selected = true;
      }
      return obj;
    });
  }

  removeTest(test: any) {
    this.selectedTests = this.selectedTests.filter((d: any) => d.ServiceId !== test.ServiceId);
    this.referedLabs = this.referedLabs.map((obj: any) => {
      if (obj.ServiceId == test.ServiceId) {
        obj.selected = false;
      }
      return obj;
    });
  }

  resetLabSelect() {
    this.selectedTests = [];
    this.referedLabs.forEach((ds: any) => {
      ds.selected = true;
    })
  }

  proceedLabCart() {
    if (this.selectedTests.length > 0) {
      this.spinner.show();
      this.dbService.clear('LabTests').subscribe((res: any) => {
        if (res == true) {
          this.selectedTests.forEach((productObj: any) => {
            let productId = productObj.ServiceId;
            let tmp = {
              "id": productId,
              "ProductId": productId,
              "CustUserId": this.apmntDetails.PatientId,
              "ServiceName": productObj.ServiceName,
              "Fees": productObj.Fees,
              "Discount": productObj.Discount,
              "ServiceId": productObj.ServiceId,
              "ServiceDesc": productObj.ServiceDesc,
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
              "RefBookingId": this.apmntDetails.BookingNo,
            };
            this.dbService.add('LabTests', tmp).subscribe((res: any) => {
            });

          });
          let d: Date = new Date();
          this.cookieService.set('labCartSynch', '0', d.getTime() + 86400 * 30, '/');
          this.spinner.hide();
          window.location.href = this.CommonService.baseurl + "customerlabcart";
          this.clsaddLab.nativeElement.click()
        } else {
          this.clsaddLab.nativeElement.click()
          this.spinner.hide();
          this.toastr.error('something went wrong')
        }
      })
      // console.log(res);
    }
  }

  bookMeds() {
    // this.selectedMeds = this.referMeds;
    console.log(this.referMeds)
    this.addMedsMdl.nativeElement.click()
  }

  resetMedSelect() {
    // this.selectedMeds = [];
    this.referMeds.forEach((ds: any) => {
      ds.addedQty = 1;
    })
  }

  addItem(item: any) {
    this.referMeds.forEach((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        obj.addedQty = 1;
        // this.selectedMeds.push(obj)
      }
    });
    this.hasAddedQty();
  }

  addUpdateItem(item: any) {
    this.referMeds.forEach((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        obj.addedQty = obj.addedQty + 1;
      }
    });
    this.hasAddedQty();
  }

  removeUpdateItem(item: any) {
    this.referMeds.forEach((obj: any) => {
      if (obj.ProductId == item.ProductId) {
        obj.addedQty = obj.addedQty - 1;
      }
    })
    this.hasAddedQty();
  }

  hasAddedQty() {
    this.proceedMed = this.referMeds.some((item: any) => item.addedQty > 0);
  }

  requestNotify(item: any) {
    // console.log(item);
    let fd = new FormData();
    fd.append('ProductId', item.ProductId);
    fd.append('ProductName', item.DisplayName);
    fd.append('ProductType', item.PrescriptionOTC);
    fd.append('RequestSource', 'C');

    this.CommonService.requestNotify('webapi/request_product/productRequest', fd).subscribe((res: any) => {
      // console.log(res);
      if (res && res.response_code == 0) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  proceedMedCart() {
    this.spinner.show();
    this.dbService.clear('cartItems').subscribe((res: any) => {
      // console.log(res);
      if (res == true) {
        this.referMeds.forEach((productObj: any) => {
          if (productObj.addedQty > 0) {

            let productId = productObj.ProductId;
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
              ProductCount: productObj.addedQty,
              ItemVal: productObj.OfferPrice,
              SSCurrencyValue: ".00",
              Iscourierable: productObj.IsCourierable,
              ProductImage: productObj.ProductImage,
              ProductPrice: productObj.MRP,
              // IsGiftProduct: productObj[this.getKeyIndex("IsGiftableProduct")],
              PrescriptionOTC: productObj.PrescriptionOTC,
              WarehouseId: this.authService.WHId,
              CPId: 0,
              MyFamilyId: 0,
              PKLotId: LotId,
              MfgGroup: productObj.MfgGroup,
              ExpiryDate: productObj.ExpiryDate,
              ProductInteractiveModule: '',
              ProductInteractiveSubModule: '',
              IsNonReturnable: '',
              RefOrderId: productObj.RefOrderId,
              Brand: productObj.Brand,
              DiscountPercent: productObj.DiscountPercent
            };

            this.dbService.add('cartItems', tmp).subscribe((res: any) => {
            });
          }

        });
        let d: Date = new Date();
        this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
        this.spinner.hide();
        window.location.href = this.CommonService.baseurl + "customercart";
      } else {
        this.clsaddMeds.nativeElement.click()
        this.spinner.hide();
        this.toastr.error('something went wrong')
      }
    })
  }

  getRatings() {
    // this.orderService.getDetails(`webapi/consultation/feedback_details?bookingNo=${this.bookingNo}`).subscribe((res: any) => {
    let res: any = {
      "status": 200,
      "data": {
        "BookingId": 609,
        "BookingNo": "HA-YEY4GF",
        "DoctorUserId": 51386,
        "FeedbackRating": 4,
        "FeedbackComments": "",
        "ListenedCarefully": 1,
        "ClearExplanation": 0,
        "Professional": 0,
        "PoorConnection": 0,
        "QuickResponse": 0,
        "Unprofessional": 0,
        "AdminComments": null,
        "FeedbackDate": "24 November 2025 16:49:11",
        "FeedbackStatus": "pending",
        "IsApprovedByAdmin": 0,
        "PreferredLanguage": "Hindi",
        "ConsultationMode": "Offline",
        "BookingDate": "24 November 2025 15:18:17",
        "AppointmentDate": "24 November, 2025",
        "SlotStartTime": "16:44",
        "SlotEndTime": "16:47",
        "Rating": 4,
        "BookingStatusId": 5,
        "BookingStatusDesc": "Consultation Closed",
        "CustUserId": 51513,
        "CustomerName": "suman  das",
        "PatientId": 41684,
        "PatientName": "suman das",
        "PatientMobileNo": 8000000009,
        "PatientEmailId": "",
        "PatientDOB": "28 October, 2020",
        "PatientGender": "M",
        "PatientAge": 5,
        "PatientRelationship": "Self",
        "PoorConnectionQuality": 0,
        "ProfessionalandKnowledgeable": 0,
        "UnprofessionalBehaviour": 0
      },
      "msg": "Success"
    }
    if (res && res.status == 200) {
      this.ratingRes = res
    } else {
      this.ratingRes = '';
    }
    // })

  }

  openRating(star: any) {
    console.log(this.ratingRes)
    this.inputRating = star;
    this.ratingMdl.nativeElement.click()
  }

  resetRating() {
    this.inputRating = '';
  }

  handleFeedback(payload: any) {
    console.log('Submit Payload:', payload);
    debugger
    let fd = new FormData();
    fd.append('bookingNo', payload.BookingId),
    fd.append('rating', payload.FeedbackRating),
    fd.append('comments', payload.FeedbackComments),
    fd.append('listenedCarefully', payload.ListenedCarefully),
    fd.append('clearExplanation', payload.ClearExplanation),
    fd.append('professional', payload.Professional),
    fd.append('poorConnection', payload.PoorConnection),
    fd.append('quickResponse', payload.QuickResponse),
    fd.append('unprofessionalBehaviour', payload.Unprofessional),

    this.spinner.show();
    this.orderService.setDetails('webapi/consultation/save_feedback', fd).subscribe((res: any) => {
      console.log(res)
      if (res && res['status'] == 200) {
        this.toastr.success(res['message']);
        this.clsrating.nativeElement.click();
        this.getRatings();
        this.spinner.hide();
      } else {
        this.clsVitalMdl.nativeElement.click();
        this.toastr.error(res['message']);
        this.spinner.hide();
      }
    })
  }


}
