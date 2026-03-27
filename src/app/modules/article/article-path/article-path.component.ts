import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-article-path',
  templateUrl: './article-path.component.html',
  styleUrl: './article-path.component.scss'
})
export class ArticlePathComponent implements OnInit {

  myPath: any = '';
  selectedValue: any;

  options: any = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Bengali', label: 'Bengali' }
  ];


  constructor(private activatedRoute: ActivatedRoute, public Commonservice: CommonService, public authService: AuthService) { }

  ngOnInit(): void {
    this.selectedValue = this.authService.CurrentLanguage;
    if (this.activatedRoute.snapshot.url.length > 0) {
      this.myPath = this.activatedRoute.snapshot.url[0].path;
    }
    // console.log(this.myPath)
  }

  onSelectionChange() {
    localStorage.setItem("Currentlanguage", this.selectedValue);
    window.location.reload();
  }
}
