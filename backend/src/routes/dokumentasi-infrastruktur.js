const express = require("express");
const { prisma } = require("../prisma");

const router = express.Router();

// ============================================
// PUBLIC ROUTES (untuk website)
// ============================================

// GET semua dokumentasi infrastruktur (public)
router.get("/", async (req, res) => {
  try {
    const { limit, jenisInfrastruktur } = req.query;

    const where = jenisInfrastruktur ? { jenisInfrastruktur } : {};

    const dokumentasi = await prisma.dokumentasiInfrastruktur.findMany({
      where,
      orderBy: {
        dibuatPada: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    // Enrich data with road information for Jalan Lingkungan
    const enrichedData = await Promise.all(
      dokumentasi.map(async (item) => {
        if (item.jenisInfrastruktur === "Jalan_Lingkungan" && item.noRuas) {
          const roadInfo = await prisma.jalanLingkunganKubuRaya.findFirst({
            where: { noRuas: item.noRuas },
            select: {
              namaJalan: true,
              kecamatan: true,
              desa: true,
            },
          });

          return {
            ...item,
            roadInfo: roadInfo || null,
          };
        }
        return {
          ...item,
          roadInfo: null,
        };
      })
    );

    res.json(enrichedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET dokumentasi by no_ruas (public) - untuk SIMANTAP
router.get("/by-ruas/:noRuas", async (req, res) => {
  try {
    const { noRuas } = req.params;

    const dokumentasi = await prisma.dokumentasiInfrastruktur.findFirst({
      where: {
        noRuas: noRuas,
        jenisInfrastruktur: "Jalan_Lingkungan",
      },
      orderBy: {
        dibuatPada: "desc",
      },
    });

    if (!dokumentasi) {
      return res.json({
        success: true,
        data: null,
        message: "Tidak ada dokumentasi untuk ruas ini",
      });
    }

    res.json({
      success: true,
      data: dokumentasi,
    });
  } catch (error) {
    console.error("Error fetching dokumentasi by no_ruas:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET satu dokumentasi by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const dokumentasi = await prisma.dokumentasiInfrastruktur.findUnique({
      where: { id: parseInt(req.params.id) },
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

// GET semua dokumentasi infrastruktur (untuk management)
router.get("/admin/all", async (req, res) => {
  try {
    const { page = 1, limit = 20, jenisInfrastruktur, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (jenisInfrastruktur) {
      where.jenisInfrastruktur = jenisInfrastruktur;
    }

    if (search) {
      where.noRuas = { contains: search, mode: "insensitive" };
    }

    const [dokumentasi, total] = await Promise.all([
      prisma.dokumentasiInfrastruktur.findMany({
        where,
        orderBy: {
          diperbaruiPada: "desc",
        },
        skip,
        take,
      }),
      prisma.dokumentasiInfrastruktur.count({ where }),
    ]);

    // Enrich data with road information for Jalan Lingkungan
    const enrichedData = await Promise.all(
      dokumentasi.map(async (item) => {
        if (item.jenisInfrastruktur === "Jalan_Lingkungan" && item.noRuas) {
          const roadInfo = await prisma.jalanLingkunganKubuRaya.findFirst({
            where: { noRuas: item.noRuas },
            select: {
              namaJalan: true,
              kecamatan: true,
              desa: true,
            },
          });

          return {
            ...item,
            roadInfo: roadInfo || null,
          };
        }
        return {
          ...item,
          roadInfo: null,
        };
      })
    );

    res.json({
      success: true,
      data: enrichedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching all dokumentasi infrastruktur:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET satu dokumentasi by ID (untuk edit)
router.get("/admin/:id", async (req, res) => {
  try {
    const dokumentasi = await prisma.dokumentasiInfrastruktur.findUnique({
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
    console.error("Error fetching dokumentasi infrastruktur:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST - Create dokumentasi infrastruktur baru
router.post("/admin", async (req, res) => {
  try {
    const { jenisInfrastruktur, linkYoutube, noRuas } = req.body;

    // Validasi
    if (!jenisInfrastruktur || !linkYoutube || !noRuas) {
      return res.status(400).json({
        success: false,
        error: "Jenis infrastruktur, link YouTube, dan nomor ruas wajib diisi",
      });
    }

    // Create dokumentasi
    const newDokumentasi = await prisma.dokumentasiInfrastruktur.create({
      data: {
        jenisInfrastruktur,
        linkYoutube,
        noRuas,
      },
    });

    res.status(201).json({
      success: true,
      message: "Dokumentasi infrastruktur berhasil dibuat",
      data: newDokumentasi,
    });
  } catch (error) {
    console.error("Error creating dokumentasi infrastruktur:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT - Update dokumentasi infrastruktur
router.put("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { jenisInfrastruktur, linkYoutube, noRuas } = req.body;

    // Check if dokumentasi exists
    const existingDokumentasi =
      await prisma.dokumentasiInfrastruktur.findUnique({
        where: { id: parseInt(id) },
      });

    if (!existingDokumentasi) {
      return res.status(404).json({
        success: false,
        error: "Dokumentasi tidak ditemukan",
      });
    }

    // Validasi
    if (!linkYoutube || !noRuas) {
      return res.status(400).json({
        success: false,
        error: "Link YouTube dan nomor ruas wajib diisi",
      });
    }

    // Update dokumentasi
    const updatedDokumentasi = await prisma.dokumentasiInfrastruktur.update({
      where: { id: parseInt(id) },
      data: {
        jenisInfrastruktur,
        linkYoutube,
        noRuas,
      },
    });

    res.json({
      success: true,
      message: "Dokumentasi infrastruktur berhasil diupdate",
      data: updatedDokumentasi,
    });
  } catch (error) {
    console.error("Error updating dokumentasi infrastruktur:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE - Hapus dokumentasi infrastruktur
router.delete("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if dokumentasi exists
    const existingDokumentasi =
      await prisma.dokumentasiInfrastruktur.findUnique({
        where: { id: parseInt(id) },
      });

    if (!existingDokumentasi) {
      return res.status(404).json({
        success: false,
        error: "Dokumentasi tidak ditemukan",
      });
    }

    // Delete dokumentasi
    await prisma.dokumentasiInfrastruktur.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Dokumentasi infrastruktur berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting dokumentasi infrastruktur:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
