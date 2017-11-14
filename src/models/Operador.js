const mongoDBClient = require('mongodb').MongoClient;
const mongoUrl = require('../config/hosts.json');

function Operador(){
  
}

Operador.prototype.auth = function(email, password, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
    db.collection( "operadores" ).findOne({ email, password }, (findErr, result) => {
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

Operador.prototype.findByCliente = function(clienteId, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {

    db.collection( "operadores" ).find({ cliente: clienteId }).toArray((findErr, result) => {
      
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

Operador.prototype.insert = function(json, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
    db.collection( "operadores" ).insert(json, null, (insertErr, inserted) => {

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

Operador.prototype.update = function(_id, json, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
    db.collection( "operadores" ).findOneAndUpdate({ _id }, json, null, (updateError, updated) => {

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

Operador.prototype.login = function(payload, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
console.log("paylaod", payload);
    db.collection("operadores").findOne(payload, (findErr, found) => {

      if( findErr ){
        next(500, {error: findErr});
      }else if( found ){
        next(200, {ok: true, result: found});
      }else{
        next(400, found);
      }
      db.close();
    });

  });

}

module.exports = Operador;