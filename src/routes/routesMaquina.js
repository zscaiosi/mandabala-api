let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;
const mongoUri = require("../config/hosts.json").mongoDb;
const Maquina = require("../models/Maquina");

router.post('/cadastrar', (req, res) => {
	try {
		let body = req.body;

		console.log("Cadastrar Maquina:", body);

		if (body._id && body.cliente) {

			const machine = new Maquina();

			machine.insert(body, function(status, result){

				if( status === 200 ){
					res.status(status).json({ ok: true, result });
				}else if( status === 500 ){
					res.status(status).json({ ok: false, error: result });
				}else{
					res.status(status).json({ ok: false, result });
				}

			});

		} else {
			res.status(400).json({ response: '_id e cliente' });
		}
	} catch (exception) {
		throw exception;
	}
});

router.get('/listar', (req, res) => {
	try {
		const queryObj = req.query;

		const machine = new Maquina();
		
		machine.list(null, function(status, results){

			if( status === 200 ){
				res.status(status).json({ ok: true, results });
			}else if( status === 500 ){
				res.status(status).json({ ok: false, error: results });
			}else{
				res.status(status).json({ ok: false, results });
			}					

		});	


	} catch (exception) {
		throw exception;
	}
});

router.get('/listar/minhas', (req, res) => {
	try {
		const queryObj = req.query;

		if( queryObj.cliente ){
			const machine = new Maquina();
			
			machine.list(queryObj.cliente, function(status, results){

				if( status === 200 ){
					res.status(status).json({ ok: true, results });
				}else if( status === 500 ){
					res.status(status).json({ ok: false, error: results });
				}else{
					res.status(status).json({ ok: false, results });
				}					

			});	
		}

	} catch (exception) {
		throw exception;
	}
});

router.get('/encontrar', (req, res) => {
	try {
		let queryObj = req.query;

		console.log('query', queryObj)

		if ( queryObj.hasOwnProperty("_id") ) {
			const maquina = new Maquina();

			maquina.findById(queryObj._id, (status, json) => {
				res.status(status).json(json);
			});

		} else {
			res.status(400).json({ response: 'Busca possível apenas por _id.' });
		}
	} catch (exception) {
		throw exception;
	}
});

router.delete('/remover/:_id', (req, res) => {
	const body = req.params;
	console.log("REMOVE", body);

	if( body.hasOwnProperty("_id") ){
		const maquina = new Maquina();

		maquina.delete(body, function(status, json){
			res.status(status).json(json);
		});

	}else{
		res.status(400).json({ ok: false, erro: '{_id}' });
	}
})

module.exports = router;