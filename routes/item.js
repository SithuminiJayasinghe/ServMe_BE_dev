var express = require('express');
var router = express.Router();
var mysqlPool = require('../config/mysqlConnection');
var fs = require('fs');
// const uploadFile = require("../middleware/upload");
var multer = require('multer');
const path = require("path")
const app = express()
var formidable = require('formidable');
var sendMali = require('../config/mailSend');
var nodemailer = require('nodemailer');
const axios = require('axios');


// router.post('/up', (req, res) => {
//     logger.info('Get Item Detail is Special Discount ++++++++++');
// });  

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
exports.imageFilter = imageFilter;

router.post("/up", function (req, res, next) {

    logger.info('++++++++++++' + req.file);
    logger.info('++++++++++++' + req.body);

    // var form = new formidable.IncomingForm();
    // // form.parse(req, function (err, fields, files) {
    // //   var oldpath = files.filetoupload.path;
    //   var oldpath = req.body.file;
    // //   var fileNAme = oldpath.lastIndexOf("/");
    //   var fileName = oldpath.substring(oldpath.lastIndexOf(String.fromCharCode(92)) + 1, oldpath.length);
    //   logger.info('File Name - ' + fileName);
    // //   var newpath = 'C:/projects/' + fileName;
    //   var newpath = 'E:/8.jpg';
    //   fs.rename(oldpath, newpath, function (err) {
    //     if (err) throw err;
    //     res.write('File uploaded and moved!');
    //     res.end();
    //     logger.info('File uploaded and moved!');
    //   });

    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('profile_pic');

    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.body) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
    });


});


// ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/get', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_active = 1";
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

/* Add Item Detail Service. */
router.post('/add', function (req, res) {
    logger.info('inside newShop ' + req.body.name);
    if (!req.body.name || !req.body.type) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

        let item;
        item = {
            item_id: req.body.name,
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            price: req.body.price,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            image_1: req.body.image_1,
            image_2: req.body.image_2,
            image_3: req.body.image_3,
            image_4: req.body.image_4,
            image_5: req.body.image_5,
            image_6: req.body.image_6,
            image_7: req.body.image_7,
            image_8: req.body.image_8,
            is_special_discount: req.body.is_special_discount,
            discount_price: req.body.discount_price,
            is_active: 0,
            expire_date: req.body.expire_date,
            showroom_id: req.body.showroom_id,
            city_id: req.body.city_id,
            user_id: req.body.user_id,
            whatsapp: req.body.whatsapp,
            facebook: req.body.facebook,
            category_id: req.body.category_id,
            item_address: req.body.address,
            item_email: req.body.email,
            item_contact1: req.body.item_contact1,
            item_contact2: req.body.item_contact2,
        };

        const sql = "insert into item set ?";
        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, item, (err, result) => {
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

                    if(req.body.is_special_discount == 1){
                    //////////////////////////////////////////

                    mysqlConnection = mysqlPool((err, connection) => {
                        if (err) {
                            connection.release();
                            logger.error('mysql connection error. ' + err.message);
                            return res.status(500).send({ success: false });
                
                        } else {
                            logger.info('connect Driver Detail all view');
                            var sql = "select item_email from serv_me.item_details where is_active = 1 GROUP BY item_email";
                            // var sql = "select * from iot_breathlizer.driver_detail Where LICEN_NO =  '"+ licenseNumber +"'" ;
                            console.log(sql);
                            connection.query(sql, function (err, result) {
                                connection.release();
                                if (err) {
                                    logger.error('mysql connection error. ' + err.message);
                                    return res.status(500).send({ success: false });
                
                                } else {
                                    logger.info( result);
                                    // return res.json({ success: true, result });

                                    var emailAddress = "";
                                    for (let i = 0; i < result.length; i++) {
                                        emailAddress = emailAddress + "," +result[i].item_email
                                      }
                                      logger.info( emailAddress);
                                    /////////////////////////////////////////////
                                    let transport = nodemailer.createTransport({
                                        host: 'smtp.gmail.com',
                                        port: 465,
                                        auth: {
                                            user: 'siteservme@gmail.com',
                                            pass: 'Qwerty1234.'
                                        }
                                    });
                
                
                                const message = {
                                    from: 'siteservme@gmail.com', // Sender address
                                    to: emailAddress,         // List of recipients
                                    subject: 'ServMe Alert', // Subject line
                                    text: 'Discount Mail Posted.' // Plain text body
                                };
                                transport.sendMail(message, function (err, info) {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        console.log(info);
                                        return res.json({ success: true, msg: 'User added' });
                                    }
                                });
                                    /////////////////////////////////////////////
                                }
                
                            });
                        }
                    });

                   
                //////////////////////////////////////////
            }

                logger.info('User Added Sucsses!');
                return res.json({ success: true, msg: 'User added' });

            });
        });



    }
});

