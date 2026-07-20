declare const google: any;

import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { AddressService } from '../../services/address.service';

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

  searchInput: string = '';
  predictions: any[] = [];
  selectedLocation: any = null;
  isSearching: boolean = false;
  mapLoading: boolean = true;
  mapError: string = '';

  defaultLatitude: number = 28.7041;
  defaultLongitude: number = 77.1025;

  constructor(
    private cdr: ChangeDetectorRef,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    // Initialize with default location from API
    this.getAddressFromCoordinates(this.defaultLatitude, this.defaultLongitude);
  }

  ngAfterViewInit() {
    if (this.isOpen && this.mapContainer) {
      this.mapLoading = true;
      this.mapError = '';
      setTimeout(() => {
        this.initMap();
        this.mapLoading = false;
      }, 100);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen && this.mapContainer && !this.map) {
      this.mapLoading = true;
      setTimeout(() => {
        this.initMap();
        this.mapLoading = false;
      }, 100);
    }
  }

  initMap(): void {
    if (!this.mapContainer) {
      this.mapError = 'Map container not found';
      return;
    }

    try {
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
    } catch (error) {
      this.mapError = 'Failed to initialize map: ' + (error as any).message;
      console.error(this.mapError, error);
    }
  }

  // Unified search - handles pincode, area, city
  onSearchChange(): void {
    const input = this.searchInput.trim();

    if (input.length === 0) {
      this.predictions = [];
      return;
    }

    // Check if input is a pincode (5-6 digits)
    const isPincode = /^\d{5,6}$/.test(input);

    if (isPincode) {
      this.searchByPincode(input);
    } else if (input.length >= 3) {
      this.searchByArea(input);
    }
  }

  // Search by pincode via API
  searchByPincode(pincode: string): void {
    this.isSearching = true;
    this.predictions = [];

    this.addressService.searchByPincode(pincode).subscribe({
      next: (response: any) => {
        this.isSearching = false;

        if (response.success && response.data) {
          // Update map with pincode location
          const location = response.data;
          const lat = location.latitude || location.lat;
          const lng = location.longitude || location.lng;

          this.placeMarkerByCoordinates(lat, lng);

          this.selectedLocation = {
            address: location.formatted_address || location.address,
            latitude: lat,
            longitude: lng,
            name: location.name || 'Selected Location',
            pincode: pincode
          };

          if (this.map) {
            this.map.setCenter({ lat, lng });
            this.map.setZoom(15);
          }

          this.cdr.detectChanges();
        } else {
          this.predictions = [{
            description: `Pincode "${pincode}" not found`,
            main_text: 'Not Found',
            secondary_text: response.message || 'Try another pincode or area name',
            isError: true
          }];
        }
      },
      error: (error) => {
        this.isSearching = false;
        console.error('Pincode search error:', error);
        this.predictions = [{
          description: 'Error searching pincode',
          main_text: 'Error',
          secondary_text: error.message || 'Failed to search. Please try again.',
          isError: true
        }];
      }
    });
  }

  // Search by area/city via API
  searchByArea(searchText: string): void {
    this.isSearching = true;

    this.addressService.searchByArea(searchText).subscribe({
      next: (response: any) => {
        this.isSearching = false;

        if (response.success && response.data && response.data.length > 0) {
          // Convert backend response to predictions format
          this.predictions = response.data.map((item: any) => ({
            description: item.formatted_address || item.address,
            main_text: item.main_text || item.name,
            secondary_text: item.secondary_text || item.address,
            place_id: item.place_id || item.id,
            latitude: item.latitude || item.lat,
            longitude: item.longitude || item.lng,
            formatted_address: item.formatted_address || item.address,
            name: item.name
          }));
        } else {
          this.predictions = [];
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSearching = false;
        console.error('Area search error:', error);
        this.predictions = [];
      }
    });
  }

  selectPrediction(prediction: any): void {
    // Skip if it's an error prediction
    if (prediction.isError) {
      return;
    }

    this.searchInput = prediction.description;
    this.predictions = [];

    // If we already have coordinates from the search response, use them
    if (prediction.latitude && prediction.longitude) {
      this.placeMarkerByCoordinates(prediction.latitude, prediction.longitude);

      this.selectedLocation = {
        address: prediction.formatted_address || prediction.description,
        latitude: prediction.latitude,
        longitude: prediction.longitude,
        name: prediction.name || 'Selected Location'
      };

      if (this.map) {
        this.map.setCenter({
          lat: prediction.latitude,
          lng: prediction.longitude
        });
      }

      this.cdr.detectChanges();
    } else {
      // Otherwise, get place details from API
      this.getPlaceDetails(prediction.place_id);
    }
  }

  // Get place details via API
  getPlaceDetails(placeId: string): void {
    this.addressService.getPlaceDetails(placeId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const place = response.data;
          const lat = place.latitude || place.lat;
          const lng = place.longitude || place.lng;

          this.placeMarkerByCoordinates(lat, lng);

          this.selectedLocation = {
            address: place.formatted_address || place.address,
            latitude: lat,
            longitude: lng,
            name: place.name || 'Selected Location'
          };

          if (this.map) {
            this.map.setCenter({ lat, lng });
          }

          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Place details error:', error);
      }
    });
  }

  // Get address from coordinates via API
  getAddressFromCoordinates(latitude: number, longitude: number): void {
    this.addressService.getAddressFromCoordinates(latitude, longitude).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.selectedLocation = {
            address: response.data.formatted_address || response.data.address,
            latitude: latitude,
            longitude: longitude,
            name: response.data.name || 'Selected Location'
          };
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Reverse geocode error:', error);
      }
    });
  }

  placeMarkerByCoordinates(lat: number, lng: number): void {
    const location = new google.maps.LatLng(lat, lng);
    this.placeMarker(location);
  }

  placeMarker(location: any): void {
    if (this.marker) {
      this.marker.setPosition(location);
    }
    
    const lat = location.lat instanceof Function ? location.lat() : location.lat;
    const lng = location.lng instanceof Function ? location.lng() : location.lng;
    
    this.getAddressFromCoordinates(lat, lng);
    
    if (this.map) {
      this.map.setCenter(location);
    }
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
    this.predictions = [];
    this.searchInput = '';
    this.closed.emit();
  }
}