const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');

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

module.exports = TaskType;