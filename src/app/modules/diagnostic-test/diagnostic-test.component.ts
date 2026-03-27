import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-diagnostic-test',
  templateUrl: './diagnostic-test.component.html',
  styleUrl: './diagnostic-test.component.scss'
})
export class DiagnosticTestComponent {

  constructor(public authService: AuthService) {
      this.authService.currentModule = 'DiagnosticTests';
  }

}
