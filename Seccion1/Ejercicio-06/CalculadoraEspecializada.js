class CalculadoraEspecializada extends CalculadoraRPN {
  constructor() {
    super()
    this.symMode = false
    this.opciones = document.querySelector('input[name="opciones"]')
  }


  //###################
  //Metodos especificos
  //###################

  /**
   * Dada una cadena de texto representando un polinomio, la procesa 
   * y transforma en un array de monomios.
   * @returns PoliArray con los monomios separados y ordenados o un 
   * numero si no se introducen variables simbolicas
   */
  #simplificarExp(str) {
    if (str.length == 0)
      return new PoliArray()
    
    let exps = str.split(/(?=[+-])/g) //Separa las monomios por + y -
    let maxOrder = 0
    let pExps = new PoliArray() //Lista con los monomios procesados y ordenados por su exponente
    for (let exp of exps) { //Encuentra el exponente maximo
      if (exp.match(/x$/) && maxOrder == 0)
        maxOrder = 1
      else if (exp.match(/x\^/)) {
          let order = exp.split('^')[1].trim()
          if (!order || !isFinite(order)) {
            super.error("Sintaxis incorrecta: Potencia sin exponente entero")
            return
          }
          if (Number(order) > maxOrder)
            maxOrder = Number(order)
      }
    }

    for (let i = 0; i < maxOrder + 1; i++) //Rellena la lista con un 0 para cada exponente
      pExps[i] = 0

    for (let exp of exps) {
      if (!exp.match('x'))
        pExps[0] += Number(exp)
      else if (exp.match(/x$/)) {
        let base = exp.replace('x', '')
        base = (!base || base == '+' || base == '-') ? base + '1' : base
        pExps[1] += Number(base)
      } else if (exp.match(/x\^/)) {
        let [base, order] = exp.split('x^')
        pExps[order] +=Number((!base || base == '+' || base == '-') ? base + '1' : base)
      }
      
    }

    if (pExps.length === 1)
      return pExps[0]

    return pExps
  }

  /**
   * Cambia entre el modo de calculo simbolico y el normal.
   */
  sym() {
    this.symMode = !this.symMode
    if (this.symMode) {
      this.opciones.value = 'sym'
    } else {
      this.opciones.value = ''
    }
  }

  /**
   * Simplifica la expresion en el input pero sin añadirla a la pila.
   */
  simplificar() {
    if (this.symMode) {
      this.inputStr = this.#simplificarExp(this.inputStr).toString()
      super.actualizaInput()
    }
  }

  /**
   * Dada una expresion simbolica y un numero, resuelve la funcion 
   * para ese numero.
   * El numero debe ser el primer parametro extraido de la pila y 
   * la funcion el segundo.
   */
  resolver() {
    if (this.symMode) {
      let [f, n] = super.getParams(2)
      console.log(f, n)
      if (!(f instanceof PoliArray)) {
        super.error('El primer parametro debe ser una funcion')
        return
      }
  
      if (!isFinite(n)) {
        super.error('El segundo parametro debe ser un numero')
      }
  
      let total = 0
      for (let i = 0; i < f.length; i++) {
        total += f[i] * Math.pow(n, i) 
      }
      
      this.stack.push(total)
      super.actualizaPila()

    }
  }

  integrar() {
    if (this.symMode) {
      let [f] = super.getParams(1)
      if (!(f instanceof PoliArray)) {
        super.error('El parametro debe ser una funcion')
        return
      }
      console.log(f)
      f.unshift(0)
      console.log(f)
      this.stack.push(f)
      super.actualizaPila()
    }
  }

  derivar() {
    if (this.symMode) {
      let [f] = super.getParams(1)
      if (!(f instanceof PoliArray)) {
        super.error('El parametro debe ser una funcion')
        return
      }
      f.shift()
      this.stack.push(f)
      super.actualizaPila()
    }
  }

  //#####################
  //Metodos sobreescritos
  //#####################
  enter() {
    if (!this.symMode) {
      super.enter()
    } else {
      let exp = this.#simplificarExp(this.inputStr)
      this.stack.push(exp)
      this.inputStr = ''
      this.actualizaInput()
      this.actualizaPila()
    }
  }

  signo() {
    if (!this.symMode) {
      super.signo()
    }
  }

  sumar() {
    if (this.symMode) {
      this.inputStr += '+'
      super.actualizaInput()
    } else {
      super.sumar()
    }
  }
  
  restar() {
    if (this.symMode) {
      this.inputStr += '-'
      super.actualizaInput()
    } else {
      super.restar()
    }
  }

  multiplicar() {
    if (!this.symMode)
      super.multiplicar()
  }

  dividir() {
    if (!this.symMode)
      super.dividir()
  }

  x() {
    if (this.symMode) {
      this.inputStr += 'x'
      super.actualizaInput()
    }
  }

  raiz() {
    if (!this.symMode)
      super.raiz()
  }

  sin() {
    if (!this.symMode)
      super.sin()
  }

  cos() {
    if (!this.symMode)
      super.cos()
  }

  tan() {
    if (!this.symMode)
    super.tan()
  }

  arcsin() {
    if (!this.symMode)
      super.arcsin()
  }

  arccos() {
    if (!this.symMode)
      super.arccos()
  }

  arctan() {
    if (!this.symMode)
      super.arctan()
  }

  cuadrado() {
    if (this.symMode) {
      this.inputStr += '^2'
      super.actualizaInput()
    } else {
      super.cuadrado()
    }
  }

  potenciaDe() {
    if (this.symMode) {
      this.inputStr += '^'
      super.actualizaInput()
    } else {
      super.potenciaDe()
    }
  }

  potenciaDeE() {
    if (!this.symMode) {
      super.potenciaDeE()
    }
  }

  keyEvent(e) {
    if (e.ctrlKey)
      return
    
    if (e.shiftKey && e.key == 'S')
      this.sym()
    else if (e.key == 'x' && this.symMode)
      this.x()
    else
      super.keyEvent(e)
    
  }

}

/**
 * Array espefico para almacenar y representar correctamente un polinomio
 */
class PoliArray extends Array {
  constructor() {
    super()
    //Define el prototipo para que funcione el instanceof
    Object.setPrototypeOf(this, PoliArray.prototype)
  }

  toString() {
    let str = ''
    for (let i = this.length-1; i >= 0; i--) {
      if (this[i] !== 0)
        if (i === this.length-1) {
          str += (this[i] < 0 ? '-' : '') + (Math.abs(this[i]) == 1 && i != 0 ? '' : Math.abs(this[i])) + (i > 0 ? (i > 1 ? `x^${i}` : 'x') : '')
        } else {
          str += (this[i] < 0 ? '-' : '+') + (Math.abs(this[i]) == 1 && i != 0 ? '' : Math.abs(this[i])) + (i > 0 ? (i > 1 ? `x^${i}` : 'x') : '')
        }
    }
    return '(f) ' + (str || '0')
  }

}

const calculadora = new CalculadoraEspecializada()

document.addEventListener('keydown', e => {
  calculadora.keyEvent(e)
})