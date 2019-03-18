let express = require('express')
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

// /argument CRUD api requests
app.use(argumentRoute)

const PORT = 3001
app.listen(PORT, () => console.info(`Server has started on ${PORT}`))
