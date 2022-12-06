const url = 'https://www.goldapi.io/api/XAU/EUR'
const apiKey = 'goldapi-1g08kbtlb4vqx5t-io'
const gramToOz = 28.35

class GoldPriceCalculator {
  constructor() {
    this.prices = null
    this.inputUnit = null
    this.kilates = null 
    this.inputAmount = 0
    this.output = 0
    this.actualizarPrecios()
  }

  actualizarPrecios() {
    $('button').prop('disabled', true)
    $('input[type=button]').prop('disabled', true)
    $.ajax({
      dataType: 'json',
      method: 'GET',
      url: url,
      headers: { 'x-access-token': apiKey },
      success: ({ price_gram_18k, price_gram_20k, 
        price_gram_21k, price_gram_22k, 
        price_gram_24k}) => {
          this.prices = {
            price_gram_18k,
            price_gram_20k,
            price_gram_21k,
            price_gram_22k,
            price_gram_24k
          }
          $('tbody').empty()
          $('tbody').append(`<tr><td>24K</td><td>${this.prices.price_gram_24k}</td>€/g</tr>`)
          $('tbody').append(`<tr><td>22K</td><td>${this.prices.price_gram_22k}</td>€/g</tr>`)
          $('tbody').append(`<tr><td>21K</td><td>${this.prices.price_gram_21k}</td>€/g</tr>`)
          $('tbody').append(`<tr><td>20K</td><td>${this.prices.price_gram_20k}</td>€/g</tr>`)
          $('tbody').append(`<tr><td>18K</td><td>${this.prices.price_gram_18k}</td>€/g</tr>`)
      },
      error: (error) => console.error(error),
      complete: () => {
        $('button').prop('disabled', false)
        $('input[type=button]').prop('disabled', false)
      }
    })
  }

  calcularPrecio() {
    let amount = $('input[name=amount]').val()
    let unit = $('select[name=unit]').val()
    let k = $('select[name=kilates]').val()

    if (unit === 'g')
      amount = Number(amount)
    else if (unit === 'oz')
      amount = Number(amount) / gramToOz

    switch (k) {
      case '24k':
        this.kilates = 'price_gram_24k'
        break;
      case '22k':
        this.kilates = 'price_gram_22k'
        break;
      case '21k':
        this.kilates = 'price_gram_21k'
        break;
      case '20k':
        this.kilates = 'price_gram_20k'
        break;
      case '18k':
        this.kilates = 'price_gram_18k'
        break;
    }

    this.output = this.prices[this.kilates] * amount

    $('p').text(this.output.toFixed(4) + '€')
  }
}

const calculator = new GoldPriceCalculator()