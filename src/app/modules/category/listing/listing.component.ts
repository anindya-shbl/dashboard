import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss'
})
export class ListingComponent implements OnInit {

  isloading: boolean = false;
  // viewCatagory: boolean = false;
  ctgryList: any = [];
  private categorySub!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    public CommonService: CommonService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {    
    this.spinner.show();
    this.categorySub = this.authService.CategoryList$.subscribe(categories => {
      this.ctgryList = categories;
      if (categories.length === 0) {
         // fetch only if not already loaded
      } else {
        this.spinner.hide();
      }
    });
  }

  seturl(url: any){
    const path = url.replace('https://sastasundar.com', '');
    let result = path.split('/').filter(Boolean);
    this.router.navigate(['new/', ...result])
  }

  ngOnDestroy() {
    if (this.categorySub) this.categorySub.unsubscribe();
  }


}
