import {Url} from '../models/urlmodels.mjs';
import { customHash } from '../utils/customhash.mjs';

async function createShortUrl(req, res) {
    const { fullUrl } = req.body;

    if (!fullUrl) {
        return res.status(400).json({ error: "Full URL is required" });
    }

    try {
        let url = await Url.findOne({ fullUrl });
        if (url) {
            return res.status(200).render('result',{ fullUrl: url.fullUrl, shortUrl: url.shortUrl });
        }

        let shortUrl;
        let isUnique = false;

        while (!isUnique) {
            shortUrl = customHash(fullUrl);
            const existingUrl = await Url.findOne({ shortUrl });

            if (!existingUrl) {
                isUnique = true;
            }
        }

        url = new Url({ fullUrl, shortUrl });
        await url.save();

        res.status(201).render('result', { fullUrl, shortUrl });
    } catch (error) {
        console.error("Error creating short URL:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function redirectShortUrl(req, res) {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });

        if (url) {
            url.visits += 1;
            await url.save();
            return res.redirect(url.fullUrl);
        }

        res.status(404).json({ error: "Short URL not found" });
    } catch (error) {
        console.error("Error handling short URL redirect:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { createShortUrl, redirectShortUrl };
