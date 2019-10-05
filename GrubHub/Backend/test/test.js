var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect = chai.expect;

it("Should check credentials and return status code", function(done){
    chai.request('http://localhost:3001')
    .post('/login')
    .send({ "username": "john.snow@gmail.com", "password" : "mahalasa1"})
    .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
    });
})

it("Should fetch details of the buyer given his/her email address", function(done){
    chai.request('http://localhost:3001')
    .get('/Details/john.snow@gmail.com')
    .end(function (err, res) {
        expect(JSON.parse(res.text).buyerFirstName).to.equal("John");
        expect(JSON.parse(res.text).buyerLastName).to.equal("Snow");
        expect(JSON.parse(res.text).buyerPhone).to.equal("7896543120");
        expect(JSON.parse(res.text).buyerAddress).to.equal("1516 crest view avenue,belmont");
        expect(JSON.parse(res.text).buyerFirstName).to.equal("John");
        done();
    });
})

it("Should check if the item that needs to be edited has the necessary item name field", function(done){
    chai.request('http://localhost:3001')
    .put('/items')
    .send({ "itemName": "", "itemPrice" : "1","itemSection":"2"})
    .end(function (err, res) {
        expect(JSON.parse(res.text)[0].msg).to.equal("Item Name is needed.")
        done();
    });
})

it("Should fetch the restaurant name given the restaurant ID", function(done){
    chai.request('http://localhost:3001')
    .get('/DetailsRestaurant/22')
    .end(function (err, res) {
        expect(JSON.parse(res.text).restaurantName).to.equal("Bawarchi")
        done();
    });
})


it("Should check if the user is a regisered user and send a message if he is not", function(done){
    chai.request('http://localhost:3001')
    .post('/LoginOwner')
    .send({ "username": "joh.snow@gmail.com", "password" : "1234"})
    .end(function (err, res) {
        expect(res).to.have.status(201)
        expect(JSON.parse(res.text)[0].msg).to.equal("Unregistered User!");
        done();
    });
})