let ArgumentModel = require('../models/argument.model')
let express = require('express')
let router = express.Router()

// create new argument
router.post('/argument', (req, res) => {
  if(!req.body) {
    return res.status(400).send('Request body is missing')
  }

  let model = new ArgumentModel(req.body)
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

  ArgumentModel.findOne(query)
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

  ArgumentModel.find(query)
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

  ArgumentModel.findOneAndUpdate(query, req.body)
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

  ArgumentModel.findOneAndRemove(query)
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
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

  ArgumentModel.find(query, (err, arguments) => {
    let data = {
      nodes: [],
      edges: []
    };
    
    arguments.forEach(argument => {
      let nodeTitle = argument.title ;
      nodeTitle = addNewlineInLabel(nodeTitle);

      data.nodes.push({ 
        id: argument._id, 
        label: nodeTitle
      })

      let argumentLabel = argument.criticalQuestion + ' (' + (argument.agree ? 'Agree' : 'Disagree') + ')';
      argumentLabel = addNewlineInLabel(argumentLabel);

      if(argument.parentId != null) {
        data.edges.push({ 
          from: argument._id, 
          to: argument.parentId,
          label: argumentLabel
        })
      }
    })

    return res.json(data)
  })
})

function addNewlineInLabel(label) {
  var result = "";
  var words = label.split(' ');
  var count = 0;

  words.forEach(word => {
    count += 1;

    if(count == 5) {
      result += word + "\n";
      count = 0;
    } else {
      result += word + " ";
    }
  })

  return result;
}

// get all arguments with their children as a key value, where the _id is the key
router.get('/argument/descendents', (req, res) => {
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

  ArgumentModel.find(query, (err, arguments) => {
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
