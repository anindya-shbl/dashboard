import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-health-packages',
  templateUrl: './health-packages.component.html',
  styleUrl: './health-packages.component.scss'
})
export class HealthPackagesComponent {

  constructor(public authService: AuthService) {
      this.authService.currentModule = 'HealthPackages';
  }

}
