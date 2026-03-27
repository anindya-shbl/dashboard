import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrl: './manage-account.component.scss'
})
export class ManageAccountComponent implements OnInit {

  respMsg: any = '';
  cnfForm!: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private dbService: NgxIndexedDBService, private cookieService: CookieService, public authService: AuthService, private spinner: NgxSpinnerService, private webengageService: WebEngageService){}

  ngOnInit(): void {
    this.generateform()
  }

  generateform() {
    this.cnfForm = this.formBuilder.group({
      cnfirm: ['', Validators.required],      
    })
  }

  get f() { return this.cnfForm.controls; }


  deleteAccount() {
    this.submitted = true;
    this.respMsg = '';
    if (this.cnfForm.value.cnfirm === 'DELETE' || this.cnfForm.value.cnfirm === 'delete') {
      let fd = new FormData();
      // console.log(adrId,fd);
      this.spinner.show();
      this.authService.removeuserAccount('webapi/cartuserapp/deleteAccount', fd).subscribe((res: any) => {
        // let res1 : any = {"status":"success","msg":"","results":{"ReturnStatus":1}};
        // let res : any = {"status":"success","msg":"","results":{"ReturnStatus":0}};
        // console.log(res);
        if (res && res['status'] == "success") {
          if(res['results']['ReturnStatus']== 1){
            this.deleteAccountWebEngage(true);
            this.logOut()
            this.spinner.hide();
          }else{
            this.deleteAccountWebEngage(false);
            this.resetCnf();
            this.respMsg = res['msg'];
            this.spinner.hide();
          }
        } else {
          this.deleteAccountWebEngage(false);
          this.resetCnf();
          this.respMsg = res['msg'];
          this.spinner.hide();
        }
      })
    }else{
      return;
    }
  }

  logOut(){
    // this.router.navigate(['CustomarCart/ViewCart']);
    this.dbService.clear('cartItems').subscribe((res: any) => {
      if(res==true){
        this.cookieService.delete('isLoggedIn');
        window.location.href=this.authService.baseurl+"index.php/user/logout";
      }
    })
  }

  resetCnf(){
    this.submitted = false;
    this.respMsg = '';
    this.cnfForm.reset();
  }

  deleteAccountWebEngage(data: any) {
    let webData = {
      'Status': data
    }
    this.webengageService.trackEvent('Delete Account Clicked', webData);
  }

}