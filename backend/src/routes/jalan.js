const express = require("express");
const { PrismaClient } = require("@prisma/client");
const archiver = require("archiver");
const stream = require("stream");
const shpwrite = require("@mapbox/shp-write");
const shpWrite = require("shp-write");
const shapefile = require("shapefile");
const nickShpWrite = require("@nickrsan/shp-write");

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

    console.log("=== CREATE ROAD REQUEST ===");
    console.log("Road Data:", JSON.stringify(roadData, null, 2));
    console.log("===========================");

    // Create road and exclude geom field from response (PostGIS geometry causes issues)
    const newRoad = await prisma.jalanLingkunganKubuRaya.create({
      data: roadData,
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
        // Exclude geom to avoid PostGIS deserialization issues
      },
    });

    console.log("Road created successfully:", newRoad.id);

    res.status(201).json({
      success: true,
      data: newRoad,
    });
  } catch (error) {
    console.error("=== ERROR CREATING ROAD ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    console.error("===========================");

    res.status(500).json({
      success: false,
      error: "Failed to create road",
      details: error.message,
      code: error.code,
    });
  }
});

// PUT /api/jalan/:id - Update road (if needed for admin)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("=== UPDATE ROAD REQUEST ===");
    console.log("Road ID:", id);
    console.log("Update Data:", JSON.stringify(updateData, null, 2));
    console.log("===========================");

    // Update road and exclude geom field from response (PostGIS geometry causes issues)
    const updatedRoad = await prisma.jalanLingkunganKubuRaya.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
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
        // Exclude geom to avoid PostGIS deserialization issues
      },
    });

    console.log("Road updated successfully:", updatedRoad.id);

    res.json({
      success: true,
      data: updatedRoad,
    });
  } catch (error) {
    console.error("=== ERROR UPDATING ROAD ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    console.error("Stack trace:", error.stack);
    console.error("===========================");

    res.status(500).json({
      success: false,
      error: "Failed to update road",
      details: error.message,
      code: error.code,
    });
  }
});

// GET /api/jalan/download/geojson - Download GeoJSON with filters
router.get("/download/geojson", async (req, res) => {
  try {
    const { kecamatan, desa } = req.query;

    console.log("=== DOWNLOAD GEOJSON REQUEST ===");
    console.log("Kecamatan:", kecamatan);
    console.log("Desa:", desa);
    console.log("================================");

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

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Use raw SQL to get geometry as text (WKT format)
    const query = `
      SELECT 
        id, fid, no_ruas, no_prov, no_kab, no_kec, no_desa,
        no_jalan, nama, nama_jalan, panjang_m, lebar_m_, 
        tahun, kondisi, nilai, bobot, keterangan, 
        kecamatan, desa, utm_x_awal, utm_y_awal, 
        pngnl_awal, utm_x_akhi, utm_y_akhi, pngnl_akhi,
        shape_leng, shape_le_1, shape_le_2, shape_le_3,
        shape_le_4, shape_le_5,
        ST_AsText(geom) as geom_wkt
      FROM jalan_lingkungan_kubu_raya
      ${whereClause}
      ORDER BY id;
    `;

    const roads = await prisma.$queryRawUnsafe(query, ...params);

    console.log(`Found ${roads.length} roads for download`);

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
              no_ruas: road.no_ruas,
              no_prov: road.no_prov,
              no_kab: road.no_kab,
              no_kec: road.no_kec,
              no_desa: road.no_desa,
              no_jalan: road.no_jalan,
              nama: road.nama,
              nama_jalan: road.nama_jalan,
              panjang_m: road.panjang_m,
              lebar_m_: road.lebar_m_,
              tahun: road.tahun,
              kondisi: road.kondisi,
              nilai: road.nilai,
              bobot: road.bobot,
              keterangan: road.keterangan,
              kecamatan: road.kecamatan,
              desa: road.desa,
              utm_x_awal: road.utm_x_awal,
              utm_y_awal: road.utm_y_awal,
              pngnl_awal: road.pngnl_awal,
              utm_x_akhi: road.utm_x_akhi,
              utm_y_akhi: road.utm_y_akhi,
              pngnl_akhi: road.pngnl_akhi,
              shape_leng: road.shape_leng,
              shape_le_1: road.shape_le_1,
              shape_le_2: road.shape_le_2,
              shape_le_3: road.shape_le_3,
              shape_le_4: road.shape_le_4,
              shape_le_5: road.shape_le_5,
            },
          });
        }
      } catch (parseError) {
        console.error(
          `Error parsing geometry for road ${road.id}:`,
          parseError
        );
      }
    }

    const geojson = {
      type: "FeatureCollection",
      features: features,
    };

    // Generate filename based on filters
    let filename = "jalan_lingkungan";
    if (kecamatan) {
      filename += `_${kecamatan.replace(/\s+/g, "_")}`;
    }
    if (desa) {
      filename += `_${desa.replace(/\s+/g, "_")}`;
    }
    filename += ".geojson";

    // Set headers for download
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    console.log(`GeoJSON download ready: ${features.length} features`);

    res.json(geojson);
  } catch (error) {
    console.error("Error downloading GeoJSON:", error);
    res.status(500).json({
      success: false,
      error: "Failed to download GeoJSON data",
      message: error.message,
    });
  }
});

