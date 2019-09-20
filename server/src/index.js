let express = require('express')
let mongoose = require('mongoose')
var cors = require('cors')
let app = express()

let argumentRoute = require('./routes/argument')

let bodyParser = require('body-parser')

// taking any json string and creating an attribute called body (req.body)
app.use(bodyParser.json())

app.use(cors());

// adds the requests made to the server to the logs
app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)

  // server responds with CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next()
})

const server = 'mongodb://localhost:27017'
const database = 'debatably-db'

mongoose.connect(process.env.MONGODB_URI || `${server}/${database}`, (err) => {
  console.log('Successfully connected')
});

const path = require('path')
app.use(express.static(path.join(__dirname, '../../client/build')))

// argument CRUD api requests
app.use(argumentRoute)

const PORT = process.env.PORT || 9000
app.listen(PORT, () => console.info(`Server has started on ${PORT}`))

module.exports = app;