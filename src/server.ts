import app from "./app";
import * as dotenv from 'dotenv';
import connectDB from "./db/connectDB";
dotenv.config({
    path:"./.env"
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});