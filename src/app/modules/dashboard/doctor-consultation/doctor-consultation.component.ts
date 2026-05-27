import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebEngageService } from '../../../services/web-engage.service';
import { UploadImagesService } from '../../../services/upload-images.service';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-doctor-consultation',
  templateUrl: './doctor-consultation.component.html',
  styleUrl: './doctor-consultation.component.scss'
})
export class DoctorConsultationComponent implements OnInit {

  steps: any = [
    { id: 1, name: 'Select Patient', icon: 'fa-user', completed: false },
    { id: 2, name: 'Check Availability', icon: 'fa-user-doctor', completed: false },
    { id: 3, name: 'Payment', icon: 'fa-credit-card', completed: false },
    // { id: 4, name: 'Confirmation', icon: 'fa-check', completed: false },
  ];

  isloading: boolean = false;
  activeStep: any = '';
  selectedPatient: any = '';
  familyMemberList: any = [];
  RecepentForm!: FormGroup;
  submitted: boolean = false;
  // billSummary: any = [];
  docList: any = [];
  billDetails: any = [];
  symptoms: any = '';
  prscFiles: any = [];
  uploadedPath: any = '';
  prscImages: any = [];
  selectedLang: any = 'Hindi';
  selectedMode: any = 'A';
  showHideDoc: boolean = false;
  selectedDoc: any = '';
  infoText: any = '';
  cartDetails: any = '';
  couponList: any = [];
  // appliedCoupon: any = [];
  pglist: any = [];
  selectedPG: any = '';

