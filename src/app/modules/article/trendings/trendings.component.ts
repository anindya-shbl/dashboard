import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-trendings',
  templateUrl: './trendings.component.html',
  styleUrl: './trendings.component.scss'
})
export class TrendingsComponent implements OnInit {

  count: any = 10;
  pageNo: any = 1;
  // response: any = [];
  langContent: any = [];
  currentLang: any = '';
  totalCount: any = 0;
  isLoading: boolean = false;

  constructor(
    private articleService: ArticleService, 
    private cookieService: CookieService, 
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.currentLang = this.authService.CurrentLanguage;
    this.getAllHealthArticles();
  }

  getAllHealthArticles() {
    this.spinner.show();
    let mob: any = '';
    let userId: any = '';
    if(this.cookieService.get('isLoggedIn') == 'true'){
      mob = this.authService.Mobile.toString();
      userId = btoa(this.authService.UserId);
    }
    let data = {
      RecordCount: this.count,
      PageNo: this.pageNo,
      MobileNumber: mob,
      Language: this.currentLang,
      CustUserId: userId
    }
    this.articleService.postData('healtharticle/getTrendingArticles', data).subscribe((res: any) => {
      // console.log('Trending Articles:', res);
      if(res && res.msgcode == 1){
        this.totalCount = res.total;
        let config = res.results.TrendingArticles;
        // console.log('Trending Articles Response:', config);
        // if(config && config.length > 0){
          this.setTrendingArticles(config, this.currentLang);
        // }
      }else{
        this.langContent = [];
        this.isLoading = false;
        this.spinner.hide();
        console.error('Error fetching trending articles:', res.msg);
      }
    })
  }

  // setTrendingArticles1(data: any, lang: any){
  //   if(data && data.length > 0){
  //     this.langContent = data.map((item: any) => {
  //       return {
  //         ...item,
  //         Content: item.Content[lang] ? item.Content[lang] : '',
  //       };
  //     });
  //   } else {
  //     this.langContent = [];
  //   }
  //   console.log('lang Response:', this.langContent);
  // }

  setTrendingArticles(data: any, lang: any) {
    if (data && data.length > 0){
      data.forEach((item: any)=>{
        if(item.Content[lang] != undefined && item.Content[lang] != null && item.Content[lang] != ''){
          this.langContent.push({...item, Content: item.Content[lang]})
        }
      })
    }
    this.spinner.hide();
    this.isLoading = false;
    // console.log('lang Response:', this.langContent);
  }

  // Additional methods and properties can be added as needed 

  likeArticle(data: any) {
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    let userId: any = '';
    if (isLoggedIn == 'true') {
      userId = btoa(this.authService.UserId);
      if(data.IsLiked == false){
        let obj: any = {
          "ArticleId": data.ArticleId,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "like",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.langContent = this.langContent.map((item: any) => {
              if(item.ArticleId === data.ArticleId) {
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
          "ArticleId": data.ArticleId,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "dislike",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.langContent = this.langContent.map((item: any) => {
              if(item.ArticleId === data.ArticleId) {
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
          "ArticleId": data.ArticleId,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "bookmark",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.langContent = this.langContent.map((item: any) => {
              if(item.ArticleId === data.ArticleId) {
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
          "ArticleId": data.ArticleId,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "unbookmark",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.langContent = this.langContent.map((item: any) => {
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
    this.getAllHealthArticles()
  }


  viewArtical(plink: any) {
    this.router.navigate(['healtharticle', plink]);
  }

}
