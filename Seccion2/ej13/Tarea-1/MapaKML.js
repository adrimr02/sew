const MBToken = 'pk.eyJ1IjoiYWRyaW0wMiIsImEiOiJjbGI2eHh4dmkwMmZoM29vZnMyNHN2a3hjIn0.v6_8Z5UVa81uaYdR5rLCAQ'

class LocalFileReader {
  constructor() {
    this.checkNavigator()
  }

  checkNavigator() {
    if (window.File && window.FileReader && window.FileList && window.Blob)
      document.querySelector('input[type=file]').disabled = false
    else
      document.querySelector('main').innerHTML(`<p>Este navegador no soporta la API File de HTML5 por lo que la aplicacion no funcionará correctametne</p>`)
  }

  readFile(file) {  
    const parseKml = this.parseKml
    if (file)
      if (file.type == 'application/vnd.google-earth.kml+xml') {
        var lector = new FileReader()
        lector.onload = function () {
          parseKml(this.result)
        }
        lector.readAsText(file);
      }
      else {
        document.querySelector('section').innerHTML += `<p>El archivo utilizado debe estar en un formato kml valido</p>`
      }
  }

  parseKml(kml) {
    $('Placemark', kml).each(function() {
      let name = $('name', this).text()
      let desc = $('description', this).text()
      let latLng = $('coordinates', this).text()
      let [lat, lng] = latLng.split(',')
      mapa.addMarker({ title: name, description: desc, lat, lng })
    })
  }

}

class Mapa {
  constructor() {
    this.map
    this.crearMapa()
  }

  crearMapa() {
    mapboxgl.accessToken = MBToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-5.8514629,43.3578779],
      zoom: 8
    });

    this.map.addControl(new mapboxgl.NavigationControl())
  }

  addMarker({ lat, lng, title, description }) {
    const marker1 = new mapboxgl.Marker({
      color: 'red'
    })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<h3>${title}</h3><p>${description}</p>`
        )
      )
      .addTo(this.map);
  }
}

const mapa = new Mapa();
const reader = new LocalFileReader()