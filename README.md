# Mayur Arora — Developer Platform & Secure CMS

A professional, high-performance developer portfolio and content management system built with **Next.js 16 (App Router)**, **React 19**, **MongoDB**, **Framer Motion**, and **Tailored Design Tokens**.

Features an interactive dual-image pointer reveal hero mask, a dedicated categorized skills catalog at `/skills`, dynamic project showcases at `/project/[slug]`, and a complete private administrative CMS dashboard at `/admin`.

---

## 🚀 Key Features

- **Preserved Hero Visual Identity**: The exact dual-layer portrait images (`hero-portrait-base.png` & `hero-portrait-color.png`) and real-time pointer mask trail reveal are fully preserved and responsive across desktop and touch devices.
- **Dedicated Skills Catalog (`/skills`)**: Real route with categorized filtering (Frontend, Backend, Database, Workflow, Creative), search lookup, and descriptive proficiency badges (`Comfortable`, `Practicing`, `Learning`, `Mastered`).
- **Dynamic Project Showcases (`/project/[id]`)**: In-depth architecture overviews, technology tags, media view, live demo launch, and GitHub repository links.
- **Private Administrative CMS (`/admin`)**:
  - **Overview**: Real-time MongoDB metrics (projects, drafts, skills, services, inquiries, system health).
  - **Projects CRUD**: Create, edit, reorder, attach thumbnails, and toggle draft/published status.
  - **Skills & Categories**: Organize competencies into domains with custom ordering.
  - **Services Manager**: Manage developer and video editing service offerings.
  - **Media Library**: Upload images (max 5MB, MIME validated), copy URLs, and preview assets. Hero image assets are protected from accidental deletion.
  - **Profile & Narrative**: Live updates to hero headline, role title, bio, and social links.
  - **Site Content & SEO**: Edit page titles, meta descriptions, and contact copy.
  - **Contact Inbox**: Persistent lead management with unread/read/archived workflows.
  - **Settings & Security**: Master password updates and active session review.
  - **Light & Dark Themes**: Decoupled theme toggle for the admin interface.
- **Zero-Git Content Publishing**: Content saved in MongoDB instantly updates the live site via Next.js `revalidatePath` without requiring Git commits or Vercel rebuilds.
- **Resilient Fallback Layer**: If MongoDB Atlas credentials are not yet configured in local development, the repository layer automatically loads from the initial seed dataset without throwing runtime exceptions.
- **Enterprise-Grade Security**: Stateless JWT cookies (`jose`), salted bcrypt password hashing (`bcryptjs`), rate limiting on login & contact routes, Zod schema input validation, and audit logging.

---

## 🛠 Technology Stack

- **Framework**: Next.js 16.3.8 (App Router & Turbopack)
- **Runtime**: React 19.2.8 & React DOM
- **Database**: MongoDB Atlas (Official `mongodb` Node.js driver)
- **Authentication**: Stateless HS256 JWT sessions via `jose` in HTTP-only cookies
- **Security**: `bcryptjs` password hashing, in-memory sliding-window rate limiting, Zod validation
- **Animations**: Framer Motion 13.4.0 & custom RAF pointer physics
- **Icons**: Lucide Icons
- **Styling**: Vanilla CSS Design Tokens (`src/index.css`, `src/styles/Admin.css`)

---

## 📦 Getting Started Locally

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm 9+

### 2. Installation
```bash
git clone <your-repository-url>
cd mayur-arora
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your variables:
```env
# MongoDB Atlas Connection URI
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB="mayur_portfolio"

# Cryptographic Secret for Admin JWT Sessions (minimum 32 chars)
JWT_SECRET="your_secure_random_secret_string_minimum_32_chars"

# Public Site Domain
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

*(Note: If `MONGODB_URI` is omitted during local development, the application automatically runs in resilient fallback mode with baseline data).*

### 4. Database Seeding
To populate your MongoDB Atlas cluster with the initial portfolio data (4 projects, skills catalog, services, settings, and initial admin account):
```bash
npm run seed
```

### 5. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public portfolio.

---

## 🔐 Administrative Access & Bootstrap

To create your initial private administrator account with your own custom email and password:

```bash
npm run bootstrap:admin
```

- Prompts for your chosen email and password interactively (or via environment variables).
- Hashes password using bcrypt with 12 rounds before storing in MongoDB Atlas.
- Permanently locks out public or repeated registration.
- If you ever forget your password, safely recover access via: `npm run reset:admin`.

Access the dashboard portal at: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🧪 Verification & Production Build

To run the Next.js Turbopack production compiler and verify TypeScript/routing:
```bash
npm run build
```
Starts the optimized production server:
```bash
npm run start
```

---

## 🌐 Deploying to Vercel

1. Push your code to your GitHub repository (when you are ready).
2. Connect your repository to [Vercel](https://vercel.com).
3. In the Vercel Project Settings, add the Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `MONGODB_DB`: `mayur_portfolio`.
   - `JWT_SECRET`: A secure 32+ character random secret string.
   - `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app` (or custom domain).
4. Deploy! All 35 static pages and dynamic route handlers will compile automatically.

---

## 📚 Technical Documentation & 16 Architecture Diagrams

Comprehensive engineering documentation and Mermaid diagrams are located in the `docs/` folder:

- **[Initial Audit Report](docs/initial-audit.md)**: Baseline audit and technical gaps analysis.
- **[System Architecture](docs/architecture.md)**: System design specifications and boundaries.
- **[Database Schema & Indexing](docs/database-schema.md)**: MongoDB document definitions and indexes.
- **[Security Architecture](docs/security.md)**: Threat model, rate limiting, and session security.
- **[Design System Specifications](docs/design-system.md)**: Color tokens, typography, and hero animation physics.
- **[Quality Assurance Report](docs/testing-report.md)**: Build logs, test matrices, and verification status.
- **[16 Technical Diagrams Index](docs/diagrams/README.md)**:
  1. [System Architecture](docs/diagrams/01-system-architecture.md)
  2. [Application Route Map](docs/diagrams/02-route-map.md)
  3. [Database ERD & Relationships](docs/diagrams/03-database-erd.md)
  4. [Authentication Lifecycle](docs/diagrams/04-authentication-flow.md)
  5. [Authorization & Mutation Pipeline](docs/diagrams/05-authorization-mutation.md)
  6. [Project Content Lifecycle](docs/diagrams/06-project-lifecycle.md)
  7. [Media Upload & Management](docs/diagrams/07-media-upload.md)
  8. [Publishing & Cache Revalidation](docs/diagrams/08-publishing-cache.md)
  9. [Admin Information Architecture](docs/diagrams/09-admin-information-architecture.md)
  10. [Theme State & Token Resolution](docs/diagrams/10-theme-flow.md)
  11. [Security Boundaries & Threat Model](docs/diagrams/11-security-boundaries.md)
  12. [Deployment & Environment Flow](docs/diagrams/12-deployment-flow.md)
  13. [Backup & Disaster Recovery](docs/diagrams/13-backup-recovery.md)
  14. [Testing & Quality Assurance](docs/diagrams/14-testing-workflow.md)
  15. [User Experience Journeys](docs/diagrams/15-user-journeys.md)
  16. [Complete End-to-End Data Flow](docs/diagrams/16-complete-data-flow.md)
