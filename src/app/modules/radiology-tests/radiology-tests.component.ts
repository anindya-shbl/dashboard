import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-radiology-tests',
  templateUrl: './radiology-tests.component.html',
  styleUrl: './radiology-tests.component.scss'
})
export class RadiologyTestsComponent {

  constructor(public authService: AuthService) {
      this.authService.currentModule = 'RadiologyTest';
    }

}
