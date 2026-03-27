import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lab-home',
  templateUrl: './lab-home.component.html',
  styleUrl: './lab-home.component.scss'
})
export class LabHomeComponent implements OnInit {

  constructor(public authService: AuthService) {
    this.authService.currentModule = 'LabTest';
  }

  ngOnInit(): void {
  }

}
