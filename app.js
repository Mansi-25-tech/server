const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/connectDB");
const web = require("./routes/web");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

connectDB();

app.use(cors({
    origin: "https://cheery-sorbet-0eb6c3.netlify.app",
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true
}));

app.use("/api", web);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});