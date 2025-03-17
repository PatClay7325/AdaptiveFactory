import express from "express";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Read database config from file
let dbConfig = JSON.parse(fs.readFileSync("dbConfig.json", "utf8"));

// Initialize Prisma with dynamic database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbConfig.DATABASE_URL,
    },
  },
});

// 📌 API to Get Current Database Config
app.get("/api/config", (req, res) => {
  res.json({ DATABASE_URL: dbConfig.DATABASE_URL });
});

// 📌 API to Update Database Config
app.post("/api/config", async (req, res) => {
  const { host, port, user, password, dbname } = req.body;
  const newDatabaseURL = `postgresql://${user}:${password}@${host}:${port}/${dbname}`;

  dbConfig.DATABASE_URL = newDatabaseURL;
  fs.writeFileSync("dbConfig.json", JSON.stringify(dbConfig, null, 2));

  res.json({ message: "Database settings updated!", DATABASE_URL: newDatabaseURL });
});

// 📌 API to Test Prisma Database Connection
app.get("/api/test-connection", async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Fetch sample data
    res.json({ status: "Connected", users });
  } catch (error) {
    res.status(500).json({ status: "Failed", error: error.message });
  }
});

// Start Backend Server
app.listen(4000, () => console.log("✅ Backend running on http://localhost:4000"));
