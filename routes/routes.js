const express = require('express');
const router = new express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const controllers = require('../controllers/contactController');

// Project routes

router.get('/', controllers.homePage);

/**
 * @swagger
 * /contacts:
 *   get:
 *     description: Get all contacts
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/contacts', controllers.getAllContacts);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     description: Get contact by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Contact not found
 */
router.get('/contacts/:id', controllers.getContactById);
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
module.exports = router;