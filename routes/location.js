var express = require('express');
var router = express.Router();
var mysqlPool = require('../config/mysqlConnection');

// ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////
//Get All Location Detail

/* Get All Location Detail Service. */
router.get('/get/locationDetailAll', (req, res) => {
    logger.info('Inside All Location Detail');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Location Detail all view');
            var sql = "select * from location;";
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    //connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    //connection.release();
                    logger.info('got Location detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});



/* Add New Location  Detail Service. */
router.post('/add/newLocation', function (req, res) {
    logger.info('inside new Location Station');
    if (!req.body.name || !req.body.isActive) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

        let location;
        location = {
            NAME: req.body.name,
            CODE: req.body.code,
            IS_ACTIVE: req.body.isActive
        };

        const sql = "insert into location set ?";
        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, location, (err, result) => {
                connection.release();
                if (err) {
                    // connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    if (err.code == "ER_DUP_ENTRY") {
                        return res.json({ success: false, msg: 'Location name exist.' });
                    }
                    return res.status(500).send({ success: false });
                }
                else
                    //connection.release();
                    logger.info('Location Added Sucsses!');
                return res.json({ success: true, msg: 'Location added' });

            });
        });



    }
});


/* Change Location State from Detail Service. */
router.post("/edit/locationState", function (req, res) {
    logger.info("inside edit Location state");
    if (!req.body.locationId || !req.body.locationId) {
        logger.info("Validation error.");
        res.json({ success: false, msg: "Please Fill Form Corectly." });
    } else {
        var locationId = req.body.locationId;
        var isActive = req.body.isActive;

        const sql =
            "UPDATE location set IS_ACTIVE = '" +
            isActive +
            "' where LOCATION_ID = '" +
            locationId +
            "'";

        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                // connection.release();
                logger.error("mysql connection error. " + err.message);
                return res.status(500).send({ success: false });
            }
            connection.query(sql, (err, result) => {
                connection.release();
                if (err) {
                    //connection.release();
                    logger.error("mysql connection error. " + err.message);
                    return res.status(500).send({ success: false });
                }
                //connection.release();
                else logger.info("Location State Update Sucsses!");
                return res.json({ success: true, msg: "Location State Edited" });
            });
        });
    }
});

module.exports = router;