const mysql= require('mysql');

var pool = mysql.createPool({
    // connectionLimit : 300, //important
   connectTimeout: 60 * 60 * 1000,
    aquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    host     : 'localhost',
    user     : 'root',
   password : '1234',
    database : 'serv_me'
});

var getConnection = function (callback) {
  pool.getConnection(function (err, connection) {
      callback(err, connection);
  });
};

module.exports = getConnection;