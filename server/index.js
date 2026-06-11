/* eslint-env node */

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "db.json");
const PORT = process.env.PORT || 4000;

function ensureDataFile() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      accounts: [],
      listings: [],
    };
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  }
}

function readDatabase() {
  ensureDataFile();
  const content = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(content);
}

function writeDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body || {};

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const db = readDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const exists = db.accounts.some(
    (account) => account.email.toLowerCase() === normalizedEmail,
  );

  if (exists) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const account = {
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
  };

  db.accounts.push(account);
  writeDatabase(db);

  return res
    .status(201)
    .json({ name: account.name, email: account.email, role: account.role });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const db = readDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const account = db.accounts.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password,
  );

  if (!account) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({
    name: account.name,
    email: account.email,
    role: account.role,
  });
});

app.get("/api/listings", (_req, res) => {
  const db = readDatabase();
  return res.json(db.listings);
});

app.post("/api/listings", (req, res) => {
  const listing = req.body || {};
  const requiredFields = [
    "title",
    "province",
    "district",
    "ward",
    "address",
    "price",
    "area",
    "bedrooms",
    "description",
    "tags",
    "imageUrl",
    "contact",
    "latitude",
    "longitude",
    "ownerEmail",
  ];

  const missing = requiredFields.filter(
    (field) => listing[field] === undefined || listing[field] === null,
  );
  if (missing.length > 0) {
    return res
      .status(400)
      .json({ message: `Missing fields: ${missing.join(", ")}` });
  }

  const db = readDatabase();
  const newListing = {
    ...listing,
    id: `room-${Date.now()}`,
    status: listing.status === "rented" ? "rented" : "available",
  };

  db.listings.unshift(newListing);
  writeDatabase(db);

  return res.status(201).json(newListing);
});

app.put("/api/listings/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};

  const db = readDatabase();
  const listingIndex = db.listings.findIndex((item) => item.id === id);

  if (listingIndex === -1) {
    return res.status(404).json({ message: "Listing not found." });
  }

  db.listings[listingIndex] = {
    ...db.listings[listingIndex],
    ...updates,
  };

  writeDatabase(db);
  return res.json(db.listings[listingIndex]);
});

app.delete("/api/listings/:id", (req, res) => {
  const { id } = req.params;

  const db = readDatabase();
  const listingIndex = db.listings.findIndex((item) => item.id === id);

  if (listingIndex === -1) {
    return res.status(404).json({ message: "Listing not found." });
  }

  db.listings.splice(listingIndex, 1);
  writeDatabase(db);

  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
