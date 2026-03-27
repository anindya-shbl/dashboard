import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-category-wise-articles',
  templateUrl: './category-wise-articles.component.html',
  styleUrl: './category-wise-articles.component.scss'
})
export class CategoryWiseArticlesComponent implements OnInit{

  parmalink: any = null;
  pageNo: any = 0;
  count: any = 10;
  currentLang: any = '';
  totalCount: any = 0;
  detailsList: any = [];
  categoryDetails: any = [];
  isLoading: boolean = false;

  constructor(
    public articleService: ArticleService,
    private authService: AuthService,
    private avtiveRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.currentLang = this.authService.CurrentLanguage;
    this.isLoading = true;
    this.spinner.show();

    this.parmalink = this.avtiveRoute.snapshot.paramMap.get('parmalink');
    if (this.parmalink != null) {
      this.getDetails();
    } else {
      this.isLoading = false;
      this.spinner.hide();
      this.router.navigate(['/healtharticle']);
    }
  }

    getDetails() {
    let mob: any = '';
    let userId: any = '';
    if(this.cookieService.get('isLoggedIn') == 'true'){
      mob = this.authService.Mobile.toString();
      userId = btoa(this.authService.UserId);
    }
    let obj = {
      CatPermalink: this.parmalink,
      pageno: this.pageNo,
      RecordCount: this.count,
      MobileNumber: mob,
      Language: this.currentLang,
      CustUserId: userId
    }

    this.articleService.postData('healtharticle/getCategorySearchTopArticles', obj).subscribe(data => {
      // console.log(data);
      if (data && data[0].msgcode == 1) {
        if(data[0].results.Category != undefined && data[0].results.Category.length>0){
          this.categoryDetails = data[0].results.Category[0];
        }
        // this.detailsList = data[0].results.articles;
        let config = data[0].results.articles;;
        // console.log('Trending Articles Response:', config);
        if(config && config.length > 0){
          this.setLangDetails(config, this.currentLang);
        }else{
          this.spinner.hide();
          this.isLoading = false;
        }
      } else {
        this.detailsList = [];
        this.isLoading = false;
        this.spinner.hide();
      }
    });

  }

    setLangDetails(data: any, lang: any) {
    if (data && data.length > 0){
      data.forEach((item: any)=>{
        if(item.Content[lang] != undefined && item.Content[lang] != null && item.Content[lang] != ''){
          this.detailsList.push({...item, Content: item.Content[lang]})
        }
      })
    }
    this.spinner.hide();
    this.isLoading = false;
    // console.log('lang Response:', this.detailsList);
  }

    likeArticle(data: any) {
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    let userId: any = '';
    // console.log(this.isLoggedIn)
    if (isLoggedIn == 'true') {
      userId = btoa(this.authService.UserId);
      if(data.IsLiked == false){
        let obj: any = {
          "ArticleId": data._id,
          "ArticlePermalink": data.Permalink,
          "CategoryId": this.categoryDetails._id,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "like",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.detailsList = this.detailsList.map((item: any) => {
              if(item._id === data._id) {
                return {
                  ...item,
                  IsLiked: true,
                  LikeCount: (item.LikeCount || 0) + 1
                };
              }
              return item;
            })
            // this.setTrendingArticles(this.response, this.currentLang);
          }
        })
      }else{ 
        let obj: any = {
          "ArticleId": data._id,
          "ArticlePermalink": data.Permalink,
          "CategoryId": this.categoryDetails._id,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "dislike",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.detailsList = this.detailsList.map((item: any) => {
              if(item._id === data._id) {
                return {
                  ...item,
                  IsLiked: false,
                  LikeCount: (item.LikeCount || 0) - 1
                };
              }
              return item;
            })
            // this.setTrendingArticles(this.response, this.currentLang);
          }
        }) 
      }
    } else {
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }

  bookmarkArticle(data: any){
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    let userId: any = '';
    // console.log(this.isLoggedIn)
    if (isLoggedIn == 'true') {
      userId = btoa(this.authService.UserId);
      if(data.IsBookmarked == false){
        let obj: any = {
          "ArticleId": data._id,
          "ArticlePermalink": data.Permalink,
          "CategoryId": this.categoryDetails._id,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "bookmark",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.detailsList = this.detailsList.map((item: any) => {
              if(item._id === data._id) {
                return {
                  ...item,
                  IsBookmarked: true,
                };
              }
              return item;
            })
            // this.setTrendingArticles(this.response, this.currentLang);
          }
        })
      }else{ 
        let obj: any = {
          "ArticleId": data._id,
          "ArticlePermalink": data.Permalink,
          "CategoryId": this.categoryDetails._id,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "unbookmark",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.detailsList = this.detailsList.map((item: any) => {
              if(item.ArticleId === data.ArticleId) {
                return {
                  ...item,
                  IsBookmarked: false,
                };
              }
              return item;
            })
            // this.setTrendingArticles(this.response, this.currentLang);
          }
        }) 
      }
    } else {
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }

  loadMore(){
    // this.spinner.show();
    this.pageNo = this.pageNo + 1 ;
    this.getDetails();
  }


  viewArtical(plink: any) {
    this.router.navigate(['healtharticle', plink]);
  }
}
