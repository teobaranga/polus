const DocumentDBClient = require('documentdb').DocumentClient;
const config = require('./config');
const TaskList = require('./routes/tasklist');
const TaskDao = require('./models/taskDao');

const Users = require('./routes/users');
const UserDao = require('./models/userDao');

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
const taskDao = new TaskDao(docDbClient, config.databaseId, config.collectionId);
const taskList = new TaskList(taskDao);
taskDao.init();

const userDao = new UserDao(docDbClient, config.databaseId, config.collectionIdUsers);
const users = new Users(userDao);
userDao.init();

/** Users */
const usersRouter = express.Router();
usersRouter.get('/', users.getAllUsers.bind(users));
usersRouter.post('/signup', validate({body: UserSchema}), users.signUp.bind(users));

router.get('/', taskList.showTasks.bind(taskList));
router.post('/addtask', taskList.addTask.bind(taskList));
router.post('/completetask', taskList.completeTask.bind(taskList));
// app.set('view engine', 'jade');

router.use('/users', usersRouter);

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