const MBToken = 'pk.eyJ1IjoiYWRyaW0wMiIsImEiOiJjbGI2eHh4dmkwMmZoM29vZnMyNHN2a3hjIn0.v6_8Z5UVa81uaYdR5rLCAQ'

class Mapa {
  constructor() {
    this.map = null
    this.minutos = document.querySelector('input[type=number]').value
    this.medio = document.querySelector('select').value 
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
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.longitud, this.latitud],
      zoom: 14
    });

    this.map.addControl(new mapboxgl.NavigationControl())

    const marker = new mapboxgl.Marker({
      color: 'red',
      draggable: true
    })
      .setLngLat([this.longitud, this.latitud])
      .addTo(this.map);

    const onDragEnd = () => {
      const lngLat = marker.getLngLat();
      console.log(lngLat)
      this.latitud = lngLat.lat
      this.longitud = lngLat.lng
      this.actualizarDatos()
    }
        
    marker.on('dragend', onDragEnd);

    this.map.on('load', () => {
      this.map.addSource('iso', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
    
      this.map.addLayer(
        {
          id: 'isoLayer',
          type: 'fill',
          source: 'iso',
          layout: {},
          paint: {
            'fill-color': '#5a3fc0',
            'fill-opacity': 0.3
          }
        },
        'poi-label'
      );
    
      this.getDistancias();
    })
  }

  async getDistancias() {
    const query = await fetch(
      `https://api.mapbox.com/isochrone/v1/mapbox/${this.medio}/${this.longitud},${this.latitud}?contours_minutes=${this.minutos}&polygons=true&access_token=${MBToken}`,
      { method: 'GET' }
    );
    const data = await query.json();
    this.map.getSource('iso').setData(data);
  }

  actualizarDatos() {
    this.minutos = document.querySelector('input[type=number]').value
    this.medio = document.querySelector('select').value 
    this.getDistancias()
  }
}

const mapa = new Mapa();