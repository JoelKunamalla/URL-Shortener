import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import homeRoutes from './routes/homeroutes.mjs';
import urlRoutes from './routes/urlroutes.mjs';

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('dev'));

mongoose.connect(process.env.mongoDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB successfully connected!");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

app.use('/', homeRoutes);
app.use('/', urlRoutes);

export default app;
