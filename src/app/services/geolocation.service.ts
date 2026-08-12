import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private currentLocationSubject = new BehaviorSubject<CurrentLocation | null>(null);
  public currentLocation$ = this.currentLocationSubject.asObservable();

  private isGeolocationSupported = 'geolocation' in navigator;
  private isGeolocationAvailableSubject = new BehaviorSubject<boolean>(false);
  public isGeolocationAvailable$ = this.isGeolocationAvailableSubject.asObservable();

  constructor() {
    this.loadCurrentLocation();
  }

  /**
   * Load current location on service initialization
   */
  private loadCurrentLocation(): void {
    if (this.isGeolocationSupported) {
      this.getCurrentLocation().subscribe({
        next: (location) => {
          this.currentLocationSubject.next(location);
          this.isGeolocationAvailableSubject.next(true);
          console.log('Current location loaded:', location);
        },
        error: (error) => {
          console.warn('Geolocation error:', error);
          this.isGeolocationAvailableSubject.next(false);
          // Will use default coordinates
        }
      });
    } else {
      console.warn('Geolocation is not supported by this browser');
      this.isGeolocationAvailableSubject.next(false);
    }
  }

  /**
   * Get current location from browser
   */
  getCurrentLocation(): Observable<CurrentLocation> {
    return new Observable((observer) => {
      if (!this.isGeolocationSupported) {
        observer.error('Geolocation is not supported');
        return;
      }

      const options = {
        enableHighAccuracy: true,  // Get more precise location
        timeout: 10000,            // Wait max 10 seconds
        maximumAge: 0              // Don't use cached position
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: CurrentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          observer.next(location);
          observer.complete();
        },
        (error) => {
          let errorMessage = 'Unable to get current location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Enable location in browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          console.error(errorMessage);
          observer.error(errorMessage);
        },
        options
      );
    });
  }

  /**
   * Get current location (synchronous from cache)
   */
  getCurrentLocationSync(): CurrentLocation | null {
    return this.currentLocationSubject.value;
  }
  /**
     * Check if geolocation is available (synchronous)
     */
    isGeolocationAvailable(): boolean {
      return this.isGeolocationAvailableSubject.value;
    }

    /**
     * Get geolocation availability as observable
     */
    getGeolocationAvailability(): Observable<boolean> {
      return this.isGeolocationAvailable$;
    }

    /**
   * ✅ NEW: Request geolocation permission explicitly
   */
    
  requestGeolocationPermission(): Observable<{
    success: boolean;
    message: string;
    location?: CurrentLocation;
    errorCode?: number;
  }> {
    return new Observable((observer) => {
      if (!this.isGeolocationSupported) {
        observer.next({
          success: false,
          message: 'Geolocation is not supported by your browser'
        });
        observer.complete();
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      // ✅ This triggers the browser's native permission dialog
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: CurrentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };

          this.currentLocationSubject.next(location);
          this.isGeolocationAvailableSubject.next(true);

          console.log('✅ Geolocation enabled:', location);

          observer.next({
            success: true,
            message: 'Geolocation enabled successfully!',
            location: location
          });
          observer.complete();
        },
        (error) => {
          let errorMessage = 'Unable to enable geolocation';
          let errorCode = error.code;

          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'You denied geolocation permission. Please enable it in browser settings.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage = 'Location request timed out. Please try again.';
          }

          this.isGeolocationAvailableSubject.next(false);
          console.error('❌ Geolocation error:', errorMessage);

          observer.next({
            success: false,
            message: errorMessage,
            errorCode: errorCode
          });
          observer.complete();
        },
        options
      );
    });
  }


  /**
   * Clear cached location
   */
  clearLocation(): void {
    this.currentLocationSubject.next(null);
  }

  /**
   * Reload current location
   */
  reloadLocation(): Observable<CurrentLocation> {
    return new Observable((observer) => {
      this.getCurrentLocation().subscribe({
        next: (location) => {
          this.currentLocationSubject.next(location);
          this.isGeolocationAvailableSubject.next(true);
          observer.next(location);
          observer.complete();
        },
        error: (error) => {
          this.isGeolocationAvailableSubject.next(false);
          observer.error(error);
        }
      });
    });
  }
}