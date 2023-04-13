//dot env
require("dotenv").config();
//error handler that handles thrown error
require("express-async-errors");

//express
const express = require("express");
const app = express();

//the rest of the package
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

//database
const connectDB = require("./db/connect");

//middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//tells us the route we head to
app.use(morgan("tiny"));
//this middle ware help us access json data in our req.body
app.use(express.json());
//parse the cookie from the req.cookies
//if cookies is signed it will be available in req.signedCookies
app.use(cookieParser(process.env.JWT_SECRET));

//file upload
app.use(express.static("./public/uploads"));
app.use(fileUpload());

//routes
app.get("/api", (req, res) => {
  res.send("hello word");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log("Server has started on " + port));
  } catch (error) {
    console.log(error);
  }
};

start();
