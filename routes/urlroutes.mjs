// import express from 'express';
// import { createShortUrl, redirectShortUrl } from '../controllers/urlcontroller.mjs';
// import { Url } from '../models/urlmodels.mjs';

// const router = express.Router();

// router.post('/shorten', createShortUrl);
// router.get('/:shortUrl', redirectShortUrl);

// router.get('/checkUrlStats', async (req, res) => {
//     const { fullUrl } = req.query;
//     console.log('Received request for checkUrlStatus with query:', req.query);

//     try {
//         const url = await Url.findOne({ fullUrl });
//         if (url) {
//             console.log('URL found:', url);
//             return res.status(200).json({ baseUrl: req.protocol + '://' + req.get('host'), shortUrl: url.shortUrl });
//         }
//         console.log('URL not found in the database.');
//         res.status(404).json({ message: "URL not found" });
//     } catch (error) {
//         console.error("Error checking URL status:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// export default router;

import express from 'express';
import { createShortUrl, redirectShortUrl } from '../controllers/urlcontroller.mjs';
import { Url } from '../models/urlmodels.mjs';

const router = express.Router();

// Ensure this route is defined first
router.get('/checkUrlStatus', async (req, res) => {
    const { fullUrl } = req.query;
    console.log(req.query);
    try {
        const url = await Url.findOne({ fullUrl });
        if (url) {
            console.log("url foundy");
            return res.status(200).json({ baseUrl: req.protocol + '://' + req.get('host'), shortUrl: url.shortUrl });
        }
        res.status(404).json({ message: "URL not found" });
    } catch (error) {
        console.error("Error checking URL status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/result', async (req, res) => {
    const { fullUrl, shortUrl } = req.query;
    res.render('result', { baseUrl: req.protocol + '://' + req.get('host'), fullUrl, shortUrl, "message":null });
});

router.post('/shorten', createShortUrl);

// This route should be defined last to avoid conflicts
router.get('/:shortUrl', redirectShortUrl);

export default router;
