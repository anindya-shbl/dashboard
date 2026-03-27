import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { ProfileService } from '../../../services/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { map, take, timer } from 'rxjs';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {

  // savedEmail: any = '';
  // savedMobile: any = '';
  // newEmail: any = '';
  // newEmailOTP: any = '';

  // newemailSec: boolean = false
  // openOTPSec: boolean = false;

  profileForm!: FormGroup;
  primaryMobForm!: FormGroup;
  primaryEmailForm!: FormGroup;
  otpForm!: FormGroup;
  submitted: boolean = false;
  Primarysubmitted: boolean = false;
  accountdata: any = [];
  customerName : any = 'Guest';
  totalSavings: any = 0;
  createDate: any = '';
  EmailId: any = '';
  MobileNo: any = '';
  respMsg: any = '';
  showOTPInput: boolean =false;

  secondsLeft: any = 0;
  showTimer: boolean = false;

  display: any;
  public timerInterval: any;

  @ViewChild('profileModal') profileModal: any;
  @ViewChild('verfEmail') verfEmail: any;
  maxdate: any = new Date().toISOString().slice(0, 10);

  constructor(private formBuilder: FormBuilder, public CommonService: CommonService, public authService: AuthService, private orderService : OrderService, private profileService: ProfileService, private spinner: NgxSpinnerService, private webengageService: WebEngageService) { }

  ngOnInit(): void {
    this.generateform();
    this.accountData();
    this.setprimaryMobForm();
    this.setprimaryEmailForm();
    this.setotpForm();
  }

  accountData() {
    // this.currentOrders = [];
    this.spinner.show();
    // this.orderService.getAccountDetails('customers/user/dashboard').subscribe((data: any) => {
    this.orderService.getAccountDetails('webapi/user/dashboard').subscribe((data: any) => {
      // console.log(data)
      if (data) {
        this.accountdata = data['result']['rs'];
        if(this.accountdata.CustFullName == null || this.accountdata.CustFullName == ''){
          this.customerName  = 'Guest'
        }else{
          this.customerName  = this.accountdata.CustFullName;
        };

        if(this.accountdata.EmailId == null || this.accountdata.EmailId == '' || this.accountdata.EmailId == undefined){
          this.EmailId  = ''
        }else{
          this.EmailId  = this.accountdata.EmailId;
        };

        // this.customerName = this.accountdata.CustFullName == 'Guest' ? 0 : this.accountdata.CustFullName;
        this.totalSavings = this.accountdata.TotalSavings == null ? 0 : this.accountdata.TotalSavings;
        this.createDate = this.accountdata.CreatedDate == null ? '' : this.accountdata.CreatedDate;
        // this.EmailId = this.accountdata.EmailId == null ? '' : this.accountdata.EmailId;
        this.MobileNo = this.accountdata.MobileNo == null ? '' : this.accountdata.MobileNo;
        // this.spinner.hide();

        this.authService.customerName = this.customerName;
        this.authService.UserName = this.accountdata.FName;
        this.authService.Mobile = this.MobileNo;
        // this.authService.labBookings any = 0;
        // this.authService.doctorConsultations any = 0;
        this.CommonService.sendClickEvent();

        this.setFormData();
        
      }
      // console.log('ttt1', this.accountdata);
    });
  }

  generateform() {
    this.profileForm = this.formBuilder.group({
      FirstName: ['', Validators.required],
      MiddleName: [''],
      Lastname: ['', Validators.required],
      BirthDay: ['', Validators.required],
      Gender: ['', Validators.required],
      PreferredMobile: [''],
      PreferredEmail: [''],
    })
  }

  setprimaryMobForm() {
    this.primaryMobForm = this.formBuilder.group({
      PrimaryMobile: ['', Validators.required],
    })
  }

  setprimaryEmailForm() {
    this.primaryEmailForm = this.formBuilder.group({
      PrimaryEmail: ['', Validators.required],
    })
  }

  setotpForm() {
    this.otpForm = this.formBuilder.group({
      otpVal: [''],
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; };
  get fM() { return this.primaryMobForm.controls; };
  get fE() { return this.primaryEmailForm.controls; };
  get oT() { return this.otpForm.controls; };

  setFormData(){
    this.profileForm.setValue({
      FirstName: this.accountdata.FName == null ? '' : this.accountdata.FName,
      MiddleName: this.accountdata.MName == null ? '' : this.accountdata.MName,
      Lastname: this.accountdata.LName == null ? '' : this.accountdata.LName,
      BirthDay: this.accountdata.DOB == null ? '' : this.accountdata.DOB,
      Gender: this.accountdata.Gender == null ? '' : this.accountdata.Gender,
      PreferredMobile: this.accountdata.AlternativeContactNo == null ? '' : this.accountdata.AlternativeContactNo,
      PreferredEmail: this.accountdata.AlternativeEmailId == null ? '' : this.accountdata.AlternativeEmailId,
    });
    this.spinner.hide();
  }


  onSubmit() {
    this.submitted = true;
    this.respMsg = '';
    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }else{
      let fd = new FormData();
      fd.append('fname', this.profileForm.value.FirstName);
      fd.append('mname', this.profileForm.value.MiddleName);
      fd.append('lname', this.profileForm.value.Lastname);
      fd.append('mobile', this.MobileNo);
      fd.append('dob', this.profileForm.value.BirthDay);
      fd.append('gender', this.profileForm.value.Gender);
      fd.append('alternativeno', this.profileForm.value.PreferredMobile);
      fd.append('alternativeEmail', this.profileForm.value.PreferredEmail);
      // console.log(this.profileForm.value, fd);
      this.spinner.show();

      // this.profileService.updateProfile('customers/user/updateProfile', fd).subscribe((res: any) => {
      this.profileService.updateProfile('webapi/customer/updateProfile', fd).subscribe((res: any) => {
        // console.log(res);
        if(res && res['status']==200){
          this.myProfileWebEngage(this.profileForm.value, this.EmailId, this.MobileNo);
          this.accountData();
          // this.closebutton.nativeElement.click();
          // this.setFormData();
          this.respMsg = 'Profile updated successfully';
          this.profileModal.nativeElement.click();
        }else{
          // this.spinner.hide();
          this.setFormData();
          // alert('some thing went wrong. please try again');
          this.respMsg = 'Something went wrong. Please try again';
          this.profileModal.nativeElement.click();
        }     
      })
    }
  }

  onReset() {
    this.submitted = false;
    this.respMsg = '';
    this.profileForm.reset();
    // this.setFormData();
    this.accountData();
  }

  getMobileOtp(){
    // getUserMobileOTP
    this.Primarysubmitted = true;
    this.respMsg = '';
    this.otpForm.reset();
    if (this.primaryMobForm.invalid) {
      // alert('invalid');
      return;
    } else {
      let fd = new FormData();
      fd.append('mobile', this.primaryMobForm.value.PrimaryMobile);
      this.profileService.getUserOTP('webapi/users/GenerateOTPMobile', fd).subscribe((res: any) => {
        // console.log(res);
        if(res && res['response_code']==200){
          this.startTimer();
          this.showOTPInput = true;                   
        }else{
          this.respMsg = res['message'];
          this.showOTPInput = false
        }
      })
    }
  }

  verifyMobileOtp(){
    this.respMsg = '';
    // this.otpForm.reset();
    if(this.otpForm.value.otpVal.length == 5){
      let fd = new FormData();
      fd.append('mobile', this.primaryMobForm.value.PrimaryMobile);
      fd.append('otp', this.otpForm.value.otpVal);
      this.profileService.verifyUserOTP('webapi/users/VerifyOTPMobile', fd).subscribe((res: any) => {
        // console.log(res);
        if (res && res['response_code'] == 200) {
          this.myProfileWebEngage(this.profileForm.value, this.EmailId, this.primaryMobForm.value.PrimaryMobile);
          this.accountData();
          this.respMsg = 'Profile updated successfully';
          this.profileModal.nativeElement.click();
        } else {
          // this.spinner.hide();
          this.setFormData();
          this.respMsg = 'Something went wrong. Please try again';
          this.profileModal.nativeElement.click();
        }
      })
    }else{
      // this.respMsg = 'OTP is required.'
      return;
    }
  }


  getEmailOtp(){
    this.Primarysubmitted = true;
    this.respMsg = '';
    this.otpForm.reset();
    if (this.primaryEmailForm.invalid) {
      // alert('invalid');
      return;
    } else {
      let fd = new FormData();
      fd.append('email', this.primaryEmailForm.value.PrimaryEmail);
      // fd.append('isVerified', this.accountdata.IsEmailVerified);
      this.profileService.getUserOTP('webapi/users/GenerateOTPEmail', fd).subscribe((res: any) => {
        if(res && res['response_code']==200){
          this.accountData(); 
          this.startTimer();    
          this.showOTPInput = true;
        }else{
          this.respMsg = res['message'];
          this.showOTPInput = false;
        }
      })
    }
  }

  verifyEmailOtp(){
    this.respMsg = '';     
    if(this.otpForm.value.otpVal.length == 5){
      let fd = new FormData();
      fd.append('email', this.primaryEmailForm.value.PrimaryEmail);
      fd.append('otp', this.otpForm.value.otpVal);
      // debugger
      this.profileService.verifyUserOTP('webapi/users/VerifyOTPEmail', fd).subscribe((res: any) => {
        // console.log(res);
        if(res && res['response_code']==200){
          this.myProfileWebEngage(this.profileForm.value, this.primaryEmailForm.value.PrimaryEmail, this.MobileNo);
          this.accountData();
          this.respMsg = 'Profile updated successfully';
          this.profileModal.nativeElement.click();
        }else{
          // this.spinner.hide();
          this.setFormData();
          this.respMsg = 'Something went wrong. Please try again';
          this.profileModal.nativeElement.click();
        } 
      })
    }else{
      // this.respMsg = 'OTP is required.'
      return;
    }
  }

  setOtpSec(){
    // this.secondsLeft = 0;
    this.stopTimer()
    this.primaryEmailForm.patchValue({PrimaryEmail: this.EmailId});
    this.getEmailOtp();
    // this.showTimer = true;
    this.showOTPInput = true;
    this.verfEmail.nativeElement.click()
  }

  // startTimer() {
  //   this.showTimer = true;
  //   const countdown$ = timer(0, 1000).pipe(
  //     take(30),
  //     map((secondsElapsed) => 29 - secondsElapsed)
  //   );

  //   countdown$.subscribe((secondsLeft) => {
  //     this.secondsLeft = secondsLeft;
  //     if (this.secondsLeft == 0) {
  //       this.showTimer = false;
  //     }
  //   });
  // }

  resetPrimary(){
    this.Primarysubmitted = false;
    this.showOTPInput = false;
    this.respMsg = '';
    this.primaryEmailForm.reset();
    this.primaryMobForm.reset();
    this.otpForm.reset();
    this.stopTimer()
  }

  // openNewEmail(){
  //   // this.newemailSec = true;
  // }

  // sendNewEmailOtp(){
  //   // this.openOTPSec = true;
  // }

  // saveNewEmail(){}

  numCheck(event: any) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
  }


  startTimer() {
    this.timer(30);
  }
  stopTimer() {
    clearInterval(this.timerInterval);
  }

  timer(val: any) {
    // let minute = 1;
    this.showTimer = true;    
    let seconds: number = val;
    let textSec: any = `0 : ${seconds}`;
    
    this.secondsLeft = textSec;
    this.timerInterval = setInterval(() => {
      if(seconds != 0){
        seconds--;
        textSec = `0 : ${seconds}`;
        this.secondsLeft = textSec;
        
      }else{
        clearInterval(this.timerInterval);
        this.showTimer = false;
      }
      
    }, 1000);
  }

  alphaOnly(event: any) {
    return ((event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122))
  };


  myProfileWebEngage(data: any, email: any, mobile: any){

    let prefMob = ''
    if(data.PreferredMobile != '' && data.PreferredMobile != null  && data.PreferredMobile != undefined){
      prefMob = '+91' + data.PreferredMobile.toString()
    }else{
      prefMob = ''
    }

    let custMob = '+91'+ mobile.toString();

    let webData = {
      'Name' : data.FirstName,
      'DOB' : data.BirthDay,
      'Gender' : data.Gender,
      'Email' : email,
      'Phone' : custMob,
      'Preferred Email' : data.PreferredEmail ? data.PreferredEmail: '',
      'Preferred Phone' : prefMob,
      // 'Accepts Marketing' : '',
    }
    this.webengageService.trackEvent('User Profile Details Updated', webData);
  }
  
}
