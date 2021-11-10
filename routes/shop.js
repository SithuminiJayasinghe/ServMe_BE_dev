var express = require('express');
var router = express.Router();
var mysqlPool = require('../config/mysqlConnection');

// ////////////////////////////////////////////////////////
//Add User Detail

/* Add Shop Detail Service. */
router.post('/add', function (req, res) {
    logger.info('inside newShop ' + req.body.name );
    if (!req.body.name || !req.body.address) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

        let shop;
        shop = {
            showroom_id: req.body.email,
            name: req.body.name,
            description: req.body.description,
            address: req.body.address,
            contact_number_1: req.body.mobile_1,
            contact_number_2: req.body.mobile_2,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            banner_image: req.body.banner_image,
            is_active: 0,
            city_id: req.body.city_id,
            district_id: req.body.district_id,
            user_id: req.body.user_id,
            email: req.body.email,
            whatsapp: req.body.whatsapp,
            facebook: req.body.facebook,
        };

        const sql = "insert into showroom set ?";
        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, shop, (err, result) => {
                connection.release();
                if (err) {
                    // connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    if (err.code == "ER_DUP_ENTRY") {
                        return res.json({ success: false, msg: 'User name exist.' });
                    }
                    return res.status(500).send({ success: false });
                }
                else
                    //connection.release();
                    logger.info('User Added Sucsses!');
                return res.json({ success: true, msg: 'User added' });

            });
        });



    }
});

// ////////////////////////////////////////////////////////
//Get Shop Detail By user id

/* Get Shop Detail is Special Discount Service. */
router.get('/getByUserId', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.showroom where is_active = 1 and user_id = " + req.query.userId ;
            // var sql = "select * from iot_breathlizer.driver_detail Where LICEN_NO =  '"+ licenseNumber +"'" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    logger.info('got Item detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});

// ////////////////////////////////////////////////////////
//Get Shop Detail By user id

/* Get Shop Detail is Special Discount Service. */
router.get('/getByShowRoom', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.showroom_view where is_active = 1 and id = " + req.query.showroom_id ;
            // var sql = "select * from iot_breathlizer.driver_detail Where LICEN_NO =  '"+ licenseNumber +"'" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    logger.info('got Item detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});

// ////////////////////////////////////////////////////////
//Get Shop Detail By user id

/* Get Shop Detail is Special Discount Service. */
router.get('/get', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.showroom_view where is_active = 1"  ;
            // var sql = "select * from iot_breathlizer.driver_detail Where LICEN_NO =  '"+ licenseNumber +"'" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    logger.info('got Item detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});

// ////////////////////////////////////////////////////////
//Get Item Detail By Shop Id

/* Get Item Detail is Special Discount Service. */
router.get('/getByUserIdLimit', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.showroom_view where is_active = 1 and user_id = " + req.query.user_id + " LIMIT 3";
            // var sql = "select * from iot_breathlizer.driver_detail Where LICEN_NO =  '"+ licenseNumber +"'" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    logger.info('got Item detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});


// ////////////////////////////////////////////////////////
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/getshopsforadmin', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.showroom_view" ;
            // var sql = "select * from iot_breathlizer.driver_detail Where LICEN_NO =  '"+ licenseNumber +"'" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    logger.info('got Item detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});
// ////////////////////////////////////////////////////////


// ////////////////////////////////////////////////////////
//Add Item Detail

/* Update Item Action Service. */
router.post('/active', function (req, res) {
    logger.info('inside newShop ' + req.body.name );
    if (!req.body.id) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

       
            // item_id: req.body.name,
        
         

        const sql = "UPDATE showroom SET is_active = '1' , create_date = now() WHERE id = " + req.body.id;
        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, (err, result) => {
                connection.release();
                if (err) {
                    // connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    if (err.code == "ER_DUP_ENTRY") {
                        return res.json({ success: false, msg: 'User name exist.' });
                    }
                    return res.status(500).send({ success: false });
                }
                else
                    //connection.release();
                    logger.info('User Added Sucsses!');
                return res.json({ success: true, msg: 'User added' });

            });
        });



    }
});

// ////////////////////////////////////////////////////////


// ////////////////////////////////////////////////////////
//Add Item Detail

/* Update Item Action Service. */
router.post('/inactive', function (req, res) {
    logger.info('inside newShop ' + req.body.name );
    if (!req.body.id) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

       
            // item_id: req.body.name,
        
         

        const sql = "UPDATE showroom SET is_active = '0' WHERE id = " + req.body.id;
        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, (err, result) => {
                connection.release();
                if (err) {
                    // connection.release();
                    logger.error('mysql connection error. ' + err.message);
                    if (err.code == "ER_DUP_ENTRY") {
                        return res.json({ success: false, msg: 'User name exist.' });
                    }
                    return res.status(500).send({ success: false });
                }
                else
                    //connection.release();
                    logger.info('User Added Sucsses!');
                return res.json({ success: true, msg: 'User added' });

            });
        });



    }
});

// ////////////////////////////////////////////////////////

/ ////////////////////////////////////////////////////////
//Get Item Detail By Shop Id

/* Get Item Detail is Special Discount Service. */
router.post('/getByShopFromName', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.showroom_view where is_active = 1 and name LIKE '%" + req.body.name + "%'";
            // var sql = "select * from iot_breathlizer.driver_detail Where LICEN_NO =  '"+ licenseNumber +"'" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    logger.info('got Item detail all view results set now !');
                    return res.json({ success: true, result });
                }

            });
        }
    });
});


// ////////////////////////////////////////////////////////

module.exports = router;