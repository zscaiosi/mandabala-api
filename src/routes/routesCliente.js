let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;
const User = require('../models/User');
const url = require('../config/hosts.json');

const mongoUrl = url.mongoDb;

router.post('/cadastrar', (req, res) => {
	try {
		let body = req.body;

		console.log(body);

		if (body.hasOwnProperty("_id") && body.hasOwnProperty("razao_social") && body.hasOwnProperty("cnpj")) {
			const user = new User(2);

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
			res.status(400).json({ response: 'Faltam informações sobre o cliente!' });
		}
	} catch (exception) {
		console.log(exception);
		throw exception;
	}
});

router.get('/encontrar', (req, res) => {
	try {
		let queryObj = req.query;

		const user = new User(2);

		user.findById(queryObj._id, function(status, result){

			if( status === 200 ){
				res.status(status).json({ ok: true, result });
			}else if( status === 500 ){
				res.status(status).json({ ok: false, error: result });
			}else{
				res.status(status).json({ ok: false, result });
			}

		});

	} catch (exception) {
		throw exception;
	}
});

router.get('/listar', (req, res) => {
	try {
		mongoClient.connect(mongoUrl, (dbErr, db) => {

			db.collection('clientes').find().toArray((findErr, findResults) => {
				
				console.log(findResults);

				if( findErr ){
					res.status(500).response({response: 'erro', error: findErr});
					db.close();
				}else if( findResults.length > 0 ){
					res.status(200).json({ response: 'ok', results: findResults});
					db.close();
				}else{
					res.status(200).json({ ok: false, results: null });
					db.close();
				}
			});
			
		});

	} catch (exception) {
		throw exception;
	}
});

router.put('/atualizar', (req, res) => {
  try {
    let putBody = req.body;

    if( putBody.hasOwnProperty("_id") ){

      const user = new User(2);
      
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
//Login com passport
router.post('/login', (req, res) => {
	const body = req.body;

	if( body.hasOwnProperty("email") && body.hasOwnProperty("password") ){

		const user = new User(2);
		
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

});

router.delete('/remover/:_id', (req,res) => {
	const body = req.params;
	console.log("REMOVE", body);
	
	if( body.hasOwnProperty("_id") ){
		const cliente = new User();

		cliente.delete(body, function(status, json){
			res.status(status).json(json);
		});

	}else{
		res.status(400).json({ ok: false, erro: '{_id}' })
	}

});

module.exports = router;