const path = require("path");
const mongoose = require("mongoose");
let express = require("express");
const { ObjectID } = require("bson");
let app = express();

const Parcel = require(path.join(__dirname, "models", "parcel.js"));

// setting up ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// for POST request handling 
app.use(express.urlencoded({ extended: false }));

//Configure MongoDB
// URL to mongoDB service
const url = "mongodb://localhost:27017/week6db";
mongoose.connect(url, (err)=>{});

app.use("/css", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "css")))
app.use("/js", express.static(path.join(__dirname, "node_modules", "bootstrap", "dist", "js" )))
app.use(express.static(path.join("public","img")));
app.use(express.static(path.join("public","css")));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/addparcel", (req,res) => {
    res.sendFile(path.join(__dirname, "views", "addparcel.html"));
});

app.post('/addparcel', (req, res) => {

    let newParcel = new Parcel({
        _id: new mongoose.Types.ObjectId(),
        sender: req.body.sender,
        address: req.body.address,
        weight: parseInt(req.body.weight),
        fragile: req.body.fragile === "true",

    });
    newParcel.save((err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/listparcelsall");

})

app.get('/listparcelsall', (req, res) => {
    Parcel.find({},(err, docs) => {
        if (err) {console.log(err)};
        res.render("listparcelsall.html", {db: docs});
    });
    
});

app.get('/listparcelssender', (req,res) => {
    res.render("listparcelssender.html", {db: {}});
});

app.post('/listparcelssender', (req,res) =>{
    // console.log(req.body)
    let query = { sender : req.body.sender };
    if (req.body.bigparcel === 'on'){
        query.weight = { $gt : 5 };
    }
    // console.log(query);
    Parcel.find(query, (err, docs) => {
        res.render("listparcelssender.html", {db: docs});
    });
});

app.get('/listparcelsweight', (req,res) => {
    res.render("listparcelsweight.html", {db: {}});
});

app.post('/listparcelsweight', (req,res) =>{
    Parcel.where('weight').gte(parseInt(req.body.min)).lte(parseInt(req.body.max)).exec( (err, docs) => {
        res.render("listparcelsweight.html", {db: docs});
    });
});

app.get('/delparcel', (req,res) => {
    res.sendFile(path.join(__dirname, "views", "delparcel.html"));
});

app.post('/delparcel', (req, res) => {
    if (req.body.delby === "id"){
        Parcel.deleteMany({ '_id': req.body.delsel.trim() }, function (err, doc) {
            if(err){console.log(err);};
        });
    } else if (req.body.delby === "sender"){
        Parcel.deleteMany({ 'sender': req.body.delsel }, function (err, doc) {
            if(err){console.log(err);};
        });
    } else if (req.body.delby === "dest"){
        Parcel.deleteMany({ 'address': req.body.delsel, weight : { $lt : 1} }, function (err, doc) {
            if(err){console.log(err);};
        });
    }

    res.redirect("/listparcelsall");

});

app.get('/updateparcel', (req,res) => {
    res.sendFile(path.join(__dirname, "views", "updateparcel.html"));
});

app.post('/updateparcel', (req, res) => {
    let findQuery = {_id : ObjectID(req.body.id.trim())};
    delete req.body.id;
    let updatedDoc = {
        ...req.body
    };
    updatedDoc.weight = parseInt(updatedDoc.weight);
    updatedDoc.fragile = updatedDoc.fragile === "true";
    let updateQuery = {$set : updatedDoc};
    Parcel.updateOne(findQuery, updateQuery, function (err, doc) {
        if (err){console.log(err)};
    });

    res.redirect("/listparcelsall");

});

// direct to 404 page if all route above are not found
app.get("*" ,(req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(8081);