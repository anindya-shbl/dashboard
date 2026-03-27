import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.scss'
})
export class TrackOrderComponent implements OnInit {

  @Input() trackOrder: [] | undefined;

  trackList: any = [];

  constructor(){}

  ngOnInit(): void {
    // console.log("in track order", this.trackOrder);
    this.trackList = this.trackOrder;
  }
}
