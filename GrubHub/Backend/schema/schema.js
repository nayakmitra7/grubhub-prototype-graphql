const graphql = require('graphql');
const _ = require('lodash');
var pool = require('../Base.js');
const bcrypt = require('bcrypt');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const buyerType = new GraphQLObjectType({
    name: 'Buyer',
    fields: () => ({
        buyerFirstName: { type: GraphQLString },
        buyerLastName: { type: GraphQLString },
        buyerEmail: { type: GraphQLString },
        buyerPhone: { type: GraphQLString },
        buyerID: { type: GraphQLInt },
        buyerAddress: { type: GraphQLString },
    })
});

const responseType = new GraphQLObjectType({
    name: 'BuyerLogin',
    fields: () => ({
        status: { type: GraphQLInt },
        msg: {type:GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        buyer: {
            type: buyerType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (rootValue, args) => {
                return getBuyer(args.id).then(value => value[0]);
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: {
            type: responseType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (rootValue, args) => {
                let data = { email: args.email, password: args.password };
                return loginBuyer({ data }).then(value => value);
            }
        },
        update: {
            type: responseType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) }, 
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
                ID:{type:new GraphQLNonNull(GraphQLInt)},
                address:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (rootValue, args) => {
                let data = { email: args.email, firstName: args.firstName,lastName: args.lastName,phone: args.phone,ID:args.ID,address:args.address };
                return buyerUpdate({ data }).then(value => value);
            }
        }

    }
});
getBuyer = (email) => {
    return new Promise((resolve, reject) => {
        let sql = `Select buyerFirstName,buyerLastName,buyerEmail,buyerPhone,buyerID,buyerAddress from buyer where buyerEmail="` + email + `"`;
        pool.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
buyerUpdate = ({data}) => {
    return new Promise((resolve, reject) => {
        let sql = 'update buyer set buyerFirstName="' + data.firstName + '",buyerLastName="' + data.lastName + '",buyerEmail ="' + data.email + '",buyerPhone="' + data.phone + '",buyerAddress="' + data.address + '"  where buyerID="' + data.ID + '"'
        pool.query(sql, (err, results) => {
            if (err) resolve({status:500,msg:'Something went Wrong'});
            resolve({status:200,msg:'Successfully updated'});
        });
    });
};
loginBuyer = ({ data }) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT buyerPassword FROM buyer where buyerEmail ="` + data.email + `"`;
        pool.query(sql, (err, results) => {
            if (err) resolve({msg:'Something went wrong',status:500});
            else if (results.length == 0) {
               resolve({msg:'No user with that email',status:500});
            }
            else {
                var row = JSON.parse(JSON.stringify(results[0]));
                bcrypt.compare(data.password, row.buyerPassword, function (err, result) {
                    if (result != true) {
                        resolve({status:500,msg:'Invalid Password'});
                    } else {
                        resolve({status:200,msg:'Successful Login'});
                    }
                });
            }
        });
    });
};
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});