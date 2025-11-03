const express = require("express");
const { prisma } = require("../prisma");
const axios = require("axios");

const router = express.Router();

// HuggingFace Configuration
// Updated to use new Inference Providers API (migrated from deprecated api-inference.huggingface.co)
const HF_API_URL =
  process.env.HF_API_URL || "https://router.huggingface.co/hf-inference/models";
// Using a smaller, faster model for better performance
// Options: bigscience/bloom-560m, microsoft/DialoGPT-medium, gpt2
const HF_MODEL = process.env.HF_MODEL || "microsoft/DialoGPT-medium";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Cache untuk FAQ responses
const faqCache = new Map();

// Helper function untuk get stats (similar to stats route)
async function getSIMANTAPStats() {
  try {
    const jalanStats = await prisma.$queryRaw`
      SELECT 
        COALESCE(SUM(panjang_m) / 1000, 0) as total_panjang_km,
        COUNT(*) as total_ruas
      FROM jalan_lingkungan_kubu_raya
      WHERE panjang_m IS NOT NULL
    `;

    const kecamatanCount = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT kecamatan) as total
      FROM jalan_lingkungan_kubu_raya
      WHERE kecamatan IS NOT NULL
    `;

    const desaCount = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT desa) as total
      FROM jalan_lingkungan_kubu_raya
      WHERE desa IS NOT NULL
    `;

    const infrastrukturCounts = await prisma.dokumentasiInfrastruktur.groupBy({
      by: ["jenisInfrastruktur"],
      _count: true,
    });

    return {
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
  } catch (error) {
    console.error("Error getting stats:", error);
    return null;
  }
}

// Pattern matching for common questions
async function checkFAQPattern(message) {
  const lowerMessage = message.toLowerCase().trim();

  // Check cache first
  if (faqCache.has(lowerMessage)) {
    return faqCache.get(lowerMessage);
  }

  let response = null;

  // FAQ patterns
  if (
    lowerMessage.includes("apa itu simantap") ||
    lowerMessage.includes("simantap adalah") ||
    lowerMessage.includes("penjelasan simantap")
  ) {
    response =
      "SIMANTAP KUBU RAYA adalah Sistem Informasi Manajemen Tata Permukiman untuk Kabupaten Kubu Raya. Platform spasial cerdas untuk manajemen dan perencanaan permukiman yang mencakup data jalan lingkungan, jembatan, drainase, kawasan permukiman, dan rumah tidak layak huni.";
  } else if (
    lowerMessage.includes("berapa total jalan") ||
    lowerMessage.includes("panjang jalan") ||
    lowerMessage.includes("total km")
  ) {
    const stats = await getSIMANTAPStats();
    if (stats) {
      response = `Total panjang jalan lingkungan di Kabupaten Kubu Raya adalah **${stats.jalan.totalPanjangKm} km** dengan **${stats.jalan.totalRuas} ruas jalan** yang telah dipetakan dan terdokumentasi.`;
    }
  } else if (
    lowerMessage.includes("jumlah kecamatan") ||
    lowerMessage.includes("berapa kecamatan")
  ) {
    const stats = await getSIMANTAPStats();
    if (stats) {
      response = `Kabupaten Kubu Raya memiliki **${stats.wilayah.kecamatan} kecamatan** yang mencakup **${stats.wilayah.desa} desa/kelurahan**.`;
    }
  } else if (
    lowerMessage.includes("jumlah ruas") ||
    lowerMessage.includes("berapa ruas")
  ) {
    const stats = await getSIMANTAPStats();
    if (stats) {
      response = `Total terdapat **${stats.jalan.totalRuas} ruas jalan** lingkungan yang telah dipetakan dalam sistem SIMANTAP.`;
    }
  } else if (
    lowerMessage.includes("dokumentasi") ||
    lowerMessage.includes("ada berapa")
  ) {
    const stats = await getSIMANTAPStats();
    if (stats && lowerMessage.includes("jembatan")) {
      response = `Terdapat **${stats.infrastruktur.jembatanLingkungan} dokumentasi jembatan lingkungan** dalam sistem SIMANTAP.`;
    } else if (stats && lowerMessage.includes("drainase")) {
      response = `Terdapat **${stats.infrastruktur.drainaseLingkungan} dokumentasi drainase lingkungan** dalam sistem SIMANTAP.`;
    } else if (stats && lowerMessage.includes("jalan")) {
      response = `Terdapat **${stats.infrastruktur.jalanLingkungan} dokumentasi jalan lingkungan** dalam sistem SIMANTAP.`;
    }
  } else if (
    lowerMessage.includes("hallo") ||
    lowerMessage.includes("halo") ||
    lowerMessage.includes("hai") ||
    lowerMessage.includes("helo") ||
    lowerMessage === "hi" ||
    lowerMessage === "hello"
  ) {
    response =
      "Halo! Saya adalah asisten SIMANTAP. Saya siap membantu menjawab pertanyaan Anda tentang infrastruktur permukiman di Kabupaten Kubu Raya. Ada yang bisa saya bantu?";
  } else if (
    lowerMessage.includes("terima kasih") ||
    lowerMessage.includes("thanks") ||
    lowerMessage.includes("thx")
  ) {
    response =
      "Sama-sama! Jika ada pertanyaan lain tentang SIMANTAP, jangan ragu untuk bertanya. Saya siap membantu kapan saja!";
  } else if (
    lowerMessage.includes("bantuan") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("apa yang bisa")
  ) {
    response =
      "Saya bisa membantu menjawab pertanyaan tentang:\n\n**Statistik Infrastruktur**: Total panjang jalan, jumlah ruas, jumlah kecamatan/desa\n**Data Infrastruktur**: Jalan lingkungan, jembatan, drainase, kawasan permukiman\n**Dokumentasi**: Jumlah dan informasi dokumentasi infrastruktur\n**Informasi Umum**: Penjelasan tentang SIMANTAP dan fitur-fiturnya\n\nSilakan tanyakan apa yang ingin Anda ketahui!";
  }

  // Cache response if found
  if (response) {
    faqCache.set(lowerMessage, response);
  }

  return response;
}

