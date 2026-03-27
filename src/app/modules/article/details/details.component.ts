import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit{

  parmalink: any = null;
  // articleId: any = null;
  details: any = '';
  langContent: any = '';
  defaultLang: any = '';
  isLoading: boolean = false;
  relatedArticle: any = [];
  showDiv: boolean = false;
  @ViewChild('socialLink') socialLink: any;

  constructor(
    public articleService: ArticleService,
    private authService: AuthService,
    private avtiveRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.defaultLang = this.authService.CurrentLanguage;
    this.isLoading = true;
    this.spinner.show();
    // this.parmalink = this.avtiveRoute.snapshot.queryParamMap.get('parmaLink');
    // if (this.parmalink != null) {
    //   this.getDetails();
    // }
    this.parmalink = this.avtiveRoute.snapshot.paramMap.get('parmalink');
    if (this.parmalink != null) {
      this.getDetails();
      this.getRelatedArtcles();
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
      ArticlePermalink: this.parmalink,
      MobileNumber: mob,
      CustUserId: userId,
      Language: this.defaultLang,
    }

    this.articleService.postData('healtharticle/getArticleDetails', obj).subscribe(data => {
      // console.log(data);
      if (data && data.msgcode == 1) {
        this.details = data.results.articles;
        this.getContentByLanguage(this.details, this.defaultLang);
      } else {
        this.details = '';
        this.langContent = '';
        this.isLoading = false;
        this.spinner.hide();
      }
    });

  }

  getContentByLanguage(data: any, lang: any) {
    // if(this.details != null && this.details != undefined) {
    //   this.lang_content = data.Content[lang];
    // }else{
    //   this.lang_content = '';

    // if (this.details != null && this.details != undefined) {
    if (this.details.hasOwnProperty('Content')) {
      if (data.Content[lang] != null && data.Content[lang] != undefined && data.Content[lang] != ''){
        if (data.Content[lang].Description.length > 0) {
          data.Content[lang].Description.forEach((cnt: any)=>{
            cnt.Content = this.removePTagsAroundIframe(cnt.Content);
          })
          this.langContent = {
            ...data,
            Content: data.Content[lang]
          };
        } else {
          this.langContent = '';
        }
      }else{
        this.langContent = '';
      }
    } else {
      this.langContent = '';
    }
    // console.log('lang Response:', this.langContent);
    this.isLoading = false;
    this.spinner.hide();
  }

  getRelatedArtcles(){
    let mob: any = '';
    let userId: any = '';
    if(this.cookieService.get('isLoggedIn') == 'true'){
      mob = this.authService.Mobile.toString();
      userId = btoa(this.authService.UserId);
    }
    let obj = {
      ArticlePermalink: this.parmalink,
      MobileNumber: mob,
      Language: this.defaultLang,
      PageNo: 1,
      RecordCount: 10,
      CustUserId: userId
    }

    this.articleService.postData('healtharticle/getRelatedArticles', obj).subscribe(data => {
      // console.log(data);
      if (data && data.msgcode == 1) {
        if(data.results.ReletedArticle.length>0){
          this.relatedArticle = data.results.ReletedArticle;
        }else{
          this.relatedArticle = []
        };
      } else {
        this.relatedArticle = [];
      }
    });
  }

  ngOnDestroy() {
    this.parmalink = null;
    // this.articleId = null;
    this.defaultLang = 'English';
    this.langContent = '';
    this.details = '';
  }

  likeArticle(data: any) {
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    // console.log(this.isLoggedIn)
    let userId: any = '';
    if (isLoggedIn == 'true') {
      userId = btoa(this.authService.UserId);
      if(data.IsLiked == false){
        let obj: any = {
          "ArticleId": data.ArticleId,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.Category[0].CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "like",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.toastr.success('Liked! We are glad you enjoyed the article.');
            let count = data.LikeCount + 1;
            this.langContent = {
              ...data, IsLiked: true, LikeCount: count
            };
            this.details = {... this.details, IsLiked: true, LikeCount: count}
          }
        })
      }else{
        let obj: any = {
          "ArticleId": data.ArticleId,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.Category[0].CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "dislike",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            let count = data.LikeCount - 1;
            this.langContent = {
              ...data, IsLiked: false, LikeCount: count
            };
            this.details = {... this.details, IsLiked: false, LikeCount: count}
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
          "CategoryId": data.Category[0].CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "bookmark",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.toastr.success('Article has been added to save list');
            this.langContent = {
              ...data, IsBookmarked: true
            };
            this.details = {... this.details, IsBookmarked: true}
          }
        })
      }else{
        let obj: any = {
          "ArticleId": data.ArticleId,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.Category[0].CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "unbookmark",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.toastr.success('Article has been removed from save list');
            this.langContent = {
              ...data, IsBookmarked: false
            };
            this.details = {... this.details, IsBookmarked: false}
          }
        })
      }
    } else {
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }

  changeLang(lang: any){
    this.spinner.show();
    this.defaultLang = lang;
    this.getDetails();
    this.getRelatedArtcles();
  }

  changeArtcle(evnt: any) {
    // this.parmalink = this.avtiveRoute.snapshot.paramMap.get('parmalink');
    this.parmalink = evnt;
    this.spinner.show();
    this.getDetails();
    this.getRelatedArtcles();
  }

  shareLink(link: any){
    this.socialLink.nativeElement.click();
  }

  // removePTagsAroundIframe(html: any) {
  //   let ls: any = html
  //     .replace(/<p>&lt;iframe/, '<iframe')
  //     .replace(/&lt;\/iframe&gt;<\/p>/, '></iframe>');
  //   let ds: any = this.sanitizer.bypassSecurityTrustHtml(ls)
  //   return ds;
  // }

  removePTagsAroundIframe(html: string) {
  let fixed = html
    .replace(/<p>&lt;iframe/gi, '<iframe')           // replace all p-wrapped iframe openings
    .replace(/&lt;\/iframe&gt;<\/p>/gi, '</iframe>') // replace all closing iframe tags
    .replace(/&gt;/gi, '>')                         // convert escaped >
    .replace(/&lt;/gi, '<');                        // convert escaped <

  return this.sanitizer.bypassSecurityTrustHtml(fixed);
}

  // removePTagsAroundIframe(html: any) {
  //   let ls: any = html
  //     .replace(/<p class="MsoNormal">&lt;iframe/, '<iframe')
  //     .replace(/&lt;\/iframe&gt;<\/p>/, '></iframe>');
  //   let ds: any = this.sanitizer.bypassSecurityTrustHtml(ls)
  //   return ds;
  // }

}
