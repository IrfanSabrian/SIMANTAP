const express = require("express");
const { prisma } = require("../prisma");

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

// GET semua berita (published only)
router.get("/", async (req, res) => {
  try {
    const { limit, kategori } = req.query;

    const where = {
      status: "published",
      ...(kategori && { kategori }),
    };

    const berita = await prisma.berita.findMany({
      where,
      orderBy: {
        tanggalPublikasi: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    res.json(berita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET satu berita by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const berita = await prisma.berita.findUnique({
      where: { slug: req.params.slug },
    });

    if (!berita) {
      return res.status(404).json({ error: "Berita tidak ditemukan" });
    }

    res.json(berita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ADMIN ROUTES (untuk dashboard management)
// ============================================

// GET semua berita termasuk draft (untuk management)
router.get("/admin/all", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, kategori, search } = req.query;

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

    if (search) {
      where.OR = [
        { judul: { contains: search, mode: "insensitive" } },
        { konten: { contains: search, mode: "insensitive" } },
      ];
    }

    const [berita, total] = await Promise.all([
      prisma.berita.findMany({
        where,
        orderBy: {
          diperbaruiPada: "desc",
        },
        skip,
        take,
      }),
      prisma.berita.count({ where }),
    ]);

    res.json({
      success: true,
      data: berita,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching all berita:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET satu berita by ID (untuk edit)
router.get("/admin/:id", async (req, res) => {
  try {
    const berita = await prisma.berita.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!berita) {
      return res.status(404).json({
        success: false,
        error: "Berita tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: berita,
    });
  } catch (error) {
    console.error("Error fetching berita:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST - Create berita baru
router.post("/admin", async (req, res) => {
  try {
    const {
      judul,
      ringkasan,
      konten,
      thumbnail,
      kategori,
      penulis,
      waktuBaca,
      status,
      tanggalPublikasi,
    } = req.body;

    // Validasi
    if (!judul || !konten) {
      return res.status(400).json({
        success: false,
        error: "Judul dan konten wajib diisi",
      });
    }

    // Generate slug
    let slug = generateSlug(judul);

    // Check if slug already exists, if yes add number suffix
    const existingBerita = await prisma.berita.findUnique({
      where: { slug },
    });

    if (existingBerita) {
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
    }

    // Create berita
    const newBerita = await prisma.berita.create({
      data: {
        judul,
        slug,
        ringkasan,
        konten,
        thumbnail,
        kategori,
        penulis: penulis || "Admin",
        waktuBaca,
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
      message: "Berita berhasil dibuat",
      data: newBerita,
    });
  } catch (error) {
    console.error("Error creating berita:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT - Update berita
router.put("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul,
      ringkasan,
      konten,
      thumbnail,
      kategori,
      penulis,
      waktuBaca,
      status,
      tanggalPublikasi,
    } = req.body;

    // Check if berita exists
    const existingBerita = await prisma.berita.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBerita) {
      return res.status(404).json({
        success: false,
        error: "Berita tidak ditemukan",
      });
    }

    // Prepare update data
    const updateData = {
      ringkasan,
      konten,
      thumbnail,
      kategori,
      penulis,
      waktuBaca,
      status,
    };

    // Update judul and slug if changed
    if (judul && judul !== existingBerita.judul) {
      let newSlug = generateSlug(judul);

      // Check if new slug already exists
      const slugExists = await prisma.berita.findFirst({
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
    } else if (status === "published" && !existingBerita.tanggalPublikasi) {
      // Auto set tanggal publikasi if status changed to published
      updateData.tanggalPublikasi = new Date();
    }

    // Update berita
    const updatedBerita = await prisma.berita.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Berita berhasil diupdate",
      data: updatedBerita,
    });
  } catch (error) {
    console.error("Error updating berita:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE - Hapus berita
router.delete("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if berita exists
    const existingBerita = await prisma.berita.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBerita) {
      return res.status(404).json({
        success: false,
        error: "Berita tidak ditemukan",
      });
    }

    // Delete berita
    await prisma.berita.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Berita berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting berita:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

