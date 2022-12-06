class GeoLocalizacion {
  constructor() {
    this.error = null;
    navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.errorHandle.bind(this));
  }

  getPosicion(posicion) {
    this.longitud = posicion.coords.longitude;
    this.latitud = posicion.coords.latitude;
    this.precision = posicion.coords.accuracy;
    this.verTodo()
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
    this.verTodo()
  }

  verTodo() {
    var str = '';
    if (!this.error) {
      str += '<p>Longitud: ' + this.longitud + ' grados</p>';
      str += '<p>Latitud: ' + this.latitud + ' grados</p>';
      str += '<p>Precisión de la latitud y longitud: ' + this.precision + ' metros</p>';
    } else {
      str = this.error
    }
    document.querySelector('main').innerHTML = str
    if (!this.error)
      this.insertarMapa()
  }

  insertarMapa() {
    let img = `<img alt="Mapa estatico de la posicion del cliente" src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${this.longitud},${this.latitud})/${this.longitud},${this.latitud},11.44,0/400x300?access_token=pk.eyJ1IjoiYWRyaW0wMiIsImEiOiJjbGI2eHh4dmkwMmZoM29vZnMyNHN2a3hjIn0.v6_8Z5UVa81uaYdR5rLCAQ" />`
    document.querySelector('main').innerHTML += img
  }
  
}
const localizacion = new GeoLocalizacion();