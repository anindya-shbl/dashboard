import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-keyword-products',
  templateUrl: './keyword-products.component.html',
  styleUrl: './keyword-products.component.scss'
})
export class KeywordProductsComponent {

  @Input() kwPrdct : any = [];

  constructor(private router: Router, public authService: AuthService){}

  viewCtalog(item: any){
    // this.authService.CatalogNow = item.Title;
    this.router.navigate(['newcatalog/lists/', item.Permalink])
  }

}
