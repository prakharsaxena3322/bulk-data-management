import { Router } from "express";
import { bulkInsert, fetchAll } from "../controller/recordController.js";
import multer from "multer";

const router = Router();
const upload = multer(); // Memory storage for uploaded files

// Routes
router.post("/bulk-insert", upload.single("file"), bulkInsert);
router.get("/", fetchAll);


export default router;
