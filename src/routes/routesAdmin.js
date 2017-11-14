let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;
const User = require("../models/User");

const mongoUrl = "mongodb://mongocaio:m0ng0ldb*@clusteruno-shard-00-01-7t23t.mongodb.net:27017/maquinas?ssl=true&replicaSet=ClusterUno-shard-0&authSource=admin";

router.post('/cadastrar', (req, res) => {
  try {
    let body = req.body;

    console.log(body);

    if (body.hasOwnProperty("_id") && body.hasOwnProperty("nome")) {

      const user = new User(1);

			user.insert(body, function(status, result){
        
        if( status === 200 ){
          res.status(status).json({ ok: true, result });
        }else if( status === 500 ){
          res.status(status).json({ ok: false, error: result });
        }else{
          res.status(status).json({ ok: false, result });
        }

      });

    } else {
      res.status(400).json({ ok: false, error: '{_id, nome}' });
    }
  } catch (exception) {
    console.log(exception);
    throw exception;
  }
});

router.post('/login', (req, res) => {
  const body = req.body;
  
  console.log(body)
  try{
    if( body.hasOwnProperty("email") && body.hasOwnProperty("password") ){

      const user = new User(1);
      
      user.auth(body.email, body.password, function(status, result){
  
        if( status === 200 ){
          res.status(status).json({ ok: true, result });
        }else if( status === 500 ){
          res.status(status).json({ ok: false, error: result });
        }else{
          res.status(status).json({ ok: false, result });
        }
  
      });
      
    }else{
      res.status(400).json({ ok: false, error: "{email, password}" });
    }

  }catch(exception){
    if(exception) {throw exception; console.log(exception);}
  }
});

router.get('/encontrar', (req, res) => {
  try {
    let queryObj = req.query;

    console.log('query', queryObj)

    if (queryObj.hasOwnProperty("_id")) {

      const user = new User(1);
      
      user.findById(queryObj._id, function(status, result){
  
        if( status === 200 ){
          res.status(status).json({ ok: true, result });
        }else if( status === 500 ){
          res.status(status).json({ ok: false, error: result });
        }else{
          res.status(status).json({ ok: false, result });
        }
  
      });

    } else {
      res.status(400).json({ ok: false, error: "{_id}" });
    }
  } catch (exception) {
    throw exception;
  }
});

router.get('/listar', (req, res) => {
  try {
    mongoClient.connect(mongoUrl, (dbErr, db) => {

      db.collection('admin').find().toArray((findErr, results) => {
        if (findErr) throw findErr;

        res.status(200).json({ response: 'ok', data: results });
      });
      db.close();
    });

  } catch (exception) {
    throw exception;
  }
});

router.put('/atualizar', (req, res) => {
  try {
    let putBody = req.body;

    if( putBody.hasOwnProperty("_id") ){

      const user = new User(1);
      
      user.update(putBody._id, putBody, function(status, result){
  
        if( status === 200 ){
          res.status(status).json({ ok: true, result });
        }else if( status === 500 ){
          res.status(status).json({ ok: false, error: result });
        }else{
          res.status(status).json({ ok: false, result });
        }
  
      });  

    }else{
      res.status(400).json({ ok: false, error: "{_id}" });
    }

  } catch (exception) {
    throw exception;
  }
});

module.exports = router;