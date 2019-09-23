let models = require('../models/argument.model')
let labelling = require('../tools/labelling')

exports.argument_create_post = (req, res) => {
    if(!req.body) {
      return res.status(400).send({error: 'Request body is missing'})
    }
  
    let model = models.getSchemeModel(req.body.scheme, req.body);
  
    model.save()
      .then(doc => {
        if(!doc || doc.length === 0) {
          return res.status(500).send(doc)
        }
        
        res.status(201).send(doc)
      })
      .catch(err => {
        res.status(500).json({error: err})
      })
}

exports.argument_detail_get = (req, res) => {
    if(!req.query.id) {
      return res.status(400).send({error: 'Missing URL parameter: id'})
    }
  
    let query = { _id: req.query.id }
    
    models.BaseArgumentModel.findOne(query)
      .then(doc => {
        if(doc === null) {
            res.status(500).json({error: 'Argument not found with given id'})
        } else {        
            res.status(200).json(doc)
        }
      })
      .catch(err => {
        res.status(500).json({error: err})
      })
}

exports.argument_update_put = (req, res) => {
    if(!req.query.id) {
      return res.status(400).send({error: 'Missing URL parameter: id'})
    }
  
    let query = { _id: req.query.id }
  
    models.BaseArgumentModel.findOneAndUpdate(query, req.body, {new: true})
      .then(doc => {
        res.json(doc)
      })
      .catch(err => {
        res.status(500).json({error: err})
      })
}

exports.argument_delete = (req, res) => {
    if(!req.query.id) {
      return res.status(400).send({error: 'Missing URL parameter: id'})
    }
  
    let query = { _id: req.query.id }
  
    models.BaseArgumentModel.findOneAndRemove(query)
      .then(doc => {
        res.json(doc)
      })
      .catch(err => {
        res.status(500).json({error: err})
      })
}

exports.argument_list_top = (req, res) => {
    let query = { parentId: null }
  
    models.BaseArgumentModel.find(query).limit(5)
      .then(doc => {
        res.json(doc)
      })
      .catch(err => {
        res.status(500).json({error: err})
      })
}

exports.argument_list_descendents = (req, res) => {
    if(!req.query.id) {
      return res.status(400).send({error: 'Missing URL parameter: id'})
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
      let data;
      
      if(arguments !== undefined) {
          data = arguments.reduce((obj, argument) => {
          argument = argument.toJSON()
          argument.children = []
  
          obj[argument._id] = argument
          return obj
        }, {})
  
        updateDataWithCalculatedDescendents(data, arguments)
      }

      return res.json(data)
    })
}

exports.argument_list_network = (req, res) => {
    if(!req.query.id) {
      return res.status(400).send({error: 'Missing URL parameter: id'})
    }
    if(!req.query.useLikes) {
      return res.status(400).send({error: 'Missing URL parameter: useLikes'})
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
      let argumentsMap = {};
      arguments.forEach((argument) => {
        argumentsMap[argument._id] = argument;
      });

      let nodesAndAttacks;
      if(arguments !== undefined) nodesAndAttacks = labelling.generateLabelledNodesAndEdges(argumentsMap, req.query.id, (req.query.useLikes === 'true'));
      return res.json(nodesAndAttacks)
    })
}

exports.argument_list_search = (req, res) => {
    const searchQuery = req.query.searchQuery;
  
    if(!searchQuery) {
      return res.status(400).send({error: 'Missing URL parameter: searchQuery'})
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
        res.status(500).json({error: err})
      })
}

exports.argument_list_user_submitted = (req, res) => {
    if(!req.query.uid) {
      return res.status(400).send({error: 'Missing URL parameter: uid'})
    }
  
    let query = { uid: req.query.uid }
  
    models.BaseArgumentModel.find(query, req.body)
      .then(doc => {
        res.json(doc)
      })
      .catch(err => {
        res.status(500).json({error: err})
      })
}

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