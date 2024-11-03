const { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID } = require('graphql');
const logger = require('./logger');

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
});

// Sample data arrays
const users = [];
let posts = [];

const isEmailInUse = (email, currentUserId = null) => {
    return users.some(user => user.email === email && user.id !== currentUserId);
};

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve: () => {
                logger.info('Fetching all users');
                return users;
            }
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => {
                const user = users.find(user => user.id === args.id);
                if (!user) {
                    logger.warn(`User with ID ${args.id} not found`);
                    throw new Error('User not found');
                }
                logger.info(`Fetching user with ID ${args.id}`);
                return user;
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: () => {
                logger.info('Fetching all posts');
                return posts;
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => {
                const post = posts.find(post => post.id === args.id);
                if (!post) {
                    logger.warn(`Post with ID ${args.id} not found`);
                    throw new Error('Post not found');
                }
                logger.info(`Fetching post with ID ${args.id}`);
                return post;
            }
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
                    logger.error('Name and email are required fields');
                    throw new Error('Name and email are required fields');
                }

                if (isEmailInUse(args.email)) {
                    logger.warn(`Attempt to add user with duplicate email: ${args.email}`);
                    throw new Error('User with this email already exists');
                }

                const newUser = {
                    id: Date.now().toString(),
                    name: args.name,
                    email: args.email
                };
                users.push(newUser);
                logger.info(`Added new user with ID ${newUser.id}`);
                return newUser;
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
                    logger.warn(`User with ID ${args.id} not found for update`);
                    throw new Error("User not found");
                }

                if (args.name) user.name = args.name;
                if (args.email) {
                    if (isEmailInUse(args.email, user.id)) {
                        logger.warn(`Attempt to update user with duplicate email: ${args.email}`);
                        throw new Error('Email already in use');
                    }
                    user.email = args.email;
                }

                logger.info(`Updated user with ID ${args.id}`);
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
                    logger.warn(`User with ID ${args.id} not found for deletion`);
                    throw new Error('User not found');
                }

                const deletedUser = users.splice(userIndex, 1)[0];
                logger.info(`Deleted user with ID ${deletedUser.id}`);
                return deletedUser;
            }
        },
        createPost: {
            type: PostType,
            args: {
                title: { type: GraphQLString },
                content: { type: GraphQLString },
                userId: { type: GraphQLID }
            },
            resolve: (parent, args) => {
                const newPost = {
                    id: `${posts.length + 1}`,
                    title: args.title,
                    content: args.content,
                    userId: args.userId
                };
                posts.push(newPost);
                logger.info(`Created new post with ID ${newPost.id} for user ID ${args.userId}`);
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
                    logger.warn(`Post with ID ${args.id} not found for update`);
                    throw new Error('Post not found');
                }

                if (args.title) post.title = args.title;
                if (args.content) post.content = args.content;

                logger.info(`Updated post with ID ${args.id}`);
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
                    logger.warn(`Post with ID ${args.id} not found for deletion`);
                    throw new Error('Post not found');
                }

                const deletedPost = posts.splice(postIndex, 1)[0];
                logger.info(`Deleted post with ID ${deletedPost.id}`);
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
