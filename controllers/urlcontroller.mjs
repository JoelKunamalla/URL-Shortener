// import { Url } from '../models/urlmodels.mjs';
// import { customHash } from '../utils/customhash.mjs';

// async function createShortUrl(req, res) {
//     const { fullUrl } = req.body;
//     console.log(`url check`);
//     console.log(isValidUrl(fullUrl));

//     if (!isValidUrl(fullUrl)) {
//         return res.status(400).render({ message: "Full URL is required" });
//     }
//     try {
//         let url = await Url.findOne({ fullUrl });
//         if (url) {
//             return res.status(200).render('result', { fullUrl: url.fullUrl, shortUrl: url.shortUrl });
//         }

//         let shortUrl;
//         let isUnique = false;

//         while (!isUnique) {
//             shortUrl = customHash(fullUrl);
//             const existingUrl = await Url.findOne({ shortUrl });

//             if (!existingUrl) {
//                 isUnique = true;
//             }
//         }

//         url = new Url({ fullUrl, shortUrl });
//         await url.save();

//         res.status(201).render('result', { fullUrl, shortUrl });
//     } catch (error) {
//         console.error("Error creating short URL:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

// async function redirectShortUrl(req, res) {
//     const { shortUrl } = req.params;

//     try {
//         const url = await Url.findOne({ shortUrl });

//         if (url) {
//             url.visits += 1;
//             await url.save();
//             return res.redirect(url.fullUrl);
//         }

//         res.status(404).json({ error: "Short URL not found" });
//     } catch (error) {
//         console.error("Error handling short URL redirect:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }

// export { createShortUrl, redirectShortUrl };


// function isValidUrl(string) {
//     try {
//         const b = new URL(string);
//         console.log(b);
//         return true;
//     } catch (error) {
//         return false;
//     }
// }



import { Url } from '../models/urlmodels.mjs';
import { publishToQueue } from '../rabbitmq/publisher.mjs';

async function createShortUrl(req, res) {
    const { fullUrl } = req.body;

    if (!isValidUrl(fullUrl)) {
        return res.status(400).render('index', { message: "Full URL is required" });
    }

    try {
        let url = await Url.findOne({ fullUrl });
        if (url) {
            return res.status(200).render('result', { baseUrl: req.protocol + '://' + req.get('host'), fullUrl: url.fullUrl, shortUrl: url.shortUrl , "message": null });
        }

        await publishToQueue('urlQueue', fullUrl);
        try {
            const url = await Url.findOne({ fullUrl });

            if (url) {
                res.status(200).render('result', { fullUrl, shortUrl });
            }
            if(!url)
            console.log("URL not found in the db--contoller");
            res.status(200).render('result', { baseUrl: req.protocol + '://' + req.get('host'), fullUrl: fullUrl, "message": "URL is being processed" });
        } catch (error) {
            console.error("Error checking URL status:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
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

        res.status(404).json({ error: "jOEL URL not found" });
    } catch (error) {
        console.error("Error handling short URL redirect:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { createShortUrl, redirectShortUrl };

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}
