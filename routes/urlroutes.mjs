import express from 'express';
import { createShortUrl, redirectShortUrl } from '../controllers/urlcontroller.mjs';

const router = express.Router();

router.post('/shorten', createShortUrl);
router.get('/:shortUrl', redirectShortUrl);

export default router;
