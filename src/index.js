const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const exp = require('constants');
const app = express();
const port = 3000;
const route = require('./routes');
const db = require('./config/db');

//connect toi db
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
//http logger
// app.use(morgan('combined'));

//template engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

//localhost: 127.0.0.1
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
