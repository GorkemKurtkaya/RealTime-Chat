import dotenv from 'dotenv';
import express from 'express';
import cookieParser from "cookie-parser";
import logger from './utils/logger.js';
import conn from './db.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import conservationRoute from './routes/conservationRoute.js';
import messageRoute from './routes/messageRoute.js';
import socketHandler from './utils/socket.js';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

conn();

const app = express();
const server = http.createServer(app);

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
app.use("/conservations", conservationRoute);
app.use("/messages", messageRoute);


socketHandler(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Server ${PORT}`);
});