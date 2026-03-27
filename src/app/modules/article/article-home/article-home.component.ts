import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-home',
  templateUrl: './article-home.component.html',
  styleUrl: './article-home.component.scss'
})
export class ArticleHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialization logic can go here
  }

  // Additional methods and properties can be added as needed

}
