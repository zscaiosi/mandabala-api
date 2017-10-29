const mqtt = require('mqtt');
const mongodbClient = require('mongodb').MongoClient;
const mongoUri = require("../config/hosts.json").mongoDb;
//const fs = require('fs');
const moment = require('moment');

function MqttSubsController(url, topic) {
	let client = mqtt.connect("mqtt://" + url);

	client.on("connect", () => {
		client.subscribe(topic);
	});

	client.on("message", (t, msg) => {
		console.log( `TOPIC: ${t}, SAID: `, msg.toString() );
		
		//Certifica-se que existe uma mensage
		let jsonMsg = msg.byteLength > 0 ? JSON.parse(msg.toString()) : null;
		//Precisa ter vindo do tópico "maquina/bichinho/atividade/report" de atividades e ter chave _id na mensagem
		if( t.indexOf("maquina/bichinho/atividade/") !== -1 && jsonMsg && jsonMsg.hasOwnProperty("_id") ){
			try {
				mongodbClient.connect( mongoUri, (dbErr, db) => {
					//Callback do connect
					if( dbErr ){
						return
					}else{
						db.collection('maquinas').findOneAndUpdate({ _id: String(jsonMsg._id) },
							{
								$inc: { tempo_total_ligada: Number(jsonMsg.tempo_ligada) },
								$set: { ultima_acao:  moment.utc().format() }
							},
							null,
							(findErr, result) => {
								//Callback do update
								if( findErr ){
									db.close();
									console.log("findErr", findErr);
									return;
								}else{
									console.log("Maquinas findOneAndUpdate Result: ", result);
								}
								db.close();
						});
						// db.collection('maquinas').update
					}

				});

			} catch (error) {
				throw error;
			}			
		}else if( t.indexOf("teste/maquinas/teste") !== -1 ){
			console.log('TESTANDO MQTT: ', msg.toString());
		}else{
			console.log('Tópico desconhecido: ', t, msg.toString());
		}
	});
}

module.exports = MqttSubsController;