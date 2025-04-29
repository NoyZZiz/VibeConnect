/**
 * Google Maps Integration
 */
class VibeConnectMap {
  constructor() {
    this.map;
    this.markers = [];
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 20.5937, lng: 78.9629 }, // India coordinates
      zoom: 5,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    this.loadLocations();
  }

  loadLocations() {
    // Replace with your actual locations data
    const locations = [
      {
        name: "Japan House Delhi",
        position: { lat: 28.6289, lng: 77.2186 },
        type: "cultural"
      }
      // Add more locations...
    ];

    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: location.position,
        map: this.map,
        title: location.name,
        icon: this.getMarkerIcon(location.type)
      });

      this.markers.push(marker);
    });
  }

  getMarkerIcon(type) {
    const icons = {
      cultural: 'assets/icons/cultural-marker.png',
      workshop: 'assets/icons/workshop-marker.png',
      // Add more types...
    };
    return icons[type] || 'assets/icons/default-marker.png';
  }
}

// Initialize when Map container exists
if (document.getElementById('map')) {
  new VibeConnectMap();
}