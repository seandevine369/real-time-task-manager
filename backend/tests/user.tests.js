// tests/user.test.js
const { app, request } = require('./setup');

describe('User API', () => {
  let createdUserId;

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            addUser(name: "Test User", email: "test@example.com") {
              id
              name
              email
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.addUser.name).toBe('Test User');
    expect(res.body.data.addUser.email).toBe('test@example.com');
    createdUserId = res.body.data.addUser.id;
  });

  it('should fetch a specific user by ID', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            user(id: "${createdUserId}") {
              id
              name
              email
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.user.id).toBe(createdUserId);
    expect(res.body.data.user.name).toBe('Test User');
  });

  it('should fetch all users', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            users {
              id
              name
              email
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data.users)).toBe(true);
  });

  it('should not create a user with duplicate email', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            addUser(name: "Duplicate User", email: "test@example.com") {
              id
              name
              email
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(400); // Assuming you handle duplicates with a 400 error
  });

  it('should delete a user by ID', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            deleteUser(id: "${createdUserId}") {
              id
              name
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.deleteUser.id).toBe(createdUserId);
  });
});
