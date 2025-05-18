// dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { MapComponent } from '../shared/map/map.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';

declare var google: any;

interface Location {
  id: number;
  name: string;
  description: string;
  distance: number;
  routeDistance?: string;
  routeDuration?: string;
  rating: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface UserData {
  name: string;
  email: string;
  // add other user properties as needed
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NavbarComponent, MapComponent]
})
export class DashboardComponent implements OnInit {
  userData: UserData | null = null;
  selectedLocation: Location | null = null;
  userLocation: { lat: number; lng: number } | null = null;
  private directionsService: any;
  
  messLocations: Location[] = [
    {
      id: 1,
      name: "Annapurna Mess",
      description: "Authentic home-style meals with pure ghee",
      distance: 0.8,
      rating: 4.5,
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    {
      id: 2,
      name: "Green Leaf Mess",
      description: "Healthy and nutritious vegetarian food",
      distance: 1.2,
      rating: 4.3,
      coordinates: { lat: 18.5314, lng: 73.8446 }
    },
    {
      id: 3,
      name: "Maharaja Mess",
      description: "Premium thalis with variety of items",
      distance: 1.5,
      rating: 4.7,
      coordinates: { lat: 18.5123, lng: 73.8289 }
    }
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.directionsService = new google.maps.DirectionsService();
  }

  ngOnInit() {
    // Get user data
    console.log('Getting user data...');
    
    this.userService.getUserData().subscribe({
      next: (data) => {
        console.log(data);
        
        this.userData = data;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });

    // Get user location
    this.getUserLocation();
  }

  getUserLocation() {
    console.log('Getting user location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location received:', position.coords);
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          // Update distances based on user location
          this.updateRouteDistances();
        },
        (error) => {
          console.error('Error getting location:', error);
          // Set default location (e.g., city center)
          this.userLocation = { lat: 18.5204, lng: 73.8567 };
          this.updateRouteDistances();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.log('Geolocation not supported, using default location');
      // Fallback for browsers that don't support geolocation
      this.userLocation = { lat: 18.5204, lng: 73.8567 };
      this.updateRouteDistances();
    }
  }

  async updateRouteDistances() {
    if (!this.userLocation) {
      console.log('No user location available for distance calculation');
      return;
    }
    
    console.log('Updating route distances from user location:', this.userLocation);
    
    // Update straight-line distances first
    this.messLocations = this.messLocations.map(location => ({
      ...location,
      distance: this.calculateDistance(
        this.userLocation!.lat,
        this.userLocation!.lng,
        location.coordinates.lat,
        location.coordinates.lng
      )
    }));

    // Update route distances
    for (const location of this.messLocations) {
      try {
        const route = await this.getRouteDetails(location);
        location.routeDistance = route.distance;
        location.routeDuration = route.duration;
      } catch (error) {
        console.error('Error getting route for:', location.name, error);
      }
    }
  }

  private getRouteDetails(location: Location): Promise<{ distance: string; duration: string }> {
    return new Promise((resolve, reject) => {
      if (!this.userLocation) {
        reject('No user location available');
        return;
      }

      const request = {
        origin: this.userLocation,
        destination: location.coordinates,
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directionsService.route(request, (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          const route = result.routes[0].legs[0];
          resolve({
            distance: route.distance.text,
            duration: route.duration.text
          });
        } else {
          reject(`Failed to get route: ${status}`);
        }
      });
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Number(d.toFixed(1));
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  selectLocation(location: Location) {
    console.log('Location selected:', location);
    this.selectedLocation = { ...location };
  }
}