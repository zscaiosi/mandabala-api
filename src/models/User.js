const mongoDBClient = require('mongodb').MongoClient;
const mongoUrl = require('../config/hosts.json');

function User(){

}

User.prototype.auth = function(username, password, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
        db.collection("clientes").findOne({ username, password }, (findErr, result) => {

          if( findErr ){console.log(findErr); next(findErr, null);}
    
          if( result ){
            next(null, result);
          }
        }); 
    
      });

}

User.prototype.findById = function(id, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
        db.collection("clientes").findOne({ _id: id }, (findErr, result) => {

          if( findErr ){console.log(findErr); next(findErr, null);}
    
          if( result ){
            next(null, result);
          }
        }); 
    
      });

}

module.exports = User;