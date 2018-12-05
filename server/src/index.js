let express = require('express')
let app = express()

let argumentRoute = require('./routes/argument')

let bodyParser = require('body-parser')

// taking any json string and creating an attribute called body (req.body)
app.use(bodyParser.json())

// adds the requests made to the server to the logs
app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
  next()
})

// /argument CRUD api requests
app.use(argumentRoute)

const PORT = 3001
app.listen(PORT, () => console.info(`Server has started on ${PORT}`))
