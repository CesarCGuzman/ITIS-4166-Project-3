// Modules
const express = require('express');
const controller = require('../controllers/eventController.js');
const { fileUpload } = require('../middleware/fileUpload');

// Create a router
const router = express.Router();


//GET /events: index
router.get('/', controller.index);

//GET /events/new: send html form for creating a new event
router.get('/new', controller.new);

//POST /events: create a new event
router.post('/', fileUpload, controller.create);

//GET /events/:id: show a specific event
router.get('/:id', controller.show);

//GET /events/:id/edit: send html form for editing a specific event
router.get('/:id/edit', controller.edit);

//PUT /events/:id: update a specific event
router.put('/:id', fileUpload, controller.update);

//DELETE /events/:id: delete a specific event
router.delete('/:id', controller.delete);

// Export the router
module.exports = router;