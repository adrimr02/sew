class CalculadoraRPN {
  constructor() {
    this.stack = new Pila()
    this.pila = document.querySelector('textarea')
    this.input = document.querySelector('input[type=text][name="entrada"]')
    this.inputStr = ''
  }

  actualizaPila() {
    this.pila.value = ''
    for (let n of this.stack.pila) {
      this.pila.value += n + '\n'
    }
    this.pila.scrollTop = this.pila.scrollHeight
  }

  actualizaInput() {
    this.input.value = this.inputStr
  }

  reset() {
    this.inputStr = ''
    this.stack.clear()
    this.actualizaPila()
    this.actualizaInput()
  }

  borrar() {
    this.inputStr = this.inputStr.substring(0, this.inputStr.length-1)
    this.actualizaInput()
  }

  enter() {
    this.inputStr = this.inputStr.trim()
    if (this.inputStr !== '') {
      this.stack.push(Number(this.inputStr))
      this.inputStr = ''
      this.actualizaInput()
      this.actualizaPila()
    }
  }

  digitos(n) {
    this.inputStr += n
    this.actualizaInput()
  } 

  punto() {
    if (this.inputStr.length === 0) {
      this.inputStr += '0.'
    } else {
      if (!this.inputStr.match(/[.]/)) {
        this.inputStr += '.'
      }
    }
    this.actualizaInput()
  }

  signo() {
    if (this.inputStr.length > 0){
      this.inputStr = -Number(this.inputStr) + ''
      this.actualizaInput()
    }
  }

  getParams(n) {
    let result = []
    for (let i = 0; i < n; i++)
      result.push(this.stack.pop() || 0)

    return result.reverse()
  }

  error(msg) {
    this.reset()
    this.pila.value = 'ERROR: ' + msg
  }

  sumar() {
    let [firstParam, secondParam] = this.getParams(2)
    let result = firstParam + secondParam
    this.stack.push(result)
    this.actualizaPila()
  }

  restar() {
    let [firstParam, secondParam] = this.getParams(2)
    let result = firstParam - secondParam
    this.stack.push(result)
    this.actualizaPila()
  }

  multiplicar() {
    let [firstParam, secondParam] = this.getParams(2)
    let result = firstParam * secondParam
    this.stack.push(result)
    this.actualizaPila()
  }
  
  dividir() {
    let [firstParam, secondParam] = this.getParams(2)
    if (secondParam == 0) {
      this.error('No se puede dividir entre 0')
      return
    }
    let result = firstParam / secondParam
    this.stack.push(result)
    this.actualizaPila()
  }
  
  raiz() {
    let [param] = this.getParams(1)
    let result = Math.sqrt(param)
    this.stack.push(result)
    this.actualizaPila()
  }

  sin() {
    let [param] = this.getParams(1)
    param = param * Math.PI / 180
    let result = Math.sin(param)
    this.stack.push(result)
    this.actualizaPila()
  }

  cos() {
    let [param] = this.getParams(1)
    param = param * Math.PI / 180
    let result = Math.cos(param)
    this.stack.push(result)
    this.actualizaPila()
  }

  tan() {
    let [param] = this.getParams(1)
    param = param * Math.PI / 180
    let result = Math.tan(param)
    this.stack.push(result)
    this.actualizaPila()
  }

  arcsin() {
    let [param] = this.getParams(1)
    let result = Math.asin(param)
    result = result * 180/Math.PI
    this.stack.push(result)
    this.actualizaPila()
  }

  arccos() {
    let [param] = this.getParams(1)
    let result = Math.acos(param)
    result = result * 180/Math.PI
    this.stack.push(result)
    this.actualizaPila()
  }

  arctan() {
    let [param] = this.getParams(1)
    let result = Math.atan(param)
    result = result * 180/Math.PI
    this.stack.push(result)
    this.actualizaPila()
  }

  cuadrado() {
    let [firstParam] = this.getParams(1)
    let result = Math.pow(firstParam, 2)
    this.stack.push(result)
    this.actualizaPila()
  }

  potenciaDe() {
    let [firstParam, secondParam] = this.getParams(2)
    let result = Math.pow(firstParam, secondParam)
    this.stack.push(result)
    this.actualizaPila()
  }

  potenciaDeE() {
    let [firstParam] = this.getParams(1)
    let result = Math.exp(firstParam)
    this.stack.push(result)
    this.actualizaPila()
  }



  //###############
  //Eventos teclado
  //###############
  keyEvent(e) {
    let key = e.key
    if (isFinite(key)) {
      this.digitos(key)
    } else {

      switch (key) {
        case '+':
          this.sumar()
          break
        case '-':
          this.restar()
          break
        case 'x':
          this.multiplicar()
          break
        case 'd':
          this.dividir()
          break
        // case 'p':
        //   this.porcentaje()
        //   break
        case 'r':
          this.raiz()
          break
        case '.':
          this.punto()
          break
        case 's':
          this.signo()
          break
        case 'Enter':
          this.enter()
          break
        case 'Backspace':
          if (e.shiftKey)
            this.reset()
          else
            this.borrar()
          break
      }
    }

  }


}

class Pila {
  constructor() {
    this.pila = []
    this.size = 0
  }

  push(element) {
    this.size++
    this.pila.push(element)
  }

  pop() {
    if (this.pila.length == 0)
      return
      
    this.size--
    return this.pila.pop()
  }

  peek() {
    return this.pila[size-1]
  }

  clear() {
    this.size = 0
    this.pila = []
  }

}