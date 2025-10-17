const express = require('express')
const { createHandler } = require('graphql-http/lib/use/express'); // Import graphql-http's Express handler
const schema = require('./schema/index');
const { connectDB } = require('./config/dbConfig');

const app = express()
const PORT = process.env.PORT || 4000;
// Middleware to parse JSON requests

app.use(express.json());

// GraphQL endpoint
app.use('/graphql', createHandler({
  schema: schema
}));

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server due to database connection error:', err.message);
    process.exit(1); // Exit with failure
  });

module.exports = app;