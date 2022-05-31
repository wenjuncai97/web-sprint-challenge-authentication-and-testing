const request = require('supertest')
const server = require('./server')
const db =  require('../data/dbConfig')
const bcrypt = require('bcryptjs/dist/bcrypt')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe("auth-router.js", () => {
  describe("POST /api/auth/register", () => {
    test("[1] - creates a new user", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "baz", password: "12345" });
      const baz = await db("users").where("username", "baz").first();
      expect(baz).toMatchObject({ username: "baz" });
    });

    test("[2] - saves the user with a bcrypted password instead of plain text", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "baz", password: "12345" });
      const baz = await db("users").where("username", "baz").first();
      expect(bcrypt.compareSync("12345", baz.password)).toBeTruthy();
    });

    test("[3] - responds with the correct error message when no username or password", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "", password: "" });
      expect(res.body.message).toMatch(/username and password required/i);
    });
  });

  describe('[GET] /api/jokes', () => {
    it('[4] requests without token bounce with proper status and message', async() => {
      const res = await request(server).get('/api/jokes')
      expect(res.body.message).toMatch(/token required/i)
    }, 750)
    it('[5] requests with invalid token bounced with appropriate message', async() => {
      const res = await request(server).get('/api/jokes').set('Authorization', 'someText')
      expect(res.body.message).toMatch(/token invalid/i)
    }, 750)
  })

  describe('[POST] /api/auth/login', () => {
    it('[6] correct status on valid credentials', async() =>{
      const res = await request(server)
                        .post('/api/auth/login')
                        .send({ username: 'bib', password: '1234' })
      expect(res.status).toBe(401)
    }, 750)
    it('[7] correct message on invalid login', async() => {
      let res = await request(server)
                      .post('/api/auth/login')
                      .send({ username: 'blimp', password: '1234'})
      expect(res.body.message).toMatch(/invalid credentials/i)
    }, 750)
  })
})
