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

// get a list of children of an argument
router.get('/argument/children', (req, res) => {
  if(!req.query.id) {
    return res.status(400).send('Missing URL parameter: id')
  }

  let query = { parentId: req.query.id }

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

module.exports = router
