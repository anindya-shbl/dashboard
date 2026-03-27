import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {

    constructor(
      public CommonService: CommonService  
    ) { }

}
