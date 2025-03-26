import { Record } from "../models/record.js";

import xlsx from "xlsx";

/**
 * @swagger
 * /api/records/bulk-insert:
 *   post:
 *     summary: Insert bulk records from JSON or Excel file
 *     description: Allows the user to insert multiple records into the database via a JSON payload or an Excel file.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               records:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Records inserted successfully.
 *       400:
 *         description: No file or records provided.
 *       500:
 *         description: Internal server error.
 */
export const bulkInsert = async (req, res) => {
  try {
    let data;
    if (req.file) {
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (req.body.records) {
      data = req.body.records;
    } else {
      return res.status(400).json({ error: "No file or records provided" });
    }
    const records = await Record.bulkCreate(data);
    res.status(201).json({
      message: "Data successfully inserted",
      records,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Retrieve all records
 *     description: Fetches all records from the database.
 *     responses:
 *       200:
 *         description: A list of records.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error.
 */

export const fetchAll = async (req, res) => {
  try {
    const records = await Record.findAll();
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
