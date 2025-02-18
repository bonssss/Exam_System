const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Set up file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
app.post("/api/payments/upload", upload.single("receipt"), async (req, res) => {
  const { examId } = req.body;
  const receiptImage = req.file.path;

  try {
    const [result] = await db.execute(
      "INSERT INTO payments (user_id, exam_id, amount, receipt_image) VALUES (?, ?, ?, ?)",
      [1, examId, 100, receiptImage] // Example: user_id = 1, amount = 100
    );
    res.status(200).json({
      message: "Receipt uploaded successfully. Waiting for approval.",
    });
  } catch (error) {
    res.status(500).json({ error: "Error uploading receipt." });
  }
});

app.get("/api/payments/pending", async (req, res) => {
  try {
    const [payments] = await db.execute(
      "SELECT * FROM payments WHERE status = ?",
      ["pending"]
    );
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pending payments." });
  }
});

app.put("/api/payments/approve/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const [result] = await db.execute(
      "UPDATE payments SET status = ? WHERE id = ?",
      [status, req.params.id]
    );
    res.status(200).json({ message: `Payment ${status}` });
  } catch (error) {
    res.status(500).json({ error: "Error updating payment status." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
