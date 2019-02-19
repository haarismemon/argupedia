let mongoose = require('mongoose')

const server = 'mongodb://localhost:27017'
const database = 'debatably-db'

mongoose.connect(`${server}/${database}`, (err) => {
  console.log('Successfully connected')
});

let options = { discriminatorKey: 'scheme' };

let argumentSchema = new mongoose.Schema({
  originalId: String,
  parentId: String,
  ancestorIds: [String],
  uid: { type: String, required: true },
  criticalQuestion: String,
  agree: Boolean,
  title: { type: String, required: true },
}, options);
argumentSchema.set('timestamps', true);

let BaseArgumentModel = mongoose.model('Argument', argumentSchema);


// **** Argument schemes **** //

actionSchema = new mongoose.Schema({
  circumstance: String, 
  action: String, 
  newCircumstance: String, 
  goal: String, 
  value: String
}, options);
ActionArgumentModel = BaseArgumentModel.discriminator('action', actionSchema);

expertSchema = new mongoose.Schema({
  source: String,
  domain: String,
  assertion: String
}, options);
ExpertArgumentModel = BaseArgumentModel.discriminator('expert', expertSchema);

popularSchema = new mongoose.Schema({
  proposition: String
}, options);
PopularArgumentModel = BaseArgumentModel.discriminator('popular', popularSchema);

module.exports = {
  BaseArgumentModel,
  ActionArgumentModel,
  ExpertArgumentModel,
  PopularArgumentModel
} 
