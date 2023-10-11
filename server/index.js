import express from "express";
import cors from "cors";
//import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
//import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoutes.js";
dotenv.config();

const app = express();

// (async() => {
//     await db.sync();
// })(); 
// app.use(cors({
//     credentials: true,
//     origin: "http://localhost:3000"
// }));
app.use(express.json());
app.use(UserRoute);

app.listen(process.env.APP_PORT, () => {
    console.log("Server running ....");
});