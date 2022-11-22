class CalculadoraCientifica extends CalculadoraMilan {
  constructor() {
    super('input[type=text][name="input"]')
    this.pantalla.value = '0'
    this.registro = document.querySelector('input[type=text][name="operacion"]')
    this.newInput = false
    this.isShift = false
    this.isRadians = false
    this.isHyp = false
    this.isFe = false
    this.newOp = false
  }

  #actualizaBotones() {
    if (this.isShift) {
      document.querySelector('input[name="sin"]').value = 'arcsin'
      document.querySelector('input[name="cos"]').value = 'arccos'
      document.querySelector('input[name="tan"]').value = 'arctan'
      document.querySelector('input[name="log"]').value = 'ln'
    } else {
      document.querySelector('input[name="sin"]').value = 'sin'
      document.querySelector('input[name="cos"]').value = 'cos'
      document.querySelector('input[name="tan"]').value = 'tan'
      document.querySelector('input[name="log"]').value = 'log'
    }
    if (this.isRadians) {
      document.querySelector('input[name="rad"]').value = 'RAD'
    } else {
      document.querySelector('input[name="rad"]').value = 'DEG'
    }
  }

  reset() {
    this.registro.value = ''
    this.newInput = true
    this.newOp = false
    super.reset(false)
    this.pantalla.value = '0'
  }

  borrar() {
    super.borrar()
    this.pantalla.value = '0'
  }

  borrarUno() {
    this.pantalla.value = this.pantalla.value.substring(0, this.pantalla.value.length - 1)
    if (this.pantalla.value.length === 0)
      this.pantalla.value = '0'
  }

  shift() {
    this.isShift = !this.isShift
    this.#actualizaBotones()
  }
  
  rad() {
    this.isRadians = !this.isRadians
    this.#actualizaBotones()
  }
  
  digitos(num) {
    if (this.newInput) {
      this.pantalla.value = '0'
      this.newInput = false
    }
    if (this.pantalla.value.length === 1 && this.pantalla.value === '0')
      if (num === 0)
        return
      else
        this.pantalla.value = num
    else
      this.pantalla.value += num
  }

  punto() {
    if (!this.pantalla.value.match(/\./g))
      this.pantalla.value += '.'
  }

  #parse() {
    let str = this.registro.value
    str = str.replace('÷', '/')
    str = str.replace('Mod', '%')

    return str
  }

  cuadrado() {
    this.pantalla.value = Math.pow(Number(this.pantalla.value), 2)
  }

  igual() {
    if (this.newOp) {
      this.registro.value = this.registro.value.substring(
        this.registro.value.lastIndexOf(this.operacion), 
        this.registro.value.length)
      this.registro.value = this.pantalla.value + ' ' + this.registro.value
    } else
      this.registro.value += this.pantalla.value
    try {
      let str = this.#parse()      
      let result = eval(str)
      this.pantalla.value = result
      this.lastResult = result
      this.newInput = true
      this.newOp = true
    } catch(e) {
      console.log(e)
      super.error('Error')
    }
  }

  #preparaOperacion() {
    if (this.newOp) {
      this.registro.value = this.lastResult + ''
      this.newOp = false
    }
    else
      this.registro.value += this.pantalla.value
  }

  suma() {
    this.#preparaOperacion()
    this.registro.value += ' + '
    this.operacion = '+'
    this.newInput = true
  }
  
  resta() {
    this.#preparaOperacion()
    this.registro.value += ' - '
    this.operacion = '-'
    this.newInput = true
  }

  multiplicacion() {
    this.#preparaOperacion()
    this.registro.value += ' * '
    this.newInput = true
  }
 
  division() {
    this.#preparaOperacion()
    this.registro.value += ' ÷ '
    this.operacion = '÷'
    this.newInput = true
  }

  pi() {
    this.pantalla.value = Math.PI
    this.newInput = true
  }

  factorial() {
    let number = Number(this.pantalla.value)
    let result = 1
    if (number % 1 != 0 || number<0){
        result = this.#gamma(number + 1);
    }
    else {
        if(number == 0) {
          result = 1;
        }
        for(var i = number; --i; ) {
          number *= i;
        }
        result = number;
    }
    this.pantalla.value = result
  }

  #gamma(z) {
    return Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
  }

  modulo() {
    this.#preparaOperacion()
    this.registro.value += ' Mod '
    this.operacion = 'Mod'
    this.newInput = true
  }

  keyEvent(e) {
    if (e.shiftKey) {
      this.shift()
    } else {
      super.keyEvent(e.key)
    }
  }

}

const calculadora = new CalculadoraCientifica()

document.addEventListener('keydown', e => {
  calculadora.keyEvent(e)
})