const connect_mogo = require('./db')
const express = require('express')
var cors = require('cors')
require('dotenv').config();
connect_mogo();


const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
// Available Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

// app.listen(port, '0.0.0.0', () => {
//   console.log("Server running on 0.0.0.0:5000");
// });

