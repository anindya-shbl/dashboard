import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent implements OnInit {

  count: any = 10;
  pageNo: any = 1;
  response: any = [];
  bookMarkData: any = [];
  currentLang: any = '';
  totalCount: any = 0;
  isloading: boolean = false;

  constructor(
    private articleService: ArticleService,
    private cookieService: CookieService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentLang = this.authService.CurrentLanguage;
    this.spinner.show();
    this.isloading = true;
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    // console.log(this.isLoggedIn)
    if (isLoggedIn == 'true') {
      this.getBookmarkArticles();
    } else {
      this.spinner.hide();
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }

  getBookmarkArticles() {
    let mob: any = '';
    let userId: any = '';
    if (this.cookieService.get('isLoggedIn') == 'true') {
      mob = this.authService.Mobile.toString();
      userId = btoa(this.authService.UserId);
    }
    let data = {
      RecordCount: this.count,
      PageNo: this.pageNo,
      MobileNumber: mob,
      ActionType: 'bookmark',
      Language: this.currentLang,
      CustUserId: userId
    }
    
    this.articleService.postData('healtharticle/getUserPersonalisedHealthArticle', data).subscribe((res: any) => {
      // console.log('Trending Articles:', res);
      if (res && res.msgcode == 1) {
        this.totalCount = res.total;
        // if (res.results.BookmarkedArticle.length > 0) {
          let config = res.results.BookmarkedArticle;
          this.setBookMarkArticles(config, this.currentLang)
        // }
      } else {
        this.bookMarkData = [];
        this.isloading =false;
        this.spinner.hide();
      }
    })
  }

  setBookMarkArticles(data: any, lang: any) {
    if (data && data.length > 0){
      data.forEach((item: any)=>{
        if(item.Content[lang] != undefined && item.Content[lang] != null && item.Content[lang] != ''){
          this.bookMarkData.push({...item, Content: item.Content[lang]})
        }
      })
    }
    this.spinner.hide();
    this.isloading = false;
  }

  loadMore(){
    this.spinner.show();
    this.pageNo = this.pageNo + 1 ;
    this.getBookmarkArticles()
  }

  un_bookmarkArticle(data: any) {
    this.spinner.show();
    let userId: any = '';
    if (this.cookieService.get('isLoggedIn') == 'true') {
      userId = btoa(this.authService.UserId);
    }
    let obj: any = {
      "ArticleId": data._id,
      "ArticlePermalink": data.Permalink,
      "CategoryId": data.CategoryId,
      "MobileNumber": this.authService.Mobile.toString(),
      "ActionType": "unbookmark",
      "CustUserId": userId
    }
    this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
      if (res && res.msgcode == 1) {
        this.isloading = true;
        this.bookMarkData = [];
        this.pageNo = 1 ;
        this.getBookmarkArticles();
        this.toastr.success('Article has been removed from save list successfully');
      }else{
        this.toastr.error(res.msgtext);
        this.spinner.hide();
      }
    })
  }

  changeLang(lang: any){
    this.spinner.show();
    this.bookMarkData = [];
    this.currentLang = lang;
    this.pageNo = 1 ;
    this.getBookmarkArticles();
  }

  viewArtical(plink: any) {
    this.router.navigate(['healtharticle/details', plink]);
  }

}
