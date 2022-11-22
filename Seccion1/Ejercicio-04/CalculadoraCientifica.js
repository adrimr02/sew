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
    this.usedMemoria = false
  }

  #actualizaBotones() {
    if (this.isShift) {
      if (this.isHyp) {
        document.querySelector('input[name="sin"]').value = 'arcsinh'
        document.querySelector('input[name="cos"]').value = 'arccosh'
        document.querySelector('input[name="tan"]').value = 'arctanh'
      } else {
        document.querySelector('input[name="sin"]').value = 'arcsin'
        document.querySelector('input[name="cos"]').value = 'arccos'
        document.querySelector('input[name="tan"]').value = 'arctan'
      }
      document.querySelector('input[name="log"]').value = 'ln'
      document.querySelector('input[name="root"]').value = '3√'
      document.querySelector('input[name="base"]').value = '2^x'
    } else {
      if (this.isHyp) {
        document.querySelector('input[name="sin"]').value = 'sinh'
        document.querySelector('input[name="cos"]').value = 'cosh'
        document.querySelector('input[name="tan"]').value = 'tanh'
      } else {
        document.querySelector('input[name="sin"]').value = 'sin'
        document.querySelector('input[name="cos"]').value = 'cos'
        document.querySelector('input[name="tan"]').value = 'tan'
      }
      document.querySelector('input[name="log"]').value = 'log'
      document.querySelector('input[name="root"]').value = '2√'
      document.querySelector('input[name="base"]').value = '10^x'
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
    super.reset(false)
    this.pantalla.value = '0'
  }

  borrarTodo() {
    super.borrar()
    this.pantalla.value = '0'
  }

  borrar() {
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
  
  hyp() {
    this.isHyp = !this.isHyp
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
    // const decimal = '[\-]{0,1}[0-9]+[\.][0-9]+|[\-]{0,1}[0-9]+' //Regex que selecciona cualquier numero real

    /**
     * Regex para seleccionar los numeros que forma parte de una potencia 'x ^ y'
     */
    const potenciaRegex = /([\-]{0,1}[0-9]+[\.][0-9]+|[\-]{0,1}[0-9]+) \^ ([\-]{0,1}[0-9]+[\.][0-9]+|[\-]{0,1}[0-9]+)/

    let str = this.registro.value
    str = str.replace('÷', '/')
    str = str.replace('Mod', '%')
    let isPotencia = str.match(potenciaRegex)
    if (isPotencia) {
      str = str.replace(potenciaRegex, `Math.pow(${isPotencia[1]},${isPotencia[2]})`)
    }

    return str
  }

  igual() {
    if (this.showingResult) {
      this.registro.value = this.registro.value.substring(
        this.registro.value.lastIndexOf(this.operacion), 
        this.registro.value.length)
      this.registro.value = this.pantalla.value + ' ' + this.registro.value
    } else
      this.registro.value += this.pantalla.value
    try {
      let str = this.#parse()      
      let result = Number(eval(str))
      this.pantalla.value = result
      this.lastResult = result
      this.newInput = true
      this.showingResult = true
    } catch(e) {
      console.log(e)
      super.error('Error')
    }
  }

  abreP() {

  }

  cierraP() {
    
  }

  #preparaOperacion() {
    if (this.showingResult) {
      this.registro.value = this.lastResult + ''
      this.showingResult = false
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
    this.newInput = true
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

  cuadrado() {
    this.pantalla.value = Math.pow(Number(this.pantalla.value), 2)
    this.newInput = true
  }

  potencia() {
    this.#preparaOperacion()
    this.registro.value += ' ^ '
    this.operacion = '^'
    this.newInput = true
  }

  base10() {
    this.pantalla.value = Math.pow(10, Number(this.pantalla.value))
    this.newInput = true
  }
  
  base2() {
    this.pantalla.value = Math.pow(2, Number(this.pantalla.value))
    this.newInput = true
  }

  log() {
    if (this.isShift)
      this.pantalla.value = Math.log(Number(this.pantalla.value))
    else
      this.pantalla.value = Math.log10(Number(this.pantalla.value))

    this.newInput = true
  }

  sin() {
    if (this.isShift)
      if (this.isHyp)
        this.pantalla.value = this.#transformUnitOut(Math.asinh(Number(this.pantalla.value)))
      else
        this.pantalla.value = this.#transformUnitOut(Math.asin(Number(this.pantalla.value)))
    else
      if (this.isHyp)
        this.pantalla.value = Math.sinh(this.#transformUnitIn(Number(this.pantalla.value)))
      else
        this.pantalla.value = Math.sin(this.#transformUnitIn(Number(this.pantalla.value)))
    
    this.newInput = true
  }

  cos() {
    if (this.isShift)
      if (this.isHyp)
        this.pantalla.value = this.#transformUnitOut(Math.acosh(Number(this.pantalla.value)))
      else
        this.pantalla.value = this.#transformUnitOut(Math.acos(Number(this.pantalla.value)))
    else
      if (this.isHyp)
        this.pantalla.value = Math.cosh(this.#transformUnitIn(Number(this.pantalla.value)))
      else
        this.pantalla.value = Math.cos(this.#transformUnitIn(Number(this.pantalla.value)))
    
    this.newInput = true
  }
  tan() {
    if (this.isShift)
      if (this.isHyp)
        this.pantalla.value = this.#transformUnitOut(Math.atanh(Number(this.pantalla.value)))
      else
        this.pantalla.value = this.#transformUnitOut(Math.atan(Number(this.pantalla.value)))
    else
      if (this.isHyp)
        this.pantalla.value = Math.tanh(this.#transformUnitIn(Number(this.pantalla.value)))
      else
        this.pantalla.value = Math.tan(this.#transformUnitIn(Number(this.pantalla.value)))

    this.newInput = true
  }

  raiz() {
    if (this.isShift)
      this.pantalla.value = Math.cbrt(Number(this.pantalla.value))
    else
      this.pantalla.value = Math.sqrt(Number(this.pantalla.value))

    this.newInput = true
  }

  #transformUnitIn(n) {
    if (this.isRadians)
      return n
    else 
      return n * Math.PI / 180
  }

  #transformUnitOut(n) {
    if (this.isRadians)
      return n
    else 
      return n * 180 / Math.PI
  }

  #updateMemoryBtns() {
    if (this.usedMemoria) {
      document.querySelector('input[value=MC]').disabled=false
      document.querySelector('input[value=MR]').disabled=false
    } else {
      document.querySelector('input[value=MC]').disabled=true
      document.querySelector('input[value=MR]').disabled=true
    }
  }

  mc() {
    this.memoria = 0
    this.usedMemoria = false
    this.#updateMemoryBtns()
  }

  mr() {
    this.pantalla.value = this.memoria
    this.#updateMemoryBtns()
  }

  mMas() {
    this.memoria += Number(this.pantalla.value)
    this.usedMemoria = true
    this.#updateMemoryBtns()
  }

  mMenos() {
    this.memoria -= Number(this.pantalla.value)
    this.usedMemoria = true
    this.#updateMemoryBtns()
  }
  
  ms() {
    this.memoria = Number(this.pantalla.value)
    this.usedMemoria = true
    this.#updateMemoryBtns()
  }


  keyEvent(e) {
    if (e.shiftKey && e.key == 'Backspace') {
      this.borrarTodo()
    } else if (e.shiftKey) {
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