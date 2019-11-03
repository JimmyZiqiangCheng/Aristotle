const express = require('express');
let app = express();
const mongoose = require('mongoose');
var morgan = require('morgan');
let config = require('config'); // load db location from config
const port = 8000||process.env.PORT;

//db options
let options = {
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30,
  useCreateIndex: true
};
// db connection
mongoose.Promise = global.Promise;
//console.log('Prepare to connect to: ', process.env.MONGODB_URI);
//process.env.MONGODB_URI

const mongoURI = "mongodb://sep:123abc@ds063870.mlab.com:63870/sep_project";

mongoose.connect(mongoURI ||process.env.MONGODB_URI || config.DB_URI, options).then(
  () => {
    console.log('Successfully connected to the database',mongoURI);
  },
  err => {
    console.log('Could not connect to the database, Exiting the app now...', err);
    process.exit();
  }
);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error:'));

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

// parse application/json
app.use(express.json());
app.use((error, req, res, next) => {
  if(error instanceof SyntaxError) {
    // handle SyntaxError for JSON format invalid (prevent revealing server info)
    return res.status(500).json({error: "Invalid input data (make sure it is in json format)"});
  } else {
    next();
  }
});
app.use(express.urlencoded({
  extended: true
}));
app.use(express.text());
app.use(express.json({
  type: 'application/json'
}));

app.get('/', (req, res) => res.json({
  message: "Welcome ... You are on broard... ^_^"
}));

// Setup Routes
const courseRouter = require('./routes/courseRouter');
const userRouter = require('./routes/userRouter');
const apiRouter = require('./routes/apiRouter');
app.use('/api', apiRouter);
app.use('/api/courses', courseRouter);
app.use('/api/users', userRouter);

app.listen(port, () => {
  console.log(`Start server on port:${port}`);
});

module.exports = app // for testing only