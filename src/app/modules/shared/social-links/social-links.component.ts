import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrl: './social-links.component.scss'
})
export class SocialLinksComponent implements OnInit {

  @Input() inputLink: any = '';
  url: any = '';
  isCopied: boolean = false;

  constructor(
    public articleService: ArticleService,
    private authService: AuthService,
    private avtiveRoute: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.url = this.authService.baseurl + 'healtharticle/' + this.inputLink;
  }

  // copyText(){
  //   // if (!this.inputLink) {
  //   //   return;
  //   // }
  //   console.log(this.url)
  //   navigator.clipboard.writeText(this.inputLink.toString());
  // }

  copyText() {
    // Get the text field
    if (!this.isCopied) {
      this.isCopied = true;
      var copyText = this.url;
      navigator.clipboard.writeText(copyText);
    } else {
      this.isCopied = false;
      navigator.clipboard.writeText('');
    }
  }

}
