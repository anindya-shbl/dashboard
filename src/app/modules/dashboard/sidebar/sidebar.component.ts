import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit(): void {
  }

  getWalletRecords(){
    this.router.navigate(['customers/wallet']);    
  }

}
