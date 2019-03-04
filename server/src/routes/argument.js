let models = require('../models/argument.model')
let express = require('express')
let router = express.Router()
let labelling = require('./tools/labelling')

// create new argument
router.post('/argument', (req, res) => {
  if(!req.body) {
    return res.status(400).send('Request body is missing')
  }

  let model = models.getSchemeModel(req.body.scheme, req.body);

  // let model = new ArgumentModel(req.body)
  model.save()
    .then(doc => {
      if(!doc || doc.length === 0) {
        return res.status(500).send(doc)
      }

      res.status(201).send(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// get an argument
router.get('/argument', (req, res) => {
  if(!req.query.id) {
    return res.status(400).send('Missing URL parameter: id')
  }

  let query = { _id: req.query.id }

  models.BaseArgumentModel.findOne(query)
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// get a list of all root arguments
router.get('/argument/list', (req, res) => {
  let query = { parentId: null }

  models.BaseArgumentModel.find(query)
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// update argument
router.put('/argument', (req, res) => {
  if(!req.query.id) {
    return res.status(400).send('Missing URL parameter: id')
  }

  let query = { _id: req.query.id }

  models.BaseArgumentModel.findOneAndUpdate(query, req.body)
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// delete argument
router.delete('/argument', (req, res) => {
  if(!req.query.id) {
    return res.status(400).send('Missing URL parameter: id')
  }

  let query = { _id: req.query.id }

  models.BaseArgumentModel.findOneAndRemove(query)
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// get all arguments with their children as a key value, where the _id is the key
router.get('/argument/descendents', (req, res) => {
  if(!req.query.id) {
    return res.status(400).send('Missing URL parameter: id')
  } else if(req.query.id == 'undefined') {
    return res.status(400).send('ID URL parameter is undefined')
  }

  let query = { "$or": [
      { _id: req.query.id },
      {"$or": [ 
          { originalId: req.query.id },
          { ancestorIds: req.query.id }
        ]
      }
    ]
  }

  models.BaseArgumentModel.find(query, (err, arguments) => {
    let data = arguments.reduce((obj, argument) => {
      argument = argument.toJSON()
      argument.children = []

      obj[argument._id] = argument
      return obj
    }, {})

    updateDataWithCalculatedDescendents(data, arguments)

    return res.json(data)
  })
})

router.get('/argument/network', (req, res) => {
  if(!req.query.id) {
    return res.status(400).send('Missing URL parameter: id')
  }

  let query = { "$or": [
      { _id: req.query.id },
      {"$or": [ 
        { originalId: req.query.id },
        { ancestorIds: req.query.id }
      ]
    }
    ]
  }

  models.BaseArgumentModel.find(query, (err, arguments) => {
    let nodesAndAttacks = labelling.generateLabelledNodesAndEdges(arguments, req.query.id);
    return res.json(nodesAndAttacks)
  })
})

router.get('/argument/search', (req, res) => {
  const searchQuery = req.query.searchQuery;

  if(!searchQuery) {
    return res.status(400).send('Missing URL parameter: searchQuery')
  }

  let query = { $text: { $search: searchQuery } }

  // if query is 'all', then return all root arguments
  if(searchQuery === "all" || searchQuery === "/") {
    query = { parentId: null }
  }

  models.BaseArgumentModel.find(query)
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.get('/argument/userSubmittedArguments', (req, res) => {
  if(!req.query.uid) {
    return res.status(400).send('Missing URL parameter: uid')
  }

  let query = { uid: req.query.uid }

  models.BaseArgumentModel.find(query, req.body)
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

function updateDataWithCalculatedDescendents(data, arguments) {
  arguments.forEach(argument => {
      let parentArgument = data[argument.parentId]

      if(parentArgument) {
          let childrenList = parentArgument.children
          
          if(childrenList) {
              childrenList.push(argument._id)
          } else {
              childrenList = [ argument._id ]
          }        
      }
  })
}

module.exports = router
