const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override')

const SortMiddleware = require('./app/middlewares/sortMiddleware')

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
app.use(morgan('combined'));

app.use(methodOverride('_method'));

//custom middlewares
app.use(SortMiddleware);

//template engine
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field === sort.column ? sort.type : 'default';

                const icons = {
                    default: 'oi oi-elevator',
                    asc: 'oi oi-sort-ascending',
                    desc: 'oi oi-sort-descending',
                };

                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc',
                }
                const icon = icons[sortType];
                const type = types[sortType]

                return `<a href="?_sort&column=${field}&type=${type}">
                <span class="${icon}"></span>
                </a>`;
            }
        }
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
