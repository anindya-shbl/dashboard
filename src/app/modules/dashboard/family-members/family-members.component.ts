import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-family-members',
  templateUrl: './family-members.component.html',
  styleUrl: './family-members.component.scss'
})
export class FamilyMembersComponent implements OnInit {

  familySec: boolean = true;
  RecepentForm!: FormGroup;
  otpForm: any;
  submitted: boolean = false;
  familyMemberList: any = [];
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('otpModal') otpModal: any;
  @ViewChild('closeotpModal') closeotpModal: any;
  @ViewChild('familyModalbtn') familyModalbtn: any;
  actionType: any = '';
  editID: any = '';
  deleteMember: any = [];
  selectedMember: any = [];
  otpValue: any = '';
  isloading: boolean = false;
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5'];
  @ViewChildren('formRow') rows: any;

  respMsg: any = '';
  isaddedMember: boolean = false;
  addedMemberId: any = '';

  maxdate: any = new Date().toISOString().slice(0, 10);

  constructor(private formBuilder: FormBuilder, private profileService: ProfileService, private spinner: NgxSpinnerService, private webengageService: WebEngageService) { }

  ngOnInit(): void {
    this.getFamilyMemberList();
    this.generateform();
    this.actionType = 'add';
    this.otpForm = this.toFormGroup(this.formInput);
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
    // this.profileService.getFamilyMembers('customers/family/manageFamilyMember').subscribe((res: any) => {
    this.profileService.getFamilyMembers('webapi/user/manageFamilyMember').subscribe((res: any) => {
      if (res && res.response_code == 0) {
        this.familyMemberList = res.data;
        this.isloading = false;
        if (this.isaddedMember == true) {
          let obj = this.familyMemberList.find((o: any) => o.MyFamilyId == this.addedMemberId);
          this.getFmOTP(obj);
        }
        this.spinner.hide();
      }
      // console.log(data['result']['rs']['allAddressData']);
      // this.familyMemberList = data['result']['rs']['allAddressData'];
      // console.log(this.familyMemberList)
    })
  }

  viewFamily() {
    this.familySec = true;
  }

  viewReceiprnts() {
    this.familySec = false;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.RecepentForm.invalid) {
      return;
    } else {
      let fd = new FormData();
      fd.append('Name', this.RecepentForm.value.Name);
      fd.append('Relationship', this.RecepentForm.value.Relationship);
      fd.append('familyDOB', this.RecepentForm.value.BirthDay);
      fd.append('Gender', this.RecepentForm.value.Gender);
      fd.append('MobileNo', this.RecepentForm.value.MobileNo);
      fd.append('EmailId', this.RecepentForm.value.Email);

      // console.log(this.RecepentForm.value, fd)

      if (this.actionType == 'add') {
        // this.profileService.addFamilyMember('customers/family/addFamilyMember', fd).subscribe((res: any) => {
        this.profileService.addFamilyMember('webapi/customer/addFamilyMember', fd).subscribe((res: any) => {
          // console.log(res);
          if (res && res['status'] == 200) {
            this.patientProfileWebEngage(this.RecepentForm.value)
            this.isaddedMember = true;
            this.addedMemberId = res['data']['record']['MyFamilyId'];
            this.getFamilyMemberList();
            this.closebutton.nativeElement.click();
            this.onReset();
          } else {
            // alert('some thing went wrong. please try again')           
            this.respMsg = res['message'];
            this.familyModalbtn.nativeElement.click();
          }
        })
      }

      if (this.actionType == 'edit') {
        fd.append('MyFamilyId', this.editID);
        fd.append('IsGiftRecipient', '');

        this.profileService.editFamilyMember('webapi/customer/updateFamilyMember', fd).subscribe((res: any) => {
          // console.log(res);
          if (res && res['status'] == 200) {
            this.patientProfileWebEngage(this.RecepentForm.value)
            this.getFamilyMemberList();
            // this.closebutton.nativeElement.click();
            this.respMsg = res['message'];
            this.familyModalbtn.nativeElement.click();
            this.onReset();
          } else {
            this.respMsg = res['message'];
            this.familyModalbtn.nativeElement.click();
          }
        })
      }
    }

