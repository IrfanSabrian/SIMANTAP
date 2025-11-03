# SIMANTAP Backend API

Backend API untuk SIMANTAP KUBU RAYA (Sistem Informasi Manajemen Tata Permukiman) menggunakan Express.js dan Prisma ORM dengan PostgreSQL + PostGIS.

## Features

- 🚀 Express.js server dengan security middleware
- 🗄️ Prisma ORM untuk database operations
- 🗺️ PostGIS support untuk data geografis
- 🔒 Rate limiting dan CORS protection
- 📊 API endpoints untuk CRUD operations
- 📈 Statistics dan analytics endpoints
- 🔍 Advanced filtering dan search

## Prerequisites

- Node.js (v16 atau lebih tinggi)
- PostgreSQL dengan PostGIS extension
- Database `kubu_raya` sudah dibuat dan diisi data

## Installation

1. Install dependencies:

```bash
npm install
```

2. Setup environment variables:

```bash
cp env.example .env
```

3. Edit `.env` file dengan konfigurasi database Anda:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/kubu_raya?schema=public"
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Start development server:

```bash
npm run dev
```

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Jalan Lingkungan Routes

#### Get All Roads

- `GET /api/jalan`
- Query parameters:
  - `page` (default: 1)
  - `limit` (default: 50)
  - `kecamatan` - Filter by kecamatan
  - `desa` - Filter by desa
  - `kondisi` - Filter by kondisi jalan
  - `tahun` - Filter by tahun
  - `search` - Search by nama jalan

#### Get Road by ID

- `GET /api/jalan/:id`

#### Get Statistics

- `GET /api/jalan/stats/summary` - Summary statistics

#### Get Filter Options

- `GET /api/jalan/filters/options` - Available filter options

#### Create Road (Admin)

- `POST /api/jalan`

#### Update Road (Admin)

- `PUT /api/jalan/:id`

#### Delete Road (Admin)

- `DELETE /api/jalan/:id`

## Database Schema

Model `JalanLingkunganKubuRaya` dengan fields:

- `id` - Primary key
- `geom` - PostGIS geometry (LineString)
- `fid`, `noRuas`, `noJalan` - Road identifiers
- `nama`, `namaJalan` - Road names
- `panjangM`, `lebarM` - Physical dimensions
- `kondisi`, `tahun` - Road condition info
- `kecamatan`, `desa` - Administrative areas
- `utmXAwal`, `utmYAwal`, `utmXAkhi`, `utmYAkhi` - UTM coordinates
- Dan field lainnya sesuai dengan schema database

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:push` - Push schema to database

## Security Features

- Helmet.js untuk security headers
- CORS protection
- Rate limiting
- Request size limiting
- Input validation
- Error handling

## Development

Server akan berjalan di `http://localhost:3000` (atau port yang dikonfigurasi di `.env`).

Health check endpoint: `http://localhost:3000/health`

## Production Deployment

1. Set `NODE_ENV=production` di environment
2. Update `DATABASE_URL` dengan production database
3. Update `FRONTEND_URL` dengan production frontend URL
4. Run `npm start`
