const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.jsong({ message: "api sedang berjalan" });
});

app.use((req, res) => {
  res.status(400).json({ success: false, message: "endpoint tidak ditemukan" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server berjaland di http://localhost:", PORT);
});
