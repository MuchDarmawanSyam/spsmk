import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import SequelizeStore from "connect-session-sequelize";

import UserRoute from "./routes/UserRoutes.js";
import SuratMasukRoute from "./routes/SuratMasukRoute.js";
import SuratKeluarRoute from "./routes/SuratKeluarRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import LampiranMasukRoute from "./routes/LampiranMasukRoute.js";
import LampiranKeluarRoute from "./routes/LampiranKeluarRoute.js";
//import LampiranKeluar from "./models/LampiranKeluarModel.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db:db
});

//(async() => {await LampiranKeluar.sync()})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialize: true,
    store: store,
    cookie: {
        secure: 'auto',   // http = false, https = true
    }
}));

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

app.use(UserRoute);
app.use(AuthRoute);
app.use(LampiranKeluarRoute);
app.use(LampiranMasukRoute);
app.use(SuratMasukRoute);
app.use(SuratKeluarRoute);

// store.sync(); // Matikan setelah membuat tabel session di database

app.listen(process.env.APP_PORT, () => {
    console.log("Server running ....");
});