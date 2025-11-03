# SIMANTAP KUBU RAYA Web GIS

SIMANTAP KUBU RAYA (Sistem Informasi Manajemen Tata Permukiman) berbasis Web GIS menggunakan Nuxt.js dan ArcGIS JS API.

## Fitur

- **Web GIS Interface**: Peta interaktif menggunakan ArcGIS JS API
- **Responsive Design**: Tampilan yang optimal di berbagai perangkat
- **Data Peta Lokal**: Data peta tematik tersimpan di folder `public/data`
- **Modern UI**: Interface yang bersih dan modern dengan gradient navbar

## Struktur Project

```
├── components/
│   ├── Navbar.vue          # Komponen navbar
│   └── MapView.vue         # Komponen peta utama
├── pages/
│   └── index.vue           # Halaman utama
├── public/
│   └── data/
│       └── peta-tematik/   # Data peta (SHP, GeoJSON, dll)
├── assets/
│   └── css/
│       └── main.css        # Styling global
├── nuxt.config.ts          # Konfigurasi Nuxt
└── package.json            # Dependencies
```

## Instalasi & Menjalankan

1. Install dependencies:

```bash
npm install
```

2. Jalankan development server:

```bash
npm run dev
```

3. Buka browser di `http://localhost:3000`

## Teknologi yang Digunakan

- **Nuxt.js 3**: Framework Vue.js untuk SSR/SSG
- **ArcGIS JS API 4.28**: Library peta dan GIS
- **Vue 3**: Framework JavaScript reaktif
- **CSS3**: Styling dengan gradient dan animasi

## Data Peta

Data peta tematik tersimpan di folder `public/data/peta-tematik/` yang berisi:

- File Shapefile (.shp, .dbf, .prj, dll)
- File GeoJSON (.json)
- Data jalan lingkungan per kecamatan dan desa

## Konfigurasi Peta

Peta dikonfigurasi dengan:

- **Basemap**: Satellite imagery
- **Center**: Koordinat Pontianak, Kalimantan Barat (109.3425, -0.0263)
- **Zoom Level**: 10
- **UI Components**: Attribution, Zoom, Compass

## Development

Untuk menambahkan layer peta baru:

1. Tambahkan data ke folder `public/data/`
2. Import layer di komponen `MapView.vue`
3. Konfigurasi styling dan popup sesuai kebutuhan

## Build untuk Production

```bash
npm run build
npm run preview
```
