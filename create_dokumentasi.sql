-- ============================================
-- SQL Script untuk Tabel Web Profil (REVISI)
-- Dinas Perumahan dan Kawasan Permukiman
-- PostgreSQL Database - Bahasa Indonesia
-- ============================================

BEGIN;

-- ============================================
-- ENUM TYPES
-- ============================================

-- Enum untuk jenis infrastruktur
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'JenisInfrastruktur') THEN
        CREATE TYPE "JenisInfrastruktur" AS ENUM (
            'Jalan Lingkungan',
            'Jembatan Lingkungan',
            'Drainase Lingkungan',
            'Kawasan Permukiman',
            'Rumah Tidak Layak Huni'
        );
    END IF;
END $$;

-- ============================================
-- 1. TABEL DOKUMENTASI KEGIATAN
-- ============================================

CREATE TABLE IF NOT EXISTS dokumentasi_kegiatan (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    deskripsi TEXT,
    konten TEXT,
    kategori VARCHAR(100),
    tanggal DATE NOT NULL,
    thumbnail VARCHAR(500),
    gambar_lainnya TEXT[] DEFAULT '{}',
    dibuat_pada TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dokumentasi_kegiatan_slug ON dokumentasi_kegiatan(slug);
CREATE INDEX IF NOT EXISTS idx_dokumentasi_kegiatan_tanggal ON dokumentasi_kegiatan(tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_dokumentasi_kegiatan_kategori ON dokumentasi_kegiatan(kategori);

-- ============================================
-- 2. TABEL DOKUMENTASI INFRASTRUKTUR
-- ============================================

CREATE TABLE IF NOT EXISTS dokumentasi_infrastruktur (
    id SERIAL PRIMARY KEY,
    jenis_infrastruktur "JenisInfrastruktur" NOT NULL,
    link_youtube VARCHAR(500) NOT NULL,
    no_ruas VARCHAR(100) NOT NULL,
    dibuat_pada TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diperbarui_pada TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dokumentasi_infrastruktur_jenis ON dokumentasi_infrastruktur(jenis_infrastruktur);
CREATE INDEX IF NOT EXISTS idx_dokumentasi_infrastruktur_no_ruas ON dokumentasi_infrastruktur(no_ruas);

-- ============================================
-- ============================================
-- TRIGGERS untuk auto-update diperbarui_pada
-- ============================================

CREATE OR REPLACE FUNCTION update_diperbarui_pada()
RETURNS TRIGGER AS $$
BEGIN
    NEW.diperbarui_pada = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS trigger_dokumentasi_kegiatan_updated ON dokumentasi_kegiatan;
CREATE TRIGGER trigger_dokumentasi_kegiatan_updated
    BEFORE UPDATE ON dokumentasi_kegiatan
    FOR EACH ROW EXECUTE FUNCTION update_diperbarui_pada();

DROP TRIGGER IF EXISTS trigger_dokumentasi_infrastruktur_updated ON dokumentasi_infrastruktur;
CREATE TRIGGER trigger_dokumentasi_infrastruktur_updated
    BEFORE UPDATE ON dokumentasi_infrastruktur
    FOR EACH ROW EXECUTE FUNCTION update_diperbarui_pada();

COMMIT;

-- ============================================
-- VERIFICATION
-- ============================================

SELECT 'Tabel Dokumentasi berhasil dibuat!' as status;

SELECT 
    table_name as nama_tabel,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as jumlah_kolom
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name IN (
        'dokumentasi_kegiatan', 
        'dokumentasi_infrastruktur'
    )
ORDER BY table_name;

