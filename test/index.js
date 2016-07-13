
import test from 'ava'
import ahumada from '../lib/index'

test('ahumada', t => {
  t.is(typeof ahumada, 'object')
})

test('cities', t => {
  t.is(typeof ahumada.cities, 'object')

  ahumada.cities.map((i, id) => { t.is(typeof id, 'number') })

  t.is(ahumada.cities[0].name, 'Los Andes')
  t.is(ahumada.cities[1].name, 'San Felipe')
  t.is(ahumada.cities[2].name, 'Santiago Los Heroes')
})

test('horary', t => {
  t.is(typeof ahumada.horary, 'object')

  ahumada.cities.map((i, id) => { t.is(typeof id, 'number') })

  t.is(ahumada.horary[0].name, 'Todo')
  t.is(ahumada.horary[1].name, 'Mañana')
  t.is(ahumada.horary[2].name, 'Tarde')
  t.is(ahumada.horary[3].name, 'Noche')
})

/*

  Methods

*/

test.cb('goFrom', t => {
  ahumada.goFrom('Los Andes', '12-07-2016').to('Santiago Los Heroes', (e, r) => {
    t.falsy(e)
    t.is(typeof r, 'object')
    t.end()
  })
})

test.cb('getSeatsAvailable', t => {
  ahumada.getSeatsAvailable(343833, (e, r) => {
    t.falsy(e)
    t.is(typeof r, 'object')
    t.end()
  })
})
