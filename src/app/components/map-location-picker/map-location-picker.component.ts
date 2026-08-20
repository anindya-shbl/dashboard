declare const google: any;

import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { AddressService } from '../../services/address.service';
import { GeolocationService, CurrentLocation } from '../../services/geolocation.service';

@Component({
  selector: 'app-map-location-picker',
  templateUrl: './map-location-picker.component.html',
  styleUrls: ['./map-location-picker.component.scss']
})
export class MapLocationPickerComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapContainer: any;
  @Input() isOpen: boolean = false;
  @Input() initialLatitude: number = 0;
  @Input() initialLongitude: number = 0;
  @Input() existingAddress: any = null; // Accept existing address as input
  @Output() locationSelected = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
  
  map: any = null;
  // marker: any = null;
  centerMarker: any = null;  //  Center marker
  destinationMarker: any = null // Destination marker
  polyline: any = null;      //  Dotted line
  isInitializing:boolean = false; // Init phase

  searchInput: string = '';
  predictions: any[] = [];
  selectedLocation: any = null;
  isSearching: boolean = false;
  mapLoading: boolean = true;
  mapError: string = '';

  defaultLatitude: number = 0;
  defaultLongitude: number = 0;
  currentLocation: CurrentLocation | null = null; 

  constructor(
    private cdr: ChangeDetectorRef,
    private addressService: AddressService,
    private geolocationService: GeolocationService
  ) {}

  ngOnInit() {
    console.log('From ngOnInit->',this.existingAddress);
    if(!this.existingAddress){
      // Initialize with default location from API
      // this.getAddressFromCoordinates(this.defaultLatitude, this.defaultLongitude);
      // Get current location from geolocation service
      this.geolocationService.currentLocation$.subscribe({
        next: (location) => {
          if (location) {
            console.log('current location'+ JSON.stringify(location));
            this.currentLocation = location;
            this.defaultLatitude = location.latitude;
            this.defaultLongitude = location.longitude;
            console.log('Using current location:', location);
          } else {
            // console.log('Using default India coordinates');
            console.log("Show form instead of map, as current location is not available");
          }
        }
      });
    }
  }

  ngAfterViewInit() {
    // console.log('ngAfterViewInit-MapLocationPickerComponent initialized. isOpen:', this.isOpen);
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
    console.log('ngOnChanges-MapLocationPickerComponent initialized. isOpen:', this.isOpen);
    // console.log(changes['isOpen']);
    // if (changes['isOpen'] && this.isOpen && this.mapContainer && !this.map) {
    if (this.isOpen) {
      // prefer explicit initial coordinates when provided (edit flow)
      const lat = (this.initialLatitude && this.initialLatitude > 0) ? this.initialLatitude : this.defaultLatitude;
      const lng = (this.initialLongitude && this.initialLongitude > 0) ? this.initialLongitude : this.defaultLongitude;

      if (lat > 0 && lng > 0) {
        this.defaultLatitude = lat;
        this.defaultLongitude = lng;

        this.isInitializing = true // set flag before initialization

        // For edit flow: show existing address without API call
        if (this.existingAddress) {
          this.selectedLocation = {
            pincode: this.existingAddress.PinCode,
            addresss: this.existingAddress.Addline,
            formatted_address: this.existingAddress.Addline,
            latitude: this.existingAddress.Latitude,
            longitude: this.existingAddress.Longitude,
            name: this.existingAddress.AddLine1
          };
        } else {
          // For add flow: fetch address from API
          this.getAddressFromCoordinates(this.defaultLatitude, this.defaultLongitude);
          console.log('before initializing map, isOpen:', this.isOpen, 'lat:', lat, 'lng:', lng);
        }
        this.mapLoading = true;
        setTimeout(() => {
          this.initMap();
          this.mapLoading = false;
          this.isInitializing = false; // clear flag after map init
        }, 100);
      } 
    }
  }

  initMap(): void {
    if (!this.mapContainer) {
      this.mapError = 'Map container not found';
      return;
    }

    try {
      const mapOptions = {
        zoom: 18,
        center: { lat: this.defaultLatitude, lng: this.defaultLongitude },
        mapTypeControl: true,
        fullscreenControl: false,
        streetViewControl: true,
        zoomControl: true
      };


      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
      console.log('Map initialized with location:', this.defaultLatitude, this.defaultLongitude);
      // Add center marker
      this.addCenterMarker();
      // this.addDestinationMarker();
      // Add current location button
      this.addCurrentLocationButton();
      //  NEW: Listen for map drag end
      this.map.addListener('dragend', () => {
        this.onMapDragEnd();
      });

      //  NEW: Also listen for map idle (when zoom changes or pan completes)
      this.map.addListener('idle', () => {
        this.onMapIdle();
      });

      // this.marker = new google.maps.Marker({
      //   map: this.map,
      //   position: { lat: this.defaultLatitude, lng: this.defaultLongitude },
      //   draggable: true,
      //   title: 'Drag to select location'
      // });

      // this.map.addListener('click', (event: any) => {
      //   if (event.latLng) {
      //     this.placeMarker(event.latLng);
      //   }
      // });

      // if (this.marker) {
      //   this.marker.addListener('dragend', () => {
      //     const pos = this.marker.getPosition();
      //     if (pos) {
      //       this.getAddressFromCoordinates(pos.lat(), pos.lng());
      //     }
      //   });
      // }
    } catch (error) {
      this.mapError = 'Failed to initialize map: ' + (error as any).message;
      console.error(this.mapError, error);
    }
  }




