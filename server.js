const express = require("express");
// const chatRoute = require("./routes/chatRoutes");
const connectDB = require("./config/db");
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoutes");
const fileUpload = require("express-fileupload");
const expressValidator = require("express-validator");
const cors = require("cors");
const { notFound } = require("./middleware/errorMiddleware");
const uploadRoute = require("./routes/uploadRoutes");
const bodyParser = require("body-parser");
const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(expressValidator());
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
// readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));
app.use(fileUpload());
app.use("/api/user", userRoute);
app.use("/api", uploadRoute);
// app.use("/api/chat", chatRoute)
app.use(notFound);
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`gg ${PORT}`));
