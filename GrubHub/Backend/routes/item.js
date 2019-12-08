var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var pool = require('../Base.js');

router.post('/',
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

router.get('/(:data)', function (req, res, next) {
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
           
            res.end(JSON.stringify(result));
        }
    })
})
router.put('/', [check("itemName", "Item Name is needed.").not().isEmpty(),
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
