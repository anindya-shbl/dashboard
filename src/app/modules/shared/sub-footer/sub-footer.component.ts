import { Component } from '@angular/core';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-sub-footer',
  templateUrl: './sub-footer.component.html',
  styleUrl: './sub-footer.component.scss'
})
export class SubFooterComponent {

  constructor(private webengageService: WebEngageService) { }

  btmMenu(name: any) {
    this.webengageService.trackEvent('Bottom Menu Clicked', name);
  }

}
