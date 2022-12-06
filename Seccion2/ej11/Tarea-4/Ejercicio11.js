const MBToken = 'pk.eyJ1IjoiYWRyaW0wMiIsImEiOiJjbGI2eHh4dmkwMmZoM29vZnMyNHN2a3hjIn0.v6_8Z5UVa81uaYdR5rLCAQ'

class Mapa {
  constructor() {
    this.crearMapa()
  }

  crearMapa() {
    mapboxgl.accessToken = MBToken;
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-5.8514629,43.3578779],
      zoom: 14
    });

    map.addControl(new mapboxgl.NavigationControl())

    const marker1 = new mapboxgl.Marker({
      color: 'red'
    })
      .setLngLat([-5.8514629,43.3578779])
      .addTo(map);
  }
}

const mapa = new Mapa();