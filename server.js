const express = require('express');
const app = express();
const routes = require('./routes/routes');
const pool = require('./models/database');

//Middleware

app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});


//Routes

app.use('/', routes);
app.use('/contacts', routes);

app.listen(process.env.PORT || 3000, () => {
    console.log('Web server is running on port ' + (process.env.PORT || 3000));
});