/**
 * ✅ Add center marker (solid blue circle)
 */
  addCenterMarker(): void {
    if (!this.map) return;

    const centerLatLng = this.map.getCenter();

    // ✅ Solid blue circle marker
    const solidCircleMarkerSVG = `
        <svg width="44" height="44" viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.29" d="M136.35 68.8501C136.35 106.13 106.129 136.35 68.8496 136.35C31.5704 136.35 1.34961 106.13 1.34961 68.8501C1.34961 31.5709 31.5704 1.3501 68.8496 1.3501C106.129 1.3501 136.35 31.5709 136.35 68.8501Z" fill="#42A5F5"/>
      <path d="M136.35 68.8501C136.35 106.13 106.129 136.35 68.8496 136.35C31.5704 136.35 1.34961 106.13 1.34961 68.8501C1.34961 31.5709 31.5704 1.3501 68.8496 1.3501C106.129 1.3501 136.35 31.5709 136.35 68.8501Z" stroke="#42A5F5" stroke-width="2.7"/>
      </svg>
      `;

    const image = {
      url: 'data:image/svg+xml;base64,' + btoa(solidCircleMarkerSVG),
      size: new google.maps.Size(44, 44),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(22, 22)
    };

    this.centerMarker = new google.maps.Marker({
      position: centerLatLng,
      map: this.map,
      icon: image,
      title: 'Current Location',
      zIndex: 100,
      draggable: false
    });

    console.log('✅ Center marker (blue circle) added');
  }

