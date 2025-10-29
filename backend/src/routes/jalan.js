const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/jalan - Get all roads with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 100000, // Increased default limit to load all roads
      kecamatan,
      desa,
      kondisi,
      tahun,
      search,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (kecamatan) {
      where.kecamatan = {
        contains: kecamatan,
        mode: "insensitive",
      };
    }

    if (desa) {
      where.desa = {
        contains: desa,
        mode: "insensitive",
      };
    }

    if (kondisi) {
      where.kondisi = kondisi;
    }

    if (tahun) {
      where.tahun = tahun;
    }

    if (search) {
      where.OR = [
        {
          nama: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          namaJalan: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          noRuas: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          noRuas: {
            equals: search,
          },
        },
        {
          noRuas: {
            equals: parseInt(search),
          },
        },
      ];
    }

    const [roads, total] = await Promise.all([
      prisma.jalanLingkunganKubuRaya.findMany({
        where,
        skip,
        take,
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          fid: true,
          noRuas: true,
          noProv: true,
          noKab: true,
          noKec: true,
          noDesa: true,
          noJalan: true,
          nama: true,
          namaJalan: true,
          panjangM: true,
          lebarM: true,
          tahun: true,
          kondisi: true,
          nilai: true,
          bobot: true,
          keterangan: true,
          kecamatan: true,
          desa: true,
          utmXAwal: true,
          utmYAwal: true,
          pngnlAwal: true,
          utmXAkhi: true,
          utmYAkhi: true,
          pngnlAkhi: true,
          shapeLeng: true,
          shapeLe1: true,
          shapeLe2: true,
          shapeLe3: true,
          shapeLe4: true,
          shapeLe5: true,
          // Exclude geom for now to avoid PostGIS issues
        },
      }),
      prisma.jalanLingkunganKubuRaya.count({ where }),
    ]);

    res.json({
      success: true,
      data: roads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching roads:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch roads",
    });
  }
});

// GET /api/jalan/geojson - Get all roads as GeoJSON with PostGIS geometry
// MUST BE BEFORE /:id route
router.get("/geojson", async (req, res) => {
  try {
    const { kecamatan, desa, kondisi, tahun } = req.query;

    // Build WHERE clause
    let whereConditions = [];
    let params = [];

    if (kecamatan) {
      whereConditions.push(
        `kecamatan ILIKE '%' || $${params.length + 1} || '%'`
      );
      params.push(kecamatan);
    }

    if (desa) {
      whereConditions.push(`desa ILIKE '%' || $${params.length + 1} || '%'`);
      params.push(desa);
    }

    if (kondisi) {
      whereConditions.push(`kondisi = $${params.length + 1}`);
      params.push(kondisi);
    }

    if (tahun) {
      whereConditions.push(`tahun = $${params.length + 1}`);
      params.push(tahun);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Use raw SQL to get geometry as text (WKT format)
    const query = `
      SELECT 
        id, fid, no_ruas, nama, nama_jalan,
        panjang_m, lebar_m_, tahun, kondisi,
        nilai, bobot, keterangan, kecamatan, desa,
        ST_AsText(geom) as geom_wkt
      FROM jalan_lingkungan_kubu_raya
      ${whereClause}
      ORDER BY id;
    `;

    const roads = await prisma.$queryRawUnsafe(query, ...params);

    // Convert to GeoJSON
    const features = [];

    for (const road of roads) {
      if (!road.geom_wkt) continue;

      try {
        // Parse WKT geometry to coordinates
        const geomStr = road.geom_wkt;

        // Simple WKT parser for LINESTRING
        let coordinates = [];
        if (geomStr && geomStr.startsWith("LINESTRING")) {
          const coordsStr = geomStr.replace("LINESTRING(", "").replace(")", "");
          const pairs = coordsStr.split(",");
          coordinates = pairs.map((pair) => {
            const [lon, lat] = pair.trim().split(" ");
            return [parseFloat(lon), parseFloat(lat)];
          });
        }

        if (coordinates.length > 0) {
          features.push({
            type: "Feature",
            id: road.id,
            geometry: {
              type: "LineString",
              coordinates: coordinates,
            },
            properties: {
              id: road.id,
              fid: road.fid,
              noRuas: road.no_ruas, // Use camelCase to match API regular format
              nama: road.nama,
              namaJalan: road.nama_jalan,
              panjangM: road.panjang_m,
              lebarM: road.lebar_m_,
              tahun: road.tahun,
              kondisi: road.kondisi,
              nilai: road.nilai,
              bobot: road.bobot,
              keterangan: road.keterangan,
              kecamatan: road.kecamatan,
              desa: road.desa,
            },
          });
        }
      } catch (parseError) {
        console.error(
          `Error parsing geometry for road ${road.id}:`,
          parseError
        );
        // Skip this road if geometry parsing fails
      }
    }

    const geojson = {
      type: "FeatureCollection",
      features: features,
    };

    console.log(`GeoJSON generated with ${features.length} features`);

    res.json({
      success: true,
      data: geojson,
    });
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: "Failed to fetch GeoJSON data",
      message: error.message,
    });
  }
});

