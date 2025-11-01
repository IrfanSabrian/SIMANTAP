const express = require("express");
const { prisma } = require("../prisma");

const router = express.Router();

// GET statistik untuk hero section
router.get("/", async (req, res) => {
  try {
    // Get total panjang jalan yang dipetakan
    const jalanStats = await prisma.$queryRaw`
      SELECT 
        COALESCE(SUM(panjang_m) / 1000, 0) as total_panjang_km,
        COUNT(*) as total_ruas
      FROM jalan_lingkungan_kubu_raya
      WHERE panjang_m IS NOT NULL
    `;

    // Count kecamatan (unique)
    const kecamatanCount = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT kecamatan) as total
      FROM jalan_lingkungan_kubu_raya
      WHERE kecamatan IS NOT NULL
    `;

    // Count desa (unique)
    const desaCount = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT desa) as total
      FROM jalan_lingkungan_kubu_raya
      WHERE desa IS NOT NULL
    `;

    // Count dokumentasi infrastruktur per jenis
    const infrastrukturCounts = await prisma.dokumentasiInfrastruktur.groupBy({
      by: ["jenisInfrastruktur"],
      _count: true,
    });

    // Format statistik
    const stats = {
      jalan: {
        totalPanjangKm: Math.round(
          parseFloat(jalanStats[0]?.total_panjang_km || 0)
        ),
        totalRuas: parseInt(jalanStats[0]?.total_ruas || 0),
      },
      wilayah: {
        kecamatan: parseInt(kecamatanCount[0]?.total || 0),
        desa: parseInt(desaCount[0]?.total || 0),
      },
      infrastruktur: {
        jalanLingkungan:
          infrastrukturCounts.find(
            (i) => i.jenisInfrastruktur === "Jalan_Lingkungan"
          )?._count || 0,
        jembatanLingkungan:
          infrastrukturCounts.find(
            (i) => i.jenisInfrastruktur === "Jembatan_Lingkungan"
          )?._count || 0,
        drainaseLingkungan:
          infrastrukturCounts.find(
            (i) => i.jenisInfrastruktur === "Drainase_Lingkungan"
          )?._count || 0,
        kawasanPermukiman:
          infrastrukturCounts.find(
            (i) => i.jenisInfrastruktur === "Kawasan_Permukiman"
          )?._count || 0,
        rtlh:
          infrastrukturCounts.find(
            (i) => i.jenisInfrastruktur === "Rumah_Tidak_Layak_Huni"
          )?._count || 0,
      },
    };

    res.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

