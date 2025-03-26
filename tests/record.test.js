import request from "supertest";
import { app, startServer, stopServer } from "../src/app.js";
import { Record } from "../src/models/record.js";
import xlsx from "xlsx";
import { close } from "../src/db.js";

// Mock the Record model
jest.mock("../src/models/record.js");

let server;

beforeAll(async () => {
  // Start the server
  server = await startServer(3002);
  jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress logs
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(async () => {
  // Stop the server and close the database connection
  await stopServer();
  await close();
  jest.restoreAllMocks(); // Restore original console methods
});

describe("POST /api/records/bulk-insert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should insert records from JSON body", async () => {
    Record.bulkCreate.mockResolvedValue([
      { name: "Alice", email: "alice@example.com", phone: "1234567890" },
      { name: "Bob", email: "bob@example.com", phone: "9876543210" },
    ]);

    const response = await request(app)
      .post("/api/records/bulk-insert")
      .send({
        records: [
          { name: "Alice", email: "alice@example.com", phone: "1234567890" },
          { name: "Bob", email: "bob@example.com", phone: "9876543210" },
        ],
      })
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body.records).toHaveLength(2);
    expect(response.body.records[0].name).toBe("Alice");
  });

  it("should insert records from an Excel file", async () => {
    Record.bulkCreate.mockResolvedValue([
      { name: "Alice", email: "alice@example.com", phone: "1234567890" },
    ]);

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet([
      { name: "Alice", email: "alice@example.com", phone: "1234567890" },
    ]);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    const response = await request(app)
      .post("/api/records/bulk-insert")
      .attach("file", buffer, "bulk_data.xlsx");

    expect(response.status).toBe(201);
    expect(response.body.records).toHaveLength(1);
    expect(response.body.records[0].name).toBe("Alice");
  });

  it("should return 400 if no file or JSON data is provided", async () => {
    const response = await request(app).post("/api/records/bulk-insert");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No file or records provided");
  });
});
