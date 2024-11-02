const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID } = require('graphql');


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

const isEmailInUse = (email, currentUserId = null) => {
    return users.some(user => user.email === email && user.id !== currentUserId);
  };

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
        resolve: (parent, args) => users.find(user => user.id === args.id)
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
                name: { type: GraphQLString },
                email: { type: GraphQLString }
            },
            resolve: (parent, args) => {
                if (!args.name || !args.email) {
                    throw new Error('Name and email are required fields');
                }
                
                if (isEmailInUse(args.email)) {
                    throw new Error('User with this email already exists');
                }

                const newUser = {
                    id: Date.now().toString(), 
                    name: args.name, 
                    email: args.email 
                };
                users.push(newUser);
                return newUser
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
                const user = users.find(user => user.id === args.id);
                if (!user) {
                    throw new Error("User not found");
                }

                if (args.name) user.name = args.name;
                if (args.email) {
                    if (isEmailInUse(args.email, user.id)) {
                        throw new Error('Email already in use');
                      }
                    user.email = args.email;
                }
                return user;
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (parent, args) => {
                const userIndex = users.findIndex(user => user.id === args.id);
                if (userIndex === -1) {
                    throw new Error('User not found');
                }

                // Remove user from the array
                const deletedUser = users.splice(userIndex, 1)[0];
                return deletedUser;
            }
        }
    }
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});
