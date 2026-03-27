import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-health-card-details',
  templateUrl: './health-card-details.component.html',
  styleUrl: './health-card-details.component.scss'
})
export class HealthCardDetailsComponent implements OnInit {

  AddCardForm!: FormGroup;
  submitted: boolean = false;
  cardBalance: any = {};
  transationData: any = {};
  trnsHistory: any = [];
  isloading: boolean = false;
  pageNo: number = 1;
  pageSize: number = 10;
  loadMoreBtn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    public authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.generateform();
    this.spinner.show();
    this.getBalance();
    // this.getTransationList();
  }

  generateform() {
    this.AddCardForm = this.formBuilder.group({
      code: ['', Validators.required]
    })
  }

  get f() { return this.AddCardForm.controls; }

  getBalance() {
    this.isloading = true;
    this.trnsHistory = [];
    this.loadMoreBtn = false;
    this.pageNo = 1;
    // this.spinner.show();
    let MobileNo = this.authService.Mobile;
    this.orderService.getDetails(`webapi/cfh/get_balance?search=${MobileNo}`).subscribe((res: any) => {
    if (res && res.status == 1) {
      this.cardBalance = res.data;
      // this.isloading = false;
      // this.spinner.hide();
      this.getTransationList();
    } else {
      this.isloading = false;
      this.spinner.hide();
    }
    })
  }

  getTransationList() {
    // this.isloading = true;
    // this.spinner.show();
    let MobileNo = this.authService.Mobile;
    this.orderService.getDetails(`webapi/cfh/trans_history?search=${MobileNo}&per_page=${this.pageSize}&page=${this.pageNo}`).subscribe((res: any) => {
    if (res && res.status == 1) {
      this.transationData = res.data;
      if (res.data && res.data.data.length > 0) {
        this.trnsHistory = [...this.trnsHistory, ...res.data.data];
        if (this.pageNo < res.data.total_pages) {
          this.loadMoreBtn = true;
        } else {
          this.loadMoreBtn = false;
        }
        this.isloading = false;
        this.spinner.hide();
      } else {
        this.isloading = false;
        this.spinner.hide();
      }
    } else {
      this.isloading = false;
      this.spinner.hide();
    }
    })
  }

  moreTransation() {
    this.pageNo += 1;
    this.isloading = true;
    this.spinner.show();
    this.getTransationList();
  }

  addCard() {
    this.submitted = true;
    if (this.AddCardForm.invalid) {
      return;
    } else {
      let data = this.AddCardForm.value.code;
      this.spinner.show();
      this.orderService.getDetails(`webapi/cfh/assign_healthcard?HealthCardCode=${data}`).subscribe((res: any) => {
        if (res && res.status == 1) {
          this.toastr.success('Health Card Added Successfully');
          this.AddCardForm.reset();
          this.submitted = false;
          this.getBalance();
          // this.getTransationList();
        } else {
          this.spinner.hide();
          this.toastr.error(res.data || 'Something went wrong');
        }
      })
    }
  }

}
