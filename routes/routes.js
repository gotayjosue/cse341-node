const express = require('express');

const router = new express.Router();
const controllers = require('../controllers/homeController');

// Project routes
router.get('/', controllers.professionalPage);

module.exports = router;