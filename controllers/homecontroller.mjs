import { Url } from '../models/urlmodels.mjs';

const getHomePage = async (req, res) => {
    try {
        const urlsArray = await Url.find({});
        res.render("index", {
            urlsArray,
            baseUrl: req.protocol + '://' + req.get('host')
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { getHomePage };
