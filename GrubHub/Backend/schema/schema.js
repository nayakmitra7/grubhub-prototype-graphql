const graphql = require('graphql');
const _ = require('lodash');
var pool = require('../Base.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
const ownerType = new GraphQLObjectType({
    name: 'Owner',
    fields: () => ({
        ownerFirstName: { type: GraphQLString },
        ownerLastName: { type: GraphQLString },
        ownerEmail: { type: GraphQLString },
        ownerPhone: { type: GraphQLString },
        ownerId: { type: GraphQLInt },
        restaurantId: { type: GraphQLInt },
        restaurantName: { type: GraphQLString },
    })
});

const responseType = new GraphQLObjectType({
    name: 'response',
    fields: () => ({
        status: { type: GraphQLInt },
        msg: { type: GraphQLString }
    })
});

const restaurantType = new GraphQLObjectType({
    name: 'restaurant',
    fields: () => ({
        restaurantId: { type: GraphQLInt },
        restaurantName: { type: GraphQLString },
        restaurantCuisine: { type: GraphQLString },
        restaurantAddress: { type: GraphQLString },
        restaurantZipCode: { type: GraphQLString },

    })
});
const itemType = new GraphQLObjectType({
    name: 'item',
    fields: () => ({
        SectionId: { type: GraphQLInt },
        ItemId: { type: GraphQLInt },
        ItemName: { type: GraphQLString },
        ItemPrice: { type: GraphQLFloat },
        ItemDesc: { type: GraphQLString },

    })
});
const sectionType = new GraphQLObjectType({
    name: 'section',
    fields: () => ({
        count: { type: GraphQLInt },
        menuSectionId: { type: GraphQLInt },
        menuSectionName: { type: GraphQLString },
        menuSectionDesc: { type: GraphQLString },

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
        Owner: {
            type: ownerType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (rootValue, args) => {
                return getOwner(args.id).then(value => value[0]);
            }
        },
        restaurants: {
            type: new GraphQLList(restaurantType),
            args: { item: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (rootValue, args) => {
                return searchRestaurants(args.item).then((value) => {
                    let response = [];
                    value.forEach(element => {
                        response.push(element)
                    });
                    return response;
                });
            }
        },
        item: {
            type: new GraphQLList(itemType),
            args: { restaurantId: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve: (rootValue, args) => {
                return fetchItem(args.restaurantId).then((value) => {
                    let response = [];
                    value.forEach(element => {
                        response.push(element)
                    });
                    return response;
                });
            }
        },
        section: {
            type: new GraphQLList(sectionType),
            args: { restaurantId: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve: (rootValue, args) => {
                return fetchSection(args.restaurantId).then((value) => {
                    let response = [];
                    value.forEach(element => {
                        response.push(element)
                    });
                    return response;
                });
            }
        },
        restaurant: {
            type: restaurantType,
            args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
            resolve: (rootValue, args) => {
                return fetchRestaurant(args.id).then((value) => value[0]);
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
                ID: { type: new GraphQLNonNull(GraphQLInt) },
                address: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (rootValue, args) => {
                let data = { email: args.email, firstName: args.firstName, lastName: args.lastName, phone: args.phone, ID: args.ID, address: args.address };
                return buyerUpdate({ data }).then(value => value);
            }
        },
        signup: {
            type: responseType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                address: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (rootValue, args) => {
                let data = { email: args.email, firstName: args.firstName, lastName: args.lastName, address: args.address, password: args.password };
                return buyerSignup({ data }).then(value => value);
            }
        },
        loginOwner: {
            type: responseType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (rootValue, args) => {
                let data = { email: args.email, password: args.password };
                return loginOwner({ data }).then(value => value);
            }
        },      
        updateOwner: {
            type: responseType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) },
                ownerId: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (rootValue, args) => {
                let data = { firstName: args.firstName, lastName: args.lastName, lastName: args.lastName, email: args.email, phone: args.phone, ownerId: args.ownerId };
                return ownerUpdate({ data }).then(value => value);
            }
        },
        updateRestaurant: {
            type: responseType,
            args: {
                restaurantName: { type: new GraphQLNonNull(GraphQLString) },
                restaurantCuisine: { type: new GraphQLNonNull(GraphQLString) },
                restaurantAddress: { type: new GraphQLNonNull(GraphQLString) },
                restaurantZipCode: { type: new GraphQLNonNull(GraphQLInt) },
                restaurantId: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve: (rootValue, args) => {
                let data = { restaurantName: args.restaurantName, restaurantCuisine: args.restaurantCuisine, restaurantAddress: args.restaurantAddress, restaurantZipCode: args.restaurantZipCode, restaurantId: args.restaurantId };
                return restaurantUpdate({ data }).then(value => value);
            }
        },
        addSection: {
            type: responseType,
            args: {
                sectionName: { type: new GraphQLNonNull(GraphQLString) },
                sectionDesc: { type: new GraphQLNonNull(GraphQLString) },
                restaurantId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (rootValue, args) => {
                let data = { sectionName: args.sectionName, sectionDesc: args.sectionDesc,restaurantId:args.restaurantId };
                return addSection({ data }).then(value => value);
            }
        },
        addItem: {
            type: responseType,
            args: {
                ItemName: { type: new GraphQLNonNull(GraphQLString) },
                ItemPrice: { type: new GraphQLNonNull(GraphQLFloat) },
                ItemDesc: { type: new GraphQLNonNull(GraphQLString) },
                SectionId: { type: new GraphQLNonNull(GraphQLInt) },
                restaurantId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (rootValue, args) => {
                console.log(args)
                let data = { ItemName: args.ItemName, ItemPrice: args.ItemPrice,ItemDesc:args.ItemDesc,SectionId:args.SectionId,restaurantId:args.restaurantId };
                return addItem({ data }).then(value => value);
            }
        },

    }
});
addItem = ({ data }) => {
    return new Promise((resolve, reject) => {
        let sql = 'Insert into menuItems (ItemName,ItemPrice,ItemDesc,SectionId,restaurantId) values ("' + data.ItemName + '","' + data.ItemPrice + '","' + data.ItemDesc + '","' + data.SectionId + '","' + data.restaurantId + '")'
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve({ status: 200, msg: 'Successfully updated' });
        });
    });
};
addSection = ({ data }) => {
    return new Promise((resolve, reject) => {
        let sql = 'Insert into menuSection (menuSectionName,menuSectionDesc,restaurantId) values ("' + data.sectionName + '","' + data.sectionDesc + '","' + data.restaurantId + '")'
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve({ status: 200, msg: 'Successfully updated' });
        });
    });
};
restaurantUpdate = ({ data }) => {
    return new Promise((resolve, reject) => {
        let sql = 'update restaurant set restaurantName="' + data.restaurantName + '",restaurantCuisine="' + data.restaurantCuisine + '",restaurantAddress ="' + data.restaurantAddress + '",restaurantZipCode="' + data.restaurantZipCode + '"  where restaurantId="' + data.restaurantId + '"'
        pool.query(sql, (err, results) => {
            console.log(err)
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve({ status: 200, msg: 'Successfully updated' });
        });
    });
};
ownerUpdate = ({ data }) => {
    return new Promise((resolve, reject) => {
        let sql = 'update owner set ownerFirstName="' + data.firstName + '",ownerLastName="' + data.lastName + '",ownerEmail ="' + data.email + '",ownerPhone="' + data.phone + '"  where ownerId="' + data.ownerId + '"'
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve({ status: 200, msg: 'Successfully updated' });
        });
    });
};
fetchRestaurant = (id) => {
    return new Promise((resolve, reject) => {
        let sql = 'Select restaurantName,restaurantCuisine,restaurantAddress,restaurantZipCode from restaurant where restaurantId="' + id + '"'
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
getOwner = (email) => {
    return new Promise((resolve, reject) => {
        let sql = 'Select ownerId,ownerFirstName,ownerLastName,ownerEmail,ownerPassword,ownerPhone,owner.restaurantId,restaurantName from sys.owner,sys.restaurant where owner.restaurantId=restaurant.restaurantId and ownerEmail= "' + email + '"'
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
loginOwner = ({ data }) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT ownerPassword FROM owner where ownerEmail ="' + data.email + '"';
        pool.query(sql, (err, results) => {
            if (err) resolve({ msg: 'Something went wrong', status: 500 });
            else if (results.length == 0) {
                resolve({ msg: 'No user with that email', status: 500 });
            }
            else {
                var row = JSON.parse(JSON.stringify(results[0]));
                bcrypt.compare(data.password, row.ownerPassword, function (err, result) {
                    if (result != true) {
                        resolve({ status: 500, msg: 'Invalid Password' });
                    } else {
                        resolve({ status: 200, msg: 'Successful Login' });
                    }
                });
            }
        });
    });
};
buyerSignup = ({ data }) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(data.password, saltRounds, function (err, hash) {
            if (!err) {
                var query = 'INSERT INTO buyer (buyerFirstName, buyerLastName, buyerPassword,buyerEmail,buyerAddress) VALUES ("' + data.firstName + '","' + data.lastName + '","' + hash + '","' + data.email + '","' + data.address + '");'
                pool.query(query, function (err, result, fields) {
                    if (err) resolve({ status: 500, msg: 'Something went Wrong' });
                    resolve({ status: 200, msg: 'Successfully updated' });
                })
            } else {
                resolve({ status: 500, msg: 'Something went Wrong' });
            }
        });

    });
};
fetchItem = (restaurantId) => {
    return new Promise((resolve, reject) => {
        let sql = 'Select ItemName,SectionId,ItemPrice,ItemDesc,ItemId from menuItems where restaurantId="' + restaurantId + '"'
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
fetchSection = (restaurantId) => {
    return new Promise((resolve, reject) => {
        let sql = 'Select menuSectionId,menuSectionName,menuSectionDesc ,count(itemName) as count from sys.menuSection left outer join sys.menuItems  on   menuSection.menuSectionId =menuItems.SectionId where menuSection.restaurantId=' + restaurantId + ' group by menuSectionId order by menuSectionName Asc';
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
getBuyer = (email) => {
    return new Promise((resolve, reject) => {
        let sql = `Select buyerFirstName,buyerLastName,buyerEmail,buyerPhone,buyerID,buyerAddress from buyer where buyerEmail="` + email + `"`;
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
searchRestaurants = (item) => {
    return new Promise((resolve, reject) => {
        let sql = 'select restaurantId,restaurantName,restaurantCuisine,restaurantAddress from restaurant where restaurantId in (SELECT restaurantId FROM menuItems where ItemName like "%' + item + '%")'
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve(JSON.parse(JSON.stringify(results)));
        });
    });
};
buyerUpdate = ({ data }) => {
    return new Promise((resolve, reject) => {
        let sql = 'update buyer set buyerFirstName="' + data.firstName + '",buyerLastName="' + data.lastName + '",buyerEmail ="' + data.email + '",buyerPhone="' + data.phone + '",buyerAddress="' + data.address + '"  where buyerID="' + data.ID + '"'
        pool.query(sql, (err, results) => {
            if (err) resolve({ status: 500, msg: 'Something went Wrong' });
            resolve({ status: 200, msg: 'Successfully updated' });
        });
    });
};
loginBuyer = ({ data }) => {
    return new Promise((resolve, reject) => {
        let sql = `SELECT buyerPassword FROM buyer where buyerEmail ="` + data.email + `"`;
        pool.query(sql, (err, results) => {
            if (err) resolve({ msg: 'Something went wrong', status: 500 });
            else if (results.length == 0) {
                resolve({ msg: 'No user with that email', status: 500 });
            }
            else {
                var row = JSON.parse(JSON.stringify(results[0]));
                bcrypt.compare(data.password, row.buyerPassword, function (err, result) {
                    if (result != true) {
                        resolve({ status: 500, msg: 'Invalid Password' });
                    } else {
                        resolve({ status: 200, msg: 'Successful Login' });
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