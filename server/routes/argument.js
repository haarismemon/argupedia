let express = require('express')
let router = express.Router()

let argumentController = require('../controllers/argumentController')

// create new argument
router.post('/api/argument', argumentController.argument_create_post)

// get an argument
router.get('/api/argument', argumentController.argument_detail_get)

// update argument
router.put('/api/argument', argumentController.argument_update_put)

// delete argument
router.delete('/api/argument', argumentController.argument_delete)

// get a list of the top five debates
router.get('/api/arguments/topDebates', argumentController.argument_list_top)

// get all arguments with their children as a key value, where the _id is the key
router.get('/api/arguments/descendents', argumentController.argument_list_descendents)

// get the network data of a debate
router.get('/api/arguments/network', argumentController.argument_list_network)

// get a list of arguments that match the search query
router.get('/api/arguments/search', argumentController.argument_list_search)

// get a list of all the arguments a user has submitted
router.get('/api/arguments/userSubmittedArguments', argumentController.argument_list_user_submitted)

module.exports = router
