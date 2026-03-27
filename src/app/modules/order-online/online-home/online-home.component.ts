import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-online-home',
  templateUrl: './online-home.component.html',
  styleUrl: './online-home.component.scss'
})
export class OnlineHomeComponent {

  showSearch: boolean = false;

  constructor(private authService: AuthService, private CommonService: CommonService ){}

  count(){
    this.CommonService.sendClickEvent();
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }
}
