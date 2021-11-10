var express = require('express');
var router = express.Router();
var mysqlPool = require('../config/mysqlConnection');

// ////////////////////////////////////////////////////////
//Add District Detail

/* Add District Detail Service. */
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

        const sql = "insert into district set ?";
        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, district, (err, result) => {
                connection.release();
                if (err) {
                    // connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    if (err.code == "ER_DUP_ENTRY") {
                        return res.json({ success: false, msg: 'District name exist.' });
                    }
                    return res.status(500).send({ success: false });
                }
                else
                    //connection.release();
                    logger.info('District Added Sucsses!');
                return res.json({ success: true, msg: 'District added' });

            });
        });



    }
});

// ////////////////////////////////////////////////////////
//Get District Detail is Special Discount

/* Get District Detail is Special Discount Service. */
router.get('/get', (req, res) => {
    logger.info('Get District Detail');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect District Detail all view');
            var sql = "select * from serv_me.district" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    //connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    //connection.release();
                    logger.info('got District detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});

module.exports = router;