const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pdfRoutes = require("./routes/pdfRoutes");
const sequelize = require("./config/database");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

app.use("/pdf", pdfRoutes);
app.use("/", () => {
  console.log(`Server running on port http://localhost:${PORT}/pdf`);
});

sequelize.sync().then(() => {
  console.log("Connection has been established successfully.");
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}/pdf`);
  });
});
