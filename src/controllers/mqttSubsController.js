const mqtt = require('mqtt');
const mongodbClient = require('mongodb').MongoClient;
const mongoUri = require("../config/hosts.json").mongoDb;


function MqttSubsController(url, topic) {
	let client = mqtt.connect("mqtt://" + url);

	client.on("connect", () => {
		client.subscribe(topic);
	});

	client.on("message", (t, msg) => {
		console.log('topic said--->', msg.toString(), typeof t);
		//console.log(JSON.parse(msg.toString()));

		if( t.indexOf("maquina/bichinho/atividade/report/m") !== -1 ){
			try {
				if (JSON.parse(msg).hasOwnProperty("_id")) {
					//Conecta ao cluster MongoDB
					mongodbClient.connect(mongoUri, (err, db) => {
						if (err) throw err;
						//Faz uma query simples
						db.collection('maquinas').find({ _id: JSON.parse(msg.toString())._id }).toArray((error, results) => {
							if (error) throw error;
							//Trata o array de resultados
							results.map((result, index) => {
								console.log('->result:', result);
							});
							db.close();
						});

						mongodbClient.connect(mongoUri, (err, db) => {
							if (err) throw err;
							msg = JSON.parse(msg.toString());
							//Faz update do estado incrementando o tempo total que já passou ligada
							let promise = db.collection('maquinas').updateOne({ "_id": msg._id }, {
								//Operators
								$inc: { "tempo_total_ligada": msg.tempo_total_ligada },
								$push: { "atividades": msg.atividades }
							},
							null,
							(updateErr, updateResult) => {
								if( updateErr ){
									console.log(updateErr);
								}else if( updateResult.ok === 1 ){
									console.log('Documentos modificados: ', updateResult.result.nModified, 'data-hora', new Date());
								}else{
									console.log('Documentos NÃO modificados: ', updateResult, 'data-hora', new Date());
								}
							});
							//Se Promise foi 'resolvida'
							promise.then((resolved) => {
								console.log('Documentos modificados: ', resolved.result.nModified, 'data-hora', new Date());
							})

							db.close();
						});
					});
				} else {
					console.log("não é JSON", typeof msg._id);
				}
			} catch (error) {
				throw error;
			}			
		}else if( t.indexOf("teste/maquinas/atividades") !== -1 ){
			console.log('TESTANDO MQTT: ', msg.toString());
		}else{
			console.log('Tópico desconhecido: ', t, msg.toString());
		}
	});
}

module.exports = MqttSubsController;