// GET /api/jalan/stats/summary - Get summary statistics
// MUST BE BEFORE /:id route
router.get("/stats/summary", async (req, res) => {
  try {
    const [totalRoads, totalLength, conditionStats, kecamatanStats, yearStats] =
      await Promise.all([
        prisma.jalanLingkunganKubuRaya.count(),
        prisma.jalanLingkunganKubuRaya.aggregate({
          _sum: {
            panjangM: true,
          },
        }),
        prisma.jalanLingkunganKubuRaya.groupBy({
          by: ["kondisi"],
          _count: {
            kondisi: true,
          },
          _sum: {
            panjangM: true,
          },
        }),
        prisma.jalanLingkunganKubuRaya.groupBy({
          by: ["kecamatan"],
          _count: {
            kecamatan: true,
          },
          _sum: {
            panjangM: true,
          },
          orderBy: {
            kecamatan: "asc",
          },
        }),
        prisma.jalanLingkunganKubuRaya.groupBy({
          by: ["tahun"],
          _count: {
            tahun: true,
          },
          _sum: {
            panjangM: true,
          },
          orderBy: {
            tahun: "desc",
          },
        }),
      ]);

    res.json({
      success: true,
      data: {
        totalRoads,
        totalLength: totalLength._sum.panjangM || 0,
        conditionStats,
        kecamatanStats,
        yearStats,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch statistics",
    });
  }
});

// GET /api/jalan/filters/kecamatan - Get distinct kecamatan list
// MUST BE BEFORE /:id route
router.get("/filters/kecamatan", async (req, res) => {
  try {
    const kecamatans = await prisma.jalanLingkunganKubuRaya.findMany({
      select: {
        kecamatan: true,
      },
      distinct: ["kecamatan"],
      where: {
        kecamatan: {
          not: null,
        },
      },
      orderBy: {
        kecamatan: "asc",
      },
    });

    res.json({
      success: true,
      data: kecamatans.map((k) => k.kecamatan).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching kecamatan options:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch kecamatan options",
    });
  }
});

// GET /api/jalan/filters/desa - Get distinct desa list (optionally filtered by kecamatan)
// MUST BE BEFORE /:id route
router.get("/filters/desa", async (req, res) => {
  try {
    const { kecamatan } = req.query;

    const where = {
      desa: {
        not: null,
      },
    };

    // If kecamatan is provided, filter desa by kecamatan
    if (kecamatan) {
      where.kecamatan = kecamatan;
    }

    const desas = await prisma.jalanLingkunganKubuRaya.findMany({
      select: {
        desa: true,
      },
      distinct: ["desa"],
      where,
      orderBy: {
        desa: "asc",
      },
    });

    res.json({
      success: true,
      data: desas.map((d) => d.desa).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching desa options:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch desa options",
    });
  }
});

// GET /api/jalan/filters/tahun - Get distinct tahun list
// MUST BE BEFORE /:id route
router.get("/filters/tahun", async (req, res) => {
  try {
    const tahuns = await prisma.jalanLingkunganKubuRaya.findMany({
      select: {
        tahun: true,
      },
      distinct: ["tahun"],
      where: {
        tahun: {
          not: null,
        },
      },
      orderBy: {
        tahun: "desc", // Descending order for years (newest first)
      },
    });

    res.json({
      success: true,
      data: tahuns.map((t) => t.tahun).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching tahun options:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tahun options",
    });
  }
});

// GET /api/jalan/filters/kondisi - Get distinct kondisi list
// MUST BE BEFORE /:id route
router.get("/filters/kondisi", async (req, res) => {
  try {
    const kondisis = await prisma.jalanLingkunganKubuRaya.findMany({
      select: {
        kondisi: true,
      },
      distinct: ["kondisi"],
      where: {
        kondisi: {
          not: null,
        },
      },
      orderBy: {
        kondisi: "asc",
      },
    });

    res.json({
      success: true,
      data: kondisis.map((k) => k.kondisi).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching kondisi options:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch kondisi options",
    });
  }
});

// GET /api/jalan/stats/keterangan - Get keterangan statistics
// MUST BE BEFORE /:id route
router.get("/stats/keterangan", async (req, res) => {
  try {
    const keteranganStats = await prisma.jalanLingkunganKubuRaya.groupBy({
      by: ["keterangan"],
      _count: {
        keterangan: true,
      },
      _sum: {
        panjangM: true,
      },
      where: {
        keterangan: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          keterangan: "desc",
        },
      },
    });

    res.json({
      success: true,
      data: keteranganStats,
    });
  } catch (error) {
    console.error("Error fetching keterangan stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch keterangan statistics",
    });
  }
});

