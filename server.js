var express = require("express");
var mongodb = require("mongodb");
var logger = require("morgan")
var bodyparser = require("body-parser");
var cors = require("cors");

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(logger('dev'));
app.use(cors());

var client = mongodb.MongoClient;
var machines;

var url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

client.connect(url, function (err, db) {
    if (err) {
        console.log("error connecting");
        process.exit(1);
        throw err;
    } else {
        console.log("connected to our database");

        machines = db.collection("test");
    }
})


// app.get("/", function (req, res) {
//     console.log("inserting a new event");
//     orders.insert({
//         "name": "art exhbit A",
//         "date": "tommorow"
//     }, function (err, doc) {

//     });

// })

// app.get("/pullOrders", function (req, res) {
//     orders.find().toArray(function (err, docs) {
//         if (err) {
//             throw err;
//             res.sendStatus(500);
//         } else {
//             var result = docs.map(function (data) {
//                 return data;
//             })
//             res.json(result);
//         }
//     })
// })

// app.get("/pullOrder", function (req, res) {
//     orders.find({
//         "name": "ronaldo"
//     })s.limit(1).next(function (err, docs) {
//         if (err) {
//             throw err;
//             res.sendStatus(500);
//         } else {

//             res.json(docs);
//         }
//     })
// })
app.post("/pushOrder", (req, res) => {
    orders.insert(req.body
        , function (err, doc) {

        });
    console.log(req.body);

})

app.post('/animalPic', upload.single('animal'), function (req, res, next) {
    // req.file is the `avatar` file 
    // req.body will hold the text fields, if there were any 
    console.log("file:", req.file);
})



var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Listening on port ' + port);
    console.log({
        "name": "art exhbit A",
        "date": "tommorow"
    })
});