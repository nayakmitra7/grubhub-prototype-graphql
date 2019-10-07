//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
const multer = require('multer');
var cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
var pool = require('./Base.js');


const bcrypt = require('bcrypt');
const saltRounds = 10;
const address = "http://localhost:"
var cors = require('cors');
var message=[];
app.set('view engine', 'ejs');

app.use(cors({ origin: address + '3000', credentials: true }));

app.use('/uploads', express.static('uploads'))

app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
    // duration: 86400000,    // Overall duration of Session : 30 minutes : 1800 seconds
    // activeDuration: 86400000
}));

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', address + '3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var filename = "profileImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
var upload = multer({ storage: storage });

var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var filename = "itemImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
var upload2 = multer({ storage: storage2 });

var storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var filename = "ownerImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
var upload3 = multer({ storage: storage3 });

var storage4 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var filename = "restaurantImage" + file.originalname + ".jpeg";
        cb(null, filename);
    }
});
var upload4 = multer({ storage: storage4 });

app.post('/restaurant/image', upload4.single('myImage'), function (req, res, next) {
    var message = []
    var data = "uploads/restaurantImage" + req.file.originalname + ".jpeg"
    var query = 'update restaurant set restaurantImage="' + data + '"  where restaurantId="' + req.file.originalname + '"'
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
});
app.get('/restaurant/image/(:data)', function (req, res, next) {
    var query = 'Select restaurantImage from restaurant where restaurantId="' + req.params.data + '"'
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
            if (JSON.parse(JSON.stringify(result[0])).restaurantImage != null) {
                var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(result[0])).restaurantImage;
                var image = { "restaurantImage": imageAddress }
                res.end(JSON.stringify(image));
            } else {
                res.end(JSON.stringify(result));

            }

        }
    })

})


app.post('/owner/image', upload3.single('myImage'), function (req, res, next) {
    var message = []
    var data = "uploads/ownerImage" + req.file.originalname + ".jpeg"
    var query = 'update owner set ownerImage="' + data + '"  where ownerId="' + req.file.originalname + '"'
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
});
app.get('/owner/image/(:data)', function (req, res, next) {
    var query = 'Select ownerImage from owner where ownerId="' + req.params.data + '"'
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
            if (JSON.parse(JSON.stringify(result[0])).ownerImage != null) {
                var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(result[0])).ownerImage;
                var image = { "ownerImage": imageAddress }
                res.end(JSON.stringify(image))
            } else {
                res.end(JSON.stringify(result))
            }

        }
    })

})
app.post('/upload/ItemPhoto', upload2.single('myImage'), function (req, res, next) {
    var message = []
    var data = "uploads/itemImage" + req.file.originalname + ".jpeg"
    var query = 'update menuItems set itemImage="' + data + '"  where itemId="' + req.file.originalname + '"'
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
});
app.post('/upload/photo', upload.single('myImage'), function (req, res, next) {
    var message = []
    var data = "uploads/profileImage" + req.file.originalname + ".jpeg"
    var query = 'update buyer set buyerImage="' + data + '"  where buyerID="' + req.file.originalname + '"'
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
});
app.get('/photo/(:data)', function (req, res, next) {
    var query = 'Select buyerImage from buyer where buyerID="' + req.params.data + '"'
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
            if (JSON.parse(JSON.stringify(result[0])).buyerImage != null) {
                var imageAddress = address + "3001/" + JSON.parse(JSON.stringify(result[0])).buyerImage;
                var image = { "buyerImage": imageAddress }
                res.end(JSON.stringify(image))
            } else {
                res.end(JSON.stringify(result))
            }

        }
    })

})