/**
 * ✅ Add destination marker (location pin icon)
 */
  // addDestinationMarker(): void {
  //   if (!this.map || !this.selectedLocation) return;

  //   // Remove existing destination marker
  //   if (this.destinationMarker) {
  //     this.destinationMarker.setMap(null);
  //   }

  //   const destinationLatLng = new google.maps.LatLng(
  //     this.selectedLocation.latitude,
  //     this.selectedLocation.longitude
  //   );

  //   // ✅ Location pin SVG (tower icon)
  //   const locationPinSVG = `
  //     <svg width="50" height="68" viewBox="0 0 108 121" fill="none" xmlns="http://www.w3.org/2000/svg">
  //   <path opacity="0.72" fill-rule="evenodd" clip-rule="evenodd" d="M53.6367 119.886C82.908 106.636 106.637 82.9072 106.637 53.636C106.637 24.3649 82.908 0.635986 53.6367 0.635986C24.3656 0.635986 0.636719 24.3649 0.636719 53.636C0.636719 82.9072 24.3656 106.636 53.6367 119.886ZM53.6367 73.511C64.6137 73.511 73.5117 64.6129 73.5117 53.636C73.5117 42.6594 64.6137 33.761 53.6367 33.761C42.6598 33.761 33.7617 42.6594 33.7617 53.636C33.7617 64.6129 42.6598 73.511 53.6367 73.511Z" fill="#42A5F5"/>
  //   <path d="M53.6367 73.511C64.6137 73.511 73.5117 64.6129 73.5117 53.636C73.5117 42.6594 64.6137 33.761 53.6367 33.761C42.6598 33.761 33.7617 42.6594 33.7617 53.636C33.7617 64.6129 42.6598 73.511 53.6367 73.511Z" stroke="#42A5F5" stroke-width="1.272" stroke-linecap="round" stroke-linejoin="round"/>
  //   <path d="M53.6367 119.886C82.908 106.636 106.637 82.9072 106.637 53.636C106.637 24.3649 82.908 0.635986 53.6367 0.635986C24.3656 0.635986 0.636719 24.3649 0.636719 53.636C0.636719 82.9072 24.3656 106.636 53.6367 119.886Z" stroke="#42A5F5" stroke-width="1.272" stroke-linecap="round" stroke-linejoin="round"/>
  //   </svg>
  //   `;

  //   const image = {
  //     url: 'data:image/svg+xml;base64,' + btoa(locationPinSVG),
  //     size: new google.maps.Size(50, 68),
  //     origin: new google.maps.Point(0, 0),
  //     anchor: new google.maps.Point(25, 68)
  //   };

  //   this.destinationMarker = new google.maps.Marker({
  //     position: destinationLatLng,
  //     map: this.map,
  //     icon: image,
  //     title: this.selectedLocation.name || 'Selected Location',
  //     zIndex: 99,
  //     draggable: false
  //   });

  //   console.log('✅ Destination marker (location pin) added');
  // }

