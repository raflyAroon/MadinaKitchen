import express from "express";
import { getCatalog } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getCatalog);

export default router;
