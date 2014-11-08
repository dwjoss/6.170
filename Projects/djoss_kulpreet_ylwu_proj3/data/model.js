/*
	Author: Kulpreet
*/

var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); // Used for hashing passwords

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
	
var userSchema = new Schema({
    name    	  : String,
    email     	  : String,
	password      : String,
	room          : {type: ObjectId, ref: 'Room'}
}); 

userSchema.methods.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
}

var roomSchema = new Schema({
	listeners : [],
    queue     : []
}); 

var Room = mongoose.model('Room', roomSchema);
var User = mongoose.model('User', userSchema);

exports.Room = Room;
exports.User = User;
