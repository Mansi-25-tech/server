const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/connectDB");
const web = require("./routes/web");

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");


// Database
connectDB();


// CORS (pehle)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


// Body Parser
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// Cookie
app.use(cookieParser());


// File Upload
app.use(fileUpload({
    useTempFiles:true
}));


// Routes
app.use("/api", web);



app.listen(process.env.PORT, () => {
    console.log(
        `Server is running on port ${process.env.PORT}`
    );
});