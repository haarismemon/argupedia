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
    let nodesAndAttacks = generateNodesAndAttacks(arguments);

    const labelledNodes = groundedLabellingAlgorithm(nodesAndAttacks);

    console.log(labelledNodes);
    

    return res.json(nodesAndAttacks)
  })
})

function groundedLabellingAlgorithm(nodesAndAttacks) {
  const allNodes = nodesAndAttacks.nodes;

  // let previousLabelling = null;
  // start of with all labels being empty
  let currentLabelling = {
    in: [],
    out: [],
    undec: []
  }

  // TODO: if all arguments are being attacked then all arguments are undecided

  // keep repeating until previous iteration labelling = current iteration labelling
  let breakLoop = false;
  while(!breakLoop) {
    let newLabelling = {
      in: [],
      out: [],
      undec: []
    }

    const unlabelledArguments = calculateUnlabelledArguments(currentLabelling, allNodes);

    // in(Li+1) = in(Li) ∪ {x | x is not labelled in Li, and ∀y : if yRx then y ∈ out(Li) }
    // label x IN if it is not labelled, and all arguments that attack x are out
    unlabelledArguments.forEach(node => {
      // get all arguments that attack the current node
      const allAttackingArguments = getAllAttackingArguments(nodesAndAttacks, node);
      
      let allAttackingArgumentsAreOut = true;
      allAttackingArguments.forEach(attackingArgumentId => {
        if(!currentLabelling.out.some(a => a.id === attackingArgumentId)) {
          allAttackingArgumentsAreOut = false;
        }
      });

      // if all are out, then add node to IN
      if(allAttackingArgumentsAreOut) {
        newLabelling.in.push(node);
      }
    });

    // out(Li+1) = out(Li) ∪ {x | x is not labelled in Li, and ∃y : yRx and y ∈ in(Li+1) }
    // label x OUT if it is not labelled, and there is an argument that attacks it that is IN (in current iteration)
    unlabelledArguments.forEach(node => {
      // get all arguments that attack the current node
      const allAttackingArguments = getAllAttackingArguments(nodesAndAttacks, node);
      
      let oneAttackingArgumentIsIn = false;    
      allAttackingArguments.forEach(attackingArgumentId => {
        if(newLabelling.in.some(a => a.id === attackingArgumentId)) {
          oneAttackingArgumentIsIn = true;
        }
      });

      // if there is one attacking that is IN, then add node to OUT
      if(oneAttackingArgumentIsIn) {
        newLabelling.out.push(node);
      }
    });

    const newIn = currentLabelling.in.concat(newLabelling.in);
    const newOut = currentLabelling.out.concat(newLabelling.out);

    if(newIn.length === currentLabelling.in.length && newOut.length == currentLabelling.out.length) {
      breakLoop = true;
    }
    
    currentLabelling.in = newIn;
    currentLabelling.out = newOut;
    // console.log(currentLabelling);
    
  }
  // LG = (in(Li), out(Li), A − (in(Li) ∪ out(Li) )
  currentLabelling.undec = calculateUnlabelledArguments(currentLabelling, allNodes);

  return currentLabelling;

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
      nodesAndAttacks.edges.push({ 
        from: argument._id, 
        to: argument.parentId,
        label: argumentLabel
      })
    }
  })

  return nodesAndAttacks;
}

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
