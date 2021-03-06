var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST


router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))


router.route('/')
    //GET all messages
    .get(function(req, res, next) {
        //retrieve all messages from Monogo
        mongoose.model('Message').find({}, function (err, messages) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/messages folder. We are also setting "messages" to be an accessible variable in our jade view
                    html: function(){
                        res.json(messages);
                    },
                    //JSON response will show all messages in JSON format
                    json: function(){
                        res.json(messages);
                    }
                });
              }     
        });
    })
    //POST a new message
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var email = req.body.email;
        var text = req.body.text;
        //call the create function for our database
        mongoose.model('Message').create({
            email : email,
            text : text
        }, function (err, message) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //message has been created
                  console.log('POST creating new message: ' + message);
                  res.format({
                      //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("messages");
                        // And forward to success page
                        res.redirect("/messages");
                    },
                    //JSON response will show the newly created message
                    json: function(){
                        res.json(message);
                    }
                });
              }
        })
    });



// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Message').findById(id, function (err, message) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(message);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Message').findById(req.id, function (err, message) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + message._id);
        var messagedob = message.dob.toISOString();
        messagedob = messagedob.substring(0, messagedob.indexOf('T'))
        res.format({
          html: function(){
              res.render('messages/show', {
                "messagedob" : messagedob,
                "message" : message
              });
          },
          json: function(){
              res.json(message);
          }
        });
      }
    });
  });

router.route('/:id/edit')
	//GET the individual message by Mongo ID
	.get(function(req, res) {
	    //search for the message within Mongo
	    mongoose.model('Message').findById(req.id, function (err, message) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the message
	            console.log('GET Retrieving ID: ' + message._id);
              var messagedob = message.dob.toISOString();
              messagedob = messagedob.substring(0, messagedob.indexOf('T'))
	            res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
	                       res.render('messages/edit', {
	                          title: 'message' + message._id,
                            "messagedob" : messagedob,
	                          "message" : message
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(message);
	                 }
	            });
	        }
	    });
	})
	//PUT to update a message by ID
	.put(function(req, res) {
	    // Get our REST or form values. These rely on the "name" attributes
	    var name = req.body.name;
	    var badge = req.body.badge;
	    var dob = req.body.dob;
	    var company = req.body.company;
	    var isloved = req.body.isloved;

	    //find the document by ID
	    mongoose.model('Message').findById(req.id, function (err, message) {
	        //update it
	        message.update({
	            name : name,
	            badge : badge,
	            dob : dob,
	            isloved : isloved
	        }, function (err, messageID) {
	          if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          } 
	          else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                  res.format({
	                      html: function(){
	                           res.redirect("/messages/" + message._id);
	                     },
	                     //JSON responds showing the updated values
	                    json: function(){
	                           res.json(message);
	                     }
	                  });
	           }
	        })
	    });
	})
	//DELETE a message by ID
	.delete(function (req, res){
	    //find blob by ID
	    mongoose.model('Message').findById(req.id, function (err, message) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            message.remove(function (err, message) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + message._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/messages");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : message
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});

module.exports = router;