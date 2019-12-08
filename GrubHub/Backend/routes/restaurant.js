var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var pool = require('../Base.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/login', [check("username", "Please fill in the User Name.").not().isEmpty(), check("password", "Please fill in the Password.  ").not().isEmpty()], function (req, res) {
    var message = validationResult(req).errors;

    if (message.length > 0) {
        res.writeHead(201, {
            'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify(message));
    } else {

        pool.query('SELECT ownerPassword FROM owner where ownerEmail ="' + req.body.username + '"', function (err, result, fields) {
            if (err) {
                res.writeHead(201, {
                    'Content-Type': 'text/plain'
                });
                var errors = { msg: "Something went wrong!" };
                message.push(errors);
                res.end(JSON.stringify(message));
            } else {
                if (result.length == 0) {
                    res.writeHead(201, {
                        'Content-Type': 'text/plain'
                    });
                    var errors = { msg: "Unregistered User!" };
                    message.push(errors);
                    res.end(JSON.stringify(message));
                } else {
                    var row = JSON.parse(JSON.stringify(result[0]));
                    bcrypt.compare(req.body.password, row.ownerPassword, function (err, result) {
                        if (result == true) {

                            res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                            res.writeHead(200, {
                                'Content-Type': 'text/plain'
                            })
                            res.end("Successful Login");
                        } else {
                            res.writeHead(201, {
                                'Content-Type': 'text/plain'
                            });
                            var errors = { msg: "Invalid Password!" };
                            message.push(errors);
                            res.end(JSON.stringify(message));
                        }
                    })

                }
            }
        })
    }
});
var doInsertion = (req) => {
    return new Promise((resolve, reject) => {
        var query1 = 'INSERT INTO restaurant (restaurantName, restaurantZipCode) VALUES ("' + req.body.restaurant + '","' + req.body.zipcode + '");'
        var query2 = 'select max(restaurantId) as val from restaurant';
        pool.query(query1, function (err, result, fields) {
            if (err) {
                return reject();
            } else {
                pool.query(query2, function (err, result, fields) {
                    if (err) {
                        return reject();
                    } else {
                        var restId = JSON.parse(JSON.stringify(result[0])).val;
                        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                            if (!err) {
                                var query3 = 'INSERT INTO owner (ownerFirstName, ownerLastName,ownerEmail,ownerPhone,restaurantId,ownerPassword) VALUES ("' + req.body.firstName + '","' + req.body.lastName + '","' + req.body.email + '","' + req.body.phone + '","' + restId + '","' + hash + '");'
                                pool.query(query3, function (err, result, fields) {
                                    if (err) {
                                        var query4 = 'delete from restaurant where restaurantId =' + restId;
                                        pool.query(query4, function (err, result, fields) {
                                            return reject();

                                        })

                                        return reject();
                                    } else {

                                        return resolve();
                                    }
                                })
                            } else {
                                reject();
                            }
                        })


                    }
                })
            }

        })
    })

}
router.post('/signup',
    [check("firstName", "First Name is needed.").not().isEmpty(),
    check("lastName", "Last Name is needed.").not().isEmpty(),
    check("phone", "Invalid phone number.").isLength({ min: 10, max: 10 }),
    check("email", "Wrong E-Mail format.").isEmail(),
    check("password", "Password length needs to be 8 or more.").isLength({ min: 8 }),
    check("restaurant", "Restaurant Name is needed.").not().isEmpty(),
    check("zipcode", "Restaurant ZipCode is Invalid.").isLength({ min: 5, max: 5 })
    ], function (req, res, next) {
        var message = validationResult(req).errors;
        if (message.length > 0) {
            res.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(message));
        } else {
            doInsertion(req).then(() => {
                res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end("Success");
            }).catch(() => {
                res.writeHead(201, {
                    'Content-Type': 'text/plain'
                });
                errors = { msg: "Something went wrong" }
                message.push(errors);
                res.end(JSON.stringify(message));
            })
        }
    });
