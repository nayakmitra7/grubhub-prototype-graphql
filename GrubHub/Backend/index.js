//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
var pool = require('./Base.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;


var cors = require('cors');
app.set('view engine', 'ejs');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


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
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});




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
    check("email", "Wrong E-Mail format.").isEmail()
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
                    var query = 'INSERT INTO buyer (buyerFirstName, buyerLastName, buyerPassword,buyerEmail) VALUES ("' + req.body.firstName + '","' + req.body.lastName + '","' + hash + '","' + req.body.email + '");'
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
    check("phone", "Invalid phone number.").isLength({ min: 10 }),
    check("email", "Wrong E-Mail format.").isEmail(),
    check("password", "Password length needs to be 8 or more.").isLength({ min: 8 }),
    check("restaurant", "Restaurant Name is needed.").not().isEmpty(),
    check("zipcode", "Zipcode is needed.").not().isEmpty()
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
app.post('/Details', function (req, res, next) {
    var query = 'Select buyerFirstName,buyerLastName,buyerEmail,buyerPhone,buyerImage,buyerID from buyer where buyerEmail="' + req.body.username + '"'
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
app.get('/DetailsOwner/(:data)', function (req, res, next) {
    var query = 'Select ownerId,ownerFirstName,ownerLastName,ownerEmail,ownerPassword,ownerPhone,restaurantId from owner where ownerEmail="' + req.params.data + '"'
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
        }
    })
})
app.post('/updateBuyer', [check("firstName", "First Name is needed.").not().isEmpty(),
check("lastName", "Last Name is needed.").not().isEmpty(),
check("phone", "Invalid phone number.").isLength({ min: 10 }),
check("email", "Wrong E-Mail format.").isEmail()],
    function (req, res, next) {
        var query = 'update buyer set buyerFirstName="' + req.body.firstName + '",buyerLastName="' + req.body.lastName + '",buyerEmail ="' + req.body.email + '",buyerPhone="' + req.body.phone + '"  where buyerID="' + req.body.ID + '"'
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
check("phone", "Invalid phone number.").isLength({ min: 10 }),
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
var message=[];
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
    var query = 'Select ItemName,SectionId,ItemPrice,ItemDesc,ItemId from menuItems where restaurantId="' + req.params.data + '"'
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
            console.log(JSON.stringify(JSON.parse(JSON.stringify(result))))
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.put('/items',[check("itemName", "Item Name is needed.").not().isEmpty(),
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
    var message=[];
    console.log(req.params.data)
    var query = 'Delete from menuItems where ItemId =' + req.params.data 
    pool.query(query, function (err, result, fields) {
        if (err) {
            res.writeHead(201, {
                'Content-Type': 'text/plain'
            });
            console.log(err)
            errors = { msg: "Something went wrong" }
            message.push(errors);
            res.end(JSON.stringify(message));
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            console.log(JSON.stringify(JSON.parse(JSON.stringify(result))))
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})

app.put('/sections',[check("menuSectionName", "Section Name is needed.").not().isEmpty()],
 function (req, res, next) {
    var query = 'update menuSection set menuSectionName="' + req.body.menuSectionName + '",menuSectionDesc="' + req.body.menuSectionDesc +'"  where menuSectionId="' + req.body.menuSectionId + '"'
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

var promiseDelete =(req)=>{
    return new Promise((resolve,reject)=>{
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
    var message=[];
    console.log(req.params.data)
    
    var query2 = 'Delete from menuSection where menuSectionId =' + req.params.data 
    promiseDelete(req).then(()=>{
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
                console.log(JSON.stringify(JSON.parse(JSON.stringify(result))))
                res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
            }
        })
    })
})
app.get('/RestaurantSearched/(:data)', function (req, res, next) {
    var message=[];
    console.log(req.params.data)
    var query = 'select restaurantId,restaurantName,restaurantCuisine,restaurantAddress from restaurant where restaurantId in (SELECT restaurantId FROM menuItems where ItemName like "%'+req.params.data+'%")'
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
            console.log(JSON.stringify(JSON.parse(JSON.stringify(result))))
            res.end(JSON.stringify(JSON.parse(JSON.stringify(result))));
        }
    })
})
app.listen(3001);
console.log("Server Listening on port 3001");