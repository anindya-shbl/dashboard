import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-health-cards-list',
  templateUrl: './health-cards-list.component.html',
  styleUrl: './health-cards-list.component.scss'
})
export class HealthCardsListComponent implements OnInit {

  isloading: boolean = false;
  cardList: any = [];
  pageNo: number = 1;
  pageSize: number = 10;
  loadMoreBtn: boolean = false;

  constructor(
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    public authService: AuthService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getCardList()
  }

  getCardList() {
    this.spinner.show();
    this.isloading = true;
    let MobileNo = this.authService.Mobile;
    this.orderService.getDetails(`webapi/cfh/card_list?search=${MobileNo}&per_page=${this.pageSize}&page=${this.pageNo}`).subscribe((res: any) => {
      // console.log(res)
      if (res && res.status == 1) {
        // this.cardList = res.data.data;
        this.cardList = [...this.cardList, ...res.data.data];
        if (this.pageNo < res.data.total_pages) {
          this.loadMoreBtn = true;
        } else {
          this.loadMoreBtn = false;
        }
        this.isloading = false;
        this.spinner.hide();
      } else {
        // this.cardList = [];
        this.isloading = false;
        this.spinner.hide();
      }
    })
  }

  loadMore() {
    this.pageNo += 1;
    this.getCardList();
  }

}
