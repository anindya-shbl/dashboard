import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-online-footer',
  templateUrl: './online-footer.component.html',
  styleUrl: './online-footer.component.scss'
})
export class OnlineFooterComponent {
  constructor(public CommonService: CommonService ){}

}
