import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-jito-search',
  templateUrl: './jito-search.component.html',
  styleUrl: './jito-search.component.scss'
})
export class JitoSearchComponent implements OnInit {

  searchText: any = '';
  // searchStart: boolean = false;
  searchList: any = [];
  typingTimer: any = 0;
  showSearchArea: boolean = false;
  activeSearchbtn: boolean = false;
  pageNo: any = 1;
  size: any = 50;
  uniqueSalts: any = [];
  isLoading: boolean = false;
  inside: boolean = false;
  addedInCart: any = [];
  totalItem: any = 0;

  constructor(
    private router: Router,
    public commonService: CommonService,
    public authService: AuthService,
    private cookieService: CookieService,
    private dbService: NgxIndexedDBService
  ) { }

  ngOnInit(): void {
    let d: Date = new Date();
    this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
  }


  // @HostListener("click")
  // clicked() {
  //   this.inside = true;
  //   // console.log('inside') 
  // }

  // @HostListener("document:click")
  // clickedOut() {
  //   // console.log('outside') 
  //   if (!this.inside) {
  //     this.cleareSearch()
  //   }
  //   this.inside = false;
  // }

  onSearchChange(evnt: any) {
    let str = evnt.target.value;
    this.searchList = [];
    this.uniqueSalts = [];
    this.totalItem = 0;
    clearTimeout(this.typingTimer);
    if (str.length > 2) {
      this.isLoading = true;
      this.searchText = str;
      this.showSearcArea();
      this.typingTimer = setTimeout(() => {
        this.onSearch();
      }, 300);
    } else {
      // this.searchStart = false;
      this.isLoading = false;
      this.showSearchArea = false;
      // this.searchList = [];

    }
    // this.searchText = str;
    // this.showSearchArea = true;
    // if (str.length == 0) {
    //   this.searchStart = false;
    //   this.searchList = [];
    // }
  }

  onSearch() {
    // console.log('Search text:', this.searchText);
    let timenow = new Date().getTime();
    let pincode = this.authService.PinCode;
    let werehouseId = this.authService.WHId;
    let panindia = this.authService.IsPanIndia;
    let device = '';
    // this.searchStart = true;
    let searchUrl = `product_list_v2?q=${this.searchText}&page=${this.pageNo}&size=${this.size}&ptype='P'&wh=${werehouseId}&panindia=${panindia}&pincode=${pincode}&strict_match=1&mtype='P'&includeGiftable=0&include_discontinued=0&timestamp=${timenow}&format=2`;
    // Implement your search logic here;
    this.commonService.getAlternativeList(searchUrl).subscribe((res: any) => {
      // console.log(res)
      if (res) {
        let data: any = res.items;
        this.totalItem = res.total;
        if (data.length > 0) {
          // this.uniqueSalts = [...new Set(data.map((item: any) => item.Salts['Name']))];
          let seen: any = {};
          let dist: any = [];

          data.forEach((item: any) => {
            let salt = item.Salts;
            if (salt && salt.Id) {
              if (!seen[salt.Id]) {
                // dist.push(salt);
                this.uniqueSalts.push(salt)
                seen[salt.Id] = true;
              }
            }
            this.searchList.push(item);
          });
          // this.uniqueSalts = dist;
          // this.searchList = data;
          // console.log(this.uniqueSalts, this.searchList)
          this.isLoading = false
        } else {
          this.searchList = [];
          this.isLoading = false;
        }
      } else {
        this.searchList = [];
        this.isLoading = false;
      }
    })



    // this.searchStart = false;
  }

  showSearcArea() {
    if (this.showSearchArea == false) {
      this.showSearchArea = true;
    }
  }

  cleareSearch() {
    this.searchText = '';
    // this.searchStart = false;
    this.searchList = [];
    this.uniqueSalts = [];
    this.totalItem = 0;
    this.showSearchArea = false;
    this.isLoading = false;
  }

  onselectItem(item: any) {
    // console.log(item);
    if (item.IsGenericNew == 1) {
      this.router.navigate(['/jito-generics/generic'], { queryParams: { id: item.ProductId, name: item.DisplayName } });
    } else {
      this.router.navigate(['/jito-generics/branded'], { queryParams: { id: item.ProductId, name: item.DisplayName } });
    }
  }

  onSaltClick(salt: any) {
    // console.log(salt);
    this.router.navigate(['/jito-generics/saltcomposition'], { queryParams: { salt: salt.Name } });
  }

  onKeydown() {
    clearTimeout(this.typingTimer);
  }

  loadMore(){
    this.pageNo = this.pageNo + 1;
    this.onSearch()
  }
}
