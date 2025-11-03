const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { PrismaClient, Prisma } = require("@prisma/client");
const nodemailer = require("nodemailer");
const cloudinary = require("../config/cloudinary");

// Email service configuration - disabled for Railway (free tier)
// Will be enabled for paid hosting
let emailServiceEnabled = false;

// Check if we're on Railway (free tier) - disable email
if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === "production") {
  console.log("ℹ️  Email service disabled");
  emailServiceEnabled = false;
} else {
  console.log("ℹ️  Email service ready for paid hosting");
  emailServiceEnabled = true;
}

const router = express.Router();
const prisma = new PrismaClient();

// Helper: Convert BigInt to String for JSON serialization
const serializeBigInt = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeBigInt(value);
    }
    return result;
  }
  return obj;
};
// Simple email transporter - only for paid hosting
let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS && emailServiceEnabled) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure:
        String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: false,
      logger: false,
    });
    console.log("✅ Email transporter configured:", process.env.SMTP_USER);
  } catch (error) {
    console.error("❌ Error setting up email transporter:", error.message);
    transporter = null;
  }
} else if (!emailServiceEnabled) {
  console.log("ℹ️  Email service disabled for Railway free tier");
} else {
  console.warn("⚠️  SMTP not configured - emails will not be sent");
}

// Test email connection on startup
const testEmailConnection = async () => {
  if (!transporter) {
    console.warn("⚠️  No email transporter available for testing");
    return false;
  }

  try {
    console.log("🔍 Testing email connection...");
    await transporter.verify();
    console.log("✅ Email connection verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Email connection test failed:", error.message);
    return false;
  }
};

// Test connection on startup (non-blocking)
if (transporter) {
  testEmailConnection().catch(console.error);
}

