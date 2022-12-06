class GeoLocalizacion {
  constructor() {
    this.error = null;
    navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this));
  }

  getPosicion(posicion) {
    this.longitud = posicion.coords.longitude;
    this.latitud = posicion.coords.latitude;
    this.precision = posicion.coords.accuracy;
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
  }
  
}
const localizacion = new GeoLocalizacion();