// GET /api/jalan/stats/kecamatan-kondisi - Get road condition statistics by kecamatan
router.get("/stats/kecamatan-kondisi", async (req, res) => {
  try {
    const kecamatanKondisiStats = await prisma.jalanLingkunganKubuRaya.groupBy({
      by: ["kecamatan", "keterangan"],
      _count: {
        keterangan: true,
      },
      _sum: {
        panjangM: true,
      },
      where: {
        keterangan: {
          not: null,
        },
        kecamatan: {
          not: null,
        },
      },
      orderBy: {
        kecamatan: "asc",
      },
    });

    // Group by kecamatan and format data
    const groupedData = {};
    kecamatanKondisiStats.forEach((stat) => {
      if (!groupedData[stat.kecamatan]) {
        groupedData[stat.kecamatan] = {
          kecamatan: stat.kecamatan,
          conditions: {},
          totalRoads: 0,
          totalLength: 0,
        };
      }

      groupedData[stat.kecamatan].conditions[stat.keterangan] = {
        count: stat._count.keterangan,
        length: stat._sum.panjangM || 0,
      };

      groupedData[stat.kecamatan].totalRoads += stat._count.keterangan;
      groupedData[stat.kecamatan].totalLength += stat._sum.panjangM || 0;
    });

    // Convert to array and sort by kecamatan name (alphabetically)
    const result = Object.values(groupedData).sort((a, b) =>
      a.kecamatan.localeCompare(b.kecamatan)
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching kecamatan-kondisi stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch kecamatan-kondisi statistics",
    });
  }
});

// GET /api/jalan/stats/material-kondisi - Get road condition statistics by material
router.get("/stats/material-kondisi", async (req, res) => {
  try {
    const { kecamatan, desa } = req.query;

    // Build where clause
    const where = {
      keterangan: {
        not: null,
      },
      kondisi: {
        not: null,
      },
    };

    // Add kecamatan filter if provided
    if (kecamatan) {
      where.kecamatan = kecamatan;
    }

    // Add desa filter if provided
    if (desa) {
      where.desa = desa;
    }

    const materialKondisiStats = await prisma.jalanLingkunganKubuRaya.groupBy({
      by: ["kondisi", "keterangan"],
      _count: {
        keterangan: true,
      },
      _sum: {
        panjangM: true,
      },
      where,
      orderBy: {
        kondisi: "asc",
      },
    });

    // Group by material and format data
    const groupedData = {};
    materialKondisiStats.forEach((stat) => {
      if (!groupedData[stat.kondisi]) {
        groupedData[stat.kondisi] = {
          material: stat.kondisi,
          conditions: {},
          totalRoads: 0,
          totalLength: 0,
        };
      }

      groupedData[stat.kondisi].conditions[stat.keterangan] = {
        count: stat._count.keterangan,
        length: stat._sum.panjangM || 0,
      };

      groupedData[stat.kondisi].totalRoads += stat._count.keterangan;
      groupedData[stat.kondisi].totalLength += stat._sum.panjangM || 0;
    });

    // Convert to array and sort by total roads
    const result = Object.values(groupedData).sort(
      (a, b) => b.totalRoads - a.totalRoads
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching material-kondisi stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch material-kondisi statistics",
    });
  }
});

