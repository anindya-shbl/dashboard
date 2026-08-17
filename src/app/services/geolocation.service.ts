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
    // Don't auto-load on init - verify on demand
  }

  /**
   * Verify current geolocation permission status
   * This checks the ACTUAL current status, not cached
   */
  verifyGeolocationStatus(): Observable<boolean> {
    return new Observable((observer) => {
      if (!this.isGeolocationSupported) {
        this.isGeolocationAvailableSubject.next(false);
        observer.next(false);
        observer.complete();
        return;
      }

      // Try to get location with timeout to check if permission granted
      const timeoutId = setTimeout(() => {
        // If timeout, assume permission was denied (user didn't grant)
        this.isGeolocationAvailableSubject.next(false);
        observer.next(false);
        observer.complete();
      }, 2000); // Quick 2-second check

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          
          const location: CurrentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };

          this.currentLocationSubject.next(location);
          this.isGeolocationAvailableSubject.next(true);
          console.log('✅ Geolocation verified as available:', location);
          
          observer.next(true);
          observer.complete();
        },
        (error) => {
          clearTimeout(timeoutId);
          
          // User denied permission or error occurred
          this.isGeolocationAvailableSubject.next(false);
          console.warn('⚠️ Geolocation not available:', error);
          
          observer.next(false);
          observer.complete();
        },
        {
          enableHighAccuracy: true,
          timeout: 2000,
          maximumAge: 0
        }
      );
    });
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
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
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
   * Check if geolocation is available (synchronous from cache)
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
   * Request geolocation permission explicitly
   * Shows browser permission dialog
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

      // This triggers the browser's native permission dialog
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