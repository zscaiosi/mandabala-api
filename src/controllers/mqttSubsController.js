const mqtt = require('mqtt');
const mongodbClient = require('mongodb').MongoClient;
const mongoUri = require("../config/hosts.json").mongoDb;
const fs = require('fs');

function MqttSubsController(url, topic) {
	let client = mqtt.connect("mqtt://" + url);

	client.on("connect", () => {
		client.subscribe(topic);
	});

	client.on("message", (t, msg) => {
		console.log('topic said--->', msg.toString(), typeof t);
		
		if( msg.toString().indexOf("Olá") !== -1 ){
			return
		}

		let jsonMsg = JSON.parse(msg.toString());
		//Precisa ter vindo do tópico "maquina/bichinho/atividade/report" de atividades e ter chave _id na mensagem
		if( t.indexOf("maquina/bichinho/atividade/") !== -1 && jsonMsg.hasOwnProperty("_id") ){
			try {
				console.log("Recebeu...", jsonMsg);
				mongodbClient.connect( mongoUri, (dbErr, db) => {
					//Callback do connect
					if( dbErr ){
						return
					}else{
						db.collection('maquinas').findOneAndUpdate({ _id: jsonMsg._id },
							{
								$inc: { tempo_total_ligada: Number(jsonMsg.tempo_ligada) }
							},
							(findErr, result) => {
								//Callback do update
								if( findErr ){
									db.close();
									console.log("findErr", findErr);
									return;
								}else{
									console.log("Result: ", result);
									db.close();
								}

						});
					}

				});

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