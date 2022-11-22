class CalculadoraMilan {

  constructor(pantalla = 'input[type=text][name="pantalla"]') {
    this.pantalla = document.querySelector(pantalla)
    this.pantalla.value = ''
    this.previousParam = ''
    this.currentParam = ''
    this.lastResult = ''
    this.operacion = ''
    this.memoria = 0
    this.showingResult = false
  }

  #actualizaPantalla() {
    this.pantalla.value = this.currentParam
  }

  error(str) {
    this.reset()
    this.pantalla.value = str
  }

  reset(memoria=true) {
    this.pantalla.value = ''
    this.previousParam = ''
    this.currentParam = ''
    this.lastResult = ''
    this.operacion = ''
    this.showingResult = false
    if (memoria)
      this.memoria = 0
  }

  borrar() {
    this.currentParam = ''
    this.pantalla.value = ''
    this.showingResult = false
  }

  digitos(num) {
    if (this.showingResult) {
      this.reset(false)
    }
    if (!this.pantalla.value.match(/[0-9]/g) || this.pantalla.value.match(/[0-9]/g).length < 8)
      this.currentParam += Number(num)
    
    this.#actualizaPantalla()
  }

  punto() {
    if (this.pantalla.value.length === 0)
      this.currentParam += '0.'
    else if (!this.pantalla.value.match(/\./g))
      this.currentParam += '.'
    
    this.#actualizaPantalla()
  }

  suma() {
    if (!this.showingResult) {
      this.showingResult = false 
      this.igual()
    }
    else {
      this.previousParam = this.lastResult
      this.showingResult = false
    }
    this.operacion = '+'
    this.currentParam = ''
  }

  resta() {
    if (!this.showingResult) {
      this.showingResult = false 
      this.igual()
    }
    else {
      this.previousParam = this.lastResult
      this.showingResult = false
    }
    this.igual()
    this.operacion = '-'
    this.currentParam = ''
  }

  multiplicacion() {
    if (!this.showingResult) {
      this.showingResult = false 
      this.igual()
    }
    else {
      this.previousParam = this.lastResult
      this.showingResult = false
    }
    this.igual()
    this.operacion = '*'
    this.currentParam = ''
  }

  division() {
    if (!this.showingResult) {
      this.showingResult = false 
      this.igual()
    }
    else {
      this.previousParam = this.lastResult
      this.showingResult = false
    }
    this.igual()
    this.operacion = '/'
    this.currentParam = ''
  }

  igual() {
    if (!this.operacion) {
      this.previousParam = this.currentParam
      return
    }
    
    let param1 = this.previousParam || '0'
    let param2 = this.currentParam || '0'
    if (this.operacion == '/' && this.currentParam === '0') {
      this.error('Math Error')
      return
    }
    let operacion = this.operacion
    let str = param1 + operacion + param2
    if (this.operacion == '√') {
      str = `Math.sqrt(${param1})${this.currentParam ? ` * ${param2}` : ''}`
      console.log(str)
    }
    try {
      let result = eval(str)
      this.previousParam = result
      this.lastResult = result + ''
      this.pantalla.value = result
      this.showingResult = true
    } catch(e) {
      console.log(e)
      this.error('Error')
    }
  }

  mrc() {
    if (this.memoria === 0) {
      if (!this.showingResult)
        this.igual()

      this.memoria = Number(this.lastResult || this.currentParam)
    } else {
      this.currentParam = this.memoria
      this.#actualizaPantalla() 
      this.operacion = ''
    }
  }

  mMenos() {
    if (!this.showingResult)
      this.igual()
    this.memoria -= Number(this.lastResult || this.currentParam)
  }

  mMas() {
    if (!this.showingResult)
      this.igual()
    this.memoria += Number(this.lastResult || this.currentParam)
  }

  porcentaje() {
    if (!this.operacion) {
      this.previousParam = this.currentParam
      return
    }

    if (this.operacion == '/' && this.currentParam === '0') {
      this.reset()
      this.pantalla.value = 'Math Error'
      return
    }

    let param1 = this.previousParam || '0'
    let param2 = this.currentParam || '0'
    let operacion = this.operacion
    let str
    switch (operacion) {
      case '*':
        str = `${param1} * (${param2} / 100)`
        break
      case '+':
        str = `${param1} * (1 + (${param2} / 100))`
        break
      case '-':
        str = `${param1} * (1 - (${param2} / 100))`
        break
      case '/':
        str = `${param1} / ${param2} * 100`
        break
    
      default:
        str = param2
        break;
    }
    let result = eval(str)
    this.previousParam = result
    this.lastResult = result + ''
    this.pantalla.value = result
    this.showingResult = true
  }

  raiz() {
    if (!this.showingResult) {
      this.showingResult = false 
      this.igual()
    }
    else {
      this.previousParam = this.lastResult
      this.showingResult = false
    }
    this.igual()
    this.operacion = '√'
    this.currentParam = ''
  }

  signo() {
    if (this.pantalla.value.match(/[0-9]/g))
      this.pantalla.value = -Number(this.pantalla.value)
  }

  
  //Eventos de teclado
  keyEvent(key) {
    if (isFinite(key)) {
      this.digitos(key)
    } else {

      switch (key) {
        case '+':
          this.suma()
          break
        case '-':
          this.resta()
          break
        case 'x':
          this.multiplicacion()
          break
        case 'd':
          this.division()
          break
        case 'p':
          this.porcentaje()
          break
        case 'r':
          this.raiz()
          break
        case '.':
          this.punto()
          break
        case 's':
          this.signo()
          break
        case 'c':
          this.mrc()
          break
        case 'm':
          this.mMas()
          break
        case 'n':
          this.mMenos()
          break
        case 'Enter':
          this.igual()
          break
        case 'Backspace':
          this.borrar()
          break
        case 'Escape':
          this.reset()
          break
      }
    }

  }

}
