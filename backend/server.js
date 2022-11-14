require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
port = process.env.PORT;

//express app
const app = express();

//middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/workouts", workoutRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for request
    app.listen(port, () => {
      console.log(`connected to db & listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
