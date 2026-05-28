const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 8080

app.use(express.json())

const url = 
    'mongodb+srv://oscpalma_db_user:soyLaPass123456@cluster0.a60lnid.mongodb.net/actividad_fullstackIII?retryWrites=true&w=majority&appName=Cluster0'

mongoose
  .connect(url)
  .then(() => {
    console.log('Conectado a MongoDB')
    app.listen(PORT, () => console.log(`App listen at port ${PORT} 💻`))
  })
  .catch((error) => console.error('Error al conectar a MongoDB:', error))

app.get('/', (_req, res) => {
  res.send('HOLA MUNDO')
})

app.get('/user', (_req, res) => {
  res.json({ message: 'Ruta user funcionando' })
})

/*
El problema era que Node.js tiene su propio resolvedor DNS interno que no usa el DNS configurado en Windows.

Cuando cambias el DNS en la configuración de red de Windows a 8.8.8.8, eso afecta al sistema operativo y los navegadores, pero Node.js resuelve DNS de forma independiente usando las librerías del sistema de bajo nivel, que en tu caso seguían apuntando al DNS de tu red (probablemente del router o ISP) que no soporta registros SRV.

El protocolo mongodb+srv:// necesita hacer una consulta DNS especial llamada SRV record para descubrir las IPs del cluster. Tu DNS local la rechazaba (ECONNREFUSED).

Al agregar esto al inicio del código:


dns.setServers(['8.8.8.8', '8.8.4.4'])
Forzamos a Node.js a usar el DNS de Google directamente, que sí soporta registros SRV, y la consulta funcionó correctamente.
*/