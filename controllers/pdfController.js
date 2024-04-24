const PDFFile = require("../models/pdfFile");
const path = require("path");
require("dotenv").config();
const Sequelize = require("sequelize");
const { createFileName } = require("../config/storege");
const { generateRandomNumber } = require("../utils/idGenaret");

const url = process.env.URL;
const uploadPDF = async (req, res) => {
  try {
    const { title, description } = req.body;
    const fileName = createFileName(req.file);
    const fileURL = `${url}/cert/GetCert/${fileName}`;
    const fileID = await generateRandomNumber(6);
    const pdf = await PDFFile.create({
      fileID,
      fileName,
      fileURL,
      title,
      description,
      status: "Active",
      isDeleted: false,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "PDF file uploaded successfully.",
        fileURL,
        data: pdf,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error uploading PDF file." });
  }
};

const getPDFDetails = async (req, res) => {
  try {
    if (!req.params.id) {
      const page = JSON.parse(req.query.page) || 1;
      const limit = JSON.parse(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const totalFiles = await PDFFile.findAndCountAll({
        where: { isDeleted: false },
      });

      const totalPages = Math.ceil((await totalFiles.count) / limit);
      const currPage = page;
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;
      let files = await PDFFile.findAll({
        limit,
        offset,
        where: { isDeleted: false },
      });
      return res
        .status(200)
        .json({
          success: true,
          data: files,
          pagination: { totalPages, currPage, nextPage, prevPage },
        });
    } else {
      const pdf = await PDFFile.findOne({
        where: { id: req.params.id, isDeleted: false },
      });
      if (!pdf) {
        return res
          .status(404)
          .json({ success: false, message: "PDF file not found or deleted" });
      }

      const filePath = path.join(__dirname, "..", "cert/GetCert", pdf.fileName);

      res.setHeader("Content-Type", "application/pdf");

      res.sendFile(filePath);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving PDF file." });
  }
};

const getPDFByFileID = async (req, res) => {
  try {
    const fileID = req.query.id;
    console.log("fileID", fileID);
    const pdf = await PDFFile.findOne({
      where: { fileID: fileID, isDeleted: false },
    });

    if (!pdf) {
      return res
        .status(404)
        .json({ success: false, message: "PDF file not found or deleted" });
    }
    const filePath = path.join(__dirname, "..", "cert/GetCert", pdf.fileName);
    res.setHeader("Content-Type", "application/pdf");

    return res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving PDF file." });
  }
};

const updatePDFDetails = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const pdf = await PDFFile.findByPk(id);
    if (!pdf) {
      return res
        .status(404)
        .json({ success: false, message: "PDF file not found." });
    }

    await pdf.update({ title, description, status });
    res
      .status(200)
      .json({
        success: true,
        message: "PDF file details updated successfully.",
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating PDF file details." });
  }
};

const deletePDF = async (req, res) => {
  const { id } = req.params;

  try {
    const pdf = await PDFFile.findByPk(id);
    if (!pdf) {
      return res
        .status(404)
        .json({
          success: false,
          message: "PDF file not found or already deleted.",
        });
    }
    await pdf.update({ isDeleted: true });
    res
      .status(200)
      .json({ success: true, message: "PDF file deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting PDF file." });
  }
};

const getPDFsByTitle = async (req, res) => {
  const { title } = req.query;
  console.log("req.query", req.query);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: pdfs } = await PDFFile.findAndCountAll({
      where: {
        title: { [Sequelize.Op.iLike]: `%${title}%` },
        isDeleted: false,
      },
      limit,
      offset,
    });

    if (pdfs.length === 0) {
      return res.status(404).json({ error: "No PDFs found with that title" });
    }

    const totalPages = Math.ceil(count / limit);
    const currPage = page;
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return res
      .status(200)
      .json({
        success: true,
        data: pdfs,
        pagination: {
          total: count,
          totalPages,
          currPage,
          limit,
          nextPage,
          prevPage,
        },
      });
  } catch (error) {
    console.error("Error fetching PDFs by title:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  uploadPDF,
  getPDFDetails,
  getPDFByFileID,
  updatePDFDetails,
  deletePDF,
  getPDFsByTitle,
};
