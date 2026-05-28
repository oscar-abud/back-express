const express = require('express')
const app = express()
const PORT = 8080

app.get('/', (_req, res) => {
  res.send('HOLA MUNDO')
})

app.listen(PORT, () => console.log(`App listen at port ${PORT} 💻`))