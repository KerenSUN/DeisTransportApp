const
 mongoose = require( 'mongoose' );
 createError = require('http-errors');
 express = require('express');
 path = require('path');
 cookieParser = require('cookie-parser');
 logger = require('morgan');
 bodyParser = require('body-parser');
 util = require("util");
 unirest  = require("unirest");
 //used to read JSON file into node.js to ultimately save into mongoose
 fs = require("fs");
 assert = require('assert');
 VanShuttleSchedulesController = require('./controllers/VanShuttleSchedulesController');
 app = express();
 VanDaySchema = require('./models/VanDaySchema')
 VanDay = mongoose.model("vanday", VanDaySchema)
 ScheduleSchema = require('./models/ScheduleSchema')
 Schedule = mongoose.model("schedule", ScheduleSchema)
 EnterVanDays = require('./EnterVanDays');
 EnterSchedule = require('./EnterSchedule')
 Query = require('./Query')

console.log('API server listening...');


//mongoose.connect( mongoDB, function(err, db) {
//{ useNewUrlParser: true }
// here is where we connect to the database!
const mongoDB = process.env.MONGO_URI || 'mongodb://localhost/DeisTransportApp'
mongoose.connect( mongoDB ,{useNewUrlParser: true})
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // console.log("we are connected!")
});


// console.log(Query.getSchedule(1010))
// Query.getSchedule(1010).then(response => console.log(response)).catch(err => console.log("err2: "+err))
// Query.getTimesForStop(2010, "Rabb").then(response => console.log(response)).catch(err => console.log("err2: "+err))
// Query.getNextTime(2010, "Rabb").then(response => console.log(response.toLocaleTimeString())).catch(err => console.log("err2: "+err))
// Query.getVanScheduleID("campusVan")


// viewengine setup
app.set('views', path.join(__dirname, 'views'));
app.set('viewengine', 'pug');

//middleware to process the req object and make it more useful!
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// this handles all static routes ...
// so don't name your routes so they conflict with the public folders
app.use(express.static(path.join(__dirname, 'public')));


app.post('/webhook', VanShuttleSchedulesController.check_parameters,
                      VanShuttleSchedulesController.respondToDF);

// app.get('/skills', skillsController.getAllSkills );
// app.post('/saveSkill', skillsController.saveSkill );
// app.post('/deleteSkill', skillsController.deleteSkill );

app.use('/', function(req, res, next) {
  console.log("in / controller")
  res.render('index', { title: 'BranVan App' });
});



// EnterVanDays.enterVanDays(new Date(2018, 6, 18), new Date(2019, 6, 18), [true,true,true,true,true,true,true], 0, "campusVan")
// EnterVanDays.enterVanDays(new Date(2018, 6, 18), new Date(2019, 6, 18), [true,true,true,true,true,true,true], 0, "campusShuttle")
// EnterVanDays.enterVanDays(new Date(2018, 6, 18), new Date(2019, 6, 18), [true,true,true,true,true,true,true], 0, "walthamVan")
// EnterVanDays.enterVanDays(new Date(2018, 6, 18), new Date(2019, 6, 18), [true,true,true,true,true,true,true], 0, "walthamShuttle")
// EnterVanDays.enterVanDays(new Date(2018, 6, 18), new Date(2019, 6, 18), [true,true,true,true,true,true,true], 0, "cambridgeShuttle")

// Query.getStopNames(2010)
// .then(stops => console.log(stops))

// nowExact = new Date()
// console.log("nowExact.getYear(): "+nowExact.getYear())
// console.log("nowExact.getMonth(): "+nowExact.getMonth())
// console.log("nowExact.getDay(): "+nowExact.getDay())
// console.log("nowExact.getDate(): "+nowExact.getDate())
// now = new Date(nowExact.getFullYear(), nowExact.getMonth(), nowExact.getDate(), 4)
// console.log("now: "+now)
//
// today = new Date()
// console.log(new Date(Date.UTC(2000, 0, 1, 0, 45)))
// console.log(today)
nowUTC = new Date(Date.UTC())
console.log(nowUTC)

// EnterVanDays.enterVanDays(new Date(2018, 7, 25), new Date(2018, 11, 15), [false,true,true,true,true,true,false], 2010, "campusVan")
// EnterVanDays.enterVanDays(new Date(2018, 7, 25), new Date(2018, 11, 15), [true,false,false,false,false,false,true], 2011, "campusVan")






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
