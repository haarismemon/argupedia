let mongoose = require('mongoose')

const server = 'mongodb://localhost:27017'
const database = 'argupedia-db'

mongoose.connect(`${server}/${database}`, (err) => {
  console.log('Successfully connected')
})

let ArgumentSchema = new mongoose.Schema({
  scheme: { type: String, required: true },
  circumstance: String,
  action: String,
  goal: String,
  value: String
})

ArgumentSchema.set('timestamps', true)

module.exports = mongoose.model('Argument', ArgumentSchema)
