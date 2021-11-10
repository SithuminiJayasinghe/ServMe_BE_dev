var express = require('express');
var router = express.Router();
var mysqlPool = require('../config/mysqlConnection');


// ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////
//Get Current Date and Time

/* Get  Current Date and Time Detail Service. */
router.get('/get/pinning', (req, res) => {
    logger.info('Inside Current Date and Time Detail');

    var datetime = new Date();
    result = datetime;
    console.log(datetime);

    logger.info('got Current Date and Time Detail results set now !');
    return res.json({ success: true, result });

});

// ////////////////////////////////////////////////////////
//Add Record Detail

/* Add Record Detail Service. */
router.get('/add-record/', (req, res) => {
    logger.info('Inside Add Record Detail');

    if (!req.query.licenseNumber || !req.query.deviceId) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Data Corectly.' });
    } else {

        let dataAll;
        dataAll = {
            DEVICE_ID : req.query.deviceId,
            LICENSE_NUMBER : req.query.licenseNumber,
            BREATH_ALCOHOL_LEVEL : req.query.breathAlcoholLevel,
            DATE : req.query.date,
            TIME : req.query.time,
            LATITUDE : req.query.latitude,
            LONGITUDE : req.query.longitude,
        }

        console.log(dataAll);
        const sql = "insert into device_record (`DEVICE_ID`,`LICENSE_NUMBER`,`BREATH_ALCOHOL_LEVEL`,`DATE`,`TIME`,`LATITUDE`,`LONGITUDE`) VALUES (" +req.query.deviceId+ "," +req.query.licenseNumber+ "," +req.query.breathAlcoholLevel+ "," +req.query.date+ "," +req.query.time+ "," +req.query.latitude+ "," +req.query.longitude+")";
        // const sql = "insert into device_record SET (?,?,?,?,?,?,?)";
        console.log(sql)
        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, dataAll, (err, result) => {
                if (err) {
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });
                }
                else
                connection.release();
                logger.info('Data Added Sucsses!');
                return res.json({ success: true, msg: 'Data added' });

            });
        });

    }

  
});


// ////////////////////////////////////////////////////////
//Search License Number Detail

/* Search License Number Service. */
router.get('/search/', (req, res) => {
    logger.info('Inside Add Record Detail');

    if (!req.query.licenseNumber) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Data Corectly.' });
    } else {

        var licenseNumber = req.query.licenseNumber;

    }

    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from iot_breathlizer.driver_detail Where LICEN_NO =  '"+ licenseNumber +"'" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    //connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    //connection.release();
                    logger.info('got License detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});

module.exports = router;