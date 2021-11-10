var express = require('express');
var router = express.Router();
var mysqlPool = require('../config/mysqlConnection');

// ////////////////////////////////////////////////////////
//Add City Detail

/* Add City Detail Service. */
router.post('/add', function (req, res) {
    logger.info('inside new District ' + req.body.name );
    if (!req.body.name) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

        let district;
        district = {
            name: req.body.name
        };

        const sql = "insert into city set ?";
        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, city, (err, result) => {
                connection.release();
                if (err) {
                    // connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    if (err.code == "ER_DUP_ENTRY") {
                        return res.json({ success: false, msg: 'City name exist.' });
                    }
                    return res.status(500).send({ success: false });
                }
                else
                    //connection.release();
                    logger.info('City Added Sucsses!');
                return res.json({ success: true, msg: 'City added' });

            });
        });



    }
});

// ////////////////////////////////////////////////////////
//Get Category Detail is Special Discount

/* Get Category Detail is Special Discount Service. */
router.get('/get', (req, res) => {
    logger.info('Get Category Detail');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect City Detail all view');
            var sql = "select * from serv_me.item_category" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    //connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    //connection.release();
                    logger.info('got Category detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});

// ////////////////////////////////////////////////////////
//Get City Item Detail is Special Discount

/* Get City Item Detail is Special Discount Service. */
router.post('/get-by-district-id', (req, res) => {
    logger.info('Get Search Item Detail is - ' + req.body.district_id);
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.city where district_id = " + req.body.district_id;
           
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    //connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    //connection.release();
                    logger.info('got Item detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});


module.exports = router;