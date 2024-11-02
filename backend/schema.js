const { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLID } = require('graphql');


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString }
    }

})

// Sample data array
const users = [];

// Define a simple Query type
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
        type: new GraphQLList(UserType),
        resolve: () => users
    },
    user: {
        type: UserType,
        args: {id: {type: GraphQLID}},
        resolve: (parent, args) => users.find(user => user.id == args.id)
    },
    message: {
      type: GraphQLString,
      resolve: () => 'Hello from GraphQL!'
    }
  }
});

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
                users.push(newUser);
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
