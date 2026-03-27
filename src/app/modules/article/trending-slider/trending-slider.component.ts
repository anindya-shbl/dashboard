import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ArticleService } from '../../../services/article.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-trending-slider',
  templateUrl: './trending-slider.component.html',
  styleUrl: './trending-slider.component.scss'
})
export class TrendingSliderComponent implements OnInit {

  count: any = 5;
  pageNo: any = 1;
  trendingData : any = [];
  currentLang : any = '';

  constructor(
    private articleService: ArticleService, 
    private cookieService: CookieService, 
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.currentLang = this.authService.CurrentLanguage;
    this.getHomeTrandings()
  }

  customOptions: OwlOptions = {
    // autoWidth: true,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    lazyLoad: true,
    nav: true,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-chevron-left fs-18 pt-1 px-1"></i>', '<i class="fa-solid fa-chevron-right fs-18 pt-1 px-1"></i>'],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1126: {
        items: 3
      },
      1600:{
        items: 4
      },
      1920: {
        items: 5
      },
    },
  }

  getHomeTrandings() {
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
      CustUserId: userId,
      Language: this.currentLang
    }
    this.articleService.postData('healtharticle/getTrendingArticles', data).subscribe((res: any) => {
      // console.log('Trending Articles:', res);
      if(res && res.msgcode == 1){
        if(res.results.TrendingArticles.length > 0){
          // this.trendingData = res.results.TrendingArticles
          let config = res.results.TrendingArticles;
          this.setTrendingArticles(config, this.currentLang);
        } else {
          this.trendingData = [];
          this.spinner.hide();
        }
      }else{
        this.trendingData = [];
        this.spinner.hide();
        // console.error('Error fetching trending articles:', res.msg);
      }
    })
  }

  setTrendingArticles(data: any, lang: any) {
    if (data && data.length > 0){
      data.forEach((item: any)=>{
        if(item.Content[lang] != undefined && item.Content[lang] != null && item.Content[lang] != ''){
          this.trendingData.push({...item, Content: item.Content[lang]})
        }
      })
    }
    this.spinner.hide();
    // console.log('lang Response:', this.langContent);
  }


  likeArticle(data: any) {
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    let userId: any = '';
    // console.log(this.isLoggedIn)
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
            this.trendingData = this.trendingData.map((item: any) => {
              if(item.ArticleId === data.ArticleId) {
                return {
                  ...item,
                  IsLiked: true,
                  LikeCount: (item.LikeCount || 0) + 1
                };
              }
              return item;
            })
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
            this.trendingData = this.trendingData.map((item: any) => {
              if(item.ArticleId === data.ArticleId) {
                return {
                  ...item,
                  IsLiked: false,
                  LikeCount: (item.LikeCount || 0) - 1
                };
              }
              return item;
            })
          }
        }) 
      }
    } else {
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }

  bookmarkArticle(data: any){
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    // console.log(this.isLoggedIn)
    let userId: any = '';
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
            this.trendingData = this.trendingData.map((item: any) => {
              if(item.ArticleId === data.ArticleId) {
                return {
                  ...item,
                  IsBookmarked: true,
                };
              }
              return item;
            })
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
            this.trendingData = this.trendingData.map((item: any) => {
              if(item.ArticleId === data.ArticleId) {
                return {
                  ...item,
                  IsBookmarked: false,
                };
              }
              return item;
            })
          }
        }) 
      }
    } else {
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }


  viewArtical(plink: any) {
    this.router.navigate(['healtharticle', plink]);
  }

}