// Simple email sending function
const sendEmail = async (to, subject, html) => {
  if (!transporter) {
    throw new Error("Email transporter not available");
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    console.log("📧 Sending email to:", to);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! MessageId:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};

const sendStatusEmail = async (
  { to, nomorRuas, status, description },
  retryCount = 0
) => {
  if (!to) {
    console.warn("⚠️  No recipient email provided");
    return;
  }

  // Skip jika email service tidak diaktifkan
  if (!emailServiceEnabled) {
    console.log("📧 Email service disabled, skipping email send");
    return;
  }

  // Skip jika transporter belum dikonfigurasi
  if (!transporter) {
    console.warn("⚠️  Email transporter not configured, skipping email send");
    return;
  }

  // Fetch road details from jalan_lingkungan_kubu_raya table
  let roadDetails = null;
  try {
    const roadRows = await prisma.$queryRaw(
      Prisma.sql`
        SELECT nama_jalan, kecamatan, desa 
        FROM jalan_lingkungan_kubu_raya 
        WHERE no_ruas = ${nomorRuas}
        LIMIT 1
      `
    );
    roadDetails = roadRows && roadRows[0] ? roadRows[0] : null;
  } catch (error) {
    console.warn("⚠️  Could not fetch road details:", error.message);
  }

  const subject = `SIMANTAP KUBU RAYA - Status Aduan Ruas ${nomorRuas}: ${status}`;

  const statusMap = {
    diajukan: {
      label: "Diajukan",
      color: "#2563eb",
      bg: "#dbeafe",
      icon: "📋",
    },
    ditinjau: {
      label: "Ditinjau",
      color: "#f59e0b",
      bg: "#fef3c7",
      icon: "🔍",
    },
    selesai: { label: "Selesai", color: "#10b981", bg: "#d1fae5", icon: "✅" },
    ditolak: { label: "Ditolak", color: "#ef4444", bg: "#fee2e2", icon: "❌" },
  };

  const statusInfo = statusMap[status] || statusMap.diajukan;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:20px 0">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);padding:30px 40px;text-align:center">
                  <!-- Title and subtitle -->
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;letter-spacing:2px">SIMANTAP</h1>
                  <p style="margin:8px 0 0 0;color:#dbeafe;font-size:14px;font-weight:400">Sistem Informasi Manajemen Tata Permukiman - Kab. Kubu Raya</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding:40px">
                  <h2 style="margin:0 0 20px 0;color:#111827;font-size:20px">Informasi Status Aduan</h2>
                  <p style="margin:0 0 24px 0;color:#4b5563;line-height:1.6">Halo,</p>
                  <p style="margin:0 0 24px 0;color:#4b5563;line-height:1.6">
                    Terima kasih telah melaporkan aduan jalan melalui sistem SIMANTAP. Berikut adalah informasi terkait laporan Anda:
                  </p>
                  
                  <!-- Info Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:24px">
                    <tr>
                      <td style="padding:20px">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color:#6b7280;font-size:13px;padding-bottom:8px">Nomor Ruas</td>
                          </tr>
                          <tr>
                            <td style="color:#111827;font-size:16px;font-weight:600;padding-bottom:16px">${nomorRuas}</td>
                          </tr>
                          ${
                            roadDetails
                              ? `
                          <tr>
                            <td style="color:#6b7280;font-size:13px;padding-bottom:8px">Nama Jalan</td>
                          </tr>
                          <tr>
                            <td style="color:#111827;font-size:16px;font-weight:600;padding-bottom:16px">${
                              roadDetails.nama_jalan || "Tidak tersedia"
                            }</td>
                          </tr>
                          <tr>
                            <td style="color:#6b7280;font-size:13px;padding-bottom:8px">Lokasi</td>
                          </tr>
                          <tr>
                            <td style="color:#111827;font-size:16px;font-weight:600;padding-bottom:16px">${
                              roadDetails.kecamatan || "Tidak tersedia"
                            }, ${roadDetails.desa || "Tidak tersedia"}</td>
                          </tr>
                          `
                              : ""
                          }
                          <tr>
                            <td style="color:#6b7280;font-size:13px;padding-bottom:8px">Status Laporan</td>
                          </tr>
                          <tr>
                            <td>
                              <div style="display:inline-block;background-color:${
                                statusInfo.bg
                              };color:${
    statusInfo.color
  };padding:8px 16px;border-radius:20px;font-size:14px;font-weight:600">
                                ${statusInfo.icon} ${statusInfo.label}
                              </div>
                            </td>
                          </tr>
                          ${
                            description
                              ? `
                          <tr>
                            <td style="color:#6b7280;font-size:13px;padding-top:16px;padding-bottom:8px">Keterangan</td>
                          </tr>
                          <tr>
                            <td style="color:#4b5563;font-size:14px;line-height:1.6">${description}</td>
                          </tr>
                          `
                              : ""
                          }
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin:0 0 16px 0;color:#4b5563;line-height:1.6">
                    Kami akan terus memberikan update terkait perkembangan laporan Anda.
                  </p>
                  <p style="margin:0;color:#4b5563;line-height:1.6">
                    Terima kasih atas partisipasi Anda dalam meningkatkan kualitas jalan di Kabupaten Kubu Raya.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
                  <p style="margin:0 0 8px 0;color:#6b7280;font-size:12px;line-height:1.6">
                    Email ini dikirim secara otomatis oleh sistem SIMANTAP. Mohon tidak membalas email ini.
                  </p>
                  <p style="margin:0;color:#9ca3af;font-size:11px">
                    © 2025 SIMANTAP KUBU RAYA - Kabupaten Kubu Raya
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    console.log(
      `📧 Sending email to ${to} - Status: ${status} (Attempt ${
        retryCount + 1
      })`
    );

    const result = await sendEmail(to, subject, html);
    return result;
  } catch (error) {
    console.error(
      `❌ Error sending email (Attempt ${retryCount + 1}):`,
      error.message
    );

    // Simple retry logic for connection timeouts
    const maxRetries = 2;
    const retryableErrors = [
      "ETIMEDOUT",
      "ECONNRESET",
      "ENOTFOUND",
      "ECONNREFUSED",
      "EHOSTUNREACH",
    ];

    if (retryCount < maxRetries && retryableErrors.includes(error.code)) {
      console.log(
        `🔄 Retrying email send in 3 seconds... (${
          retryCount + 1
        }/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return sendStatusEmail(
        { to, nomorRuas, status, description },
        retryCount + 1
      );
    }

    // Log final failure
    console.error(`❌ Email send failed after ${retryCount + 1} attempts:`, {
      error: error.message,
      attempts: retryCount + 1,
    });

    // Tidak throw error, hanya log saja agar proses tidak terganggu
    return { success: false, error: error.message, attempts: retryCount + 1 };
  }
};

// Setup Cloudinary storage
let storage, upload;

try {
  console.log("Setting up Cloudinary storage...");
  console.log("Cloudinary config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "***" : "NOT SET",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "NOT SET",
    folder: process.env.CLOUDINARY_FOLDER || "SIMANTAP",
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      const nomorRuas = req.body.nomor_ruas || "unknown";
      return {
        folder: `${
          process.env.CLOUDINARY_FOLDER || "SIMANTAP"
        }/aduan/${nomorRuas}`,
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [{ width: 1200, height: 1200, crop: "limit" }],
      };
    },
  });

  upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 10 }, // 10MB limit per file, max 10 files
  });

  console.log("✅ Cloudinary storage configured successfully");
} catch (error) {
  console.error("❌ Error setting up Cloudinary storage:", error);
  // Fallback to memory storage if Cloudinary fails
  const multer = require("multer");
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  });
  console.log("⚠️  Using memory storage as fallback");
}

// GET /api/aduan - list semua aduan dengan pagination dan filter
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status || null;

    const [rows, total] = await Promise.all([
      prisma.$queryRaw`
        SELECT * FROM aduan
        ${status ? Prisma.sql`WHERE status = ${status}` : Prisma.empty}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      prisma.$queryRaw`
        SELECT COUNT(*)::int as total FROM aduan
        ${status ? Prisma.sql`WHERE status = ${status}` : Prisma.empty}
      `,
    ]);

    const totalCount = total && total[0] ? total[0].total : 0;

    // Use JSON.stringify with replacer to handle BigInt serialization
    const serializedData = JSON.parse(
      JSON.stringify(rows || [], (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return res.json({
      success: true,
      data: serializedData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.error("GET /api/aduan error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Terjadi kesalahan" });
  }
});

// POST /api/aduan - terima form multipart dan simpan ke DB + upload ke Cloudinary
router.post("/", upload.array("photos", 10), async (req, res) => {
  try {
    console.log("POST /api/aduan - Request received");
    console.log("Body:", req.body);
    console.log("Files:", req.files ? req.files.length : 0);

    const nomorRuas = (req.body.nomor_ruas || "").trim();
    const namaPelapor = (req.body.nama_pelapor || "").trim() || null;
    const anonim = String(req.body.anonim).toLowerCase() === "true";
    const description = (req.body.description || "").trim() || null;
    const email = (req.body.email || "").trim() || null;

    if (!nomorRuas) {
      console.log("Error: nomor_ruas is required");
      return res
        .status(400)
        .json({ success: false, error: "nomor_ruas wajib diisi" });
    }

    // Get uploaded photos URLs from Cloudinary
    const photos = req.files ? req.files.map((file) => file.path) : [];
    console.log("Photos URLs:", photos);

    console.log("About to insert into database...");
    console.log("Insert data:", {
      nomorRuas,
      namaPelapor: anonim ? null : namaPelapor,
      anonim,
      description,
      email,
      photos: photos.length,
      photosArray: photos,
    });

    // Insert menggunakan Prisma ORM biasa (lebih aman untuk array)
    const created = await prisma.aduan.create({
      data: {
        nomorRuas,
        namaPelapor: anonim ? null : namaPelapor,
        anonim,
        description,
        email,
        photos: photos, // Prisma akan handle array dengan benar
        status: "diajukan",
      },
    });

    console.log("Database insert result:", created);

    // Kirim email status "diajukan" ke pelapor bila ada email (async, tidak memblokir response)
    if (email && emailServiceEnabled) {
      setImmediate(async () => {
        try {
          await sendStatusEmail({
            to: email,
            nomorRuas: nomorRuas,
            status: "diajukan",
            description,
          });
        } catch (emailError) {
          console.error("Error sending status email:", emailError);
          // Continue even if email fails
        }
      });
    } else if (email) {
      console.log("📧 Email service disabled, skipping email notification");
    }

    return res.json({ success: true, data: serializeBigInt(created) });
  } catch (err) {
    console.error("POST /api/aduan error:", err);
    console.error("Error stack:", err.stack);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      name: err.name,
    });
    return res.status(500).json({
      success: false,
      error: err.message || "Terjadi kesalahan",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

// PATCH /api/aduan/:id/status - ubah status dan kirim email notifikasi
router.patch("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, description } = req.body || {};

    const allowed = ["diajukan", "ditinjau", "selesai", "ditolak"];
    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: "Status tidak valid" });
    }

    const rows = await prisma.$queryRaw(
      Prisma.sql`
        UPDATE aduan SET status = ${status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `
    );

    const updated = rows && rows[0] ? rows[0] : null;
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Aduan tidak ditemukan" });
    }

    // Kirim email notifikasi (async, tidak memblokir response)
    if (updated.email && emailServiceEnabled) {
      setImmediate(async () => {
        try {
          await sendStatusEmail({
            to: updated.email,
            nomorRuas: updated.nomor_ruas,
            status,
            description: description || updated.description,
          });
        } catch (emailError) {
          console.error("Error sending status email:", emailError);
          // Continue even if email fails
        }
      });
    } else if (updated.email) {
      console.log("📧 Email service disabled, skipping email notification");
    }

    return res.json({ success: true, data: serializeBigInt(updated) });
  } catch (err) {
    console.error("PATCH /api/aduan/:id/status error:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message || "Terjadi kesalahan" });
  }
});

module.exports = router;
