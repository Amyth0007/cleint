import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Location } from 'src/app/auth/interfaces/location.interface';

declare var google: any;

/// <reference types="@types/google.maps" />





@Component({
  selector: 'app-map',
  template: `
    <div #mapContainer style="width: 100%; height: 400px; display: block; border-radius: 0.5rem;"></div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class MapComponent implements OnInit, OnChanges {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  @Input() selectedLocation: Location | null = null;
  @Input() userLocation: { lat: number; lng: number } | null = null;
  @Output() locationSelected = new EventEmitter<Location>();

  private map: any = null;
  private markers: any[] = [];
  private directionsService: any;
  private directionsRenderer: any;

  constructor() {}

  ngOnInit() {
    // Delay map initialization slightly to ensure DOM is ready
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      if (changes['selectedLocation']) {
        this.clearMap();
        this.updateMarkers();
        if (this.selectedLocation && this.userLocation) {
          this.showDirections();
        }
      }
    }
  }

  private initMap() {
    try {
      if (typeof google === 'undefined' || !google.maps) {
        console.error('Google Maps SDK not loaded');
        return;
      }

      const defaultCenter = { lat: 18.5204, lng: 73.8567 }; // Default center (Pune)

      const mapOptions = {
        center: this.userLocation || defaultCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      };

      if (!this.mapContainer) {
        console.error('Map container not found');
        return;
      }

      const mapElement = this.mapContainer.nativeElement;
      if (!mapElement) {
        console.error('Map element not found in DOM');
        return;
      }

      this.map = new google.maps.Map(mapElement, mapOptions);

      if (!this.map) {
        console.error('Failed to create map instance');
        return;
      }

      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#4F46E5',
          strokeWeight: 4
        }
      });

      // Trigger resize event to ensure map renders properly
      google.maps.event.trigger(this.map, 'resize');

      this.updateMarkers();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private clearMap() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
    }
  }

  private updateMarkers() {
    // Add user location marker
    if (this.userLocation) {
      const userMarker = new google.maps.Marker({
        position: this.userLocation,
        map: this.map,
        title: 'Your Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 8
        }
      });
      this.markers.push(userMarker);
    }

    // Add selected location marker
    if (this.selectedLocation) {
      const locationMarker = new google.maps.Marker({
        position: this.selectedLocation.coordinates,
        map: this.map,
        title: this.selectedLocation.name,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          fillColor: '#10B981',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 6
        }
      });
      this.markers.push(locationMarker);

      // Center map on selected location
      this.map.panTo(this.selectedLocation.coordinates);
    }
  }

  private showDirections() {
    if (!this.userLocation || !this.selectedLocation || !this.map) return;

    const request = {
      origin: this.userLocation,
      destination: this.selectedLocation.coordinates,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setDirections(result);

        // Adjust map bounds to show the entire route
        const bounds = new google.maps.LatLngBounds();
        if (this.userLocation) {
          bounds.extend(this.userLocation);
        }
        if (this.selectedLocation?.coordinates) {
          bounds.extend(this.selectedLocation.coordinates);
        }
        this.map.fitBounds(bounds);
      }
    });
  }
}
