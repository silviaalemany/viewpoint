var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var suggestionSchema = new Schema({
	id: {type: String, required: true, unique: true},
    userID: {type: String, required: true, unique: false},
    upvotes: Number,
    downvotes: Number,
    // origPhoto,
    // maskPhoto,
    // finalPhoto,
    // caption is input to DALL-E
    caption: String,
    // desc is user description (supplemental)
    desc: String,
    lat: Number,
    long: Number,
    resolved: Boolean
    });

// export personSchema as a class called Person
module.exports = mongoose.model('suggestion', suggestionSchema);