// POST /api/jalan/export/geojson - Export selected roads as GeoJSON
router.post("/export/geojson", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      console.log("❌ Export GeoJSON: No IDs provided");
      return res.status(400).json({
        success: false,
        error: "IDs array is required",
      });
    }

    console.log(`\n=== 📥 EXPORT GEOJSON REQUEST ===`);
    console.log(`Selected IDs: ${ids.length} roads`);
    console.log(
      `IDs: ${ids.slice(0, 5).join(", ")}${ids.length > 5 ? "..." : ""}`
    );
    console.log(`=================================`);

    // Build WHERE clause for selected IDs
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");

    const query = `
      SELECT 
        id, fid, no_ruas, no_prov, no_kab, no_kec, no_desa,
        no_jalan, nama, nama_jalan, panjang_m, lebar_m_, 
        tahun, kondisi, nilai, bobot, keterangan, 
        kecamatan, desa, utm_x_awal, utm_y_awal, 
        pngnl_awal, utm_x_akhi, utm_y_akhi, pngnl_akhi,
        shape_leng, shape_le_1, shape_le_2, shape_le_3,
        shape_le_4, shape_le_5,
        ST_AsText(geom) as geom_wkt
      FROM jalan_lingkungan_kubu_raya
      WHERE id IN (${placeholders})
      ORDER BY id;
    `;

    const roads = await prisma.$queryRawUnsafe(query, ...ids);

    const features = [];
    for (const road of roads) {
      if (!road.geom_wkt) continue;

      try {
        const geomStr = road.geom_wkt.trim();
        let geometryType = null;
        let coordinates = [];

        // Handle LINESTRING
        if (geomStr.toUpperCase().startsWith("LINESTRING")) {
          geometryType = "LineString";
          // Remove LINESTRING prefix and parentheses, handle Z/M if present
          let coordsStr = geomStr
            .replace(/^LINESTRING\s*Z?\s*M?\s*\(/i, "")
            .replace(/\)$/, "");

          const pairs = coordsStr.split(",");
          coordinates = pairs
            .map((pair) => {
              const parts = pair.trim().split(/\s+/);
              const lon = parseFloat(parts[0]);
              const lat = parseFloat(parts[1]);
              // Only use lon and lat (ignore Z or M if present)
              if (
                !isNaN(lon) &&
                !isNaN(lat) &&
                isFinite(lon) &&
                isFinite(lat)
              ) {
                return [lon, lat];
              }
              return null;
            })
            .filter((coord) => coord !== null);
        }
        // Handle MULTILINESTRING
        else if (geomStr.toUpperCase().startsWith("MULTILINESTRING")) {
          geometryType = "MultiLineString";
          // Remove MULTILINESTRING prefix and outer parentheses
          let coordsStr = geomStr
            .replace(/^MULTILINESTRING\s*Z?\s*M?\s*\(/i, "")
            .replace(/\)$/, "");

          // Split by "), (" to get individual LineString parts
          const lineStrings = coordsStr.split(/\),\s*\(/);

          coordinates = lineStrings
            .map((lineStr) => {
              // Clean up parentheses
              const cleanStr = lineStr.replace(/^\(/, "").replace(/\)$/, "");
              const pairs = cleanStr.split(",");
              return pairs
                .map((pair) => {
                  const parts = pair.trim().split(/\s+/);
                  const lon = parseFloat(parts[0]);
                  const lat = parseFloat(parts[1]);
                  if (
                    !isNaN(lon) &&
                    !isNaN(lat) &&
                    isFinite(lon) &&
                    isFinite(lat)
                  ) {
                    return [lon, lat];
                  }
                  return null;
                })
                .filter((coord) => coord !== null);
            })
            .filter((line) => line.length > 0);
        }

        if (geometryType && coordinates.length > 0) {
          // Use fid as feature id, fallback to 0 if null
          const featureId =
            road.fid !== null && road.fid !== undefined ? road.fid : 0;

          features.push({
            type: "Feature",
            id: featureId,
            geometry: {
              type: geometryType,
              coordinates: coordinates,
            },
            properties: {
              FID: road.fid !== null && road.fid !== undefined ? road.fid : 0,
              No_Ruas: road.no_ruas || "",
              No_Prov:
                road.no_prov !== null && road.no_prov !== undefined
                  ? road.no_prov
                  : 0,
              No_Kab:
                road.no_kab !== null && road.no_kab !== undefined
                  ? road.no_kab
                  : 0,
              No_Kec:
                road.no_kec !== null && road.no_kec !== undefined
                  ? road.no_kec
                  : 0,
              No_Desa:
                road.no_desa !== null && road.no_desa !== undefined
                  ? road.no_desa
                  : 0,
              No_Jalan: road.no_jalan || "",
              Nama: road.nama || "",
              Nama_Jalan: road.nama_jalan || "",
              Panjang_M:
                road.panjang_m !== null && road.panjang_m !== undefined
                  ? road.panjang_m
                  : 0,
              Lebar_m_:
                road.lebar_m_ !== null && road.lebar_m_ !== undefined
                  ? road.lebar_m_
                  : 0,
              Tahun: road.tahun || "",
              Kondisi: road.kondisi || "",
              Nilai:
                road.nilai !== null && road.nilai !== undefined
                  ? road.nilai
                  : 0,
              Bobot:
                road.bobot !== null && road.bobot !== undefined
                  ? road.bobot
                  : 0,
              Keterangan: road.keterangan || "",
              Kecamatan: road.kecamatan || "",
              Desa: road.desa || "",
              UTM_X_AWAL:
                road.utm_x_awal !== null && road.utm_x_awal !== undefined
                  ? road.utm_x_awal
                  : 0,
              UTM_Y_AWAL:
                road.utm_y_awal !== null && road.utm_y_awal !== undefined
                  ? road.utm_y_awal
                  : 0,
              Pngnl_Awal: road.pngnl_awal || "",
              UTM_X_AKHI:
                road.utm_x_akhi !== null && road.utm_x_akhi !== undefined
                  ? road.utm_x_akhi
                  : 0,
              UTM_Y_AKHI:
                road.utm_y_akhi !== null && road.utm_y_akhi !== undefined
                  ? road.utm_y_akhi
                  : 0,
              Pngnl_Akhi: road.pngnl_akhi || "",
              Shape_Leng:
                road.shape_leng !== null && road.shape_leng !== undefined
                  ? road.shape_leng
                  : 0,
              Shape_Le_1:
                road.shape_le_1 !== null && road.shape_le_1 !== undefined
                  ? road.shape_le_1
                  : 0,
              Shape_Le_2:
                road.shape_le_2 !== null && road.shape_le_2 !== undefined
                  ? road.shape_le_2
                  : 0,
              Shape_Le_3:
                road.shape_le_3 !== null && road.shape_le_3 !== undefined
                  ? road.shape_le_3
                  : 0,
              Shape_Le_4:
                road.shape_le_4 !== null && road.shape_le_4 !== undefined
                  ? road.shape_le_4
                  : 0,
              Shape_Le_5:
                road.shape_le_5 !== null && road.shape_le_5 !== undefined
                  ? road.shape_le_5
                  : 0,
            },
          });
        }
      } catch (parseError) {
        console.error(
          `Error parsing geometry for road ${road.id}:`,
          parseError
        );
      }
    }

    const geojson = {
      type: "FeatureCollection",
      features: features,
    };

    console.log(
      `✅ GeoJSON export ready: ${features.length} features with geometry`
    );
    console.log(
      `Sample feature has geometry: ${features[0]?.geometry ? "YES ✓" : "NO ✗"}`
    );
    if (features[0]?.geometry) {
      console.log(
        `Coordinates count: ${features[0].geometry.coordinates.length} points`
      );
    }
    console.log(`=================================\n`);

    res.json({
      success: true,
      data: geojson,
    });
  } catch (error) {
    console.error("Error exporting GeoJSON:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export GeoJSON",
      message: error.message,
    });
  }
});

