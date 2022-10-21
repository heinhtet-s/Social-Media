const express = require("express");
// const chatRoute = require("./routes/chatRoutes");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoutes");
const expressValidator = require('express-validator')
const cors = require('cors');
const { notFound } = require("./middleware/errorMiddleware");
const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(expressValidator())
app.use(cors({
    origin: '*',
}));
app.use("/api/user", userRoute)

// app.use("/api/chat", chatRoute)
app.use(notFound);
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`gg ${PORT}`));

