
import request from 'request'
import { load } from 'cheerio'

const API = 'http://www.ahumadaonline.cl/ventaweb/mobil/'

/*
  Private methods
*/

function r (payload, cb) {
  payload.uri = `${API}${payload.uri}`

  request(payload, (error, response, body) => {
    cb(error, body)
  })
}

class Ahumada {

  constructor () {
    this.cities = [
      { id: 1, name: 'Los Andes' },
      { id: 2, name: 'San Felipe' },
      { id: 3, name: 'Santiago Los Heroes' }
    ]

    this.horary = [
      { 'id': 1, name: 'Todo' },
      { 'id': 2, name: 'Mañana' },
      { 'id': 3, name: 'Tarde' },
      { 'id': 4, name: 'Noche' }
    ]
  }

  /**
   * Obtener los servicios disponibles, de acuerdo a la
   * fecha y horario (Sale, Llega, Tipo de Servicio, Tarifa)
   *
   * @param {String} city ciudad de origen
   * @param {String} date fecha de viaje
   * @param {String} horary horario
   * @param {Number} passages número de pasajes
   *
   * to
   * @param {String} city ciudad de destino
   * @return {Function} cb(error, result)
   */

  goFrom (city, date, horary = 'Todo', passages = 1) {
    if (!city) throw new Error('city argument is required')
    if (!date) throw new Error('date argument is required')

    if (typeof city !== 'string') {
      throw new Error('city must be a string')
    }

    // buscar objetos disponibles en la plataforma

    city = this.cities.find((c) => {
      return c.name.toLowerCase() === city.toLowerCase()
    })
    horary = this.horary.find((h) => {
      return h.name.toLowerCase() === horary.toLowerCase()
    })

    if (!city) throw new Error('incorrect city')
    if (!horary) throw new Error('incorrect horary')

    let payload = {
      'ciudad_salida': city.id,
      'pasajes': passages,
      'radio': 2,
      'fecha_salida': date,
      'horario_salida': horary.id
    }

    return {
      to: (city, cb) => {
        if (!city) throw new Error('city destiny argument is required')

        if (typeof city !== 'string') {
          throw new Error('city must be a string')
        }

        city = this.cities.find((c) => {
          return c.name.toLowerCase() === city.toLowerCase()
        })

        if (!city) throw new Error('incorrect city')

        payload.ciudad_llegada = city.id

        r({
          uri: 'ventamovil2.asp',
          method: 'POST',
          form: payload
        }, (err, body) => {
          const $ = load(body, { normalizeWhitespace: true })
          const data = $('table[class=data]').children().map((i, el) => {
            if (i > 2) {
              const values = $(el).text().split(' ').filter(Boolean)

              const onclick = load(el)('input').attr('onclick')
              const idServicioSalida = /\('id_servicio_salida'\).value=(\d*)/.exec(onclick)[1]
              const idPlanillaSalida = /\('id_planilla_salida'\).value=(\d*)/.exec(onclick)[1]

              return {
                sale: values[0],
                llega: values[1],
                servicio: `${values[2]} ${values[3]}`,
                tarifa: values[4],
                id_servicio_salida: parseInt(idServicioSalida),
                id_planilla_salida: parseInt(idPlanillaSalida)
              }
            }
          }).get()

          cb(err, data)
        })
      }
    }
  }

  /**
   * Conseguir los asientos libres y ocupados
   *
   * @param {Number} idServicioSalida identificador
   * @return {Function} cb(error, result)
   **/

  getSeatsAvailable (idServicioSalida, cb) {
    if (!idServicioSalida) throw new Error('idServicioSalida argument is required')

    if (typeof idServicioSalida !== 'number') {
      throw new Error('idServicioSalida must be a number')
    }

    r({
      uri: 'ventamovil3.asp',
      method: 'POST',
      form: { id_servicio_salida: idServicioSalida }
    }, (err, body) => {
      const $ = load(body)
      const seats = $('.tabla_bus2 table').children().map((i, rows) => {
        // guarda valor previo (nombre de clase css)
        let prev

        const seats = load(rows)('tr').children().map((i, seat) => {
          const number = parseInt($(seat).text())

          if (!number) {
            prev = $(seat).attr('class')
          } else {
            return {
              asiento: number,
              estado: (prev === 'td_asiento_free') ? 'libre' : 'ocupado'
            }
          }
        }).get()

        return seats
      }).get()

      cb(err, seats)
    })
  }
}

module.exports = new Ahumada()
