import dotenv from 'dotenv';
import express from 'express';
import cookieParser from "cookie-parser";
import logger from './utils/logger.js';
import conn from './db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

conn();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Loglama
app.use((req, res, next) => {
    logger.info(`${req.method} - ${req.url} - ${req.ip}`);
    next();
});


app.use("/auth", authRoute);
app.use("/user", userRoute);



app.listen(process.env.PORT, () => {
    console.log(`Server ${process.env.PORT}`);
});