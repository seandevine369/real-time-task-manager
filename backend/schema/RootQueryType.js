const { GraphQLObjectType, GraphQLList, GraphQLID } = require('graphql');
const UserType = require('./UserType');
const TaskType = require('./TaskType');
const { getAllUsers, getUserById } = require('../models/userModel');
const { getAllTasks, getTaskById } = require('../models/taskModel');
const logger = require('../logger');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: getAllUsers
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve: (_, args) => getUserById(args.id)
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: getAllTasks
        },
        task: {
            type: TaskType,
            args: { id: { type: GraphQLID } },
            resolve: (_, args) => getTaskById(args.id)
        }
    }
});

module.exports = RootQueryType;