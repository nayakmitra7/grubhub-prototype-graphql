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
       pool.query('SELECT buyerPassword FROM buyer where buyerEmail ="' + req.body.username + '"', function (err, result, fields) {
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
                    bcrypt.compare(req.body.password, row.buyerPassword, function (err, result) {
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
                    });

                }
            }
        })
    }
});
router.post('/signup',
    [check("firstName", "First Name is needed.").not().isEmpty(),
    check("lastName", "Last Name is needed.").not().isEmpty(),
    check("password", "Password length needs to be 8 or more.").isLength({ min: 8 }),
    check("email", "Wrong E-Mail format.").isEmail(),
    check("address", "Address is needed.").not().isEmpty()
    ], function (req, res) {
        var message = validationResult(req).errors;
        if (message.length > 0) {
            res.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(message));
        } else {
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                if (!err) {
                    var query = 'INSERT INTO buyer (buyerFirstName, buyerLastName, buyerPassword,buyerEmail,buyerAddress) VALUES ("' + req.body.firstName + '","' + req.body.lastName + '","' + hash + '","' + req.body.email + '","' + req.body.address + '");'
                    pool.query(query, function (err, result, fields) {
                        if (err) {
                            res.writeHead(201, {
                                'Content-Type': 'text/plain'
                            });
                            errors = { msg: "Something went wrong" }
                            message.push(errors);
                            res.end(JSON.stringify(message));
                        } else {
                            res.cookie('cookie', "admin", { maxAge: 900000, httpOnly: false, path: '/' });
                            res.writeHead(200, {
                                'Content-Type': 'text/plain'
                            });
                            res.end("success");
                        }
                    })
                } else {
                    res.writeHead(201, {
                        'Content-Type': 'text/plain'
                    });
                    errors = { msg: "Something went wrong" }
                    message.push(errors);
                    res.end(JSON.stringify(message));
                }
            });

        }
    });


router.get('/details/(:data)', function (req, res, next) {
    var query = 'Select buyerFirstName,buyerLastName,buyerEmail,buyerPhone,buyerID,buyerAddress from buyer where buyerEmail="' + req.params.data + '"'
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
router.post('/update', [check("firstName", "First Name is needed.").not().isEmpty(),
check("lastName", "Last Name is needed.").not().isEmpty(),
check("phone", "Invalid phone number.").isLength({ min: 10,max:10 }),
check("email", "Wrong E-Mail format.").isEmail(), check("address", "Address is needed.").not().isEmpty()],
    function (req, res, next) {
        var query = 'update buyer set buyerFirstName="' + req.body.firstName + '",buyerLastName="' + req.body.lastName + '",buyerEmail ="' + req.body.email + '",buyerPhone="' + req.body.phone + '",buyerAddress="' + req.body.address + '"  where buyerID="' + req.body.ID + '"'

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
