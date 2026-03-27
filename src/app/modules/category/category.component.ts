import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {

  constructor(public authService: AuthService) {
        this.authService.currentModule = 'CategoryListing';
  }

}