app.post('/login', [check("username", "Please fill in the User Name.").not().isEmpty(), check("password", "Please fill in the Password.  ").not().isEmpty()], function (req, res) {
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

app.post('/LoginOwner', [check("username", "Please fill in the User Name.").not().isEmpty(), check("password", "Please fill in the Password.  ").not().isEmpty()], function (req, res) {
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

app.post('/signup',
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
app.post('/SignUpOwner',
    [check("firstName", "First Name is needed.").not().isEmpty(),
    check("lastName", "Last Name is needed.").not().isEmpty(),
    check("phone", "Invalid phone number.").isLength({ min: 10, max:10 }),
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
app.get('/Details/(:data)', function (req, res, next) {
    var query = 'Select buyerFirstName,buyerLastName,buyerEmail,buyerPhone,buyerImage,buyerID,buyerAddress from buyer where buyerEmail="' + req.params.data + '"'
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
app.get('/image', function (req, res, next) {
    res.sendFile('/Users/mitranayak/Documents/273/react/ReactLab1BeforeRedux/GrubHub/Backend/uploads/1570006739761.png');

})
app.get('/DetailsOwner/(:data)', function (req, res, next) {
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

app.get('/DetailsRestaurant/(:data)', function (req, res, next) {
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
            console.log(JSON.stringify(result[0]))
        }
    })
    
})
app.post('/updateBuyer', [check("firstName", "First Name is needed.").not().isEmpty(),
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
app.post('/UpdateOwner', [check("firstName", "First Name is needed.").not().isEmpty(),
check("lastName", "Last Name is needed.").not().isEmpty(),
check("phone", "Invalid phone number.").isLength({ min: 10, max:10 }),
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
app.post('/UpdateRestaurant', function (req, res, next) {
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
var checkExistingSection = (req) => {
    return new Promise((resolve, reject) => {

        var query22 = 'SELECT COUNT(menuSectionName) as con FROM sys.menuSection WHERE upper(menuSectionName)=Upper("' + req.body.sectionName + '") and restaurantId="' + req.body.restaurantId + '"';
        pool.query(query22, function (err, result, fields) {
            if (JSON.parse(JSON.stringify(result[0])).con) {
                reject();
            } else {
                resolve();
            }
        })

    })
}

app.post('/section',
    [check("sectionName", "Section Name is needed.").not().isEmpty()]
    , function (req, res, next) {
        var query = 'Insert into menuSection (menuSectionName,menuSectionDesc,restaurantId) values ("' + req.body.sectionName + '","' + req.body.sectionDesc + '","' + req.body.restaurantId + '")'
        var message = validationResult(req).errors;
        if (message.length > 0) {
            res.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            res.end(JSON.stringify(message));
        } else {
            checkExistingSection(req).then(() => {
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
            }).catch(() => {
                res.writeHead(201, {
                    'Content-Type': 'text/plain'
                });
                errors = { msg: "The Section already exits." }
                message.push(errors);
                res.end(JSON.stringify(message));
            })


        }
    })
app.get('/section/(:data)', function (req, res, next) {
    var query = 'Select menuSectionId,menuSectionName,menuSectionDesc ,count(itemName) as count from sys.menuSection left outer join sys.menuItems  on   menuSection.menuSectionId =menuItems.SectionId where menuSection.restaurantId=' + req.params.data + ' group by menuSectionId order by menuSectionName Asc';
    var message = [];
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.post('/item',
    [check("itemName", "Item Name is needed.").not().isEmpty(),
    check("itemPrice", "Item Price is needed.").not().isEmpty(),
    check("itemSection", "Item Section is needed.").not().isEmpty()]
    , function (req, res, next) {

        var query = 'Insert into menuItems (ItemName,ItemPrice,ItemDesc,SectionId,restaurantId) values ("' + req.body.itemName + '","' + req.body.itemPrice + '","' + req.body.itemDesc + '","' + req.body.itemSection + '","' + req.body.restaurantId + '")'
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
                    errors = { msg: "Either the item already exits or something went wrong" }
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

app.get('/items/(:data)', function (req, res, next) {
    var query = 'Select ItemName,SectionId,ItemPrice,ItemDesc,ItemId,itemImage from menuItems where restaurantId="' + req.params.data + '"'
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
            var modifiedResult = [];
            JSON.parse(JSON.stringify(result)).forEach(item => {
                if (item.itemImage != null) {
                    item.itemImage = address + "3001/" + item.itemImage;
                    modifiedResult.push(item);
                } else {
                    modifiedResult.push(item);
                }
            });
            res.end(JSON.stringify(JSON.parse(JSON.stringify(modifiedResult))));
        }
    })
})
app.put('/items', [check("itemName", "Item Name is needed.").not().isEmpty(),
check("itemPrice", "Item Price is needed.").not().isEmpty(),
check("itemSection", "Item Section is needed.").not().equals("0")],
    function (req, res, next) {
        var query = 'update menuItems set ItemName="' + req.body.itemName + '",SectionId="' + req.body.itemSection + '",ItemPrice ="' + req.body.itemPrice + '",ItemDesc="' + req.body.itemDesc + '"  where ItemId="' + req.body.itemId + '"'
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

app.delete('/items/(:data)', function (req, res, next) {
    var message = [];
    var query = 'Delete from menuItems where ItemId =' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})

app.put('/sections', [check("menuSectionName", "Section Name is needed.").not().isEmpty()],
    function (req, res, next) {
        var query = 'update menuSection set menuSectionName="' + req.body.menuSectionName + '",menuSectionDesc="' + req.body.menuSectionDesc + '"  where menuSectionId="' + req.body.menuSectionId + '"'
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

var promiseDelete = (req) => {
    return new Promise((resolve, reject) => {
        var query = 'Delete from menuItems where SectionId =' + req.params.data
        pool.query(query, function (err, result, fields) {
            if (err) {
                reject()
            } else {
                resolve();
            }
        })

    })

}
app.delete('/sections/(:data)', function (req, res, next) {
    var message = [];
    var query2 = 'Delete from menuSection where menuSectionId =' + req.params.data
    promiseDelete(req).then(() => {
        pool.query(query2, function (err, result, fields) {
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
                res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
            }
        })
    })
})
app.get('/RestaurantSearched/(:data)', function (req, res, next) {
    var message = [];
    var query = 'select restaurantId,restaurantName,restaurantCuisine,restaurantAddress,restaurantImage from restaurant where restaurantId in (SELECT restaurantId FROM menuItems where ItemName like "%' + req.params.data + '%")'
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
            var modifiedResult = [];
            JSON.parse(JSON.stringify(result)).forEach(restaurant => {
                if (restaurant.restaurantImage != null) {
                    restaurant.restaurantImage = address + "3001/" + restaurant.restaurantImage;
                    modifiedResult.push(restaurant);
                } else {
                    modifiedResult.push(restaurant);
                }
            });
            res.end(JSON.stringify(JSON.parse(JSON.stringify(modifiedResult))));
        }
    })
})

app.post('/Order', function (req, res, next) {
    var message = [];
    var query = "Insert INTO sys.order (restaurantId,buyerId,buyerAddress,orderStatus,orderDetails,orderDate) values ('" + req.body.restaurantId + "','" + req.body.buyerID + "','" + req.body.buyerAddress + "','" + "New" + "','" + req.body.bag + "','" + req.body.date + "')"
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
            errors = { msg: "Order Placed" }
            message.push(errors);
            res.end(JSON.stringify(message));
        }
    })


})
app.get('/UpcomingOrders/(:data)', function (req, res, next) {
    var message = [];
    var query = 'Select restaurantName,buyerAddress,orderStatus,orderDetails,orderDate,orderId from sys.order,sys.restaurant where (order.orderStatus !="Delivered" and order.orderStatus!="Cancelled" )and order.restaurantId=restaurant.restaurantId and buyerId=' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})

app.get('/OrdersOwner/(:data)', function (req, res, next) {
    var message = [];
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where (orderStatus="Delivered" or orderStatus="Cancelled") and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.get('/OrdersOwnerNew/(:data)', function (req, res, next) {
    var message = [];
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="New" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.get('/OrdersOwnerConfirmed/(:data)', function (req, res, next) {
    var message = [];
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="Confirmed" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.get('/OrdersOwnerPreparing/(:data)', function (req, res, next) {
    var message = [];
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="Preparing" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.get('/OrdersOwnerReady/(:data)', function (req, res, next) {
    var message = [];
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="Ready" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.get('/OrdersOwnerCancelled/(:data)', function (req, res, next) {
    var message = [];
    var query = 'select orderId,order.restaurantId,order.buyerId,order.buyerAddress,orderStatus,orderDetails,orderDate,buyerFirstName,buyerLastName from sys.order,sys.buyer where orderStatus="Cancelled" and order.buyerId=buyer.buyerID and order.restaurantId =' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.post('/CancelOrder',
    function (req, res, next) {

        var query = 'update sys.order set orderStatus="Cancelled" where orderId=' + req.body.id
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

    })
app.post('/statusChange',
    function (req, res, next) {
        var query = 'update sys.order set orderStatus="' + req.body.status + '" where orderId=' + req.body.id
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

    })

app.get('/PastOrders/(:data)', function (req, res, next) {
    var message = [];
    var query = 'Select restaurantName,buyerAddress,orderStatus,orderDetails,orderDate,orderId from sys.order,sys.restaurant where (order.orderStatus ="Delivered" or order.orderStatus="Cancelled" )and order.restaurantId=restaurant.restaurantId and buyerId=' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.get('/maxItemId/(:data)', function (req, res, next) {
    var message = [];
    var query = 'Select max(ItemId) as val from sys.menuItems where restaurantId =' + req.params.data
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
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result[0])).val))
        }
    })
})

app.listen(3001);
console.log("Server Listening on port 3001");