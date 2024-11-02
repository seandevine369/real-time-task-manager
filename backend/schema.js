const { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLID } = require('graphql');

// Define a simple Query type
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    message: {
      type: GraphQLString,
      resolve: () => 'Hello from GraphQL!'
    }
  }
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString }
    }

})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, {name, email}) => {
                const newUser = {id: Date.now().toString(), name, email };
                return newUser
            }
        }
    }
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});
