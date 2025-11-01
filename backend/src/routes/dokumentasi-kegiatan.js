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

// GET semua dokumentasi kegiatan (public)
router.get("/", async (req, res) => {
  try {
    const { limit, kategori } = req.query;

    const where = kategori ? { kategori } : {};

    const dokumentasi = await prisma.dokumentasiKegiatan.findMany({
      where,
      orderBy: {
        tanggal: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    res.json(dokumentasi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET satu dokumentasi by slug (public)
router.get("/slug/:slug", async (req, res) => {
  try {
    const dokumentasi = await prisma.dokumentasiKegiatan.findUnique({
      where: { slug: req.params.slug },
    });

    if (!dokumentasi) {
      return res.status(404).json({ error: "Dokumentasi tidak ditemukan" });
    }

    res.json(dokumentasi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ADMIN ROUTES (untuk dashboard management)
// ============================================

// GET semua dokumentasi kegiatan (untuk management)
router.get("/admin/all", async (req, res) => {
  try {
    const { page = 1, limit = 20, kategori, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (kategori) {
      where.kategori = kategori;
    }

    if (search) {
      where.OR = [
        { judul: { contains: search, mode: "insensitive" } },
        { deskripsi: { contains: search, mode: "insensitive" } },
      ];
    }

    const [dokumentasi, total] = await Promise.all([
      prisma.dokumentasiKegiatan.findMany({
        where,
        orderBy: {
          tanggal: "desc",
        },
        skip,
        take,
      }),
      prisma.dokumentasiKegiatan.count({ where }),
    ]);

    res.json({
      success: true,
      data: dokumentasi,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching all dokumentasi kegiatan:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET satu dokumentasi by ID (untuk edit)
router.get("/admin/:id", async (req, res) => {
  try {
    const dokumentasi = await prisma.dokumentasiKegiatan.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!dokumentasi) {
      return res.status(404).json({
        success: false,
        error: "Dokumentasi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: dokumentasi,
    });
  } catch (error) {
    console.error("Error fetching dokumentasi kegiatan:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST - Create dokumentasi kegiatan baru
router.post("/admin", async (req, res) => {
  try {
    const {
      judul,
      deskripsi,
      konten,
      kategori,
      tanggal,
      thumbnail,
      gambarLainnya,
    } = req.body;

    // Validasi
    if (!judul || !tanggal) {
      return res.status(400).json({
        success: false,
        error: "Judul dan tanggal wajib diisi",
      });
    }

    // Generate slug
    let slug = generateSlug(judul);

    // Check if slug already exists
    const existingDokumentasi = await prisma.dokumentasiKegiatan.findUnique({
      where: { slug },
    });

    if (existingDokumentasi) {
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
    }

    // Create dokumentasi
    const newDokumentasi = await prisma.dokumentasiKegiatan.create({
      data: {
        judul,
        slug,
        deskripsi,
        konten,
        kategori,
        tanggal: new Date(tanggal),
        thumbnail,
        gambarLainnya: gambarLainnya || [],
      },
    });

    res.status(201).json({
      success: true,
      message: "Dokumentasi kegiatan berhasil dibuat",
      data: newDokumentasi,
    });
  } catch (error) {
    console.error("Error creating dokumentasi kegiatan:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT - Update dokumentasi kegiatan
router.put("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul,
      deskripsi,
      konten,
      kategori,
      tanggal,
      thumbnail,
      gambarLainnya,
    } = req.body;

    // Check if dokumentasi exists
    const existingDokumentasi = await prisma.dokumentasiKegiatan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDokumentasi) {
      return res.status(404).json({
        success: false,
        error: "Dokumentasi tidak ditemukan",
      });
    }

    // Prepare update data
    const updateData = {
      deskripsi,
      konten,
      kategori,
      thumbnail,
      gambarLainnya,
    };

    // Update tanggal if provided
    if (tanggal) {
      updateData.tanggal = new Date(tanggal);
    }

    // Update judul and slug if changed
    if (judul && judul !== existingDokumentasi.judul) {
      let newSlug = generateSlug(judul);

      // Check if new slug already exists
      const slugExists = await prisma.dokumentasiKegiatan.findFirst({
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

    // Update dokumentasi
    const updatedDokumentasi = await prisma.dokumentasiKegiatan.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Dokumentasi kegiatan berhasil diupdate",
      data: updatedDokumentasi,
    });
  } catch (error) {
    console.error("Error updating dokumentasi kegiatan:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE - Hapus dokumentasi kegiatan
router.delete("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if dokumentasi exists
    const existingDokumentasi = await prisma.dokumentasiKegiatan.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDokumentasi) {
      return res.status(404).json({
        success: false,
        error: "Dokumentasi tidak ditemukan",
      });
    }

    // Delete dokumentasi
    await prisma.dokumentasiKegiatan.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Dokumentasi kegiatan berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting dokumentasi kegiatan:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

