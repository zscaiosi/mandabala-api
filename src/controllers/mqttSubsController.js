const mqtt = require('mqtt');
const mongodbClient = require('mongodb').MongoClient;
const mongoUri = require("../config/hosts.json").mongoDb;


function MqttSubsController(url, topic) {
	let client = mqtt.connect("mqtt://" + url);

	client.on("connect", () => {
		client.subscribe(topic);
	});

	client.on("message", (t, msg) => {
		let topicArr = t.split("/");
		
		if( t.indexOf("maquina/bichinho/atividades/") !== -1 ){
			console.log("msg-->", JSON.parse(msg.toString()));
			let newMsg = JSON.parse(msg.toString());

			mongodbClient.connect(mongoUri, (dbErr, db) => {

				if( dbErr ){
					console.log("Connection to Mongo failed:", dbErr);
				}else{
					db.collection("maquinas").findOneAndUpdate( {_id: topicArr[3]},
						//Update operations
						{
							$inc: { "tempo_total_ligada" : newMsg.tempo_total_ligada },
							$push: { "atividades" : newMsg.atividades }
						},
						//Callback
						(updateErr, updateRes) => {
							console.log(updateErr, updateRes);
							//Fecha no callback
							db.close();
					});
				}

			});

		}else{
			console.log("Outro tópico...", t);
		}

	});
}

module.exports = MqttSubsController;