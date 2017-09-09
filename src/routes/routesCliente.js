let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;
const User = require('../models/User');
const passport = require("passport");

const mongoUrl = "mongodb://mongocaio:m0ng0ldb*@clusteruno-shard-00-01-7t23t.mongodb.net:27017/maquinas?ssl=true&replicaSet=ClusterUno-shard-0&authSource=admin";

router.post('/cadastrar', (req, res) => {
	try {
		let body = req.body;

		console.log(body);

		if (body.hasOwnProperty("_id") && body.hasOwnProperty("razao_social") && body.hasOwnProperty("cnpj")) {
			mongoClient.connect(mongoUrl, (dbErr, db) => {
				//Faz insert apenas se existe um campo _id
				body._id ? db.collection('clientes').insert(body, null, (insertErr, result) => {
					result.result.ok === 1 ? res.status(200).json({ response: 'Adicionado com sucesso', data: result.ops[0] }) : res.status(500).send(insertErr);
				}) : res.status(400).send('Não inseriu um _id!');

				db.close();

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

		console.log('query', queryObj)

		if (queryObj.hasOwnProperty("id")) {
			mongoClient.connect(mongoUrl, (dbErr, db) => {

				db.collection('clientes').findOne({ "_id": queryObj.id }, (findErr, result) => {

					if (findErr) throw findErr;

					res.status(200).json(result);
				});
				db.close();
			});
		} else {
			res.status(400).json({ response: 'Busca possível apenas por _id.' });
		}
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
					res.status(200).json({ response: 'ok', data: findResults});
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

		mongoClient.connect(mongoUrl, (dbErr, db) => {

			db.collection('clientes').findOneAndUpdate({ _id: putBody.cnpj },
				{ $set: putBody },
				null,
				(updateErr, updateResult) => {
					console.log('r:', updateResult);
					console.log('err:', updateErr);

					if (updateErr) {
						res.status(500).json({ response: 'erro', error: updateErr });
					} else if (updateResult.ok === 1 && updateResult.lastErrorObject.updateExisting == true) {
						res.status(200).json({ response: "atualizado", data: { antigo: updateResult.value, novo: putBody } });
					} else if (updateResult.value === null) {
						res.status(400).json({ response: "Não atualizado", data: updateResult });
					}
				});
			db.close();
		});

	} catch (exception) {
		throw exception;
	}
});
//Login com passport
router.post('/login', passport.authenticate('local', {session: false}), function(req, res){
	res.json({auth: true, user: req.user});
})

module.exports = router;