/**
 * ✅ Add dashed line between center and destination
 */
  addDottedLine(): void {
    if (!this.map || !this.selectedLocation || !this.centerMarker) return;

    // Remove existing polyline
    if (this.polyline) {
      this.polyline.setMap(null);
    }

    const center = this.centerMarker.getPosition();
    const destination = new google.maps.LatLng(
      this.selectedLocation.latitude,
      this.selectedLocation.longitude
    );

    // ✅ Dashed line
    const dashSymbol = {
      path: 'M 0,-1 0,1',
      strokeColor: '#2196F3',
      scale: 2.5
    };

    this.polyline = new google.maps.Polyline({
      path: [center, destination],
      geodesic: false,
      strokeColor: '#BBDEFB',
      strokeOpacity: 0.5,
      strokeWeight: 1.5,
      icons: [
        {
          icon: dashSymbol,
          offset: '0',
          repeat: '12px'
        }
      ],
      map: this.map,
      zIndex: 98
    });

    console.log('✅ Dashed line added');
  }
  /**
   * NEW: Called when user finishes dragging the map
   */
  onMapDragEnd(): void {
    console.log('🗺️ Map drag end - getting new address');
    
    if (this.map) {
      const center = this.map.getCenter();
      const lat = center.lat();
      const lng = center.lng();

      console.log('New center:', lat, lng);

      // Get address for the new center point
      this.getAddressFromCoordinates(lat, lng);
    }
  }

  /**
   * NEW: Called when map becomes idle (stops moving)
   */
  onMapIdle(): void {
    console.log('🗺️ Map idle - getting current address');
    
    if (this.map) {
      const center = this.map.getCenter();
      const lat = center.lat();
      const lng = center.lng();

      // Optional: You can also get address here for every position change
      // this.getAddressFromCoordinates(lat, lng);
    }
  }

  // Get address from coordinates via API
  getAddressFromCoordinates(latitude: number, longitude: number): void {
    // if(!this.existingAddress){
      this.addressService.getAddressFromCoordinates(latitude, longitude).subscribe({
        next: (response: any) => {
          if (response.responseCode == 200 && response.data) {
            this.selectedLocation = {
              pincode: response.data.pinCode,
              addresss: response.data.address,
              formatted_address: response.data.address,
              latitude: response.data.lat,
              longitude: response.data.lng,
              name: response.data.addressName
            };
            console.log('Address updated:', this.selectedLocation);

            // this.addDestinationMarker();
            // Add dotted line when address updates
            this.addDottedLine();
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Reverse geocode error:', error);
        }
      });
    // } else{
    //   console.log('Getting address for coordinates:existingAddress', this.existingAddress);
    //    this.selectedLocation = {
    //           pincode: this.existingAddress.PinCode,
    //           addresss: this.existingAddress.Addline,
    //           formatted_address: this.existingAddress.Addline,
    //           latitude: this.existingAddress.Latitude,
    //           longitude: this.existingAddress.Longitude,
    //           name: this.existingAddress.AddLine1
    //         };
    // }
  }

  // Get address from coordinates via API
  getAddressFromCoordinates1(latitude: number, longitude: number): void {
    // if(!this.existingAddress){
      this.addressService.getAddressFromCoordinates(latitude, longitude).subscribe({
        next: (response: any) => {
          if (response.responseCode == 200 && response.data) {
            this.selectedLocation = Object.assign({}, this.selectedLocation || {}, {
            pincode:  response.data.pinCode,
            // addresss: response.data.address,
            // latitude: lat,
            // longitude: lng
          });
            // this.selectedLocation = {
            //   pincode: response.data.pinCode,
            //   // addresss: response.data.address,
            //   // formatted_address: response.data.address,
            //   // latitude: response.data.lat,
            //   // longitude: response.data.lng,
            //   // name: response.data.addressName
            // };
            console.log('Address updated1:', this.selectedLocation);

            // this.addDestinationMarker();
            // Add dotted line when address updates
            this.addDottedLine();
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Reverse geocode error:', error);
        }
      });
    // } else{
    //   console.log('Getting address for coordinates:existingAddress', this.existingAddress);
    //    this.selectedLocation = {
    //           pincode: this.existingAddress.PinCode,
    //           addresss: this.existingAddress.Addline,
    //           formatted_address: this.existingAddress.Addline,
    //           latitude: this.existingAddress.Latitude,
    //           longitude: this.existingAddress.Longitude,
    //           name: this.existingAddress.AddLine1
    //         };
    // }
  }
  /**
   * Add "Current Location" button
   */
  addCurrentLocationButton(): void {
    const button = document.createElement('button');
    button.textContent = '📍 Current Location';
    button.style.cssText = `
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      margin-right: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: background 0.2s;
    `;

    button.onmouseover = () => {
      button.style.backgroundColor = '#f0f0f0';
    };

    button.onmouseout = () => {
      button.style.backgroundColor = 'white';
    };

    button.onclick = () => {
      this.useCurrentLocation();
    };

    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button);
  }

  /**
   * Use current location
   */
  useCurrentLocation(): void {
    if (!this.currentLocation) {
      this.geolocationService.reloadLocation().subscribe({
        next: (location) => {
          this.defaultLatitude = location.latitude;
          this.defaultLongitude = location.longitude;
          this.centerMapOnLocation();
        },
        error: (error) => {
          alert('Unable to get current location: ' + error);
        }
      });
    } else {
      this.defaultLatitude = this.currentLocation.latitude;
      this.defaultLongitude = this.currentLocation.longitude;
      this.centerMapOnLocation();
    }
  }

  

  /**
   * Center map on current location
   */
  private centerMapOnLocation(): void {
    const location = { lat: this.defaultLatitude, lng: this.defaultLongitude };
    this.map.setCenter(location);
    this.map.setZoom(16);
    this.getAddressFromCoordinates(this.defaultLatitude, this.defaultLongitude);
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

        if (response.responseCode == 200 && response.data) {
          // Update map with pincode location
          const location = response.data;
          const suggestedPincode = location.suggestions;
          this.predictions = suggestedPincode.map((item:any) => {
             return {
                place_id: item.placePrediction.placeId,
                main_text:item.placePrediction.structuredFormat.mainText.text,
                secondary_text:item.placePrediction.text.text,
                isError:false
            }
          });
          console.log(this.predictions);
          const lat = location.latitude || location.lat; 
          const lng = location.longitude || location.lng;

          // this.placeMarkerByCoordinates(lat, lng);

          // this.selectedLocation = {
          //   address: location.formatted_address || location.address,
          //   latitude: lat,
          //   longitude: lng,
          //   name: location.name || 'Selected Location',
          //   pincode: pincode
          // };

          if (this.map) {
            this.map.setCenter({ lat, lng });
            this.map.setZoom(15);
          }
          // Update marker
          if (this.centerMarker) {
            this.centerMarker.setPosition({ lat, lng });
          }
          this.getAddressFromCoordinates(lat, lng);
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
        // console.log(response.responseCode);

        if (response.responseCode == 200 && response.data) {

          const location = response.data;
          const suggestedPincode = location.suggestions;
          this.predictions = suggestedPincode.map((item:any) => {
             return {
                place_id: item.placePrediction.placeId,
                main_text:item.placePrediction.structuredFormat.mainText.text,
                secondary_text:item.placePrediction.text.text,
                isError:false
            }
          });
          // console.log(this.predictions);
          // Convert backend response to predictions format
          // this.predictions = response.data.map((item: any) => ({
          //   description: item.formatted_address || item.address,
          //   main_text: item.main_text || item.name,
          //   secondary_text: item.secondary_text || item.address,
          //   place_id: item.place_id || item.id,
          //   latitude: item.latitude || item.lat,
          //   longitude: item.longitude || item.lng,
          //   formatted_address: item.formatted_address || item.address,
          //   name: item.name
          // }));
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
    console.log('Selected prediction:', prediction);
    if (prediction.isError) {
      return;
    }

    this.searchInput = prediction.main_text;
    this.predictions = [];

    // If we already have coordinates from the search response, use them
    if (prediction.latitude && prediction.longitude) {
      // this.placeMarkerByCoordinates(prediction.latitude, prediction.longitude);
      let custom_formatted_address = prediction.addressComponents.filter(
        (component: any) => {
          const hasLocalityType = component.types.includes('locality');
          const hasStateType = component.types.includes('administrative_area_level_1');
          const hasCountryType = component.types.includes('country');
          return hasLocalityType || hasStateType || hasCountryType;
        }
      ).map((comp: any) => comp.longText).join(', ');
      console.log('custom_formatted_address:', custom_formatted_address);
      this.selectedLocation = {
        address: prediction.formatted_address || custom_formatted_address,
        formatted_address: prediction.formatted_address || custom_formatted_address,
        latitude: prediction.latitude,
        longitude: prediction.longitude,
        name: prediction.name || 'Selected Location'
      };

      if (this.map) {
        this.map.setCenter({
          lat: prediction.latitude,
          lng: prediction.longitude
        });

        // Update marker
        if (this.centerMarker) {
          this.centerMarker.setPosition({
            lat: prediction.latitude,
            lng: prediction.longitude
          });
        }
      }
      this.getAddressFromCoordinates(prediction.latitude, prediction.longitude);
      this.cdr.detectChanges();
    } else {
        // Otherwise, get place details from API
        this.getPlaceDetails(prediction.place_id);
        this.selectedLocation = {
          formatted_address: prediction.secondary_text,
          name: prediction.main_text,
        };
      }
  }

  // Get place details via API
  getPlaceDetails(placeId: string): void {
    this.addressService.getPlaceDetails(placeId).subscribe({
      next: (response: any) => {
        // console.log('Place details response:', response);
        if (response.responseCode == 200 && response.data) {
          const place = response.data;
          // const address = place.formattedAddress;
          const lat = place.location.latitude;
          const lng = place.location.longitude;

          this.defaultLatitude = lat;
          this.defaultLongitude = lng;

          // this.placeMarkerByCoordinates(lat, lng);

          // this.selectedLocation = {
          //   address: address,
          //   latitude: lat,
          //   longitude: lng,
          //   name: place.displayName.text || 'Selected Location'
          // };
          // let addressComponents:any[] = place.addressComponents;
          // console.log("addressComponents",addressComponents);
          // let pincode = addressComponents.find(comp => comp.types.includes('postal_code'))?.longText || '';
          // let street_number = addressComponents.find(comp => comp.types.includes('premise'))?.longText || '';
          // let administrative_area_level_3 = addressComponents.find(comp => comp.types.includes('administrative_area_level_3'))?.longText || '';
          // let sublocality_level_2 = addressComponents.find(comp => comp.types.includes('sublocality_level_2'))?.longText || '';
          // let sublocality_level_1 = addressComponents.find(comp => comp.types.includes('sublocality_level_1'))?.longText || '';
          // let locality = addressComponents.find(comp => comp.types.includes('locality'))?.longText || '';
          // let administrative_area_level_2 = addressComponents.find(comp => comp.types.includes('administrative_area_level_2'))?.longText || '';
          // let administrative_area_level_1 = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.longText || '';
          // let country = addressComponents.find(comp => comp.types.includes('country'))?.longText || '';
          // let displayName = response.data.displayName?.text;
          // const lat = response.data.location.latitude;
          // const lng = response.data.location.longitude;
          
          // this.selectedLocation = {
          //   pincode: pincode,
          //   addresss: street_number + ' ' + displayName + ', ' + administrative_area_level_1 + ', ' + country,
          //   formatted_address: response.data.formattedAddress || street_number + ' ' + displayName + ', ' + administrative_area_level_1 + ', ' + country,
          //   latitude: response.data.location.latitude,
          //   longitude: response.data.location.longitude,
          //   name: displayName
          // };
          // Merge detailed place information into any existing selectedLocation
          // const mergedAddress = street_number + ' ' + (displayName || '') + ', ' + administrative_area_level_1 + ', ' + country;
          // this.selectedLocation = Object.assign({}, this.selectedLocation || {}, {
          //   pincode: pincode,
          //   addresss: mergedAddress,
          //   latitude: lat,
          //   longitude: lng
          // });

          if (this.map) {
            this.map.setCenter({ lat, lng });
            // Update marker
            if (this.centerMarker) {
              this.centerMarker.setPosition({ lat, lng });
            }
          }
          this.getAddressFromCoordinates1(lat, lng);
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Place details error:', error);
      }
    });
  }

 

  // placeMarkerByCoordinates(lat: number, lng: number): void {
  //   const location = new google.maps.LatLng(lat, lng);
  //   this.placeMarker(location);
  // }

  // placeMarker(location: any): void {
  //   if (this.marker) {
  //     this.marker.setPosition(location);
  //   }
    
  //   // const lat = location.lat instanceof Function ? location.lat() : location.lat;
  //   // const lng = location.lng instanceof Function ? location.lng() : location.lng;
    
  //   // this.getAddressFromCoordinates(lat, lng);
    
  //   if (this.map) {
  //     this.map.setCenter(location);
  //   }
  // }

  confirmLocation(): void {
    if (this.selectedLocation) {
      this.locationSelected.emit(this.selectedLocation);
      this.existingAddress = null; // Clear after map closes
      this.closeDialog();
    } else {
      alert('Please select a location');
    }
  }

  closeDialog(): void {
    this.isOpen = false;
    this.predictions = [];
    this.searchInput = '';
    // Clean up
    if (this.polyline) {
      this.polyline.setMap(null);
    }
    this.closed.emit();
  }
}