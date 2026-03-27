import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-healthbuddy',
  templateUrl: './manage-healthbuddy.component.html',
  styleUrl: './manage-healthbuddy.component.scss'
})
export class ManageHealthbuddyComponent implements OnInit {

  respMsg: any = '';
  RelivantHBData : any = '';
  RequestHBForm!: FormGroup;
  submitted: boolean = false;
  showPrfSeller: boolean = false;
  @ViewChild('hbReqModal') hbReqModal: any;

  constructor(public authService: AuthService, private spinner: NgxSpinnerService, public CommonService: CommonService, private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.generateform();
    this.getRelivantHB()
  }

  generateform() {
    this.RequestHBForm = this.formBuilder.group({
      hbName : ['', Validators.required],      
    })
  }

  get f() { return this.RequestHBForm.controls; }

  changeSeller(){
    this.showPrfSeller = true;
  }

  getRelivantHB(){
    let fd = new FormData();
    fd.append('pincode', '700156');
    this.CommonService.getRelivantHBList('webapi/users/getHBList', fd).subscribe((res: any) => {
      // console.log(res);
      if(res && res.status == 200){
        this.RelivantHBData = res['data']
      }else{
        this.RelivantHBData = '';
      }
    })
  }

  submitHB(){
    this.submitted = true;
    this.respMsg = '';
    // stop here if form is invalid
    if (this.RequestHBForm.invalid) {
      return;
    }else{
      let fd = new FormData();
      fd.append('message', this.RequestHBForm.value.hbName);
      // console.log(fd);
      // debugger
      this.CommonService.changeHealthBuddy('customers/user/changeHealthbuddy', fd).subscribe((res: any) => {
        // console.log(res);
        if(res && res['status']==200){
          this.respMsg = 'Your request has been submitted successfully';
          this.hbReqModal.nativeElement.click();
        }else{
          this.respMsg = 'Something went wrong. Please try again';
          this.hbReqModal.nativeElement.click();
        }     
      })
    }
  }

  hbReset(){
    this.showPrfSeller = false;
    this.submitted = false;
    this.respMsg = '';
    this.RequestHBForm.reset();
  }

}