// POST /api/jalan/export/shapefile - REMOVED: Feature disabled due to issues
/*
router.post("/export/shapefile", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      console.log("❌ Export Shapefile: No IDs provided");
      return res.status(400).json({
        success: false,
        error: "IDs array is required",
      });
    }

    console.log(`\n=== 📥 EXPORT SHAPEFILE REQUEST ===`);
    console.log(`Selected IDs: ${ids.length} roads`);
    console.log(
      `IDs: ${ids.slice(0, 5).join(", ")}${ids.length > 5 ? "..." : ""}`
    );
    console.log(`====================================`);

    // Build WHERE clause for selected IDs
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");

    const query = `
      SELECT 
        id, fid, no_ruas, no_prov, no_kab, no_kec, no_desa,
        no_jalan, nama, nama_jalan, panjang_m, lebar_m_, 
        tahun, kondisi, nilai, bobot, keterangan, 
        kecamatan, desa, utm_x_awal, utm_y_awal, 
        pngnl_awal, utm_x_akhi, utm_y_akhi, pngnl_akhi,
        shape_leng, shape_le_1, shape_le_2, shape_le_3,
        shape_le_4, shape_le_5,
        ST_AsText(geom) as geom_wkt
      FROM jalan_lingkungan_kubu_raya
      WHERE id IN (${placeholders})
      ORDER BY id;
    `;

    const roads = await prisma.$queryRawUnsafe(query, ...ids);

    // Define field mapping once - ALL features must have the SAME field names
    // Shapefile requires field names max 10 chars, alphanumeric + underscore only
    const fieldMapping = {
      id: "id",
      fid: "fid",
      no_ruas: "no_ruas",
      no_prov: "no_prov",
      no_kab: "no_kab",
      no_kec: "no_kec",
      no_desa: "no_desa",
      no_jalan: "no_jalan",
      nama: "nama",
      nama_jalan: "nama_jln", // truncated to 10 chars
      panjang_m: "panjang_m",
      lebar_m_: "lebar_m",
      tahun: "tahun",
      kondisi: "kondisi",
      nilai: "nilai",
      bobot: "bobot",
      keterangan: "ket",
      kecamatan: "kecamatan",
      desa: "desa",
      utm_x_awal: "utm_x_aw",
      utm_y_awal: "utm_y_aw",
      utm_x_akhi: "utm_x_ak",
      utm_y_akhi: "utm_y_ak",
      shape_leng: "shape_lng",
    };

    // Helper function to sanitize value for DBF format
    // CRITICAL: DBF format is very strict - must return proper types
    const sanitizeValue = (value, defaultValue = "") => {
      if (value === null || value === undefined) {
        return defaultValue;
      }
      if (typeof value === "number") {
        // Ensure number is finite and valid
        if (!isFinite(value)) {
          return defaultValue === "" ? 0 : defaultValue;
        }
        return value;
      }
      if (typeof value === "string") {
        // Limit string length to 254 characters (DBF limit)
        // Remove null bytes and control characters that can break DBF
        const cleaned = value
          .replace(/\0/g, "") // Remove null bytes
          .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
          .trim();
        return cleaned.length > 254 ? cleaned.substring(0, 254) : cleaned;
      }
      if (typeof value === "boolean") {
        return value ? 1 : 0;
      }
      // Convert other types to string, but ensure it's safe
      const strValue = String(value)
        .replace(/\0/g, "")
        .replace(/[\x00-\x1F\x7F]/g, "")
        .trim();
      return strValue.length > 254 ? strValue.substring(0, 254) : strValue;
    };

    // Define expected property keys in fixed order - CRITICAL for shapefile sync
    const expectedPropertyKeys = [
      fieldMapping.id,
      fieldMapping.fid,
      fieldMapping.no_ruas,
      fieldMapping.no_prov,
      fieldMapping.no_kab,
      fieldMapping.no_kec,
      fieldMapping.no_desa,
      fieldMapping.no_jalan,
      fieldMapping.nama,
      fieldMapping.nama_jalan,
      fieldMapping.panjang_m,
      fieldMapping.lebar_m_,
      fieldMapping.tahun,
      fieldMapping.kondisi,
      fieldMapping.nilai,
      fieldMapping.bobot,
      fieldMapping.keterangan,
      fieldMapping.kecamatan,
      fieldMapping.desa,
      fieldMapping.utm_x_awal,
      fieldMapping.utm_y_awal,
      fieldMapping.utm_x_akhi,
      fieldMapping.utm_y_akhi,
      fieldMapping.shape_leng,
    ];

    const features = [];
    for (const road of roads) {
      if (!road.geom_wkt) {
        console.warn(`⚠️ Road ${road.id}: Missing geometry, skipping`);
        continue;
      }

      try {
        const geomStr = road.geom_wkt.trim();
        let geometryType = null;
        let coordinates = [];

        // Handle LINESTRING
        if (geomStr && geomStr.toUpperCase().startsWith("LINESTRING")) {
          geometryType = "LineString";
          // Remove LINESTRING prefix and parentheses, handle Z/M if present
          let coordsStr = geomStr
            .replace(/^LINESTRING\s*Z?\s*M?\s*\(/i, "")
            .replace(/\)$/, "");

          const pairs = coordsStr.split(",");
          coordinates = pairs
            .map((pair) => {
              const parts = pair.trim().split(/\s+/);
              const lon = parseFloat(parts[0]);
              const lat = parseFloat(parts[1]);
              // Only use lon and lat (ignore Z or M if present)
              if (
                !isNaN(lon) &&
                !isNaN(lat) &&
                isFinite(lon) &&
                isFinite(lat)
              ) {
                return [lon, lat];
              }
              return null;
            })
            .filter((coord) => coord !== null);
        }
        // Handle MULTILINESTRING
        else if (
          geomStr &&
          geomStr.toUpperCase().startsWith("MULTILINESTRING")
        ) {
          geometryType = "MultiLineString";
          // Remove MULTILINESTRING prefix and outer parentheses
          let coordsStr = geomStr
            .replace(/^MULTILINESTRING\s*Z?\s*M?\s*\(/i, "")
            .replace(/\)$/, "");

          // Split by "), (" to get individual LineString parts
          const lineStrings = coordsStr.split(/\),\s*\(/);

          coordinates = lineStrings
            .map((lineStr) => {
              // Clean up parentheses
              const cleanStr = lineStr.replace(/^\(/, "").replace(/\)$/, "");
              const pairs = cleanStr.split(",");
              return pairs
                .map((pair) => {
                  const parts = pair.trim().split(/\s+/);
                  const lon = parseFloat(parts[0]);
                  const lat = parseFloat(parts[1]);
                  if (
                    !isNaN(lon) &&
                    !isNaN(lat) &&
                    isFinite(lon) &&
                    isFinite(lat)
                  ) {
                    return [lon, lat];
                  }
                  return null;
                })
                .filter((coord) => coord !== null);
            })
            .filter((line) => line.length > 0);
        }

        // Validate coordinates based on geometry type
        let validCoordinates = [];
        let isValid = false;

        if (geometryType === "LineString") {
          validCoordinates = coordinates.filter(
            (coord) =>
              Array.isArray(coord) &&
              coord.length === 2 &&
              !isNaN(coord[0]) &&
              !isNaN(coord[1]) &&
              isFinite(coord[0]) &&
              isFinite(coord[1])
          );
          isValid = validCoordinates.length >= 2;
        } else if (geometryType === "MultiLineString") {
          // For MultiLineString, validate each LineString part
          validCoordinates = coordinates.filter((line) => {
            if (!Array.isArray(line) || line.length === 0) return false;
            return line.every(
              (coord) =>
                Array.isArray(coord) &&
                coord.length === 2 &&
                !isNaN(coord[0]) &&
                !isNaN(coord[1]) &&
                isFinite(coord[0]) &&
                isFinite(coord[1])
            );
          });
          isValid =
            validCoordinates.length > 0 &&
            validCoordinates.some((line) => line.length >= 2);
        }

        if (!isValid || !geometryType) {
          console.warn(
            `⚠️ Road ${road.id}: Invalid geometry (type: ${geometryType}, coords: ${coordinates.length}), skipping`
          );
          continue;
        }

        // Create properties object with ALL fields in FIXED ORDER
        // This ensures .shp and .dbf files stay perfectly synchronized
        const properties = {};

        // Always include all fields in the exact same order, even if null
        for (const key of expectedPropertyKeys) {
          // Map back to original field name
          let originalKey = null;
          for (const [orig, mapped] of Object.entries(fieldMapping)) {
            if (mapped === key) {
              originalKey = orig;
              break;
            }
          }
          if (originalKey) {
            properties[key] = sanitizeValue(
              road[originalKey],
              /^(id|fid|no_|panjang|lebar|nilai|bobot|utm_|shape_)/i.test(key)
                ? 0
                : ""
            );
          } else {
            // Fallback - should not happen but ensures consistency
            properties[key] =
              /^(id|fid|no_|panjang|lebar|nilai|bobot|utm_|shape_)/i.test(key)
                ? 0
                : "";
          }
        }

        // Verify all expected keys are present
        const missingKeys = expectedPropertyKeys.filter(
          (k) => !(k in properties)
        );
        if (missingKeys.length > 0) {
          console.error(
            `❌ Road ${road.id}: Missing property keys: ${missingKeys.join(
              ", "
            )}`
          );
          // Fill missing keys to ensure consistency
          for (const key of missingKeys) {
            properties[key] =
              /^(id|fid|no_|panjang|lebar|nilai|bobot|utm_|shape_)/i.test(key)
                ? 0
                : "";
          }
        }

        // Ensure coordinates are properly formatted (exactly [lon, lat] pairs)
        // Keep original geometry types - @nickrsan/shp-write should handle them correctly
        if (geometryType === "LineString") {
          const finalCoordinates = validCoordinates.map((coord) => [
            parseFloat(coord[0]),
            parseFloat(coord[1]),
          ]);

          // Verify coordinates are valid
          if (finalCoordinates.length >= 2) {
            features.push({
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: finalCoordinates,
              },
              properties: properties,
            });
          } else {
            console.warn(
              `⚠️ Road ${road.id}: LineString has < 2 valid coordinates, skipping`
            );
          }
        } else if (geometryType === "MultiLineString") {
          // Keep MultiLineString but ensure all parts have valid coordinates
          const lineStrings = validCoordinates
            .map((line) => {
              if (!Array.isArray(line) || line.length < 2) {
                return null; // Skip invalid line parts
              }
              const coords = line.map((coord) => [
                parseFloat(coord[0]),
                parseFloat(coord[1]),
              ]);
              // Verify all coordinates are valid
              const allValid = coords.every(
                (c) =>
                  !isNaN(c[0]) &&
                  !isNaN(c[1]) &&
                  isFinite(c[0]) &&
                  isFinite(c[1])
              );
              if (allValid && coords.length >= 2) {
                return coords;
              }
              return null;
            })
            .filter((line) => line !== null); // Remove invalid parts

          // Only add if at least one valid LineString part exists
          if (lineStrings.length > 0) {
            features.push({
              type: "Feature",
              geometry: {
                type: "MultiLineString",
                coordinates: lineStrings,
              },
              properties: properties,
            });
          } else {
            console.warn(
              `⚠️ Road ${road.id}: MultiLineString has no valid LineString parts, skipping`
            );
          }
        }
      } catch (parseError) {
        console.error(
          `❌ Error parsing geometry for road ${road.id}:`,
          parseError
        );
        // Skip this road - don't add to features to maintain sync
      }
    }

    if (features.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid features with geometry found",
      });
    }

    const geojson = {
      type: "FeatureCollection",
      features: features,
    };

    // Count geometry types
    const geometryTypes = {};
    features.forEach((f) => {
      const type = f.geometry?.type || "Unknown";
      geometryTypes[type] = (geometryTypes[type] || 0) + 1;
    });

    console.log(
      `✅ Shapefile export ready: ${features.length} features with geometry`
    );
    console.log(`📊 Geometry types:`, geometryTypes);

    // Set headers for ZIP download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="jalan_lingkungan_${new Date().getTime()}.zip"`
    );

    // Convert GeoJSON to shapefile using @mapbox/shp-write
    try {
      console.log("🔄 Converting data to Shapefile using @mapbox/shp-write...");
      console.log("📊 GeoJSON structure:", {
        type: geojson.type,
        features_count: geojson.features.length,
        first_feature: geojson.features[0]
          ? {
              type: geojson.features[0].type,
              geometry_type: geojson.features[0].geometry?.type,
              coordinates_count:
                geojson.features[0].geometry?.coordinates?.length,
              properties_keys: Object.keys(
                geojson.features[0].properties || {}
              ),
            }
          : null,
      });

      // @mapbox/shp-write.write() returns object with {filename: Buffer}
      // Need to ensure GeoJSON is valid
      if (!geojson.features || geojson.features.length === 0) {
        throw new Error("No features in GeoJSON");
      }

      // All features should already be validated and have consistent structure
      // Just ensure properties are normalized using the predefined keys
      // DO NOT filter features here - this causes .shp/.dbf mismatch
      console.log(
        `📋 Normalizing ${geojson.features.length} features with predefined property keys`
      );

      // Normalize each feature to have EXACTLY the same properties in the same order
      // Use the predefined expectedPropertyKeys to ensure consistency
      const normalizedFeatures = geojson.features.map((feature, idx) => {
        // Ensure properties exist
        if (!feature.properties) {
          feature.properties = {};
        }

        const normalizedProps = {};

        // Add all expected properties in the exact same order
        for (const key of expectedPropertyKeys) {
          const value = feature.properties[key];
          // Ensure no null/undefined - use appropriate default
          if (value === null || value === undefined) {
            // Determine default based on key pattern
            const isNumeric =
              /^(id|fid|no_|panjang|lebar|nilai|bobot|utm_|shape_)/i.test(key);
            normalizedProps[key] = isNumeric ? 0 : "";
          } else {
            normalizedProps[key] = value;
          }
        }

        // Verify all expected keys are present
        const missingKeys = expectedPropertyKeys.filter(
          (k) => !(k in normalizedProps)
        );
        if (missingKeys.length > 0) {
          console.warn(
            `⚠️ Feature ${idx}: Missing keys, filling defaults: ${missingKeys.join(
              ", "
            )}`
          );
          for (const key of missingKeys) {
            const isNumeric =
              /^(id|fid|no_|panjang|lebar|nilai|bobot|utm_|shape_)/i.test(key);
            normalizedProps[key] = isNumeric ? 0 : "";
          }
        }

        // Create normalized feature - ensure geometry is valid
        return {
          type: "Feature",
          geometry: feature.geometry, // Already validated, use as-is
          properties: normalizedProps,
        };
      });

      // Verify all normalized features have identical structure
      const allConsistent = normalizedFeatures.every((f, idx) => {
        const propKeys = Object.keys(f.properties);
        if (propKeys.length !== expectedPropertyKeys.length) {
          console.error(
            `❌ Feature ${idx}: Properties count mismatch! Expected ${expectedPropertyKeys.length}, got ${propKeys.length}`
          );
          return false;
        }
        // Check that all expected keys are present (order doesn't matter for object keys)
        const allKeysPresent = expectedPropertyKeys.every(
          (k) => k in f.properties
        );
        if (!allKeysPresent) {
          console.error(`❌ Feature ${idx}: Missing expected property keys!`);
          return false;
        }
        return true;
      });

      if (!allConsistent) {
        throw new Error(
          "Failed to normalize features - structure inconsistency detected"
        );
      }

      console.log(
        `✅ Normalized ${normalizedFeatures.length} features with identical structure`
      );

      const validGeoJSON = {
        type: "FeatureCollection",
        features: normalizedFeatures,
      };

      // Log first feature structure for debugging
      if (normalizedFeatures.length > 0) {
        const firstFeature = normalizedFeatures[0];
        console.log("📋 First normalized feature structure:", {
          type: firstFeature.type,
          geometry: {
            type: firstFeature.geometry.type,
            coordinates_length: firstFeature.geometry.coordinates.length,
            first_coord: firstFeature.geometry.coordinates[0],
            last_coord:
              firstFeature.geometry.coordinates[
                firstFeature.geometry.coordinates.length - 1
              ],
          },
          properties_count: Object.keys(firstFeature.properties || {}).length,
          properties_keys: Object.keys(firstFeature.properties || {}).sort(),
        });
      }

      // All validation and normalization is done above
      // Now we'll use shp-write library (not @mapbox/shp-write) for better reliability

      // Verify GeoJSON structure before sending to library
      if (!validGeoJSON.type || validGeoJSON.type !== "FeatureCollection") {
        throw new Error("Invalid GeoJSON type - must be FeatureCollection");
      }
      if (!Array.isArray(validGeoJSON.features)) {
        throw new Error("Invalid GeoJSON features - must be an array");
      }
      if (validGeoJSON.features.length === 0) {
        throw new Error("No features in GeoJSON");
      }

      // Verify first feature structure
      const firstFeature = validGeoJSON.features[0];
      if (!firstFeature.geometry || !firstFeature.geometry.type) {
        throw new Error("First feature missing geometry or geometry type");
      }
      if (!Array.isArray(firstFeature.geometry.coordinates)) {
        throw new Error("First feature geometry coordinates must be an array");
      }

      console.log("✅ GeoJSON structure validated before sending to shpwrite");

      // CRITICAL: All features should already be validated and normalized
      // Just ensure coordinates are in the exact format library expects [lon, lat]
      // DO NOT filter features - this will cause .shp/.dbf mismatch
      // All features passed here should be valid
      console.log(
        `📋 Final validation: ${validGeoJSON.features.length} features ready for shapefile conversion`
      );

      // Double-check that all features have valid geometry (should already be validated)
      const finalFeatures = validGeoJSON.features.map((feature, idx) => {
        // Verify geometry exists (should already be validated)
        if (!feature.geometry || !feature.geometry.coordinates) {
          throw new Error(
            `Feature ${idx}: Missing geometry - this should not happen after validation`
          );
        }

        const geometryType = feature.geometry.type;
        const coords = feature.geometry.coordinates;

        // Ensure coordinates are in correct format [lon, lat] pairs
        // Handle both LineString and MultiLineString (keep original types)
        let finalCoords;

        if (geometryType === "LineString") {
          // Verify and format LineString coordinates
          if (!Array.isArray(coords) || coords.length < 2) {
            throw new Error(`Feature ${idx}: Invalid LineString coordinates`);
          }

          finalCoords = coords.map((coord, coordIdx) => {
            if (!Array.isArray(coord) || coord.length < 2) {
              throw new Error(
                `Feature ${idx}, coordinate ${coordIdx}: Invalid format`
              );
            }
            const lon = parseFloat(coord[0]);
            const lat = parseFloat(coord[1]);
            if (isNaN(lon) || isNaN(lat) || !isFinite(lon) || !isFinite(lat)) {
              throw new Error(
                `Feature ${idx}, coordinate ${coordIdx}: Invalid values`
              );
            }
            return [lon, lat];
          });
        } else if (geometryType === "MultiLineString") {
          // Verify and format MultiLineString coordinates
          if (!Array.isArray(coords) || coords.length === 0) {
            throw new Error(
              `Feature ${idx}: Invalid MultiLineString coordinates`
            );
          }

          finalCoords = coords
            .map((line, lineIdx) => {
              if (!Array.isArray(line) || line.length < 2) {
                console.warn(
                  `⚠️ Feature ${idx}, LineString ${lineIdx}: Invalid or too short, skipping this part`
                );
                return null;
              }

              const validLine = line
                .map((coord, coordIdx) => {
                  if (!Array.isArray(coord) || coord.length < 2) {
                    return null;
                  }
                  const lon = parseFloat(coord[0]);
                  const lat = parseFloat(coord[1]);
                  if (
                    isNaN(lon) ||
                    isNaN(lat) ||
                    !isFinite(lon) ||
                    !isFinite(lat)
                  ) {
                    return null;
                  }
                  return [lon, lat];
                })
                .filter((c) => c !== null); // Remove invalid coordinates

              // Only return line if it has at least 2 valid coordinates
              return validLine.length >= 2 ? validLine : null;
            })
            .filter((line) => line !== null); // Remove invalid line parts

          // Ensure at least one valid LineString part exists
          if (finalCoords.length === 0) {
            throw new Error(
              `Feature ${idx}: MultiLineString has no valid LineString parts`
            );
          }
        } else {
          throw new Error(
            `Feature ${idx}: Unsupported geometry type ${geometryType}`
          );
        }

        // Ensure properties are normalized and sanitized for DBF format
        const normalizedProps = {};
        for (const key of expectedPropertyKeys) {
          const value = feature.properties?.[key];
          if (value === null || value === undefined) {
            const isNumeric =
              /^(id|fid|no_|panjang|lebar|nilai|bobot|utm_|shape_)/i.test(key);
            normalizedProps[key] = isNumeric ? 0 : "";
          } else {
            // Sanitize value to ensure DBF compatibility
            if (typeof value === "string") {
              // Remove null bytes and control characters
              normalizedProps[key] = value
                .replace(/\0/g, "")
                .replace(/[\x00-\x1F\x7F]/g, "")
                .trim()
                .substring(0, 254); // DBF string limit
            } else if (typeof value === "number") {
              normalizedProps[key] = isFinite(value) ? value : 0;
            } else {
              // Convert to string and sanitize
              normalizedProps[key] = String(value)
                .replace(/\0/g, "")
                .replace(/[\x00-\x1F\x7F]/g, "")
                .trim()
                .substring(0, 254);
            }
          }
        }

        return {
          type: "Feature",
          geometry: {
            type: geometryType, // Keep original geometry type
            coordinates: finalCoords,
          },
          properties: normalizedProps,
        };
      });

      console.log(
        `✅ All ${finalFeatures.length} features validated and formatted for shapefile`
      );

      const sanitizedGeoJSON = {
        type: "FeatureCollection",
        features: finalFeatures,
      };

      console.log(
        `✅ Sanitized ${finalFeatures.length} features with validated coordinates`
      );

      // CRITICAL: Final validation - filter out any features that might be rejected by library
      // Library @mapbox/shp-write may silently skip features with invalid geometry
      const finalValidFeatures = sanitizedGeoJSON.features.filter(
        (feature, idx) => {
          // Ensure geometry exists and is valid
          if (!feature.geometry || !feature.geometry.coordinates) {
            console.warn(`⚠️ Feature ${idx}: Missing geometry, filtering out`);
            return false;
          }

          // Ensure LineString has at least 2 coordinates
          if (feature.geometry.type === "LineString") {
            const coords = feature.geometry.coordinates;
            if (!Array.isArray(coords) || coords.length < 2) {
              console.warn(
                `⚠️ Feature ${idx}: LineString has < 2 coordinates, filtering out`
              );
              return false;
            }

            // Verify all coordinates are valid
            const allValid = coords.every((coord) => {
              return (
                Array.isArray(coord) &&
                coord.length >= 2 &&
                !isNaN(coord[0]) &&
                !isNaN(coord[1]) &&
                isFinite(coord[0]) &&
                isFinite(coord[1])
              );
            });

            if (!allValid) {
              console.warn(
                `⚠️ Feature ${idx}: Invalid coordinates, filtering out`
              );
              return false;
            }
          } else {
            console.warn(
              `⚠️ Feature ${idx}: Unexpected geometry type ${feature.geometry.type}, filtering out`
            );
            return false;
          }

          // Ensure properties exist and have all required keys
          if (!feature.properties) {
            console.warn(
              `⚠️ Feature ${idx}: Missing properties, filtering out`
            );
            return false;
          }

          const propKeys = Object.keys(feature.properties);
          if (propKeys.length !== expectedPropertyKeys.length) {
            console.warn(
              `⚠️ Feature ${idx}: Properties count mismatch (${propKeys.length} vs ${expectedPropertyKeys.length}), filtering out`
            );
            return false;
          }

          return true;
        }
      );

      if (finalValidFeatures.length !== sanitizedGeoJSON.features.length) {
        console.warn(
          `⚠️ Filtered ${
            sanitizedGeoJSON.features.length - finalValidFeatures.length
          } invalid features before sending to library`
        );
      }

      if (finalValidFeatures.length === 0) {
        throw new Error("No valid features after final validation");
      }

      const finalGeoJSON = {
        type: "FeatureCollection",
        features: finalValidFeatures,
      };

      // CRITICAL: Log feature count before sending to library
      console.log(
        `📊 Sending ${finalGeoJSON.features.length} validated features to @mapbox/shp-write library`
      );
      console.log(
        `📋 First feature properties keys: ${Object.keys(
          finalGeoJSON.features[0]?.properties || {}
        ).join(", ")}`
      );

      // Try using @nickrsan/shp-write first - more reliable and fixes dbf/shp sync issues
      console.log(
        "🔄 Trying @nickrsan/shp-write library (fixes dbf/shp sync issues)..."
      );

      let zipBuffer;
      try {
        // Use @nickrsan/shp-write which fixes the dbf/shp mismatch issue
        const zipResult = await nickShpWrite.zip(finalGeoJSON);

        if (Buffer.isBuffer(zipResult)) {
          zipBuffer = zipResult;
        } else if (typeof zipResult === "string") {
          try {
            zipBuffer = Buffer.from(zipResult, "base64");
          } catch (e) {
            zipBuffer = Buffer.from(zipResult, "binary");
          }
        } else {
          throw new Error(
            `@nickrsan/shp-write returned unexpected type: ${typeof zipResult}`
          );
        }

        if (!zipBuffer || zipBuffer.length === 0) {
          throw new Error("@nickrsan/shp-write returned empty buffer");
        }

        console.log(
          `✅ Shapefile ZIP created using @nickrsan/shp-write. Size: ${zipBuffer.length} bytes, Features: ${finalGeoJSON.features.length}`
        );

        res.send(zipBuffer);
        console.log(`✅ Shapefile ZIP sent to client`);
        console.log(`====================================\n`);
        return; // Exit early on success
      } catch (nickError) {
        console.error("❌ Error with @nickrsan/shp-write:", nickError.message);
        console.log("⚠️ Falling back to @mapbox/shp-write.zip()...");

        // Fallback to @mapbox/shp-write
        try {
          // Use zip() method which handles everything internally
          const zipResult = await shpwrite.zip(finalGeoJSON);

          // Handle zip() result
          if (Buffer.isBuffer(zipResult)) {
            zipBuffer = zipResult;
          } else if (typeof zipResult === "string") {
            try {
              zipBuffer = Buffer.from(zipResult, "base64");
            } catch (e) {
              zipBuffer = Buffer.from(zipResult, "binary");
            }
          } else {
            throw new Error(
              `zip() returned unexpected type: ${typeof zipResult}`
            );
          }

          if (!zipBuffer || zipBuffer.length === 0) {
            throw new Error("zip() returned empty buffer");
          }

          console.log(
            `✅ Shapefile ZIP created using @mapbox/shp-write fallback. Size: ${zipBuffer.length} bytes, Features: ${finalGeoJSON.features.length}`
          );

          res.send(zipBuffer);
          console.log(`✅ Shapefile ZIP sent to client`);
          console.log(`====================================\n`);
          return; // Exit early on success
        } catch (fallbackError) {
          console.error(
            "❌ Error with @mapbox/shp-write.zip() fallback:",
            fallbackError.message
          );
          console.error("Error details:", {
            message: fallbackError.message,
            name: fallbackError.name,
            stack: fallbackError.stack,
          });

          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              error: "Failed to create Shapefile",
              message: fallbackError.message,
            });
          }
        }
      }
    } catch (shpError) {
      console.error("❌ Error creating shapefile:", shpError);
      console.error("Error stack:", shpError.stack);
      console.error("Error details:", {
        message: shpError.message,
        name: shpError.name,
        constructor: shpError.constructor.name,
      });

      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          error: "Failed to create Shapefile",
          message: shpError.message,
        });
      }
    }
  } catch (error) {
    console.error("❌ Error exporting Shapefile:", error);
    console.error("Error stack:", error.stack);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: "Failed to export Shapefile",
        message: error.message,
      });
    }
  }
});
*/
// End of commented shapefile export endpoint

// DELETE /api/jalan/:id - Delete road (if needed for admin)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=== DELETE ROAD REQUEST ===");
    console.log("Road ID:", id);
    console.log("===========================");

    await prisma.jalanLingkunganKubuRaya.delete({
      where: {
        id: parseInt(id),
      },
    });

    console.log("Road deleted successfully:", id);

    res.json({
      success: true,
      message: "Road deleted successfully",
    });
  } catch (error) {
    console.error("=== ERROR DELETING ROAD ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    console.error("===========================");

    res.status(500).json({
      success: false,
      error: "Failed to delete road",
      details: error.message,
      code: error.code,
    });
  }
});

module.exports = router;
