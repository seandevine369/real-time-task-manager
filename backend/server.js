const express = require('express')
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express()
const PORT = 4000

// Middleware to parse JSON requests
app.use(express.json());

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true // Enables the GraphiQL interface for testing queries
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
});