var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var port = process.env.PORT || 3000
var mongoose = require('mongoose');
var config = require('./config/db');

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

var Users = require('./routes/users')
var Colleges = require('./routes/colleges');

// Mongodb Config
mongoose.set('useCreateIndex', true);


//connected to database
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});

//checking the  database connected 
mongoose.connection.on('connected', () => {
  console.log('Connected to the database mongodb @27017');
});

//checking error 
mongoose.connection.on('error', (err) => {
  if (err) {
    console.log('Error in connecting the databse ' + err);
  }

});

//checking the database is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected');
});
//for users routes
app.use('/users', Users)
// for college routes
app.use('/colleges', Colleges)

// for implementing routes for checking routes is working of not
app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(port, function () {
  console.log('Server is running on port: ' + port)
})
