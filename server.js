const express = require("express");
const mongoose = require("mongoose");
const shortId = require("shortid");
const shortUrl = require("./models");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const app = express();


mongoose.connect(process.env.mongoDbUri, {
	useNewUrlParser: true, useUnifiedTopology: true,
	useFindAndModify: false, useCreateIndex: true,
});
mongoose.connection
	.once("open", () => console.log("MongoDB succesfully connected!"))
	.on("error", (error) => {
		console.log("Error in connecting MongoDB:", error);
	});


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));



app.get("/", async (req, res) => {
	const data = await shortUrl.find({});
	res.render("index", {
		urlsArray: data
	});
});

app.post("/postUrl", async (req, res) => {
	const shortenedUrl = shortId.generate(req.body.fullUrl);
	await shortUrl.create({
		fullUrl: req.body.fullUrl,
		shortUrl: shortenedUrl
	});
	res.redirect("/");
});

app.get("/:shortUrlParam", async (req, res) => {
	const shortenedUrl = await shortUrl.findOne({
		shortUrl: req.params.shortUrlParam
	});
	if (shortenedUrl == null) return res.sendStatus(404);
	shortenedUrl.visits++;
	shortenedUrl.save();
	res.redirect(shortenedUrl.fullUrl);
});

app.listen(PORT, () => {
	console.log(`Server is listening at http://localhost:${PORT}`)
})