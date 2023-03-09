const mongoose = require('mongoose')
require('dotenv').config({ path: ".env" })

const URI = process.env.BBDD;

mongoose.set("strictQuery", true);
mongoose.set('debug', true);

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("😍 The database is running")
    console.log("-----------------------------")
  })
  .catch((err) => console.error("Connection error in DB -", err));