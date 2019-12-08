const graphql = require('graphql');
const _ = require('lodash');
var pool = require('../Base.js');
const bcrypt = require('bcrypt');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLFloat
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
    name: 'response',
    fields: () => ({
        status: { type: GraphQLInt },
        msg: {type:GraphQLString}
    })
});

const restaurantType = new GraphQLObjectType({
    name: 'restaurant',
    fields: () => ({
        restaurantId: { type: GraphQLInt },
        restaurantName: {type:GraphQLString},
        restaurantCuisine: {type:GraphQLString},
        restaurantAddress: {type:GraphQLString},

    })
});
const itemType = new GraphQLObjectType({
    name: 'item',
    fields: () => ({
        SectionId: { type: GraphQLInt },
        ItemId: { type: GraphQLInt },
        ItemName: {type:GraphQLString},
        ItemPrice: { type: GraphQLFloat },
        ItemDesc: {type:GraphQLString},

    })
});
const sectionType = new GraphQLObjectType({
    name: 'section',
    fields: () => ({
        count: { type: GraphQLInt },
        menuSectionId: { type: GraphQLInt },
        menuSectionName: {type:GraphQLString},
        menuSectionDesc: {type:GraphQLString},

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
        restaurant: {
            type:  new GraphQLList(restaurantType),
            args: { item: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (rootValue, args) => {
                return searchRestaurants(args.item).then((value) => {
                    let response=[];
                    value.forEach(element => {
                        response.push(element)
                    });
                    return response;
                });
            }
        }, 
        item: {
            type:  new GraphQLList(itemType),
            args: { restaurantId: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve: (rootValue, args) => {
                return fetchItem(args.restaurantId).then((value) => {
                    let response=[];
                    value.forEach(element => {
                        response.push(element)
                    });
                    return response;
                });
            }
        },
        section: {
            type:  new GraphQLList(sectionType),
            args: { restaurantId: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve: (rootValue, args) => {
                return fetchSection(args.restaurantId).then((value) => {
                    let response=[];
                    value.forEach(element => {
                        response.push(element)
                    });
                    return response;
                });
            }
        }
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
fetchItem = (restaurantId) => {
    return new Promise((resolve, reject) => {
        let sql = 'Select ItemName,SectionId,ItemPrice,ItemDesc,ItemId from menuItems where restaurantId="' + restaurantId + '"'
        pool.query(sql, (err, results) => {
            if (err) resolve({status:500,msg:'Something went Wrong'});
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
fetchSection = (restaurantId) => {
    return new Promise((resolve, reject) => {
        let sql = 'Select menuSectionId,menuSectionName,menuSectionDesc ,count(itemName) as count from sys.menuSection left outer join sys.menuItems  on   menuSection.menuSectionId =menuItems.SectionId where menuSection.restaurantId=' + restaurantId + ' group by menuSectionId order by menuSectionName Asc';
        pool.query(sql, (err, results) => {
            if (err) resolve({status:500,msg:'Something went Wrong'});
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
getBuyer = (email) => {
    return new Promise((resolve, reject) => {
        let sql = `Select buyerFirstName,buyerLastName,buyerEmail,buyerPhone,buyerID,buyerAddress from buyer where buyerEmail="` + email + `"`;
        pool.query(sql, (err, results) => {
            if (err) resolve({status:500,msg:'Something went Wrong'});
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
searchRestaurants = (item) => {
    return new Promise((resolve, reject) => {
        let sql = 'select restaurantId,restaurantName,restaurantCuisine,restaurantAddress from restaurant where restaurantId in (SELECT restaurantId FROM menuItems where ItemName like "%' + item + '%")'
        pool.query(sql, (err, results) => {
            if (err) resolve({status:500,msg:'Something went Wrong'});
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