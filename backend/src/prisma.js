const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

// Check DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not defined in .env file!");
  console.error("Please create .env file with DATABASE_URL");
  process.exit(1);
}

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

// Test database connection
prisma
  .$connect()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    console.error("\nPlease check:");
    console.error("1. DATABASE_URL in .env file is correct");
    console.error("2. PostgreSQL server is running");
    console.error("3. Database exists");
    console.error("4. Run: npx prisma generate");
  });

module.exports = { prisma };

