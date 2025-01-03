import app from "./app";
import * as dotenv from 'dotenv';
import connectDB from "./db/connectDB";
import { v2 as cloudinary } from "cloudinary";
import http from 'http';
import { initSocketServer } from "./socketServer";
dotenv.config({
    path: "./.env"
});
const server = http.createServer(app);

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

initSocketServer(server);

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});