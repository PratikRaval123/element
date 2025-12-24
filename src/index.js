const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const blogRoutes = require("./routes/blogRoutes");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes"); // Added contact routes

dotenv.config();

const PORT = process.env.PORT || 8500;
const MONGODB_URI = process.env.MONGODB_URI;
const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// Serve static files from 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Backend</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Arial, sans-serif;
          background: #f4f6f8;
        }
        .box {
          background: #fff;
          padding: 40px 60px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          text-align: center;
        }
        h1 { margin: 0; color: #1e293b; }
        p { margin-top: 10px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>Welcome to Port Backend 🚀</h1>
        <p>Your API is running successfully</p>
      </div>
    </body>
    </html>
  `);
});

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server ready on http://localhost:${PORT}`);
  });
});

