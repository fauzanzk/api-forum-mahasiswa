const express = require("express");
const router = express.Router();

// Mock data based on forum-mahasiswa frontend home.dart
const posts = [
  {
    id: 1,
    nama: "SistemInformasi",
    judul: "Tips bertahan hidup di ujian akhir Basis Data",
    upvotes: "247",
    comments: "38",
  },
  {
    id: 2,
    nama: "TeknikInformatika",
    judul: "Ada saran judul skripsi untuk anak IT yang tidak jago ngoding?",
    upvotes: "128",
    comments: "45",
  },
  {
    id: 3,
    nama: "KehidupanKampus",
    judul: "Tempat belajar paling nyaman di sekitar kampus",
    upvotes: "1.2k",
    comments: "150",
  },
];

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: posts,
  });
});

module.exports = router;
