const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID } = require('graphql');
const logger = require('./logger');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('./db/users');
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('./db/tasks');

const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        user_id: { type: GraphQLID }, // Link the task to a user,
        status: { type: GraphQLString }
    }
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: async (user) => {
                logger.info(`Fetching tasks for user with ID ${user.id}`);
                return getAllTasks().then(tasks => tasks.filter(task => task.user_id === user.id));
            }
        }
    }
});


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: () => {
                logger.info('GraphQL Query: Fetching all users');
                return getAllUsers();
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => {
                logger.info(`GraphQL Query: Fetching user with ID ${args.id}`);
                return getUserById(args.id);
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: () => {
                logger.info('GraphQL Query: Fetching all tasks');
                return getAllTasks();
            }
        },
        task: {
            type: TaskType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => {
                logger.info(`GraphQL Query: Fetching task with ID ${args.id}`);
                return getTaskById(args.id);
            }
        }
    }
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // could be buged because createUser in resolver may not return UserType
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                logger.info(`GraphQL Mutation: Adding new user with email ${args.email}`);
                return createUser(args.name, args.email);
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                logger.info(`GraphQL Mutation: Updating user with ID ${args.id}`);
                return updateUser(args.id, args.name, args.email);
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (parent, args) => {
                logger.info(`GraphQL Mutation: Deleting user with ID ${args.id}`);
                return deleteUser(args.id);
            }
        },
        createTask: {
            type: TaskType,
            args: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                user_id: { type: GraphQLID }
            },
            resolve: (parent, args) => {
                logger.info(`GraphQL Mutation: Creating new task for user ID ${args.user_id}`);
                return createTask(args.title, args.description, args.user_id);
            }
        },
        updateTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                logger.info(`GraphQL Mutation: Updating task with ID ${args.id}`);
                return updateTask(args.id, args.title, args.description, args.statusƒ);
            }
        },
        deleteTask: {
            type: TaskType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (parent, args) => {
                logger.info(`GraphQL Mutation: Deleting task with ID ${args.id}`);
                return deleteTask(args.id);
            }
        }
    }
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});
