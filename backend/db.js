
const mongoose = require("mongoose");

mongoose.connect(`mongodb://127.0.0.1:27017/inotebook`);
mongoose.connection.on("connected",() => console.log('Connection Is Succesful'))
mongoose.connection.on("error",(error) => console.log('Connection Failed With-'+error))

