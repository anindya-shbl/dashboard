import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ArticleService } from '../../../services/article.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-latest-slider',
  templateUrl: './latest-slider.component.html',
  styleUrl: './latest-slider.component.scss'
})
export class LatestSliderComponent implements OnInit {

  count: any = 5;
  pageNo: any = 1;
  latestArticlesData : any = [];
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
    this.getHomeLatestArticles()
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

  getHomeLatestArticles() {
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
    this.articleService.postData('healtharticle/getLatestArticles', data).subscribe((res: any) => {
      // console.log('Latest Articles:', res);
      if(res && res.msgcode == 1){
        if(res.results.latestarticles.length > 0){
          let config = res.results.latestarticles;
          this.setLatestArticles(config, this.currentLang);
        } else {
          this.latestArticlesData = [];
          this.spinner.hide();
        }
      }else{
        this.latestArticlesData = [];
        this.spinner.hide();
        // console.error('Error fetching trending articles:', res.msg);
      }
    })
  }

  setLatestArticles(data: any, lang: any) {
    if (data && data.length > 0){
      data.forEach((item: any)=>{
        // if(item.Content[lang] != undefined && item.Content[lang] != null && item.Content[lang] != ''){
          // this.latestArticlesData.push({...item, Content: item.Content[lang]})
          this.latestArticlesData.push(item)
        // }
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
            this.latestArticlesData = this.latestArticlesData.map((item: any) => {
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
            this.latestArticlesData = this.latestArticlesData.map((item: any) => {
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
            this.latestArticlesData = this.latestArticlesData.map((item: any) => {
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
            this.latestArticlesData = this.latestArticlesData.map((item: any) => {
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
