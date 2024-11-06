const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');
const UserType = require('./UserType');
const TaskType = require('./TaskType');
const { createUser, updateUser, deleteUser } = require('../models/userModel');
const { createTask, updateTask, deleteTask } = require('../models/taskModel');
const logger = require('../logger');

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve: (_, args) => createUser(args.name, args.email)
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve:  (_, args) => updateUser(args.id, args.name, args.email)
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (_, args) => deleteUser(args.id)
        },
        createTask: {
            type: TaskType,
            args: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                user_id: { type: GraphQLID }
            },
            resolve: (_, args) => createTask(args.title, args.description, args.user_id)
        },
        updateTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString }
            },
            resolve:  (_, args) => updateTask(args.id, args.title, args.description, args.status)
        },
        deleteTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID }
            },
            resolve:  (_, args) => deleteTask(args.id)
        }
    }
});

module.exports = RootMutationType;