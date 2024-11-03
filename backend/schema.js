const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID } = require('graphql');

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: {
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      userId: { type: GraphQLID } // Link the post to a user
    }
  });

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        posts: {
            type: new GraphQLList(PostType),
            resolve: (user) => posts.filter(post => post.userId === user.id) // Fetch posts for the user
        }
    }

})

// Sample data array
const users = [];
let posts = []; 

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
    posts: {
        type: new GraphQLList(PostType),
        resolve: () => posts
      },
  
      post: {
        type: PostType,
        args: { id: { type: GraphQLID } },
        resolve: (parent, args) => posts.find(post => post.id === args.id)
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
        },
        //could add check that user exists
        createPost: {
            type: PostType,
            args: {
              title: { type: GraphQLString },
              content: { type: GraphQLString },
              userId: { type: GraphQLID }
            },
            resolve: (parent, args) => {
              const newPost = {
                id: `${posts.length + 1}`, // Simple ID generation
                title: args.title,
                content: args.content,
                userId: args.userId
              };
              posts.push(newPost);
              return newPost;
            }
          },
          updatePost: {
            type: PostType,
            args: {
              id: { type: GraphQLID },
              title: { type: GraphQLString },
              content: { type: GraphQLString }
            },
            resolve: (parent, args) => {
              const post = posts.find(post => post.id === args.id);
              if (!post) {
                throw new Error('Post not found');
              }
          
              // Update fields if provided
              if (args.title) post.title = args.title;
              if (args.content) post.content = args.content;
          
              return post;
            }
          },
          deletePost: {
            type: PostType,
            args: {
              id: { type: GraphQLID }
            },
            resolve: (parent, args) => {
              const postIndex = posts.findIndex(post => post.id === args.id);
              if (postIndex === -1) {
                throw new Error('Post not found');
              }
              const deletedPost = posts.splice(postIndex, 1)[0];
              return deletedPost;
            }
          }
    }
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});
