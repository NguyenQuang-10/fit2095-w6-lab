const express = require("express");
const mongoose = require("mongoose");

const senders = require("./routers/sender.js");
const parcels = require("./routers/parcel.js");

const app = express();

app.listen(8080);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/fit2095lab7', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');

});

app.get("/sender/:name", senders.getSender);
app.post("/sender", senders.createOne);
app.delete("/sender/", senders.deleteOne);
app.put("/sender", senders.updateOne);

app.get("/parcel", parcels.getByAddress)
app.post("/parcel", parcels.addParcel);
app.put("/parcel", parcels.updateAddress);