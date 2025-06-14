// dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { AuthService } from '../../auth/services/auth-service/auth.service';
import { UserService } from '../../services/user.service';
import { MapComponent } from '../shared/map/map.component';
import { MenuDisplayComponent } from '../shared/menu-display/menu-display.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { UserData } from 'src/app/auth/interfaces/user.interface';
import { Location } from 'src/app/auth/interfaces/location.interface';
import { FormsModule } from '@angular/forms';
declare var google: any;





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NavbarComponent, MapComponent, MenuDisplayComponent, FormsModule]
})
export class DashboardComponent implements OnInit {
  userData: UserData | null = null;
  selectedLocation: Location | null = null;
  userLocation: { lat: number; lng: number } | null = null;
  private directionsService: any;
  selectedCity: string = 'All';
  topCities: string[] = ['All', 'Pune', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];
  messNameSearchQuery: string = '';

  messLocations: Location[] = []
  // [
  //   {
  //     id: 1,
  //     name: "Annapurna Mess",
  //     description: "Authentic home-style meals with pure ghee",
  //     distance: 0.8,
  //     rating: 4.5,
  //     city: "Pune",
  //     coordinates: { lat: 18.5204, lng: 73.8567 }
  //   },
  //   {
  //     id: 2,
  //     name: "Green Leaf Mess",
  //     description: "Healthy and nutritious vegetarian food",
  //     distance: 1.2,
  //     rating: 4.3,
  //     city: "Pune",
  //     coordinates: { lat: 18.5314, lng: 73.8446 }
  //   },
  //   {
  //     id: 3,
  //     name: "Maharaja Mess",
  //     description: "Premium thalis with variety of items",
  //     distance: 1.5,
  //     rating: 4.7,
  //     city: "Pune",
  //     coordinates: { lat: 18.5123, lng: 73.8289 }
  //   },
  //   {
  //     id: 4,
  //     name: "Mumbai Tiffin",
  //     description: "Delicious Maharashtrian food",
  //     distance: 2.0,
  //     rating: 4.2,
  //     city: "Mumbai",
  //     coordinates: { lat: 19.076, lng: 72.8777 }
  //   },
  //   {
  //     id: 5,
  //     name: "Delhi Thali House",
  //     description: "Authentic North Indian thalis",
  //     distance: 2.3,
  //     rating: 4.4,
  //     city: "Delhi",
  //     coordinates: { lat: 28.6139, lng: 77.209 }
  //   },
  //   {
  //     id: 6,
  //     name: "Bangalore Meals",
  //     description: "South Indian meals with filter coffee",
  //     distance: 1.8,
  //     rating: 4.6,
  //     city: "Bangalore",
  //     coordinates: { lat: 12.9716, lng: 77.5946 }
  //   },
  //   {
  //     id: 7,
  //     name: "Hyderabad Ruchi",
  //     description: "Spicy and flavorful Hyderabadi thalis",
  //     distance: 2.5,
  //     rating: 4.3,
  //     city: "Hyderabad",
  //     coordinates: { lat: 17.385, lng: 78.4867 }
  //   },
  //   {
  //     id: 8,
  //     name: "Chennai Veg Delight",
  //     description: "Pure veg South Indian meals",
  //     distance: 2.7,
  //     rating: 4.1,
  //     city: "Chennai",
  //     coordinates: { lat: 13.0827, lng: 80.2707 }
  //   }
  // ];


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private locationService: LocationService
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.getmessLocations();
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
    this.getmessLocations();

    // Get user location
    this.getUserLocation();
  }

  getmessLocations(){
    this.locationService.getLocations().subscribe({
      next: (data: any) => {
        console.log(data.data);
        
        this.messLocations = data.data
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  get filteredMessLocationsByNameAndCity(): Location[] {

    if (this.selectedCity === 'All') {
      const query = this.messNameSearchQuery.toLowerCase().trim();
      return this.messLocations.filter(location =>
        location.name.toLowerCase().includes(query)
      );
    }
    let data = this.messLocations.filter(location => {
      const matchesCity = this.selectedCity ? location.city === this.selectedCity : true;
      const matchesName = this.messNameSearchQuery
        ? location.name.toLowerCase().includes(this.messNameSearchQuery.toLowerCase().trim())
        : true;
      return matchesCity && matchesName;
    });
    return data;
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
    
    // Scroll to menu section after a short delay to ensure component is rendered
    setTimeout(() => {
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}
