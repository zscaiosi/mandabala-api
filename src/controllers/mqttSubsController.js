const mqtt = require('mqtt');
const mongodbClient = require('mongodb').MongoClient;
const mongoUri = require("../config/hosts.json").mongoDb;
//const fs = require('fs');
const moment = require('moment');
const Maquina = require('../models/Maquina');

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
		if( t.indexOf("maquina/bichinho/atividades/") !== -1 && jsonMsg && jsonMsg.hasOwnProperty("_id") ){
			try {
				mongodbClient.connect( mongoUri, (dbErr, db) => {
					//Callback do connect
					if( dbErr ){
						return
					}else{
						db.collection('maquinas').findOneAndUpdate({ _id: String(jsonMsg._id) },
							{
								$inc: { tempo_total_ligada: Number(jsonMsg.tempo_ligada) },
								$push: { periodos_ligada: Number(jsonMsg.tempo_ligada) },
								$set: { ligada: false }
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

		}else if( t.indexOf("maquina/bichinho/ligada/") > -1 ){
			try{

				if( jsonMsg.hasOwnProperty("isOn") ){

					if( Number(jsonMsg.isOn) == 1 ){

						const m = new Maquina();
						m.isOn({ _id: jsonMsg._id, onDate: moment.utc().subtract(3, 'hours').format() }, function(result){
							console.log("LIGOU no BD", result);
						});

					}else{
						return;
					}

				}else{

					console.log("{isOn?}")

				}

			}catch(exception){
				console.log(exception);
			}
		}
	});
}

module.exports = MqttSubsController;