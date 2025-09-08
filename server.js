const express = require('express');
const app = express();
const routes = require('./routes/routes');
const pool = require('./models/database');

// Set up view engine
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});


//Routes

app.use('/', routes);

app.listen(process.env.PORT || 3000, () => {
    console.log('Web server is running on port ' + (process.env.PORT || 3000));
});

