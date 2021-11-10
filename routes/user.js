var express = require('express');
var router = express.Router();
var mysqlPool = require('../config/mysqlConnection');

// ////////////////////////////////////////////////////////
//Add User Detail 

/* Add User Detail Service. */
router.post('/add', function (req, res) {
    logger.info('inside new User ' + req.body.user_id );
    if (!req.body.name || !req.body.password) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

        let user;
        user = {
            user_id: req.body.user_id,
            name: req.body.name,
            nic: req.body.nic,
            dob: req.body.dob,
            gender: req.body.gender,
            email: req.body.email,
            user_name: req.body.email,
            address: req.body.address,
            contact_number: req.body.contact_number,
            password: req.body.password,
            is_active: 1,
            user_type: req.body.user_type,
        };

        const sql = "insert into user set ?";
        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, user, (err, result) => {
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

// ////////////////////////////////////////////////////////
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/getusersforadmin', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.user" ;
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
            var sql = "select * from serv_me.user where is_active = 1 and id = " + req.query.user_id ;
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
router.post('/login', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {

            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.user where is_active = 1 and user_name = '" + req.body.userName + "' and password = '" +req.body.password + "' ";
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
//Add Item Detail

/* Update Item Action Service. */
router.post('/active', function (req, res) {
    logger.info('inside newShop ' + req.body.name );
    if (!req.body.id) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

       
            // item_id: req.body.name,
        
         

        const sql = "UPDATE user SET is_active = '1' WHERE id = " + req.body.id;
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
        
         

        const sql = "UPDATE user SET is_active = '0' WHERE id = " + req.body.id;
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

module.exports = router;