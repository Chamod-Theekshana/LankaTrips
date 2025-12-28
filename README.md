# LankaTrips (MERN)

Sri Lanka travel booking web app (customers + admin).

- **Frontend:** React + Vite, React Router, Axios, TailwindCSS
- **Backend:** Node.js + Express
- **DB:** MongoDB + Mongoose
- **Auth:** JWT + role-based access (customer/admin)
- **Uploads:** Multer (local `/uploads`) + optional Cloudinary later
- **Receipts:** Auto-created on booking; PDF download endpoint; Admin CSV export

---

## 1) Quick Start (Local)

### Prereqs
- Node.js 18+ (recommended)
- MongoDB running locally **or** a MongoDB Atlas URI

### Clone / open
```bash
cd LankaTrips
```

---

## 2) Backend Setup (server)

### Install
```bash
cd server
npm install
```

### Env
Copy `.env.example` to `.env` and edit values:
```bash
cp .env.example .env
```

### Run (dev)
```bash
npm run dev
```

### Seed sample data (creates admin + sample locations/packages)
In a new terminal:
```bash
cd server
npm run seed
```

Seed creates:
- Admin: `admin@lankatrips.lk` / `Admin@123`
- Customer: `user@lankatrips.lk` / `User@123`

---

## 3) Frontend Setup (client)

```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

Open the Vite URL shown in terminal.

---

## 4) Key URLs

- API health: `GET http://localhost:5001/api/health`
- Uploaded images served from: `http://localhost:5001/uploads/<filename>`

---

## 5) Notes

- Payments are **Pay Later** by default.
- Stripe is optional and scaffolded (see `server/src/routes/stripeRoutes.js`).
- Receipt PDF download:
  - Customer: from **My Receipts**
  - Admin: from **Admin → Receipts**

---

## 6) Scripts

### server
- `npm run dev` – start with nodemon
- `npm start` – production
- `npm run seed` – seed sample data

### client
- `npm run dev` – start Vite dev server
- `npm run build` – build
- `npm run preview` – preview production build
