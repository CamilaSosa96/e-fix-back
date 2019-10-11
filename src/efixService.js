const express = require('express')
const app = express()
const router = require('./efixRouter')

app.use(router)

app.listen(5000, () => {
  console.log('E-FIX service running on http://localhost:5000')
})