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
    let name = file.name
    let lastModified = file.lastModifiedDate
    let size = file.size
    let type = file.type
    let output = document.querySelector('section')
    console.log(output)
    if (!output) {
      output = document.createElement('section')
      document.querySelector('main').append(output)
    }
    output.innerHTML = '<h2>Información sobre el archivo:</h2>'
    output.innerHTML += `<p>Nombre: ${name}</p>`
    output.innerHTML += `<p>Tamaño: ${size} bytes</p>`
    output.innerHTML += `<p>Última modificación: ${lastModified}</p>`
    output.innerHTML += `<p>Tipo: ${type}</p>`
    if (file.type.match('text/*') || file.type == 'application/json') {
      var lector = new FileReader()
      lector.onload = function () {
        output.innerHTML += '<p>Contenido del fichero:</p><pre><code></code></pre>'
        document.querySelector('code').append(document.createTextNode(lector.result))
      }
      lector.readAsText(file);
    }
    else {
      output.innerHTML += `<p>No se puede mostrar el archivo. Solo se permiten archivos de texto plano</p>`
    }
  }

}

const reader = new LocalFileReader()