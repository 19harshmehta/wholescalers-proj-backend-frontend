const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// Do NOT include dotenv or mongoose connection here.

// --- Routes (keep these imports) ---
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const dashboardRoutes = require("./routes/dashboard");
const retailerRoutes = require("./routes/retailer");
const orderRoutes = require("./routes/orders");
const invoiceRoutes = require("./routes/invoices");
const reportRoutes = require("./routes/reports");
const settingsRoutes = require("./routes/settings");
const paymentRoutes = require("./routes/payments");

const app = express();
app.use(cors());

// Webhook must be declared before express.json()
app.use("/api/payments/webhook", paymentRoutes);

app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/retailerDashboard", retailerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) =>
  res.json({ ok: true, msg: "B2B Wholesale Portal API" })
);

// CRUCIAL: Export the app instance
module.exports = app;