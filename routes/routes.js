const express = require('express');

const router = new express.Router();
const controllers = require('../controllers/contactController');

// Project routes
router.get('/', controllers.homePage);
router.get('/contacts', controllers.getAllContacts);
router.get('/contacts/:id', controllers.getContactById);

module.exports = router;