// GET /api/jalan/stats/kondisi-material-filtered - Get condition and material stats filtered by kecamatan
router.get("/stats/kondisi-material-filtered", async (req, res) => {
  try {
    const { kecamatan } = req.query;

    // Build where clause
    const where = {
      keterangan: {
        not: null,
      },
    };

    // Add kecamatan filter if provided
    if (kecamatan) {
      where.kecamatan = kecamatan;
    }

    const [kondisiStats, materialStats] = await Promise.all([
      // Get kondisi stats
      prisma.jalanLingkunganKubuRaya.groupBy({
        by: ["keterangan"],
        _count: {
          keterangan: true,
        },
        _sum: {
          panjangM: true,
        },
        where,
        orderBy: {
          _count: {
            keterangan: "desc",
          },
        },
      }),
      // Get material stats
      prisma.jalanLingkunganKubuRaya.groupBy({
        by: ["kondisi"],
        _count: {
          kondisi: true,
        },
        _sum: {
          panjangM: true,
        },
        where: {
          kondisi: {
            not: null,
          },
          ...(kecamatan ? { kecamatan } : {}),
        },
        orderBy: {
          _count: {
            kondisi: "desc",
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        kondisiStats,
        materialStats,
      },
    });
  } catch (error) {
    console.error("Error fetching kondisi-material-filtered stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch kondisi-material-filtered statistics",
    });
  }
});

// GET /api/jalan/filters/options - Get filter options
// MUST BE BEFORE /:id route
router.get("/filters/options", async (req, res) => {
  try {
    const [kecamatans, desas, kondisiOptions, tahunOptions] = await Promise.all(
      [
        prisma.jalanLingkunganKubuRaya.findMany({
          select: {
            kecamatan: true,
          },
          distinct: ["kecamatan"],
          where: {
            kecamatan: {
              not: null,
            },
          },
          orderBy: {
            kecamatan: "asc",
          },
        }),
        prisma.jalanLingkunganKubuRaya.findMany({
          select: {
            desa: true,
          },
          distinct: ["desa"],
          where: {
            desa: {
              not: null,
            },
          },
          orderBy: {
            desa: "asc",
          },
        }),
        prisma.jalanLingkunganKubuRaya.findMany({
          select: {
            kondisi: true,
          },
          distinct: ["kondisi"],
          where: {
            kondisi: {
              not: null,
            },
          },
          orderBy: {
            kondisi: "asc",
          },
        }),
        prisma.jalanLingkunganKubuRaya.findMany({
          select: {
            tahun: true,
          },
          distinct: ["tahun"],
          where: {
            tahun: {
              not: null,
            },
          },
          orderBy: {
            tahun: "desc",
          },
        }),
      ]
    );

    res.json({
      success: true,
      data: {
        kecamatans: kecamatans.map((k) => k.kecamatan).filter(Boolean),
        desas: desas.map((d) => d.desa).filter(Boolean),
        kondisiOptions: kondisiOptions.map((k) => k.kondisi).filter(Boolean),
        tahunOptions: tahunOptions.map((t) => t.tahun).filter(Boolean),
      },
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch filter options",
    });
  }
});

// GET /api/jalan/:id/geometry - Get road geometry
// MUST BE BEFORE /:id route (more specific path)
router.get("/:id/geometry", async (req, res) => {
  try {
    const { id } = req.params;

    const road = await prisma.jalanLingkunganKubuRaya.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        geom: true,
        nama: true,
        namaJalan: true,
      },
    });

    if (!road) {
      return res.status(404).json({
        success: false,
        error: "Road not found",
      });
    }

    res.json({
      success: true,
      data: road,
    });
  } catch (error) {
    console.error("Error fetching road geometry:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch road geometry",
    });
  }
});

// GET /api/jalan/locations - Get available kecamatan and desa for filtering
router.get("/locations", async (req, res) => {
  try {
    // Get unique kecamatan
    const kecamatanList = await prisma.jalanLingkunganKubuRaya.findMany({
      select: {
        kecamatan: true,
      },
      distinct: ["kecamatan"],
      where: {
        kecamatan: {
          not: null,
        },
      },
      orderBy: {
        kecamatan: "asc",
      },
    });

    // Get unique desa
    const desaList = await prisma.jalanLingkunganKubuRaya.findMany({
      select: {
        desa: true,
        kecamatan: true,
      },
      distinct: ["desa", "kecamatan"],
      where: {
        desa: {
          not: null,
        },
      },
      orderBy: [{ kecamatan: "asc" }, { desa: "asc" }],
    });

    // Group desa by kecamatan
    const desaByKecamatan = {};
    desaList.forEach((item) => {
      if (!desaByKecamatan[item.kecamatan]) {
        desaByKecamatan[item.kecamatan] = [];
      }
      desaByKecamatan[item.kecamatan].push(item.desa);
    });

    res.json({
      success: true,
      data: {
        kecamatan: kecamatanList.map((k) => k.kecamatan).filter(Boolean),
        desa: desaByKecamatan,
      },
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch locations",
    });
  }
});

