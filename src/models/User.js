const mongoDBClient = require('mongodb').MongoClient;
const mongoUrl = require('../config/hosts.json');

function User(userType){
  this._userType = userType;
}

User.prototype.auth = function(email, password, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
    db.collection( this._userType === 1 ? "admins" : "clientes" ).findOne({ email, password }, (findErr, result) => {
      console.log("FINDONE", result, findErr)
      if( findErr ){
        console.log(findErr);
        next(500, findErr);
      }else if( result ){
        next(200, result);
      }else{
        next(500, null);
      }

    }); 
    db.close();
  });

}

User.prototype.findById = function(_id, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {

    db.collection( this._userType === 1 ? "admins" : "clientes" ).findOne({ _id }, (findErr, result) => {

      if( findErr ){
        console.log(findErr);
        next(500, findErr);
      }else if( result ){
        next(200, result);
      }else{
        next(500, null);
      }

    }); 
    db.close();
  });

}

User.prototype.insert = function(json, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
    db.collection( this._userType === 1 ? "admins" : "clientes" ).insert(json, null, (insertErr, inserted) => {

      if( insertErr ){
        console.log(insertErr);
        next(500, insertErr);
      }else if( inserted ){
        next(200, inserted);
      }else{
        next(500, null);
      }

    });
    db.close();
  });

}

User.prototype.update = function(_id, json, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
    db.collection( this._userType === 1 ? "admins" : "clientes" ).findOneAndUpdate({ _id }, json, null, (updateError, updated) => {

      if( updateError ){
        console.log(updateError);
        next(500, updateError);
      }else if( updated ){
        next(200, updated);
      }else{
        next(500, null);
      }

    });
    db.close();
  });  

} 

module.exports = User;