import express from 'express';
import { getHomePage } from '../controllers/homecontroller.mjs';

const router = express.Router();

router.get("/", getHomePage);

export default router;
