//import the require dependencies
var express = require('express');
var app = express();
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
var bodyParser = require('body-parser');
var session = require('express-session');
const address = "http://localhost:"
var cors = require('cors');
app.set('view engine', 'ejs');

app.use(cors({ origin: address + '3000', credentials: true }));
app.use(session({
    secret: 'cmpe273_kafka_passport_mongo',
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
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
app.use('/buyer', require('./routes/buyer.js'));
app.use('/restaurant', require('./routes/restaurant.js'));
app.use('/item',require('./routes/item.js'));
app.use('/section',require('./routes/section.js'));
app.use("/graphql",graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(8080, ()=>{
    console.log("GraphQL server started on port 8080");
})