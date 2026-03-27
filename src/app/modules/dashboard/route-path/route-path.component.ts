import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-route-path',
  templateUrl: './route-path.component.html',
  styleUrl: './route-path.component.scss'
})
export class RoutePathComponent implements OnInit{

  myPath: any = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public Commonservice: CommonService) {}

  ngOnInit(): void {
    this.myPath = this.activatedRoute.snapshot.url[0].path;
    // console.log(this.myPath)
  }

}
