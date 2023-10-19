import createServer from "../server";
import request from "supertest";
import AppDataSource from "../util/data-source";
import RedisClient from "../util/client";

const app = createServer();
const authToken = process.env.TEST_TOKEN;

describe("TODO API TEST", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.close();
    await RedisClient.quit();
  });

  describe("Create a todo", () => {
    it("No Input data is passed", async () => {
      const response = await request(app)
        .post("/todo/create-todo")
        .send({})
        .set("Content-Type", "application/json")
        .set("Authorization", `${authToken}`);
      expect(response.status).toBe(400);
    });

    it("Successfully created todo", async () => {
      const response = await request(app)
        .post("/todo/create-todo")
        .send({
          task: "TestApp",
        })
        .set("Content-Type", "application/json")
        .set("Authorization", `${authToken}`);
      expect(response.status).toBe(201);
    });
  });

  describe("Get Todo", () => {
    it("Fetched All Todos Success", async () => {
      const response = await request(app)
        .get("/todo/get-todo")
        .set("Content-Type", "application/json")
        .set("Authorization", `${authToken}`);
      expect(response.status).toBe(200);
    });

    it("Failed to fetch All Todos", async () => {
      const response = await request(app)
        .get("/todo/get-todo")
        .set("Content-Type", "application/json")
        .set("Authorization", "dummy");
      expect(response.status).toBe(401);
    });
  });

  describe("Delete Todo", () => {
    it("Todo id not found", async () => {
      const response = await request(app)
        .delete("/todo/del-todo/1")
        .set("Content-Type", "application/json")
        .set("Authorization", `${authToken}`);
      expect(response.status).toBe(404);
    });

    it("User not authorized to delete todo", async () => {
      const response = await request(app)
        .delete("/todo/del-todo/9")
        .set("Content-Type", "application/json")
        .set("Authorization", `${authToken}`);
      expect(response.status).toBe(403);
    });

    it("Successfully delete todo", async () => {
      const response = await request(app)
        .delete("/todo/del-todo/27")
        .set("Content-Type", "application/json")
        .set("Authorization", `${authToken}`);
      expect(response.status).toBe(204);
    });
  });
});
