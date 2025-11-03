const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { prisma } = require("./prisma");

// Import routes
const jalanRoutes = require("./routes/jalan");
const authRoutes = require("./routes/auth");
const aduanRoutes = require("./routes/aduan");

let dokumentasiKegiatanRoutes,
  dokumentasiInfrastrukturRoutes,
  statsRoutes,
  chatbotRoutes;

try {
  console.log("Loading dokumentasi-kegiatan routes...");
  dokumentasiKegiatanRoutes = require("./routes/dokumentasi-kegiatan");
  console.log("✅ Dokumentasi kegiatan routes loaded");
} catch (error) {
  console.error("❌ Error loading dokumentasi-kegiatan routes:", error.message);
}

try {
  console.log("Loading dokumentasi-infrastruktur routes...");
  dokumentasiInfrastrukturRoutes = require("./routes/dokumentasi-infrastruktur");
  console.log("✅ Dokumentasi infrastruktur routes loaded");
} catch (error) {
  console.error(
    "❌ Error loading dokumentasi-infrastruktur routes:",
    error.message
  );
  console.error("Stack:", error.stack);
}

try {
  console.log("Loading stats routes...");
  statsRoutes = require("./routes/stats");
  console.log("✅ Stats routes loaded");
} catch (error) {
  console.error("❌ Error loading stats routes:", error.message);
}

try {
  console.log("Loading chatbot routes...");
  chatbotRoutes = require("./routes/chatbot");
  console.log("✅ Chatbot routes loaded");
} catch (error) {
  console.error("❌ Error loading chatbot routes:", error.message);
}

const app = express();

// Trust proxy for Railway deployment
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// Rate limiting (dapat dinonaktifkan via env)
const rateLimitEnabled = process.env.RATE_LIMIT_ENABLED !== "false"; // Default: enabled
if (rateLimitEnabled) {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // Default: 15 menit
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000; // Default: 1000 requests (lebih longgar)

  const limiter = rateLimit({
    windowMs: windowMs,
    max: maxRequests,
    message: {
      error: "Too many requests from this IP, please try again later.",
      limit: maxRequests,
      window: `${windowMs / 1000 / 60} minutes`,
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  app.use(limiter);
  console.log(
    `✅ Rate limiting enabled: ${maxRequests} requests per ${
      windowMs / 1000 / 60
    } minutes`
  );
} else {
  console.log("⚠️ Rate limiting disabled (RATE_LIMIT_ENABLED=false)");
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "https://sijali.vercel.app",
      "https://sijali-web.vercel.app",
    ];

    // Check if origin is in allowed list or matches patterns
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin) ||
      /^https:\/\/.*\.railway\.app$/.test(origin)
    ) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
};
app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Test endpoint untuk cek routes
app.get("/api/test-routes", (req, res) => {
  res.json({
    routes: {
      dokumentasiKegiatan: !!dokumentasiKegiatanRoutes,
      dokumentasiInfrastruktur: !!dokumentasiInfrastrukturRoutes,
      stats: !!statsRoutes,
    },
    message: "Backend routes status check",
  });
});

// API routes
app.use("/api/jalan", jalanRoutes);
app.use("/api/aduan", aduanRoutes);
app.use("/api/auth", authRoutes);

if (dokumentasiKegiatanRoutes) {
  app.use("/api/dokumentasi-kegiatan", dokumentasiKegiatanRoutes);
  console.log(
    "✅ Dokumentasi kegiatan routes registered at /api/dokumentasi-kegiatan"
  );
} else {
  console.warn(
    "⚠️ Dokumentasi kegiatan routes not registered (module failed to load)"
  );
}

if (dokumentasiInfrastrukturRoutes) {
  app.use("/api/dokumentasi-infrastruktur", dokumentasiInfrastrukturRoutes);
  console.log(
    "✅ Dokumentasi infrastruktur routes registered at /api/dokumentasi-infrastruktur"
  );
} else {
  console.warn(
    "⚠️ Dokumentasi infrastruktur routes not registered (module failed to load)"
  );
}

if (statsRoutes) {
  app.use("/api/stats", statsRoutes);
  console.log("✅ Stats routes registered at /api/stats");
} else {
  console.warn("⚠️ Stats routes not registered (module failed to load)");
}

if (chatbotRoutes) {
  app.use("/api/chatbot", chatbotRoutes);
  console.log("✅ Chatbot routes registered at /api/chatbot");
} else {
  console.warn("⚠️ Chatbot routes not registered (module failed to load)");
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON payload",
    });
  }

  res.status(500).json({
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
