import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-order-action',
  templateUrl: './order-action.component.html',
  styleUrl: './order-action.component.scss'
})
export class OrderActionComponent {

  constructor(
    private cookieService: CookieService,
    private router: Router,
  ) { }

  orderByDoc() {
    let checkLogIn = this.cookieService.get('isLoggedIn');
    if (checkLogIn == 'true') {
      window.location.href = 'https://sastasundar.com/medicine/orderbyprescription';
    } else {
      this.router.navigate(['/newlogin']);
    }
  }

}