// GET /api/jalan/report - Get detailed road report data for specific kecamatan/desa
router.get("/report", async (req, res) => {
  try {
    const { kecamatan, desa } = req.query;

    // Build WHERE clause
    let where = {};

    if (kecamatan) {
      where.kecamatan = {
        contains: kecamatan,
        mode: "insensitive",
      };
    }

    if (desa) {
      where.desa = {
        contains: desa,
        mode: "insensitive",
      };
    }

    // Get all road segments with detailed information
    const roads = await prisma.jalanLingkunganKubuRaya.findMany({
      where,
      orderBy: [{ noJalan: "asc" }, { noRuas: "asc" }],
      select: {
        id: true,
        noRuas: true,
        noProv: true,
        noKab: true,
        noKec: true,
        noDesa: true,
        noJalan: true,
        nama: true,
        namaJalan: true,
        panjangM: true,
        lebarM: true,
        tahun: true,
        kondisi: true,
        nilai: true,
        bobot: true,
        keterangan: true,
        kecamatan: true,
        desa: true,
        utmXAwal: true,
        utmYAwal: true,
        pngnlAwal: true,
        utmXAkhi: true,
        utmYAkhi: true,
        pngnlAkhi: true,
      },
    });

    // Group roads by noJalan and calculate totals
    const groupedRoads = {};
    let totalLength = 0;
    let totalRuas = 0;

    roads.forEach((road) => {
      const noJalan = road.noJalan || "Unknown";

      if (!groupedRoads[noJalan]) {
        groupedRoads[noJalan] = {
          noJalan,
          ruas: [],
          totalPanjang: 0,
          totalRuas: 0,
        };
      }

      groupedRoads[noJalan].ruas.push(road);
      groupedRoads[noJalan].totalPanjang += road.panjangM || 0;
      groupedRoads[noJalan].totalRuas += 1;

      totalLength += road.panjangM || 0;
      totalRuas += 1;
    });

    // Convert to array and sort by noJalan
    const reportData = Object.values(groupedRoads).sort((a, b) => {
      const aNum = parseInt(a.noJalan) || 0;
      const bNum = parseInt(b.noJalan) || 0;
      return aNum - bNum;
    });

    // Get summary statistics
    const summary = {
      totalLength,
      totalRuas,
      totalJalan: reportData.length,
      kecamatan: roads.length > 0 ? roads[0].kecamatan : null,
      desa: roads.length > 0 ? roads[0].desa : null,
    };

    res.json({
      success: true,
      data: {
        summary,
        roads: reportData,
      },
    });
  } catch (error) {
    console.error("Error fetching road report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch road report",
    });
  }
});

// GET /api/jalan/:id - Get road by ID
// MUST BE LAST - catches all GET requests with an ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const road = await prisma.jalanLingkunganKubuRaya.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        fid: true,
        noRuas: true,
        noProv: true,
        noKab: true,
        noKec: true,
        noDesa: true,
        noJalan: true,
        nama: true,
        namaJalan: true,
        panjangM: true,
        lebarM: true,
        tahun: true,
        kondisi: true,
        nilai: true,
        bobot: true,
        keterangan: true,
        kecamatan: true,
        desa: true,
        utmXAwal: true,
        utmYAwal: true,
        pngnlAwal: true,
        utmXAkhi: true,
        utmYAkhi: true,
        pngnlAkhi: true,
        shapeLeng: true,
        shapeLe1: true,
        shapeLe2: true,
        shapeLe3: true,
        shapeLe4: true,
        shapeLe5: true,
      },
    });

    if (!road) {
      return res.status(404).json({
        success: false,
        error: "Road not found",
      });
    }

    res.json({
      success: true,
      data: road,
    });
  } catch (error) {
    console.error("Error fetching road:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch road",
    });
  }
});

// POST /api/jalan - Create new road (if needed for admin)
router.post("/", async (req, res) => {
  try {
    const roadData = req.body;

    const newRoad = await prisma.jalanLingkunganKubuRaya.create({
      data: roadData,
    });

    res.status(201).json({
      success: true,
      data: newRoad,
    });
  } catch (error) {
    console.error("Error creating road:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create road",
    });
  }
});

// PUT /api/jalan/:id - Update road (if needed for admin)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRoad = await prisma.jalanLingkunganKubuRaya.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
    });

    res.json({
      success: true,
      data: updatedRoad,
    });
  } catch (error) {
    console.error("Error updating road:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update road",
    });
  }
});

// DELETE /api/jalan/:id - Delete road (if needed for admin)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.jalanLingkunganKubuRaya.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({
      success: true,
      message: "Road deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting road:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete road",
    });
  }
});

module.exports = router;
