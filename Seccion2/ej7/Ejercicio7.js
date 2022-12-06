class ManipuladorHtml {
  
  constructor() {
    this.mostrandoParrafos = true
    this.mostrandoNodos = false
  }

  ocultarMostrarParrafos() {
    if (this.mostrandoParrafos) {
      $('p').hide()
      this.mostrandoParrafos = false
    } else {
      $('p').show()
      this.mostrandoParrafos = true
    }
    this.modificarBoton()
  }

  modificarBoton() {
    $('button[name="ocultaParrafos"]').html(this.mostrandoParrafos ? 'Ocultar parrafos' : 'Mostrar parrafos')
  }

  comentar() {
    let comentario = $('textarea').val()
    $('ul').append(`<li>${comentario}</li>`)
    $('textarea').val('')
  }

  eliminarComentarios() {
    $('ul').empty()
  }

  mostrarElementos() {
    if (!this.mostrandoNodos) {
      let finalStr = ''
      $('*', document.body).each(function () {
        let nodo = $(this).get(0).nodeName.toLowerCase()
        if (nodo != 'script') {
          let padre = $(this).parent().get(0).nodeName.toLowerCase()
          let str = `Padre: &lt;${padre}&gt;, Elemento: &lt;${nodo}&gt;`
          finalStr += str + '\n'
        }
      })
      this.mostrandoNodos = true
      $('body').append(`<section><h2>Descripcion de los elementos</h2><pre>${finalStr}</pre></section>`)
    }
  }

  sumarTabla() {
    if (!this.mostrandoNodos) {
      let total = 0;
      $('tbody').children('tr').each(function () { //ROWS
        $(this).children('td').each(function () { //CELLS
          total += Number($(this).text());
        })
      });
      $('section:last').append(`<p>${total} habitantes</p>`)
    } else {
      console.error('No se puede calcular el total si se estan mostrando la informacion de los elementos')
    }
  }

}

const manipulador = new ManipuladorHtml()