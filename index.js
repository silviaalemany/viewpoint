// set up Express
var express = require('express');
var app = express();
const cors = require('cors')

app.use(cors())

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// import the suggestion class from suggestion.js
var suggestion = require('./suggestion.js');

/***************************************/
function makeid(length) {
	let result = '';
	// TODO: Update this to use UUID
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

app.use('/create', (req, res) => {
	//URI target: /create?userID=<userID>&upvotes=0&downvotes=0&caption=<caption>&desc=<description>&lat=<lat>&long=<long>
	// output: response message saying if operation is succesful
	var randID = makeid(20);  
    // construct the suggestion from the form data which is in the request body
	var post = new suggestion ({
		id: randID.toString(),  
		userID: req.query.userID,
		upvotes: req.query.upvotes,
		downvotes: req.query.upvotes,
		// caption is input to DALL-E
		caption: req.query.caption,
		img: req.query.imgFile,
		// desc is user description (supplemental)
		desc: req.query.desc,
		lat: req.query.lat,
		long: req.query.long,
		resolved: false
	});

	post.save( (err) => { 
		if (err) {
			res.type('html').status(200);
			res.write('uh oh: ' + err);
			console.log(err);
			res.end();
		}
		else {
			// display the "successfull created" message
			res.send({
				msg: 'successfully added ' + post.id + ' to the database', 
				id: post.id
			});
		}
	});
});


// endpoint for showing all the people
app.use('/list', (req, res) => {
	suggestion.find({}, (err, post) => {
		if (err) {
		    res.type('html').status(400);
		    console.log('uh oh' + err);
			res.json({'status': 'error'});
		    res.write(err);
		}
		else if (!post || post.length == 0){
			res.json({'status' : 'post not found'});
		} else {
			res.type('html').status(400);
			var allRecords = [];
			for(let i = 0; i < post.length; i++)
			{
				allRecords.push({
					'id' : post[i].id,
					'userID' : post[i].userID,
					'upvotes' : post[i].upvotes,
					'downvotes' : post[i].downvotes,
					'caption' : post[i].caption,
					'desc' : post[i].desc,
					'lat' : post[i].lat,
					'long' : post[i].long,
					'resolved' : post[i].resolved,
				});
			}
			res.type('html').status(200);
			res.json( {
				'entries': allRecords,
				'status' : 'successful'
			});
		}
	});
});

app.use('/get', (req, res) => {
	// URI target: /get?id=<post_id>
	// output: JSON representation of the object
	var filter = { 'id' : req.query.id } ;
	suggestion.find( filter, (err, post) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else if (!post || post.length == 0){
			res.json({'status' : 'post not found'});
		} else {
			res.json( {
				'id' : post[0].id,
				'userID' : post[0].userID,
				'upvotes' : post[0].upvotes,
				'downvotes' : post[0].downvotes,
				'caption' : post[0].caption,
				'desc' : post[0].desc,
				'lat' : post[0].lat,
				'long' : post[0].long,
				'img': post[0].imgFile,
				'resolved' : post[0].resolved,
				'status' : 'successful'
			});
		}
	});
});

//delete all entires. 
app.use('/delteAll', (req, res) => {
	suggestion.deleteMany({}, (err, post) => {
		if (err) {
			res.json( { 'status' : e } );
		} else {
			res.json({'status': 'successful'})
		}
	});
})

app.use('/delete', (req, res) => {
	// URI target: /delete?id=<post_id>
	// output: delete the post + message saying if succesful
	var filter = { 'id' : req.query.id } ;
	// delete the person to the database
	suggestion.findOneAndDelete( filter, (err, post) => {
		if (err) {
			res.json( { 'status' : e } );
		} else if (!post || post.length == 0) {
			res.json( { 'status' : 'not found' } );
		} else {
			// display the "successfull deleted" message
			res.json({'status' : 'success!'});
		}
	});

});

app.use('/upvote', (req, res) => { 
	// URI target: /upvote?id=<post_id>
    var id = req.query.id;
    if (!id) {
        res.json( { 'status' : 'missing data' }); 
    }
    var filter = { 'id' : id };
	suggestion.find( filter, (e, p) => {
        if (e) { 
            res.json( { 'status' : e } );
        } else if (!p || p.length == 0) {
    		res.json( { 'status' : 'not found' } );
    	} else {
			n = 1 + p[0].upvotes;
			var action = { '$set' : { 'upvotes' :  n } }; 
			suggestion.findOneAndUpdate( filter, action, (e, p) => {
				if (e) { 
					res.json( { 'status' : e } );
				} else if (!p || p.length == 0) {
					res.json( { 'status' : 'not found' } );
				} else {
					res.json( { 'status' : 'updated' } );
				}
			});
		}
	});
});

app.use('/downvote', (req, res) => { 
	// URI target: /downvote?id=<post_id>
    var id = req.query.id;
    if (!id) {
        res.json( { 'status' : 'missing data' }); 
    }
    var filter = { 'id' : id };
	suggestion.find( filter, (e, p) => {
        if (e) { 
            res.json( { 'status' : e } );
        } else if (!p || p.length == 0) {
    		res.json( { 'status' : 'not found' } );
    	} else {
			n = 1 + p[0].downvotes;
			var action = { '$set' : { 'downvotes' :  n } }; 
			suggestion.findOneAndUpdate( filter, action, (e, p) => {
				if (e) { 
					res.json( { 'status' : e } );
				} else if (!p || p.length == 0) {
					res.json( { 'status' : 'not found' } );
				} else {
					res.json( { 'status' : 'updated' } );
				}
			});
		}
	});
});

app.use('/resolve', (req, res) => { 
	// URI target: /resolve?id=<post_id>
    var id = req.query.id;
    if (!id) {
        res.json( { 'status' : 'missing data' }); 
    }
    var filter = { 'id' : id };
	var action = { '$set' : { 'resolved' :  true } }; 
	suggestion.findOneAndUpdate( filter, action, (e, p) => {
		if (e) { 
			res.json( { 'status' : e } );
		} else if (!p || p.length == 0) {
			res.json( { 'status' : 'not found' } );
		} else {
			res.json( { 'status' : 'updated' } );
		}
	});
});

/*************************************************/

app.use('/public', express.static('public'));

app.listen(8002,  () => {
	console.log('Listening on port 8002');
    });
