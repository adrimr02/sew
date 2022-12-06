const consulta = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&lang=es&appid=5d2f91910fe6f90c235c2121c46483e6'

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
    let results = Promise.allSettled(this.ciudades.map(this.#hacerPeticion))
    results.then((data => {
      let result = data.map(data => data.value)
      result.forEach(value => {
          value.ciudad.info = value.result
          value.ciudad.error = value.error
      })
      
      this.#actualizaInfo()
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
        dataType: 'json',
        method: 'GET',
        url: ciudad.getUrl(),
        success: (result) => resolve({ciudad, result}),
        error: (error) => reject({ciudad, error})
      })
    })
  }

  #actualizaInfo() {
    $('main').children().not('button').remove();
    for(let ciudad of this.ciudades) {
      let html = 
      `<section>
        <h2>El tiempo actual en ${ciudad.nombre}</h2>
        <section>
          <h3>Situación atmosférica</h3>
          <p>Temperatura: ${ciudad.info.main.temp}</p>  
          <p>Sensacion térmica: ${ciudad.info.main.feels_like}</p>  
          <p>Humedad: ${ciudad.info.main.humidity}</p>  
          <p>Presión: ${ciudad.info.main.pressure}</p>  
        </section>
        <section>
          <h3>Estado del Cielo</h3>
          <p>${ciudad.info.weather[0].description} <img src="http://openweathermap.org/img/wn/${ciudad.info.weather[0].icon}@2x.png" alt="[clima]"></p>  
          <p>Nubosidad: ${ciudad.info.clouds.all}%</p>  
          <p>Visibilidad: ${ciudad.info.visibility}m</p>  
          <p>${ciudad.info.rain ? `Lluvia: ${ciudad.info.rain['1h']}mm` : 'No ha llovido en la última hora'}</p>  
        </section>
        <section>
          <h3>Viento</h3>
          <p>Velocidad: ${ciudad.info.wind.speed}m/s</p>  
          <p>Rachas: ${ciudad.info.wind.gust}m/s</p>  
          <p>Dirección: ${ciudad.info.wind.deg}º</p>  
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