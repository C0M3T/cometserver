// Set up
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
 
// Configuration
mongoose.connect('mongodb://Abelchalla:Abel323447@ds121543.mlab.com:21543/heroku_bqhtlgll');
 
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());
 
// Models
var Machine = mongoose.model('Machine', {
    machine_number: Number,
    type: String,
    reserved: [
        {
            from: String,
            to: String
        }
    ]
});
 
/*
 * Generate some test data, if no records exist already
 * MAKE SURE TO REMOVE THIS IN PROD ENVIRONMENT
*/
 
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
Machine.remove({}, function(res){
    console.log("removed records");
});
 
Machine.count({}, function(err, count){
    console.log("Machines: " + count);
 
    if(count === 0){
 
        var recordsToGenerate = 150;
 
        var machineTypes = [
            'standard',
            'villa',
            'penthouse',
            'studio'
        ];
 
        // For testing purposes, all machines will be booked out from:
        // 18th May 2017 to 25th May 2017, and
        // 29th Jan 2018 to 31 Jan 2018
 
        for(var i = 0; i < recordsToGenerate; i++){
            var newMachine = new Machine({
                machine_number: i,
                type: machineTypes[getRandomInt(0,3)],
                beds: getRandomInt(1, 6),
                max_occupancy: getRandomInt(1, 8),
                cost_per_night: getRandomInt(50, 500),
                reserved: [
                    {from: '1970-01-01', to: '1970-01-02'},
                    {from: '2017-04-18', to: '2017-04-23'},
                    {from: '2018-01-29', to: '2018-01-30'}
                ]
            });
 
            newMachine.save(function(err, doc){
                console.log("Created test document: " + doc._id);
            });
        } 
 
    }
});
 
// Routes
 
    app.post('/api/machines', function(req, res) {
 
        Machine.find({
            type: req.body.roomType,
            beds: req.body.beds,
            max_occupancy: {$gt: req.body.guests},
            cost_per_night: {$gte: req.body.priceRange.lower, $lte: req.body.priceRange.upper},
            reserved: { 
 
                //Check if any of the dates the room has been reserved for overlap with the requsted dates
                $not: {
                    $elemMatch: {from: {$lt: req.body.to.substring(0,10)}, to: {$gt: req.body.from.substring(0,10)}}
                }
 
            }
        }, function(err, rooms){
            if(err){
                res.send(err);
            } else {
                res.json(rooms);
            }
        });
 
    });
 
    app.post('/api/machines/reserve', function(req, res) {
 
        console.log(req.body._id);
 
        Machine.findByIdAndUpdate(req.body._id, {
            $push: {"reserved": {from: req.body.from, to: req.body.to}}
        }, {
            safe: true,
            new: true
        }, function(err, room){
            if(err){
                res.send(err);
            } else {
                res.json(room);
            }
        });
 
    });
 
// listen
app.listen(8080);
console.log("App listening on port 8080");