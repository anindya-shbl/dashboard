declare const google: any;

import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-map-location-picker',
  templateUrl: './map-location-picker.component.html',
  styleUrls: ['./map-location-picker.component.scss']
})
export class MapLocationPickerComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapContainer: any;
  @Input() isOpen: boolean = false;
  @Output() locationSelected = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  map: any = null;
  marker: any = null;
  placesService: any = null;
  geocoder: any = null;
  sessionToken: any = null;

  searchInput: string = '';
  pincodeInput: string = '';
  predictions: any[] = [];
  selectedLocation: any = null;
  isSearching: boolean = false;

  defaultLatitude: number = 28.7041;
  defaultLongitude: number = 77.1025;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.sessionToken = new google.maps.places.AutocompleteSessionToken();
    this.geocoder = new google.maps.Geocoder();
  }

  ngAfterViewInit() {
    if (this.isOpen && this.mapContainer) {
      setTimeout(() => {
        this.initMap();
        this.initPlacesService();
      }, 100);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen && this.mapContainer && !this.map) {
      setTimeout(() => {
        this.initMap();
        this.initPlacesService();
      }, 100);
    }
  }

  initMap(): void {
    if (!this.mapContainer) return;

    const mapOptions = {
      zoom: 15,
      center: { lat: this.defaultLatitude, lng: this.defaultLongitude },
      mapTypeControl: true,
      fullscreenControl: false,
      streetViewControl: true,
      zoomControl: true
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({
      map: this.map,
      position: { lat: this.defaultLatitude, lng: this.defaultLongitude },
      draggable: true,
      title: 'Drag to select location'
    });

    this.map.addListener('click', (event: any) => {
      if (event.latLng) {
        this.placeMarker(event.latLng);
      }
    });

    if (this.marker) {
      this.marker.addListener('dragend', () => {
        const pos = this.marker.getPosition();
        if (pos) {
          this.getAddressFromCoordinates(pos.lat(), pos.lng());
        }
      });
    }
  }

  initPlacesService(): void {
    this.placesService = new google.maps.places.PlacesService(this.map);
  }

  // Search by area name
  onSearchChange(): void {
    if (this.searchInput.length < 3) {
      this.predictions = [];
      return;
    }

    const service = new google.maps.places.AutocompleteService();
    
    const request = {
      input: this.searchInput,
      componentRestrictions: { country: 'in' },
      sessionToken: this.sessionToken
    };

    service.getPlacePredictions(request, (predictions: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        this.predictions = predictions;
        this.cdr.detectChanges();
      } else {
        this.predictions = [];
      }
    });
  }

  // Search by pincode
  searchByPincode(): void {
    if (!this.pincodeInput || this.pincodeInput.length < 5) {
      alert('Please enter a valid pincode');
      return;
    }

    this.isSearching = true;

    // Search for pincode location
    const request = {
      address: this.pincodeInput + ', India'
    };

    this.geocoder.geocode(request, (results: any, status: any) => {
      this.isSearching = false;

      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        this.placeMarker(location);

        this.selectedLocation = {
          address: results[0].formatted_address,
          latitude: location.lat(),
          longitude: location.lng(),
          name: results[0].address_components[0]?.long_name || 'Selected Location',
          pincode: this.pincodeInput
        };

        if (this.map) {
          this.map.setCenter(location);
          this.map.setZoom(15);
        }
        this.cdr.detectChanges();
      } else {
        alert('Pincode not found. Please try another pincode.');
      }
    });
  }

  selectPrediction(prediction: any): void {
    this.searchInput = prediction.description;
    this.predictions = [];

    if (!this.placesService) return;

    const request = {
      placeId: prediction.place_id,
      fields: ['geometry', 'formatted_address', 'name', 'address_components'],
      sessionToken: this.sessionToken
    };

    this.placesService.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
        const location = place.geometry.location;
        this.placeMarker(location);

        this.selectedLocation = {
          address: place.formatted_address,
          latitude: location.lat(),
          longitude: location.lng(),
          name: place.name || 'Selected Location'
        };

        if (this.map) {
          this.map.setCenter(location);
        }
        this.cdr.detectChanges();

        this.sessionToken = new google.maps.places.AutocompleteSessionToken();
      }
    });
  }

  placeMarker(location: any): void {
    if (this.marker) {
      this.marker.setPosition(location);
    }
    this.getAddressFromCoordinates(location.lat(), location.lng());
    if (this.map) {
      this.map.setCenter(location);
    }
  }

  getAddressFromCoordinates(lat: number, lng: number): void {
    const location = new google.maps.LatLng(lat, lng);

    this.geocoder.geocode({ location }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        this.selectedLocation = {
          address: results[0].formatted_address,
          latitude: lat,
          longitude: lng,
          name: results[0].address_components[0]?.long_name || 'Selected Location'
        };
        this.cdr.detectChanges();
      }
    });
  }

  confirmLocation(): void {
    if (this.selectedLocation) {
      this.locationSelected.emit(this.selectedLocation);
      this.closeDialog();
    } else {
      alert('Please select a location');
    }
  }

  closeDialog(): void {
    this.isOpen = false;
    this.closed.emit();
  }
}