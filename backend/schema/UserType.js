const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = require('graphql');
const TaskType = require('./TaskType');
const { getAllTasksByUserId } = require('../models/taskModel');
const logger = require('../logger');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: (user) => getAllTasksByUserId(user.id)
        }
    }
});

module.exports = UserType;