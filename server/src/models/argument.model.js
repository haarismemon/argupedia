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
  likes: [String],
  uid: { type: String, required: true },
  username: { type: String, required: true },
  criticalQuestionTag: String,
  criticalQuestion: String,
  agree: Boolean,
  title: { type: String, required: true },
  link: String,
}, options);
argumentSchema.set('timestamps', true);
argumentSchema.index({criticalQuestion: 'text', title: 'text'});

let BaseArgumentModel = mongoose.model('Argument', argumentSchema);


// **** Argument schemes **** //

actionSchema = new mongoose.Schema({
  circumstance: String, 
  action: String, 
  newCircumstance: String, 
  goal: String, 
  value: String
}, options);
actionSchema.index({'$**': 'text'});
ActionArgumentModel = BaseArgumentModel.discriminator('action', actionSchema);

expertSchema = new mongoose.Schema({
  source: String,
  domain: String,
  assertion: String
}, options);
expertSchema.index({'$**': 'text'});
ExpertArgumentModel = BaseArgumentModel.discriminator('expert', expertSchema);

popularSchema = new mongoose.Schema({
  proposition: String
}, options);
popularSchema.index({'$**': 'text'});
PopularArgumentModel = BaseArgumentModel.discriminator('popular', popularSchema);

positionToKnowSchema = new mongoose.Schema({
  source: String,
  proposition: String,
}, options);
positionToKnowSchema.index({'$**': 'text'});
PositionToKnowArgumentModel = BaseArgumentModel.discriminator('positionToKnow', positionToKnowSchema);

causeToEffectSchema = new mongoose.Schema({
  cause: String,
  effect: String,
  evidence: String,
}, options);
causeToEffectSchema.index({'$**': 'text'});
CauseToEffectArgumentModel = BaseArgumentModel.discriminator('causeToEffect', causeToEffectSchema);

function getSchemeModel(scheme, body) {
  let model;

  switch (scheme) {
    case "action":
      model = new ActionArgumentModel(body);
      break;
    case "expert":
      model = new ExpertArgumentModel(body);
      break;
    case "popular":
      model = new PopularArgumentModel(body);
      break;
    case "positionToKnow":
      model = new PositionToKnowArgumentModel(body);
      break;
    case "causeToEffect":
      model = new CauseToEffectArgumentModel(body);
      break;
    default:
      model = new BaseArgumentModel(body);
      break;
  }

  return model;
}

module.exports = {
  BaseArgumentModel,
  getSchemeModel
} 
