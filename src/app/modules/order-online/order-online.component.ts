import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-online',
  templateUrl: './order-online.component.html',
  styleUrl: './order-online.component.scss'
})
export class OrderOnlineComponent implements OnInit {

  constructor(public authService: AuthService, private titleService: Title, private metaService: Meta, private route: ActivatedRoute) {
    this.authService.currentModule = 'OrderOnline';
  }

  ngOnInit(): void {
    // Example: Prevent indexing for this specific route
    // this.metaService.addTag({ name: 'robots', content: 'noindex, nofollow' });
    this.titleService.setTitle('Order 100% Genuine Medicines Online | SastaSundar');
    this.metaService.addTags([
      { name: 'description', content: 'Buy 100% genuine medicines online from SastaSundar. Get flat 18% OFF + ₹50 on 1st order. Free & fast delivery. Order now!' },
      { name: 'robots', content: 'noindex, nofollow' }
    ]);
  }

}
