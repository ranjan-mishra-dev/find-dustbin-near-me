const userLocation = [22.286050, 73.364441];

const map = L.map('map', {
    center: [22.292130, 73.363210], 
    zoom: 10,                        
    minZoom: 8,                      
    maxZoom: 20                      
});


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const userIcon = L.icon({
    iconUrl: 'person-311134_640.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const userMarker = L.marker(userLocation, { icon: userIcon }).addTo(map)
    .bindPopup("<b>You are here!</b>")
    .openPopup();

const facilities = [
    { lat: 22.292793, lng: 73.363070, name: 'Composting Facility 1' },
    { lat: 22.290004, lng: 73.362150, name: 'Waste Disposal Site 1' },
    { lat: 22.288572, lng: 73.364522, name: 'Eco-Friendly Recycling Hub' },
    { lat: 22.294192, lng: 73.362047, name: 'Nature Bounty Composting Facility' },
    { lat: 22.293809, lng: 73.383052, name: 'Recycling Center 2 ' },
    { lat: 22.285094, lng: 73.363831, name: 'Green Earth Composting Station' },
    { lat: 22.288008, lng: 73.347635, name: 'Waste Warriors Disposal Center' },
    { lat: 22.291659, lng: 73.324979, name: 'Composting Facility 2 ' },
    { lat: 22.285993, lng: 73.363722, name: 'Waste Disposal Site 2 ' },
    { lat: 22.286152, lng: 73.364959, name: 'Waste Disposal Site 5 ' },
];

L.circleMarker([22.292666, 73.364773], {
    color: 'red',       
    fillColor: 'red',   
    fillOpacity: 0.8,   
    radius: 8           
}).addTo(map)
  .bindPopup(`<b>${'Recycling Center 1 FULL'}</b>`);

  L.circleMarker([22.290674, 73.373777], {
    color: 'red',       
    fillColor: 'red',   
    fillOpacity: 0.8,   
    radius: 8           
}).addTo(map)
  .bindPopup(`<b>${'Sustainable Recycling Center FULL'}</b>`);

facilities.forEach(facility => {
    L.marker([facility.lat, facility.lng]).addTo(map)
        .bindPopup(`<b>${facility.name}</b>`);
});

const bounds = L.latLngBounds([
    [22.270000, 73.350000],
    [22.300000, 73.370000] 
]);

map.setMaxBounds(bounds);

map.on('drag', function() {
    map.panInsideBounds(bounds);
});


function drawNearestFacility() {
    let nearestFacility = null;
    let shortestDistance = Infinity;

    facilities.forEach(facility => {
        const facilityLocation = [facility.lat, facility.lng];
        const distance = map.distance(userLocation, facilityLocation);

        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestFacility = facilityLocation;
        }
    });

    if (nearestFacility) {
        const line = L.polyline([userLocation, nearestFacility], { color: 'red' }).addTo(map);
        map.fitBounds(line.getBounds()); // Adjust map view to fit the line

        const midPoint = [
            (userLocation[0] + nearestFacility[0]) / 2,
            (userLocation[1] + nearestFacility[1]) / 2
        ];

        const distanceLabel = L.divIcon({
            className: 'distance-label',
            html: `<div style="color: blue; font-weight: bold;">Shortest Distance: ${Math.round(shortestDistance)} m</div>`,
            iconSize: [150, 40],
            iconAnchor: [75, 20]
        });

        L.marker(midPoint, { icon: distanceLabel }).addTo(map);
    }
}

document.getElementById('findShortestDistanceBtn').addEventListener('click', drawNearestFacility);
