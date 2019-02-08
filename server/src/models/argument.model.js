let mongoose = require('mongoose')

const server = 'mongodb://localhost:27017'
const database = 'debatably-db'

mongoose.connect(`${server}/${database}`, (err) => {
  console.log('Successfully connected')
})

let ArgumentSchema = new mongoose.Schema({
  originalId: String,
  parentId: String,
  ancestorIds: [String],
  uid: { type: String, required: true },
  criticalQuestion: String,
  agree: Boolean,
  scheme: { type: String, required: true },
  title: { type: String, required: true },
  circumstance: String, //action
  action: String, //action
  newCircumstance: String, //action
  goal: String, //action
  value: String, //action
  source: String, //expert
  domain: String, //expert
  assertion: String, //expert
  proposition: String //popular
})
ArgumentSchema.set('timestamps', true)

module.exports = mongoose.model('Argument', ArgumentSchema)
