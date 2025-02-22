const express = require("express");
const qr = require("qr-image");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files 
app.use(express.static("public"));

// Endpoint to generate QR code
app.post("/generate-qr", express.json(), (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send({ message: "URL is required" });
  }

  const qrSvg = qr.image(url, { type: "png" });
  const filePath = path.join(__dirname, "public", "qr_img.png");

  // Create the file and save the QR code image
  qrSvg.pipe(fs.createWriteStream(filePath))
    .on("finish", () => {
      res.status(200).send({ message: "QR code generated", imageUrl: "/qr_img.png" });
    })
    .on("error", (err) => {
      res.status(500).send({ message: "Error generating QR code", error: err.message });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
