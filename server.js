// BASE SETUP
// ================================================================

// call the package we need
var express     = require('express');   // call express
var app         = express();            // define our app using express
var bodyParser  = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.port || 8081; // set our port

var mongoose    = require('mongoose');
mongoose.connect('mongodb://localhost:27017/simdb');
var connection  = mongoose.connection;
// var Bear        = require('./app/model/bear');
var BearSchema  = new mongoose.Schema({
    name: String
});
var Bear = mongoose.model('Bear', BearSchema);

// ROUTES FOR OUR API
// ================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working 
router.get('/', function(req, res) {
    res.json({ message: 'Hooray! Welcome to our api!'});
});

// on routes that end in /bears
router.route('/bears')
    // create a bear
    .post(function(req, res) {

        var bear = new Bear({name: req.body.name});      // create a new instance of the Bear model
        // bear.name = req.body.name;  // set the bear name 
        
        // save the bear and check for errors
        console.log('Prepare saving...' + connection);
        // bear.save(function(err) {
        //     if(err)
        //         res.send(err);
            
        //     res.json({ message: 'Bear created!' });    
        // });
        // Bear.findOne(function(err, res) { 
        //     if(err)
        //         res.send(err);      
        // });
    })

    // get all bears
    .get(function(req, res) {
        // Bear.find(function(err, bears) {
        //     if(err)
        //         res.send(err);
            
        //     res.json(bears);
        // });
        res.json({ message: 'Hooray! Welcome to our api!'});
    });

router.route('/bears/:bear_id')
    // get bear with id
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if(err)
                res.send(err);

            res.json(bear);
        })
    })

    // update bear with id
    .put(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if(err)
                res.send(err);
            
            bear.name = req.body.name; // update bear info

            // save the bear
            bear.save(function(err) {
                if(err)
                    res.send(err);
                
                res.json({message: 'Bear updated!'});
            });    
        });
    })

    // delete bear with id
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if(err)
                res.send(err);
            
            res.json({message: 'Successfully deleted'});
        });     
    });

// REGISTER OUR ROUTES
// ================================================================
app.use('/api', router);


// START THE SERVER
// ================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
