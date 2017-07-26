let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;

const mongoUrl = "mongodb://mongocaio:m0ng0ldb*@clusteruno-shard-00-01-7t23t.mongodb.net:27017/maquinas?ssl=true&replicaSet=ClusterUno-shard-0&authSource=admin";

router.post('/cadastrar', (req, res) => {
	try {
		let body = req.body;

		console.log(body);

		if (body.hasOwnProperty("_id") && body.hasOwnProperty("nome") && body.hasOwnProperty("cliente")) {
			mongoClient.connect(mongoUrl, (dbErr, db) => {
				//Faz insert apenas se existe os campos _id nome e cliente
				body._id ? db.collection('operadores').insert(body, null, (insertErr, result) => {
					if( insertErr ){
						res.status(500).send(insertErr);
						db.close();
					}else if( result.result.ok === 1 ){

						db.collection('clientes').findOneAndUpdate({ _id: body.cliente },
							{
								$push: { operadores: body }
							},
							null,
							(updateErr, updateResult) => {

								if( updateErr ){
									res.status(500).json({ response: 'erro', error: updateErr });
									console.log('...', updateErr)
									db.close();
								}else if( updateResult && updateResult.ok === 1 ){
									res.status(200).json({ insert: { response: 'Adicionado com sucesso', data: result.ops[0] }, update: { response: 'ok', data: updateResult } });
									db.close();
								}else{
									res.status(500).json({ response: 'não atualizado', data: updateResult });
									db.close();
								}
							}
							);//Fim do update
					}
					  
				}) : res.status(400).send('Não inseriu _id!');

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

		if (queryObj.hasOwnProperty("cliente")) {
			mongoClient.connect(mongoUrl, (dbErr, db) => {

				db.collection('operadores').findOne(queryObj, (findErr, result) => {

					if (findErr) throw findErr;

					if (result === null) {
						res.status(500).json({ response: 'não encontrado', data: result });
					} else {
						res.status(200).json({result: result, response: 'ok'});
					}
					db.close();
				});

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

			db.collection('operadores').find().toArray((findErr, results) => {
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

		mongoClient.connect(mongoUrl, (dbErr, db) => {

			db.collection('operadores').findOneAndUpdate({ _id: putBody._id },
				{ $set: putBody }, null,
				(updateErr, result) => {
					console.log('r:', result);
					console.log('err:', updateErr);
					if (!updateErr && result.lastErrorObject.updatedExisting === true) {
						res.status(200).json({ response: "atualizado", data: { antigo: result.value, novo: putBody } });
					} else {
						res.status(400).json({ response: "erro", data: updateErr });
					}
				});
			db.close();
		});

	} catch (exception) {
		throw exception;
	}
});

module.exports = router;