    // console.log(this.RecepentForm.value)
  }

  onReset() {
    this.submitted = false;
    this.RecepentForm.reset();
    this.actionType = 'add';
    this.editID = '';
    this.deleteMember = [];
  }

  editMember(familyId: any) {
    let obj = this.familyMemberList.find((o: any) => o['MyFamilyId'] === familyId);
    this.actionType = 'edit';
    let encodedString = familyId;
    this.editID = btoa(encodedString);
    // console.log(obj, encodedString);
    this.RecepentForm.patchValue({
      Name: obj.Name,
      Relationship: obj.Relationship,
      BirthDay: obj.DOB,
      Gender: obj.Gender,
      MobileNo: obj.MobileNo,
      Email: obj.EmailId,
    });

    // this.profileService.editAddress('customers/address/editAddress', fd).subscribe((res: any) => {
    //   console.log(res);
    // this.getAddressList();
    // this.closebutton.nativeElement.click();
    // })
  }

  setDeleteModal(data: any) {
    this.deleteMember = data;
  }

  removeReceipent(familyId: any) {
    let delId = btoa(familyId)
    let fd = new FormData();
    fd.append('memberId', delId);
    // console.log(delId);
    // this.profileService.removeMember('customers/family/memberDelete', fd).subscribe((res: any) => {
    this.profileService.removeMember('webapi/customer/memberDelete', fd).subscribe((res: any) => {
      // console.log(res);
      if (res && res['status'] == 200) {
        this.getFamilyMemberList();
        this.closebutton.nativeElement.click();
        this.respMsg = res['message'];
        this.familyModalbtn.nativeElement.click();
        this.onReset();
      } else {
        this.closebutton.nativeElement.click();
        this.respMsg = res['message'];
        this.familyModalbtn.nativeElement.click();
        // alert('some thing went wrong. please try again')
      }
    })
  }

  toFormGroup(elements: any) {
    const group: any = {};
    elements.forEach((key: any) => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  keyUpEvent(event: any, index: any) {
    let pos = index;
    const val = event.target.value;
    const key = event.key.toLowerCase();

    if (key == "backspace" || key == "delete") {
      event.target.value = "";
      pos = index - 1;
    } else {
      if (isNaN(val) || val == "") {
        event.target.value = "";
        return;
      } else {
        pos = index + 1;
      }
    }

    if (pos > -1 && pos < this.formInput.length) {
      this.rows._results[pos].nativeElement.focus();
    }
  }

  getFmOTP(member: any) {
    this.spinner.show();
    this.selectedMember = [];
    this.selectedMember.push(member);
    this.otpValue = '';
    // this.rows._results[0].nativeElement.focus();

    let fmlyId = btoa(member.MyFamilyId)
    let fd = new FormData();
    fd.append('memberID', fmlyId);
    fd.append('mobileNo', member.MobileNo);

    if (member.MobileNo != null && fmlyId != null) {
      // this.profileService.getFmOTP('customers/family/generateOtp', fd).subscribe((res: any) => {
      this.profileService.getFmOTP('webapi/customer/generateOtp', fd).subscribe((res: any) => {
        // console.log(res);
        if (res && res['status'] == 200) {
          this.otpModal.nativeElement.click();
          this.spinner.hide()
        } else {
          this.respMsg = res['message'];
          this.familyModalbtn.nativeElement.click();
          this.spinner.hide();
          // alert('some thing went wrong. please try again');
        }
      })
    } else {
      return;
    }
  }

  submitOTP() {
    this.otpValue = `${this.otpForm.value.input1}${this.otpForm.value.input2}${this.otpForm.value.input3}${this.otpForm.value.input4}${this.otpForm.value.input5}`;
    // console.log('member',this.selectedMember, this.otpValue);
    let fmlyId = btoa(this.selectedMember[0].MyFamilyId)
    let fd = new FormData();
    fd.append('memberID', fmlyId);
    fd.append('mobileNo', this.selectedMember[0].MobileNo);
    fd.append('otp', this.otpValue);
    if (this.otpForm.valid && this.otpValue != '') {
      // this.profileService.verifyFmOTP('customers/family/verifyMobile', fd).subscribe((res: any) => {
      this.profileService.verifyFmOTP('webapi/customer/verifyMobile', fd).subscribe((res: any) => {
        // console.log(res);
        if (res && res['status'] == 200) {
          this.respMsg = res['message'];
          this.closeotpModal.nativeElement.click();
          this.familyModalbtn.nativeElement.click();
          this.getFamilyMemberList();
          this.onReset();
          this.skipOTP();
        } else {
          this.respMsg = res['message'];
          this.familyModalbtn.nativeElement.click();
          this.skipOTP();
          // alert('some thing went wrong. please try again')
        }
      })
    }
  }

  skipOTP() {
    this.closeotpModal.nativeElement.click();
    this.isaddedMember = false;
    this.otpForm.reset();
    this.selectedMember = [];
    this.addedMemberId = '';
    this.otpValue = '';
  }


  //   http://192.168.5.162/sspl_com/index.php/customers/family/generateOtp
  // memberId = base64_encode()
  // MobileNo = 

  // http://192.168.5.162/sspl_com/index.php/customers/family/verifyMobile
  // memberId = base64_encode()
  // OTPtext =

  numCheck(event: any) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57
  }

  alphaOnly(event: any) {
    return ((event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 32))
  };


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

  addPatientWebEngage(){
    this.webengageService.trackEvent('Add Patient Clicked', {});
  }

}
