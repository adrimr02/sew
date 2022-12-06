const MBToken = 'pk.eyJ1IjoiYWRyaW0wMiIsImEiOiJjbGI2eHh4dmkwMmZoM29vZnMyNHN2a3hjIn0.v6_8Z5UVa81uaYdR5rLCAQ'

class Mapa {
  constructor() {
    navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.errorHandle.bind(this));
  }

  getPosicion(posicion) {
    this.longitud = posicion.coords.longitude;
    this.latitud = posicion.coords.latitude;
    this.precision = posicion.coords.accuracy;
    this.crearMapa()
  }

  errorHandle(error) {
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        this.error = "Error: El usuario no permite la petición de geolocalización"
        break;
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        this.error = "Error: Información de geolocalización no disponible"
        break;
      case GeolocationPositionError.TIMEOUT:
        this.error = "Error: La petición de geolocalización ha caducado"
        break;
      default:
        this.error = "Error: Se ha producido un error desconocido"
        break;
    }
    document.querySelector('body').innerHTML += `<article>${this.error}</article>`
  }

  crearMapa() {
    mapboxgl.accessToken = MBToken;
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longitud, this.latitud],
      zoom: 14
    });

    map.addControl(new mapboxgl.NavigationControl())

    const marker1 = new mapboxgl.Marker({
      color: 'red'
    })
      .setLngLat([this.longitud, this.latitud])
      .addTo(map);
  }
}

const mapa = new Mapa();