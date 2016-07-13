# Api de Buses Ahumada

Librería para usar los servicios de [Buses Ahumada (Chile)](http://www.ahumadaonline.cl/ventaweb/inicio.asp).

## Instalación

```
npm i ahumada
```

## Uso en Node.js

```js
var ahumada = require('ahumada')

// Listar ciudades disponibles para el viaje
var cities = ahumada.cities
console.log(cities)

// Listar horarios disponibles
var horary = ahumada.horary
console.log(horary)
```

## Metodos Soportados

### goFrom(city1, date, horary, passages).to(city2, callback)

Obtener los servicios disponibles, segun la ciudad de origen, fecha de viaje (formato: `dd-mm-aaaa`), horario deseado (opcional), cantidad de pasajes (opcional) y la ciudad de destino.

```js
ahumada.goFrom('Los Andes', '13-07-2016').to('Santiago Los Heroes', function (err, services) {
  console.log(err, services)
})
```

### getSeatsAvailable(idServicioSalida, callback)

Conseguir los asientos libres y ocupados.

```js
ahumada.getSeatsAvailable(360646, function (err, seats) {
  console.log(err, seats)
})
```

## Testing :green_heart::green_heart::green_heart:

```
npm test
```
