// Importing mongo client from database.js
const MongoClient = require('../models/database').MongoClient;

// Importing ObjectId to convert string id to MongoDB ObjectId
const ObjectId = require('mongodb').ObjectId;

// Controller functions

// Home page controller
async function homePage(req, res) {
    res.status(200).send('Welcome to the Home Page');
}


// Get all contacts
async function getAllContacts(req, res) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const contacts = await client.db("CSE341").collection("contacts").find().toArray();
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
}

// Get contact by ID
async function getContactById(req, res) {
    const userId = new ObjectId(req.params.id);
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const contact = await client.db("CSE341").collection("contacts").findOne({ _id: userId });
        if (contact) {
            res.status(200).json(contact);
        } else {
            res.status(404).json({ message: "Contact not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
}


module.exports = { getAllContacts, getContactById, homePage };