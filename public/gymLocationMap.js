mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltb25qYXkiLCJhIjoiY2t1czZvMGJjMWpoNjJwcXJtNDJqZmp1biJ9.9MMga3s7vQYPW9v67AEATg';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: gym.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
  .setLngLat(gym.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h5 style="color:DarkSlateGrey;"><center>${gym.name}</center></h5><p>${gym.location}</p>`)
  )
  .addTo(map)