// Call HuggingFace API
async function callHuggingFaceAPI(message) {
  if (!HF_API_KEY) {
    throw new Error("HuggingFace API key not configured");
  }

  try {
    const modelUrl = `${HF_API_URL}/${HF_MODEL}`;

    // For text-generation models (Mistral, Llama, etc.)
    const response = await axios.post(
      modelUrl,
      {
        inputs: message,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        },
        options: {
          wait_for_model: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 45000, // 45 seconds timeout
      }
    );

    // Extract response based on model output format
    if (Array.isArray(response.data) && response.data[0]) {
      const result = response.data[0].generated_text || response.data[0].text;
      return result || "";
    } else if (response.data.generated_text) {
      return response.data.generated_text;
    } else if (typeof response.data === "string") {
      return response.data;
    }

    console.warn("Unexpected response format:", response.data);
    return "Maaf, saya mengalami kesulitan memproses respons. Silakan coba lagi.";
  } catch (error) {
    console.error("HuggingFace API error:", error.message);

    if (error.response?.status === 503) {
      throw new Error(
        "Model sedang loading, silakan coba lagi dalam beberapa detik"
      );
    } else if (error.response?.status === 429) {
      throw new Error("Rate limit tercapai, silakan coba lagi nanti");
    }

    throw error;
  }
}

// Main chatbot endpoint
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    console.log(`🤖 Chatbot query: "${message}"`);

    // 1. Try pattern matching first (FAQ responses)
    const faqResponse = await checkFAQPattern(message);

    if (faqResponse) {
      console.log("✅ FAQ matched, returning cached response");
      return res.json({
        success: true,
        data: {
          message: faqResponse,
          source: "faq",
        },
      });
    }

    // 2. If no FAQ match, use AI API
    console.log("🤖 No FAQ match, calling HuggingFace API");

    // Build context from SIMANTAP data
    const stats = await getSIMANTAPStats();
    const context = stats
      ? `Simantap adalah Sistem Informasi Manajemen Tata Permukiman untuk Kabupaten Kubu Raya. Statistik terbaru: Total panjang jalan ${stats.jalan.totalPanjangKm} km, ${stats.jalan.totalRuas} ruas jalan, ${stats.wilayah.kecamatan} kecamatan, ${stats.wilayah.desa} desa.`
      : "Simantap adalah Sistem Informasi Manajemen Tata Permukiman untuk Kabupaten Kubu Raya.";

    const enhancedMessage = `${context}\n\nPertanyaan: ${message}\n\nJawab dengan singkat dan ramah:`;

    const aiResponse = await callHuggingFaceAPI(enhancedMessage);

    return res.json({
      success: true,
      data: {
        message: aiResponse,
        source: "ai",
      },
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    // Fallback response if AI fails
    const fallbackMessage =
      "Maaf, saya mengalami kesulitan memproses pertanyaan Anda saat ini. Silakan coba lagi dalam beberapa saat atau hubungi admin untuk bantuan lebih lanjut.";

    return res.json({
      success: true,
      data: {
        message: fallbackMessage,
        source: "fallback",
      },
    });
  }
});

// Health check endpoint for chatbot
router.get("/health", async (req, res) => {
  try {
    const hasAPIKey = !!HF_API_KEY;
    const statsAvailable = (await getSIMANTAPStats()) !== null;

    res.json({
      success: true,
      data: {
        status: "healthy",
        features: {
          faq: true,
          ai: hasAPIKey,
          stats: statsAvailable,
        },
        api_key_configured: hasAPIKey,
        api_url: HF_API_URL,
        model: HF_MODEL,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
