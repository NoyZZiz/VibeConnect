// map.js - Interactive Google Maps implementation
function initMap() {
  // Initialize map centered on India
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: { lat: 20.5937, lng: 78.9629 },
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  });

  // Add markers for each location
  Object.values(locations).forEach(city => {
    city.forEach(venue => {
      const marker = new google.maps.Marker({
        position: venue.coordinates,
        map: map,
        title: venue.name,
        icon: {
          url: getMarkerIcon(venue.categories[0]),
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="map-info-window">
            <h3>${venue.name}</h3>
            <p>${venue.address}</p>
            ${venue.website ? `<a href="${venue.website}" target="_blank">Website</a>` : ''}
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });
  });

  // Auto-center based on URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const cityParam = urlParams.get('city');
  
  if (cityParam && locations[cityParam]) {
    const bounds = new google.maps.LatLngBounds();
    locations[cityParam].forEach(venue => {
      bounds.extend(venue.coordinates);
    });
    map.fitBounds(bounds);
  }
}

function getMarkerIcon(category) {
  const icons = {
    'anime': 'assets/icons/marker-anime.png',
    'kpop': 'assets/icons/marker-kpop.png',
    'tea-ceremony': 'assets/icons/marker-tea.png',
    'food': 'assets/icons/marker-food.png',
    'workshop': 'assets/icons/marker-workshop.png',
    'default': 'assets/icons/marker-default.png'
  };
  return icons[category] || icons['default'];
}