router.get('/detailsOwner/(:data)', function (req, res, next) {
    var query = 'Select ownerId,ownerFirstName,ownerLastName,ownerEmail,ownerPassword,ownerPhone,owner.restaurantId,restaurantName from sys.owner,sys.restaurant where owner.restaurantId=restaurant.restaurantId and ownerEmail= "' + req.params.data + '"'
    pool.query(query, function (err, result, fields) {
        if (err) {
            res.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            errors = { msg: "Something went wrong" }
            message.push(errors);
            res.end(JSON.stringify(message));
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(result[0]));
        }
    })
})

router.get('/detailsRestaurant/(:data)', function (req, res, next) {
    var query = 'Select restaurantName,restaurantCuisine,restaurantAddress,restaurantZipCode from restaurant where restaurantId="' + req.params.data + '"'

    pool.query(query, function (err, result, fields) {

        if (err) {
            res.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            errors = { msg: "Something went wrong" }
            message.push(errors);
            res.end(JSON.stringify(message));
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(result[0]));
        }
    })

})

router.post('/updateOwner', [check("firstName", "First Name is needed.").not().isEmpty(),
check("lastName", "Last Name is needed.").not().isEmpty(),
check("phone", "Invalid phone number.").isLength({ min: 10, max: 10 }),
check("email", "Wrong E-Mail format.").isEmail(),
check("restaurantAddress", "Restaurant Address is needed.").not().isEmpty(),
check("restaurantName", "Restaurant Name is needed.").not().isEmpty(),
check("restaurantZipCode", "Restaurant ZipCode is Invalid.").isLength({ min: 5, max: 5 })],
    function (req, res, next) {
        var query = 'update owner set ownerFirstName="' + req.body.firstName + '",ownerLastName="' + req.body.lastName + '",ownerEmail ="' + req.body.email + '",ownerPhone="' + req.body.phone + '"  where ownerId="' + req.body.ownerId + '"'
        var message = validationResult(req).errors;
        if (message.length > 0) {
            res.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(message));
        } else {
            pool.query(query, function (err, result, fields) {
                if (err) {
                    res.writeHead(201, {
                        'Content-Type': 'text/plain'
                    });
                    errors = { msg: "Something went wrong" }
                    message.push(errors);
                    res.end(JSON.stringify(message));
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end("Success");
                }

            })
        }
    })
router.post('/updateRestaurant', function (req, res, next) {
    var query = 'update restaurant set restaurantName="' + req.body.restaurantName + '",restaurantCuisine="' + req.body.restaurantCuisine + '",restaurantAddress ="' + req.body.restaurantAddress + '",restaurantZipCode="' + req.body.restaurantZipCode + '"  where restaurantId="' + req.body.restaurantId + '"'
    var message = validationResult(req).errors;
    if (message.length > 0) {
        res.writeHead(201, {
            'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify(message));
    } else {
        pool.query(query, function (err, result, fields) {
            if (err) {
                res.writeHead(201, {
                    'Content-Type': 'text/plain'
                });
                errors = { msg: "Something went wrong" }
                message.push(errors);
                res.end(JSON.stringify(message));
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end("Success");
            }

        })
    }
})

router.get('/restaurantSearched/(:data)', function (req, res, next) {
    var message = [];
    var query = 'select restaurantId,restaurantName,restaurantCuisine,restaurantAddress from restaurant where restaurantId in (SELECT restaurantId FROM menuItems where ItemName like "%' + req.params.data + '%")'
    pool.query(query, function (err, result, fields) {
        if (err) {
            res.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            errors = { msg: "Something went wrong" }
            message.push(errors);
            res.end(JSON.stringify(message));
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            
            res.end(JSON.stringify(result));
        }
    })
})

router.use((error, req, res, next) => {
    res.writeHead(201, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(error));
})
router.use((req, res, next) => {
    var message = [];
    var errors = { msg: "Something went wrong!" }
    message.push(errors);
    res.writeHead(201, {
        'Content-Type': 'text/plain'
    });
    res.end(JSON.stringify(message));
})
module.exports = router;
