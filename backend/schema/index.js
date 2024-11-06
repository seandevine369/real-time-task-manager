const { GraphQLSchema } = require('graphql');
const RootQueryType = require('./RootQueryType');
const RootMutationType = require('./RootMutationType');

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});