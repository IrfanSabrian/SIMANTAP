const express = require("express");
const { prisma } = require("../prisma");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate slug from judul
function generateSlug(judul) {
  return judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ============================================
// PUBLIC ROUTES (untuk website)
// ============================================

// GET semua dokumen PPID (published)
router.get("/", async (req, res) => {
  try {
    const { limit, kategori, tahun } = req.query;

    const where = {
      status: "published",
      ...(kategori && { kategori }),
      ...(tahun && { tahun }),
    };

    const dokumen = await prisma.dokumenPpid.findMany({
      where,
      orderBy: {
        tanggalPublikasi: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    res.json(dokumen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET satu dokumen by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const dokumen = await prisma.dokumenPpid.findUnique({
      where: { slug: req.params.slug },
    });

    if (!dokumen) {
      return res.status(404).json({ error: "Dokumen tidak ditemukan" });
    }

    res.json(dokumen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST increment download count
router.post("/download/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const dokumen = await prisma.dokumenPpid.update({
      where: {
        id: parseInt(id),
      },
      data: {
        jumlahUnduhan: {
          increment: 1,
        },
      },
    });

    res.json({ success: true, jumlahUnduhan: dokumen.jumlahUnduhan });
  } catch (error) {
    console.error("Error incrementing download count:", error);
    // Don't fail the download if tracking fails
    res.json({ success: false, error: error.message });
  }
});

// GET download file (serve dari local storage)
router.get("/download-file/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[Download] Request for dokumen ID: ${id}`);

    // Get dokumen data
    const dokumen = await prisma.dokumenPpid.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!dokumen) {
      console.error(`[Download] Dokumen not found: ${id}`);
      return res.status(404).json({ error: "Dokumen tidak ditemukan" });
    }

    console.log(`[Download] Found dokumen: ${dokumen.judul}`);
    console.log(`[Download] File URL: ${dokumen.urlFile}`);

    // Extract file extension
    const extension = dokumen.namaFile.split(".").pop() || "pdf";

    // Clean judul for filename
    const cleanJudul = dokumen.judul
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "_")
      .replace(/-+/g, "-")
      .substring(0, 100);

    const downloadFilename = `${cleanJudul}.${extension}`;

    // Increment download count
    await prisma.dokumenPpid.update({
      where: {
        id: parseInt(id),
      },
      data: {
        jumlahUnduhan: {
          increment: 1,
        },
      },
    });

    // Determine if file is local or from Cloudinary
    if (dokumen.urlFile.startsWith("/uploads")) {
      // Local file
      const filePath = path.join(process.cwd(), "public", dokumen.urlFile);

      console.log(`[Download] Serving local file: ${filePath}`);

      if (!fs.existsSync(filePath)) {
        console.error(`[Download] File not found: ${filePath}`);
        return res
          .status(404)
          .json({ error: "File tidak ditemukan di server" });
      }

      // Set headers for download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(downloadFilename)}"`
      );
      res.setHeader("Content-Type", `application/${extension}`);

      // Send file
      res.sendFile(filePath);
      console.log(`[Download] File sent successfully`);
    } else {
      // Legacy Cloudinary file - return error message
      console.error(`[Download] Legacy Cloudinary file detected`);
      return res.status(400).json({
        error:
          "File ini menggunakan Cloudinary (legacy). Silakan upload ulang file.",
      });
    }
  } catch (error) {
    console.error("[Download URL] Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ADMIN ROUTES (untuk dashboard management)
// ============================================

// GET semua dokumen PPID (untuk management)
router.get("/admin/all", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, kategori, tahun, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (status) {
      where.status = status;
    }

    if (kategori) {
      where.kategori = kategori;
    }

    if (tahun) {
      where.tahun = tahun;
    }

    if (search) {
      where.OR = [
        { judul: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
      ];
    }

    const [dokumen, total] = await Promise.all([
      prisma.dokumenPpid.findMany({
        where,
        orderBy: {
          diperbaruiPada: "desc",
        },
        skip,
        take,
      }),
      prisma.dokumenPpid.count({ where }),
    ]);

    res.json({
      success: true,
      data: dokumen,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching all dokumen PPID:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET satu dokumen by ID (untuk edit)
router.get("/admin/:id", async (req, res) => {
  try {
    const dokumen = await prisma.dokumenPpid.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!dokumen) {
      return res.status(404).json({
        success: false,
        error: "Dokumen tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: dokumen,
    });
  } catch (error) {
    console.error("Error fetching dokumen PPID:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST - Create dokumen PPID baru
router.post("/admin", async (req, res) => {
  try {
    const {
      judul,
      deskripsi,
      kategori,
      urlFile,
      namaFile,
      tahun,
      nomorDokumen,
      status,
      tanggalPublikasi,
    } = req.body;

    // Validasi
    if (!judul || !urlFile || !namaFile) {
      return res.status(400).json({
        success: false,
        error: "Judul, URL file, dan nama file wajib diisi",
      });
    }

    // Generate slug
    let slug = generateSlug(judul);

    // Check if slug already exists
    const existingDokumen = await prisma.dokumenPpid.findUnique({
      where: { slug },
    });

    if (existingDokumen) {
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
    }

    // Create dokumen
    const newDokumen = await prisma.dokumenPpid.create({
      data: {
        judul,
        slug,
        deskripsi,
        kategori,
        urlFile,
        namaFile,
        tahun: tahun ? String(tahun) : null,
        nomorDokumen,
        status: status || "draft",
        tanggalPublikasi: tanggalPublikasi
          ? new Date(tanggalPublikasi)
          : status === "published"
          ? new Date()
          : null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Dokumen PPID berhasil dibuat",
      data: newDokumen,
    });
  } catch (error) {
    console.error("Error creating dokumen PPID:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT - Update dokumen PPID
router.put("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul,
      deskripsi,
      kategori,
      urlFile,
      namaFile,
      tahun,
      nomorDokumen,
      status,
      tanggalPublikasi,
    } = req.body;

    // Check if dokumen exists
    const existingDokumen = await prisma.dokumenPpid.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDokumen) {
      return res.status(404).json({
        success: false,
        error: "Dokumen tidak ditemukan",
      });
    }

    // Prepare update data
    const updateData = {
      deskripsi,
      kategori,
      urlFile,
      namaFile,
      tahun: tahun ? String(tahun) : null,
      nomorDokumen,
      status,
    };

    // Update judul and slug if changed
    if (judul && judul !== existingDokumen.judul) {
      let newSlug = generateSlug(judul);

      // Check if new slug already exists
      const slugExists = await prisma.dokumenPpid.findFirst({
        where: {
          slug: newSlug,
          NOT: { id: parseInt(id) },
        },
      });

      if (slugExists) {
        const timestamp = Date.now();
        newSlug = `${newSlug}-${timestamp}`;
      }

      updateData.judul = judul;
      updateData.slug = newSlug;
    }

    // Update tanggal publikasi
    if (tanggalPublikasi !== undefined) {
      updateData.tanggalPublikasi = tanggalPublikasi
        ? new Date(tanggalPublikasi)
        : null;
    } else if (status === "published" && !existingDokumen.tanggalPublikasi) {
      // Auto set tanggal publikasi if status changed to published
      updateData.tanggalPublikasi = new Date();
    }

    // Update dokumen
    const updatedDokumen = await prisma.dokumenPpid.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Dokumen PPID berhasil diupdate",
      data: updatedDokumen,
    });
  } catch (error) {
    console.error("Error updating dokumen PPID:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE - Hapus dokumen PPID
router.delete("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if dokumen exists
    const existingDokumen = await prisma.dokumenPpid.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDokumen) {
      return res.status(404).json({
        success: false,
        error: "Dokumen tidak ditemukan",
      });
    }

    // Delete dokumen
    await prisma.dokumenPpid.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Dokumen PPID berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting dokumen PPID:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

