const consulta = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&lang=es&mode=xml&appid=5d2f91910fe6f90c235c2121c46483e6'

class AplicacionTiempo {

  /**
   * Recibe la lista de sitios de los que obtendrá el tiempo
   * @param {Array<Ciudad>} ciudades 
   */
  constructor(ciudades) {
    this.ciudades = ciudades;
    this.searching = false
    this.obtenerTiempo()
  }

  obtenerTiempo() {
    this.#bloqueaBoton();
    let results = Promise.allSettled(ciudades.map(this.#hacerPeticion))
    results.then((data => {
      let result = data.map(data => data.value)
      result.forEach(value => {
          value.ciudad.info = value.result
          value.ciudad.error = value.error
      })
      
      this.actualizaInfo()
    }))
    .catch(e => console.error(e))
    .finally(() => this.#bloqueaBoton())
  }

  #bloqueaBoton() {
    $('button').prop('disabled', !this.searching)
    this.searching = !this.searching
  }

  #hacerPeticion(ciudad) {
    return new Promise((resolve, reject) => {
      $.ajax({
        dataType: 'xml',
        method: 'GET',
        url: ciudad.getUrl(),
        success: (result) => resolve({ciudad, result}),
        error: (error) => reject({ciudad, error})
      })
    })
  }

  actualizaInfo() {
    $('main').children().not('button').remove();
    for(let ciudad of this.ciudades) {
      let temp = $('temperature', ciudad.info).attr('value')
      let feel_temp = $('feels_like', ciudad.info).attr('value')
      let humidity = $('feels_like', ciudad.info).attr('value')
      let pressure = $('feels_like', ciudad.info).attr('value')
      let weatherDesc = $('weather', ciudad.info).attr('value')
      let weatherIcon = $('weather', ciudad.info).attr('icon')
      let clouds = $('clouds', ciudad.info).attr('value')
      let visibility = $('', ciudad.info).attr('')
      let rain = $('precipitation', ciudad.info).attr('value')
      let wind = $('wind', ciudad.info)
      let windSpeed = $('speed', wind).attr('value')
      let windGust = $('gusts', wind).attr('value')
      let windDir = $('direction', wind).attr('code')
      let html = 
      `<section>
        <h2>El tiempo actual en ${ciudad.nombre}</h2>
        <section>
          <h3>Situación atmosférica</h3>
          <p>Temperatura: ${temp}</p>  
          <p>Sensacion térmica: ${feel_temp}</p>  
          <p>Humedad: ${humidity}</p>  
          <p>Presión: ${pressure}</p>  
        </section>
        <section>
          <h3>Estado del Cielo</h3>
          <p>${weatherDesc} <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="[clima]"></p>  
          <p>Nubosidad: ${clouds}%</p>  
          <p>Visibilidad: ${visibility}m</p>  
          <p>${rain ? `Lluvia: ${rain}mm` : 'No ha llovido en la última hora'}</p>  
        </section>
        <section>
          <h3>Viento</h3>
          <p>Velocidad: ${windSpeed}m/s</p>  
          <p>Rachas: ${windGust}m/s</p>  
          <p>Dirección: ${windDir}º</p>  
        </section>
      </section>`

      $('main').append(html)
    }
  }

}

class Lugar {

  constructor(nombre, lat, lon) {
    this.nombre = nombre
    this.lat = lat
    this.lon = lon
    this.info = null
    this.error = null
  }

  getUrl() {
    if (!this.url)
      this.url = consulta.replace('{lat}', this.lat).replace('{lon}', this.lon)
    return this.url
  }

}

const ciudades = [
  new Lugar('Oviedo', 43.3603, -5.8448),
  new Lugar('Gijón', 43.5357, -5.6615),
  new Lugar('Avilés', 43.5547, -5.9248),
  new Lugar('Siero', 43.25, -5.7667),
  new Lugar('Mieres', 43.3833, -5.6667)
] 

const app = new AplicacionTiempo(ciudades);