import createServer from "../server";
import request from "supertest";
import AppDataSource from "../util/data-source";

const app = createServer();

describe("API Tests", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.close();
  });

  it("should get users from the API", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
  });

  it("Should register user", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        email: "user1@gmail.com",
        username: "user1",
        password: "test123",
      })
      .set("Content-Type", "application/json");
    expect(response.status).toBe(201);
  });

  it("User Already Exists", async () => {
    const response = await request(app)
      .post("/user/register")
      .send({
        email: "user1@gmail.com",
        username: "user1",
        password: "test123",
      })
      .set("Content-Type", "application/json");
    expect(response.status).toBe(400);
  });
});
