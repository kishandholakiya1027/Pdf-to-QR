const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "aws-0-ap-southeast-1.pooler.supabase.com",
  port: 5432,
  username: "postgres.ftqcyirfxhybjdxxqvku",
  password: "Pdf_@2024#!",
  database: "postgres",
});

module.exports = sequelize;
