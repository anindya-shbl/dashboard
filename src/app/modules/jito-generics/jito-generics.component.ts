import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-jito-generics',
  templateUrl: './jito-generics.component.html',
  styleUrl: './jito-generics.component.scss'
})
export class JitoGenericsComponent {

  constructor( public authService: AuthService){
      this.authService.currentModule = 'JitoGenerics';
    }

}
