const DocumentDBClient = require('documentdb').DocumentClient;
const config = require('./config');

const Users = require('./routes/users');
const UserDao = require('./models/userDao');

const Offices = require('./routes/offices');
const OfficeDao = require('./models/officeDao');

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { Validator, ValidationError } = require('express-json-validator-middleware');

const UserSchema = require('./schemas/UserSchema');

const app = express();
const router = express.Router(); // get an instance of the express Router

// Initialize a Validator instance first
const validator = new Validator({allErrors: true}); // pass in options to the Ajv instance
// Define a shortcut. It is perfectly okay to use validator.validate() as middleware, this just makes it easier
const validate = validator.validate.bind(validator);

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Todo App:
const docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});

const userDao = new UserDao(docDbClient, config.databaseId, config.collectionIdUsers);
const users = new Users(userDao);
userDao.init();

const officeDao = new OfficeDao(docDbClient, config.databaseId, config.collectionIdOffices);
const offices = new Offices(officeDao);
officeDao.init();

/** Users */
const usersRouter = express.Router();
usersRouter.post('/signup', validate({body: UserSchema.signUp}), users.signUp.bind(users));
usersRouter.post('/login', validate({body: UserSchema.logIn}), users.login.bind(users));

/** Offices */
const officesRouter = express.Router();
officesRouter.post('/setup', offices.setup.bind(offices));
officesRouter.get('/', offices.getOffices.bind(offices));

// app.set('view engine', 'jade');

router.use('/users', usersRouter);
router.use('/offices', officesRouter);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    if (err.name === 'JsonSchemaValidationError') {
        console.log(err.message);

        // Bad Request
        res.status(400).json({
            statusText: 'Bad Request',
            jsonSchemaValidation: true,
            validations: err.validations  // All of your validation information
        });
    } else {
        res.status(err.status || 500);
        res.json({ message: "You messed up"});
    }
});

module.exports = app;
