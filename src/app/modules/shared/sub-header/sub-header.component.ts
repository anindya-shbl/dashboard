import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrl: './sub-header.component.scss'
})
export class SubHeaderComponent implements OnInit{

  currentModule: any = '';
  ctgryList: any = [];
  subCtgry: any = [];
  pctgry: any = [];
  sbctgry: any = [];
  private categorySub!: Subscription;

  // catagoryImg: any = "https://images.pexels.com/photos/2746187/pexels-photo-2746187.jpeg";

  isloading: boolean = false;
  viewCatagory: boolean = false;

  constructor(
    private router: Router, 
    public authService: AuthService,
    public CommonService: CommonService,
    private spinner: NgxSpinnerService){  }

  ngOnInit(): void {    
    this.spinner.show();
    this.categorySub = this.authService.CategoryList$.subscribe(categories => {
      this.ctgryList = categories;
      if (this.ctgryList.length> 0) {
        this.setSubCtgry(this.ctgryList[0]); // fetch only if not already loaded
      } else {
        this.spinner.hide();
      }
    });
  }

  setSubCtgry(pctr: any) {
    this.pctgry = pctr;
    this.subCtgry = pctr.subcategory_data;
    this.isloading = false;
    this.spinner.hide();
  }

  showCatagory(){
    this.viewCatagory = true;
  }

  resetCtgry(){
    this.viewCatagory = false;
    this.setSubCtgry(this.ctgryList[0]);
  }

  getSubCtgrydetails(sbct: any){
    this.sbctgry = sbct;
  }
  
  category_redirect(url: any){
    window.location.href = url;
  }

  // category_redirect(url: any){
  //   const path = url.replace('https://sastasundar.com', '');
  //   let result = path.split('/').filter(Boolean);
  //   this.router.navigate(['new/', ...result])
  // }

  ngOnDestroy() {
    if (this.categorySub) this.categorySub.unsubscribe();
  }

}
