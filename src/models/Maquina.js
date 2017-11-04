const mongoDBClient = require('mongodb').MongoClient;
const mongoUrl = require('../config/hosts.json');
let moment = require("moment");

function Maquina(){
  this._lastTime = moment(moment("2017-10-14").utc().format()).utc();
}

Maquina.prototype.list = function(clienteId, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
    if( clienteId !== null ){
      db.collection( "maquinas" ).find({ cliente: clienteId }).toArray((findErr, results) => {
        
        if( findErr ){
          console.log(findErr);
          next(500, findErr);
        }else if( results ){
          next(200, results);
        }else{
          next(500, null);
        }
  
        db.close();
      
      });      
    }else{

      db.collection( "maquinas" ).find().toArray((findErr, results) => {
        console.log("??", findErr, results)
        if( findErr ){
          console.log(findErr);
          next(500, findErr);
        }else if( results ){
          next(200, results);
        }else{
          next(500, null);
        }
  
        db.close();
      }); 

    }
   

  });

}

Maquina.prototype.findById = function(_id, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {

    db.collection( "maquinas" ).findOne({ _id }, (findErr, result) => {

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

Maquina.prototype.insert = function(json, next){
  console.log("Maquina insert", json);
  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    
    db.collection("maquinas").insert(json, null, (insertErr, inserted) => {

      if( insertErr ){
        console.log(insertErr);
        next(500, insertErr);
      }else if( inserted ){
        this.addToClient(json.cliente, function(status){
          next(status, inserted);
        });
      }else{
        next(500, null);
      }

    });
    db.close();
  });

}

Maquina.prototype.addToClient = function(clienteId, next){
  
  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {

    db.collection("clientes").findOneAndUpdate({ _id: clienteId },
      { $inc: { nr_maquinas: Number(1) } },
      (updateErr, result) => {
        if( updateErr ){
          next(500);
        }else{
          next(200)
        }
        db.close();
      });

  });

}

Maquina.prototype.calculateTime = function(json, next){

  const now = moment.utc();
  this._lastTime = this._lastTime === now ? now : this._lastTime;

  console.log("now= ", now, this._lastTime, now > this._lastTime);

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {

    db.collection("maquinas").findOne({ _id: String(json._id) }, (findErr, result) => {

      if(findErr){
        console.log(findErr);
      }else if( result ){

        const lastAction = moment(moment(result.ultima_acao).utc().format()).utc();
        console.log("LAST ACTION: ", lastAction);

      }
      db.close();
    });

  });
}

Maquina.prototype.delete = function(json, next){
  
  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {

    db.collection("maquinas").remove({ _id: json._id }, (removeErr, removed) => {

      if(removeErr){
        next(500, {ok: false});
      }else if( removed ){
        next(200, removed);
      }
      db.close();
    });

  });
}

Maquina.prototype.isOn = function(json, next){

  mongoDBClient.connect(mongoUrl.mongoDb, (dbErr, db) => {
    db.collection("maquinas").findOneAndUpdate({ _id: json._id },
    {
      $set: { ligada: true },
      $push: { ultimas_vezes_ligada: json.onDate }
    },
    null,
    (updateErr, updated) => {

      if(updateErr){
        console.log(updateErr);
      }else{
        next(updated);
      }

    });
  })

}

module.exports = Maquina;