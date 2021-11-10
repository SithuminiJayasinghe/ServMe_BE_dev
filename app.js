var express = require('express');
var path = require('path');
var cors = require('cors');

// var companyRouter = require('./routes/company');
var locationRouter = require('./routes/location');
var deviceRouter = require('./routes/device');
var itemRouter = require('./routes/item');
var userRouter = require('./routes/user');
var shopRouter = require('./routes/shop');
var districtRouter = require('./routes/district');
var cityRouter = require('./routes/city');
var categoryRouter = require('./routes/category');

var mysqlPool = require('./config/mysqlConnection');

global.logger = require('./config/log');

var app = express();
app.use(cors());


const port = 5102;
const service = 'ServMe Service';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use('/company', companyRouter);
app.use('/location', locationRouter);
app.use('/device', deviceRouter);
app.use('/item', itemRouter);
app.use('/user', userRouter);
app.use('/shop', shopRouter);
app.use('/district', districtRouter);
app.use('/city', cityRouter);
app.use('/category', categoryRouter);
app.use(express.static(__dirname + '/public'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var requestedUrl = req.protocol + '://' + req.get('Host') + req.url;
   logger.error('Inside \'resource not found\' handler , Req resource: ' + requestedUrl);

    return res.sendStatus(404);
});


// error handler
app.use(function(err, req, res, next) {

  logger.error('Error handler:', err);
    res.sendStatus(500);
});

app.listen(port, ()=>{
  logger.info(service + ' started on port ' + port);
});

module.exports = app;
