// tests/task.test.js
const { app, request } = require('./setup');

describe('Task API', () => {
  let createdTaskId;
  const testUserId = "1"; // Adjust this ID according to your test setup

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            createTask(title: "Sample Task", description: "Test Description", user_id: "${testUserId}") {
              id
              title
              description
              user_id
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.createTask.title).toBe('Sample Task');
    expect(res.body.data.createTask.description).toBe('Test Description');
    createdTaskId = res.body.data.createTask.id;
  });

  it('should fetch a task by ID', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            task(id: "${createdTaskId}") {
              id
              title
              description
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.task.id).toBe(createdTaskId);
    expect(res.body.data.task.title).toBe('Sample Task');
  });

  it('should update a task', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            updateTask(id: "${createdTaskId}", title: "Updated Task Title") {
              id
              title
              description
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.updateTask.title).toBe('Updated Task Title');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          mutation {
            deleteTask(id: "${createdTaskId}") {
              id
              title
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.deleteTask.id).toBe(createdTaskId);
  });

  it('should return an error if task ID does not exist', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            task(id: "nonexistent-id") {
              id
              title
            }
          }
        `,
      });
    expect(res.statusCode).toEqual(404);
  });
});
