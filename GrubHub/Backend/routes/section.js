var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var pool = require('../Base.js');

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

router.post('/',
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
router.get('/(:data)', function (req, res, next) {
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


router.put('/', [check("menuSectionName", "Section Name is needed.").not().isEmpty()],
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
router.delete('/(:data)', function (req, res, next) {
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
