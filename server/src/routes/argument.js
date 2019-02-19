let models = require('../models/argument.model')
let express = require('express')
let router = express.Router()

// create new argument
router.post('/argument', (req, res) => {
  if(!req.body) {
    return res.status(400).send('Request body is missing')
  }

  let model;

  switch (req.body.scheme) {
    case "action":
      model = new models.ActionArgumentModel(req.body);
      break;
    case "expert":
      model = new models.ExpertArgumentModel(req.body);
      break;
    case "popular":
      model = new models.PopularArgumentModel(req.body);
      break;
    default:
      model = new models.BaseArgumentModel(req.body);
      break;
  }  

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
    let nodesAndAttacks = generateNodesAndAttacks(arguments);

    // categorises the arguments into labels: IN, OUT, and UNDEC
    const labelledNodes = groundedLabellingAlgorithm(nodesAndAttacks);

    // update the nodes with label colours
    nodesAndAttacks.nodes = colourArgumentNodes(labelledNodes);

    return res.json(nodesAndAttacks)
  })
})

function generateNodesAndAttacks(arguments) {
  let nodesAndAttacks = {
    nodes: [],
    edges: []
  };

  arguments.forEach(argument => {
    let nodeTitle = argument.title ;
    nodeTitle = addNewlineInLabel(nodeTitle);

    nodesAndAttacks.nodes.push({ 
      id: argument._id, 
      label: nodeTitle
    })

    let argumentLabel = argument.criticalQuestion + ' (' + (argument.agree ? 'Agree' : 'Disagree') + ')';
    argumentLabel = addNewlineInLabel(argumentLabel);

    if(argument.parentId != null) {
      if(argument._id != '5c570b4a90cebb4864b4a9c2') {
        nodesAndAttacks.edges.push({ 
          from: argument._id, 
          to: argument.parentId,
          label: argumentLabel
        })
      } else {
        // dummy edge from parent to child (child to parent already existing)
        nodesAndAttacks.edges.push({ 
          from: argument._id, 
          to: argument.parentId,
          label: argumentLabel,
          smooth: {type: 'curvedCW', roundness: 0.3}
        }, { 
          from: argument.parentId, 
          to: argument._id,
          label: "Alternative action (negative)",
          smooth: {type: 'curvedCW', roundness: 0.3}
        })
      }
    }
  })

  return nodesAndAttacks;
}

function groundedLabellingAlgorithm(nodesAndAttacks) {
  const allNodes = nodesAndAttacks.nodes;

  // start of with all labels being empty
  let currentLabelling = {
    in: [],
    out: []
  }

  let breakLoop = false;

  // keep repeating until previous iteration labelling = current iteration labelling
  while(!breakLoop) {
    let newLabelling = {
      in: [...currentLabelling.in],
      out: [...currentLabelling.out]
    }

    const unlabelledArguments = calculateUnlabelledArguments(currentLabelling, allNodes);

    // label x IN if it is not labelled, and all arguments that attack x are out
    unlabelledArguments.forEach(node => {
      // get all arguments that attack the current node
      const allAttackingArguments = getAllAttackingArguments(nodesAndAttacks, node);
      
      let allAttackingArgumentsAreOut = true;
      allAttackingArguments.forEach(attackingArgumentId => {
        // if attackingArgumentId is not in OUT then set to false
        if(!currentLabelling.out.some(a => a.id == attackingArgumentId)) {
          allAttackingArgumentsAreOut = false;
        }
      });

      // if all are out, then add node to IN
      if(allAttackingArgumentsAreOut) {
        newLabelling.in.push(node);
      }
    });

    // label x OUT if it is not labelled, and there is an argument that attacks it that is IN (in current iteration)
    unlabelledArguments.forEach(node => {
      // get all arguments that attack the current node
      const allAttackingArguments = getAllAttackingArguments(nodesAndAttacks, node);
      
      let oneAttackingArgumentIsIn = false;    
      allAttackingArguments.forEach(attackingArgumentId => {
        if(newLabelling.in.some(a => a.id == attackingArgumentId)) {
          oneAttackingArgumentIsIn = true;
        }
      });

      // if there is one attacking that is IN, then add node to OUT
      if(oneAttackingArgumentIsIn) {
        newLabelling.out.push(node);
      }
    });

    if(newLabelling.in.length === currentLabelling.in.length && 
        newLabelling.out.length === currentLabelling.out.length) {
      breakLoop = true;
    }
    
    currentLabelling = newLabelling;
  }

  // assign remaining arguments to the undecided label
  currentLabelling.undec = calculateUnlabelledArguments(currentLabelling, allNodes);

  return currentLabelling;

}

function colourArgumentNodes(labelledNodes) {
  let colouredNodes = []

  labelledNodes.in.forEach(inNode => {
    inNode.color = {
      background: "lime",
      border: "darkGreen",
      highlight: {
        background: "mediumSeaGreen",
        border: "darkGreen"
      }
    };
    colouredNodes.push(inNode);
  });
  
  labelledNodes.out.forEach(outNode => {
    outNode.color = {
      background: "orangered",
      border: "maroon",
      highlight: {
        background: "crimson",
        border: "maroon"
      }
    };
    outNode.font = {
      color: "white"
    }
    colouredNodes.push(outNode);
  });
  
  colouredNodes = colouredNodes.concat(labelledNodes.undec);

  return colouredNodes;
}

function calculateUnlabelledArguments(currentLabelling, allNodes) {
  const union = new Set(currentLabelling.in.concat(currentLabelling.out));
  return allNodes.filter(argument => !union.has(argument));
}

function getAllAttackingArguments(nodesAndAttacks, node) {
  let attackingArguments = [];

  nodesAndAttacks.edges.forEach(attack => {
    const attackingArgument = attack.from;
    const attackedArgument = attack.to;

    // store the attacking argument, if the argument being attacked matches the id of the provided node
    if(attackedArgument == node.id) {
      attackingArguments.push(attackingArgument);
    }
  });

  return attackingArguments;
}

function addNewlineInLabel(label) {
  let result = "";
  let words = label.split(' ');
  let count = 0;

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
