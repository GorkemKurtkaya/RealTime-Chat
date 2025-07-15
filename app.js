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
import "./cron/autoMessageCron.js";
import rabbitMQ from './utils/rabbitmq.js';
import { sendAutoMessage } from './services/autoMessageService.js';
import { authLimiter, messageLimiter, conversationLimiter, userLimiter } from './middleware/rate-limitmiddleware.js';
import { resetAllOnlineUsers } from './services/userService.js';





dotenv.config();



const app = express();
const server = http.createServer(app);

rabbitMQ.connect();
conn();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Loglama
app.use((req, res, next) => {
    logger.info(`${req.method} - ${req.url} - ${req.ip}`);
    next();
});


app.use("/auth", authLimiter, authRoute);
app.use("/user", userLimiter, userRoute);
app.use("/conservations", conversationLimiter, conservationRoute);
app.use("/messages", messageLimiter, messageRoute);


socketHandler(server);

rabbitMQ.consume("auto_messages", sendAutoMessage);

await resetAllOnlineUsers();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Server ${PORT} Portunda Ayakta`);
});