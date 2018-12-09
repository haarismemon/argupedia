let mongoose = require('mongoose')

const server = 'mongodb://localhost:27017'
const database = 'argupedia-db'

mongoose.connect(`${server}/${database}`, (err) => {
  console.log('Successfully connected')
})

let ArgumentSchema = new mongoose.Schema({
  criticalQuestion: String,
  agree: Boolean,
  scheme: { type: String, required: true },
  circumstance: String,
  action: String,
  newCircumstance: String,
  goal: String,
  value: String,
  parentId: String
})

ArgumentSchema.set('timestamps', true)

module.exports = mongoose.model('Argument', ArgumentSchema)