  maxdate: any = new Date().toISOString().slice(0, 10);
  @ViewChild('closePtnt') closePtnt: any;
  @ViewChild('clsCupon') clsCupon: any;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private imagesService: UploadImagesService,
    public CommonService: CommonService,
    private orderService: OrderService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private webengageService: WebEngageService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.selectedPatient = '';
    this.activeStep = this.steps[0];
    this.generateform();
    this.getFamilyMemberList();
  }

  generateform() {
    this.RecepentForm = this.formBuilder.group({
      Name: ['', Validators.required],
      Relationship: ['', Validators.required],
      BirthDay: ['', Validators.required],
      Gender: ['', Validators.required],
      MobileNo: ['', Validators.required],
      Email: [''],

    })
  }

  get f() { return this.RecepentForm.controls; }

  getFamilyMemberList() {
    this.isloading = true;
    this.spinner.show();

    this.profileService.getFamilyMembers('webapi/user/manageFamilyMember').subscribe((res: any) => {
      if (res && res.response_code == 0) {
        this.familyMemberList = res.data;
        this.isloading = false;
        // if (this.isaddedMember == true) {
        //   let obj = this.familyMemberList.find((o: any) => o.MyFamilyId == this.selectedMember.MyFamilyId);
        //   // this.getFmOTP(obj);
        // }
        this.spinner.hide();
      }else{
        this.isloading = false;
        this.spinner.hide();
      }
    })
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.RecepentForm.invalid) {
      return;
    } else {
      this.spinner.show()
      let fd = new FormData();
      fd.append('Name', this.RecepentForm.value.Name);
      fd.append('Relationship', this.RecepentForm.value.Relationship);
      fd.append('familyDOB', this.RecepentForm.value.BirthDay);
      fd.append('Gender', this.RecepentForm.value.Gender);
      fd.append('MobileNo', this.RecepentForm.value.MobileNo);
      fd.append('EmailId', this.RecepentForm.value.Email);


      this.profileService.addFamilyMember('webapi/customer/addFamilyMember', fd).subscribe((res: any) => {
        // console.log(res);
        if (res && res['status'] == 200) {
          this.patientProfileWebEngage(this.RecepentForm.value)
          this.selectedPatient = res['data']['record'];
          this.getFamilyMemberList();
          this.closePtnt.nativeElement.click();
          this.onReset();
        } else {
          this.spinner.hide();
          this.toastr.error(res['message'])
        }
      })
    }
  }

  onReset() {
    this.submitted = false;
    this.RecepentForm.reset();
  }

  getDocList() {
    this.orderService.getDetails(`webapi/consultation/available_doctor_list?patientId=${this.selectedPatient.MyFamilyId}`).subscribe((resp: any) => {
      // console.log(resp)
      if (resp && resp['status'] == 200) {
        if (resp['autoRequest'] == 0) {
          this.docList = resp.data;
          this.getCartDetails();
          this.getPromoList();
        } else if (resp['autoRequest'] == 1) {
          this.docList = [];
          this.infoText = resp['message']
          this.isloading = false;
          this.spinner.hide();
        }
      } else {
        this.docList = [];
        this.infoText = resp['message']
        this.isloading = false;
        this.spinner.hide()
      }
    })
  }


  getCartDetails() {
    this.orderService.getDetails(`webapi/consultation/consultation_cart_details`).subscribe((resp: any) => {
      if (resp && resp['status'] == 200) {
        this.cartDetails = resp['data'];
        this.symptoms = this.cartDetails.SymptomesDetails;
        this.uploadedPath = this.cartDetails.ReportFilePath;
        // this.appliedCoupon = this.cartDetails.PromoCode;
        this.setLang(this.cartDetails.PreferredLanguage);
        this.setMode(this.cartDetails.ModeOfConsultation);
        this.isloading = false;
        this.spinner.hide()
      } else {
        this.cartDetails = '';
        this.symptoms = '';
        this.uploadedPath = '';
        // this.appliedCoupon = '';
        this.selectedLang = 'Hindi';
        this.selectedMode = 'A';
        this.isloading = false;
        this.spinner.hide()
      }
    })
  }

  setLang(lng: any) {
    if (lng != '' && lng != null && lng != undefined) {
      this.selectedLang = lng;
    } else {
      this.selectedLang = 'Hindi';
    }
  }

  setMode(mode: any) {
    if (mode != '' && mode != null && mode != undefined) {
      this.selectedMode = mode;
    } else {
      this.selectedMode = 'A';
    }
  }

  onMouseEnter(doc: any): void {
    this.showHideDoc = true;
    this.selectedDoc = doc;
  }

  onMouseLeave(): void {
    this.showHideDoc = false;
    this.selectedDoc = '';
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
          this.toastr.success(res['message'])
          this.uploadedPath = res['data']['UploadedFileName'];
          this.spinner.hide()
        } else {
          this.uploadedPath = '';
          this.toastr.error(res['message']);
          this.spinner.hide()
        }
      })
    }
  }

  showUploadedPresc() { }

  getPromoList() {
    this.orderService.getDetails(`webapi/consultation/promo_list`).subscribe((rsp: any) => {
      if (rsp && rsp['status'] == 200) {
        this.couponList = rsp['data'];
      } else {
        this.couponList = [];
      }
    })
  }

  applyPromo(data: any) {
    console.log(data)
    let fd = new FormData();
    fd.append('promoCode', data.PromoCode);
    this.spinner.show()
    this.orderService.setDetails(`webapi/consultation/apply_promo`, fd).subscribe((rsp: any) => {
      if (rsp && rsp['status'] == 200) {
        this.clsCupon.nativeElement.click()
        this.toastr.success(rsp.message);
        this.getCartDetails();
      } else {
        this.clsCupon.nativeElement.click()
        this.toastr.error(rsp.message);
        this.spinner.hide()
      }
    })
  }

  removePromo() {
    this.spinner.show()
    this.orderService.getDetails(`webapi/consultation/remove_promo`).subscribe((rsp: any) => {
      if (rsp && rsp['status'] == 200) {
        this.clsCupon.nativeElement.click()
        this.toastr.success(rsp.message);
        this.getCartDetails();
      } else {
        this.toastr.error(rsp.message);
        this.spinner.hide()
      }
    })

  }


  saveCart() {
    this.spinner.show();
    let fd = new FormData();
    fd.append('patientId', this.selectedPatient.MyFamilyId);
    fd.append('preferredLanguage', this.selectedLang);
    fd.append('reportFilePath', this.uploadedPath);
    fd.append('symptomesDetails', this.symptoms);
    fd.append('modeOfConsultation', this.selectedMode);
    this.spinner.show()
    this.orderService.setDetails(`webapi/consultation/save_consultation_cart`, fd).subscribe((rsp: any) => {

      if (rsp && rsp['status'] == 200) {
        this.cartDetails = rsp['data'];
        this.symptoms = this.cartDetails.SymptomesDetails;
        this.setLang(this.cartDetails.PreferredLanguage);
        this.setMode(this.cartDetails.ModeOfConsultation);
        // this.proceedPay.emit(this.billDetails);
        this.getPaymentOptions();
      } else {
        // this.clsCupon.nativeElement.click()
        this.toastr.error(rsp.message);
        this.spinner.hide()
      }

    })
  }

  getPaymentOptions() {
    this.pglist = [];
    this.selectedPG = '';
    this.orderService.getDetails('webapi/consultation/get_pg_list').subscribe((response: any) => {
      if (response['status'] == 200) {
        // console.log('pg list', response);
        this.pglist = response['data'];
        if (this.pglist.length > 0) {
          this.selectedPG = this.pglist[0];
          this.steps[1].completed = true;
          this.activeStep = this.steps[2];
        } else {
          this.toastr.error(response['message']);
          this.selectedPG = '';
        }
        this.spinner.hide();
      } else {
        this.toastr.error(response['message']);
        this.spinner.hide()
      }
    });
  }

  assignPayment(value: any) {
    this.selectedPG = value;
  }

  placeOrder(pgRow: any) { }

  // processDgPay(data: any) {
  //   this.msgText = '';
  //   this.spinner.show();
  //   let fd = new FormData();
  //   if (data['GateWayPayMode'] != '' && data['GateWayPayMode'] != null) {
  //     fd.append('PaymentMode', data['GateWayPayMode']);
  //   } else {
  //     fd.append('PaymentMode', '');
  //   }

  //   fd.append('PaymentMethod', data['Key']);
  //   fd.append('IsAdmin', '0');
  //   fd.append('PatientId', this.selectedPaitentID);

  //   this.CommonService.postData('lab/gatewayinfo', fd).subscribe((response: any) => {


  //     // console.log("p.res", response);

  //     if (response && response['status'] == 200) {

  //       let d: Date = new Date();
  //       this.cookieService.set('defaultGateway', data['Key'], d.getTime() + 86400 * 30, '/');
  //       this.cookieService.set('GateWayPayMode', data['GateWayPayMode'], d.getTime() + 86400 * 30, '/');
  //       if(data['Key'] == 'RAZORPAY') {
  //         let RZdata = response['PGData']['result']['data']['RazorpayMerchantDetails'];
  //         this.makePayment(RZdata);
  //         this.spinner.hide();
  //       }
  //     }else{
  //       this.msgText = response['message'];
  //       this.respModal.nativeElement.click();
  //       this.spinner.hide();
  //     }
  //   });
  // }

  // async makePayment(data: any) {
  //   const options: any = {
  //     key: data.razorpay_key,
  //     amount: data.amount_due, // amount in paisa
  //     currency: data.currency,
  //     name: "SastaSundar",
  //     description: '',
  //     image: 'incom/retail_WH/images/small_logo.png',
  //     order_id: data.id,
  //     // handler: (response: any) => {
  //     //   console.log('payment response', response)
  //     // },
  //     prefill: {
  //       name: this.CommonService.UserName,
  //       email: this.CommonService.EmailId,
  //       contact: this.CommonService.Mobile
  //     },
  //     modal: {
  //       // We should prevent closing of the form when esc key is pressed.
  //       escape: false,
  //     },
  //     notes: {
  //       amount: data.amount_due,
  //       receipt: data.receipt
  //     },
  //     theme: {
  //       color: '#3399cc'
  //     },
  //   };

  //   options.handler = ((response: any, error: any) => {
  //     options.response = response;
  //     // debugger
  //     // console.log(options);
  //     this.spinner.show();
  //     let fd = new FormData();
  //     fd.append('receipt', data.receipt);
  //     fd.append('amount', data.amount_due);
  //     fd.append('razorpay_payment_id', response.razorpay_payment_id);
  //     fd.append('razorpay_order_id', response.razorpay_order_id);
  //     fd.append('razorpay_signature', response.razorpay_signature);
  //     // fd.append('response', response);
  //     this.CommonService.postData('lab/razorpay_payment_success', fd).subscribe((resp: any) => {
  //       // console.log(rsp)
  //       if (resp && resp['response_code'] == 0) {
  //         if(resp['data']['ReturnStatus']== 1){
  //           // this.orderSuccess(resp);
  //           this.spinner.hide();
  //         }else{
  //           this.msgText = resp['message'];
  //           this.respModal.nativeElement.click();
  //           this.spinner.hide();
  //         }
  //       } else {
  //         this.msgText = resp['message'];
  //         this.respModal.nativeElement.click();
  //         this.spinner.hide();
  //       }
  //     })
  //   });
  //   options.modal.ondismiss = (() => {
  //     // handle the case when user closes the form while transaction is in progress
  //     this.msgText = 'Transaction cancelled. Unable to process your request';
  //     this.respModal.nativeElement.click();
  //     this.spinner.hide();
  //   });

  //   const razorpay = new Razorpay(options);
  //   razorpay.open();
  // }



  patientProfileWebEngage(data: any) {
    let Mob = '+91' + data.MobileNo.toString();
    let webData = {
      'Patient Name': data.Name,
      'Patient DOB': data.BirthDay,
      'Patient Gender': data.Gender,
      'Patient Email': data.Email ? data.Email : '',
      'Patient Phone': Mob,
      'Relationship': data.Relationship
    }
    this.webengageService.trackEvent('Patient Profile Details Updated', webData);
  }

  addPatientWebEngage() {
    this.webengageService.trackEvent('Add Patient Clicked', {});
  }

  selectPatient(member: any) {
    this.selectedPatient = member;
  }

  backToHome() { }

  continue() {
    // this.patientSelect.emit(this.selectedMember);
    this.steps[0].completed = true;
    this.activeStep = this.steps[1];
    this.spinner.show();
    this.getDocList()
  }

  changePatient() {
    this.steps.map((step: any) => ({ ...step, completed: false }));
    this.activeStep = this.steps[0];
    this.docList = [];
    this.billDetails = [];
    this.symptoms = '';
    this.prscFiles = [];
    this.uploadedPath = '';
    this.prscImages = [];
    this.selectedLang = 'Hindi';
    this.selectedMode = 'A';
    this.showHideDoc = false;
    this.selectedDoc = '';
    this.infoText = '';
    this.cartDetails = '';
    this.couponList = [];
    this.pglist = [];
    this.selectedPG = '';
  }

  numCheck(event: any) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
  }

  alphaOnly(event: any) {
    return ((event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 32))
  };

}
