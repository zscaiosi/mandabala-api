let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;
const Operador = require("../models/Operador");

const mongoUrl = "mongodb://mongocaio:m0ng0ldb*@clusteruno-shard-00-01-7t23t.mongodb.net:27017/maquinas?ssl=true&replicaSet=ClusterUno-shard-0&authSource=admin";

router.post('/cadastrar', (req, res) => {
	try {
		let body = req.body;

		console.log(body);

		if (body.hasOwnProperty("_id") && body.hasOwnProperty("nome_quiosque") && body.hasOwnProperty("cliente")) {

			const operator = new Operador();

			operator.insert(body, function(status, result){
				
				if( status === 200 ){
					res.status(status).json({ ok: true, result });
				}else if( status === 500 ){
					res.status(status).json({ ok: false, error: result });
				}else{
					res.status(status).json({ ok: false, result });
				}

			});

		} else {
			res.status(400).json({ response: 'Faltam informações sobre o operador!' });
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

		if (queryObj.hasOwnProperty("clienteId")) {

			const operator = new Operador();

			operator.findByCliente(queryObj.clienteId, function(status, results){

				if( status === 200 ){
					res.status(status).json({ ok: true, results });
				}else if( status === 500 ){
					res.status(status).json({ ok: false, error: result });
				}else{
					res.status(status).json({ ok: false, results });
				}

			});

		} else {
			res.status(400).json({ response: 'Busca possível apenas por cliente.' });
		}
	} catch (exception) {
		throw exception;
	}
});

router.get('/listar', (req, res) => {
	try {
		const queryObj = req.query;

		mongoClient.connect(mongoUrl, (dbErr, db) => {

			db.collection('operadores').find({cliente: queryObj.clienteId}).toArray((findErr, results) => {
				if (findErr) throw findErr;

				res.status(200).json({ response: 'ok', results: results });
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

		const operator = new Operador();

		operator.update(putBody._id, putBody, function(status, result){

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

module.exports = router;