// ////////////////////////////////////////////////////////
//Get Offers Item Detail is Special Discount

/* Get Offers Item Detail is Special Discount Service. */
router.get('/get-offers', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_active = 1 and is_special_discount = 1 ORDER BY DATE(create_date) DESC LIMIT 12";
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

// ////////////////////////////////////////////////////////
//Get Recent Item Detail is Special Discount

/* Get Recent Item Detail is Special Discount Service. */
router.get('/get-recent', (req, res) => {
    logger.info('Get Recent Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_active = 1 ORDER BY DATE(create_date) DESC LIMIT 12";
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


// ////////////////////////////////////////////////////////
//Get Search Item Detail is Special Discount

/* Get Search Item Detail is Special Discount Service. */
router.post('/get-search', (req, res) => {
    logger.info('Get Search Item Detail is - ' + req.body.city_id);
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_active = 1 ";
            if (req.body.name) {
                sql = sql + " and name LIKE '%" + req.body.name + "%' or category_name LIKE '%" + req.body.name + "%' ";
            }
            if (req.body.city_id && req.body.city_id != 0) {
                sql = sql + " and city_id = " + req.body.city_id;
            }
            if (req.body.district_id && req.body.district_id != 0) {
                sql = sql + " and district_id = " + req.body.district_id;
            }
            if (req.body.category_id) {
                sql = sql + " and category_id = " + req.body.category_id;
            }
            if (req.body.price_min) {
                sql = sql + " and price >= " + req.body.price_min;
            }
            if (req.body.price_max) {
                sql = sql + " and price <= " + req.body.price_max;
            }
            if (req.body.createDate_min) {
                sql = sql + " and create_date >= " + req.body.createDate_min;
            }
            if (req.body.createDate_max) {
                sql = sql + " and create_date <= '" + req.body.createDate_max + "'";
            }
            sql = sql + " ORDER BY DATE(create_date) DESC ";

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

// ////////////////////////////////////////////////////////
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/getByItemId', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_active = 1 and id = " + req.query.id;
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
router.get('/getByshowroom', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_active = 1 and showroom_id = " + req.query.showroom_id;
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
router.get('/getByUserId', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_active = 1 and user_id = " + req.query.user_id + " LIMIT 3";
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
router.get('/getOffersAll', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_active = 1 and is_special_discount = 1 ORDER BY DATE(create_date) DESC ";
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
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/getInactive', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where type='1'";
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
/ ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/getjobsforadmin', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where type='2'";
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


router.get('/getdiscountitemsforadmin', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_special_discount='1'";
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
    logger.info('inside newShop ' + req.body.name);
    if (!req.body.id) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {


        // item_id: req.body.name,



        const date = new Date();
        const sql = "UPDATE item SET is_active = '1' , create_date = now() WHERE id = " + req.body.id;
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
    logger.info('inside newShop ' + req.body.name);
    if (!req.body.id) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {


        // item_id: req.body.name,



        const sql = "UPDATE item SET is_active = '0' WHERE id = " + req.body.id;
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
//Add Report Item Detail

/* Add Report Item Detail Service. */
router.post('/add-report-item', function (req, res) {
    logger.info('inside new report item ' + req.body.item_id);

    if (!req.body.item_id) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

        let item;
        item = {
            item_id: req.body.item_id,
            user_id: req.body.user_id,
        };

        const sql = "insert into report_item set ?";

        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, item, (err, result) => {
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
// ////////////////////////////////////////////////////////
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/getReportItem', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.report_item_view";
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
/ ////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////
//Add Report Item Detail

/* Add Report Item Detail Service. */
router.post('/add-comment', function (req, res) {
    logger.info('inside new report item ' + req.body.item_id);

    if (!req.body.item_id) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

        let item;
        item = {
            item_id: req.body.item_id,
            comment: req.body.comment,
            user_id: req.body.user_id,
        };

        const sql = "insert into comment_item set ?";

        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, item, (err, result) => {
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
// ////////////////////////////////////////////////////////
//Add Report Item Detail

/* Add Report Item Detail Service. */
router.post('/like-item', function (req, res) {
    logger.info('inside new report item ' + req.body.item_id);

    if (!req.body.item_id) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

        let item;
        item = {
            item_id: req.body.item_id,
            user_id: req.body.user_id,
        };

        const sql = "insert into like_item set ?";

        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, item, (err, result) => {
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

// ////////////////////////////////////////////////////////
//Add Report Item Detail

/* Add Report Item Detail Service. */
router.post('/add-rate', function (req, res) {
    logger.info('inside new report item ' + req.body.item_id);

    if (!req.body.item_id) {
        logger.info('Validation error.');
        res.json({ success: false, msg: 'Please Fill Form Corectly.' });
    } else {

        let item;
        item = {
            item_id: req.body.item_id,
            rate: req.body.rate,
            user_id: req.body.user_id,
        };

        const sql = "insert into rate_item set ?";

        const mysqlConnection = mysqlPool((err, connection) => {
            if (err) {
                connection.release();
                logger.error('mysql connection error. ' + err.message);
                return res.status(500).send({ success: false });
            }
            logger.info(sql);
            connection.query(sql, item, (err, result) => {
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
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/getByCommentedItemId', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.comment_item_view where is_active = 1 and id = " + req.query.id;
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
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/getByItemFromWishlist', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.wishlist_item_view where is_active = 1 and like_user_id = " + req.query.user_id;
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
//Get Item Detail is Special Discount

/* Get Item Detail is Special Discount Service. */
router.get('/getByRateItemById', (req, res) => {
    logger.info('Get Item Detail is Special Discount');
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.rate_item where item_id = " + req.query.id;
            // var sql = "select * from iot_breathlizer.driver_detail Where LICEN_NO =  '"+ licenseNumber +"'" ;
            console.log(sql);
            connection.query(sql, function (err, result) {
                connection.release();
                if (err) {
                    logger.error('mysql connection error. ' + err.message);
                    return res.status(500).send({ success: false });

                } else {
                    logger.info('got Item detail all view results set now !');


                    let rateCount = 0;
                    for (let i = 0; i < result.length; i++) {
                        rateCount = rateCount + result[i].rate ;
                      }

                    rateCount = rateCount/result.length;

                    return res.json({ success: true, rateCount });
                }

            });
        }
    });
});

// ////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////
//Get Search Item Detail is Special Discount

/* Get Search Item Detail is Special Discount Service. */
router.post('/get-search-offers', (req, res) => {
    logger.info('Get Search Item Detail is - ' + req.body.city_id);
    mysqlConnection = mysqlPool((err, connection) => {
        if (err) {
            connection.release();
            logger.error('mysql connection error. ' + err.message);
            return res.status(500).send({ success: false });

        } else {
            logger.info('connect Driver Detail all view');
            var sql = "select * from serv_me.item_details where is_active = 1 and is_special_discount = 1 ";
            if (req.body.name) {
                sql = sql + " and name LIKE '%" + req.body.name + "%' or category_name LIKE '%" + req.body.name + "%' ";
            }
            if (req.body.city_id && req.body.city_id != 0) {
                sql = sql + " and city_id = " + req.body.city_id;
            }
            if (req.body.district_id && req.body.district_id != 0) {
                sql = sql + " and district_id = " + req.body.district_id;
            }
            if (req.body.category_id) {
                sql = sql + " and category_id = " + req.body.category_id;
            }
            if (req.body.price_min) {
                sql = sql + " and discount_price >= " + req.body.price_min;
            }
            if (req.body.price_max) {
                sql = sql + " and discount_price <= " + req.body.price_max;
            }
            if (req.body.createDate_min) {
                sql = sql + " and create_date >= " + req.body.createDate_min;
            }
            if (req.body.createDate_max) {
                sql = sql + " and create_date <= '" + req.body.createDate_max + "'";
            }
            sql = sql + " ORDER BY DATE(create_date) DESC ";

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

// ////////////////////////////////////////////////////////

module.exports = router;