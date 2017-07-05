const mqtt = require('mqtt');
const mongodbClient = require('mongodb').MongoClient;
const mongoUri = "mongodb://mongocaio:m0ng0ldb*@clusteruno-shard-00-01-7t23t.mongodb.net:27017/test?ssl=true&replicaSet=ClusterUno-shard-0&authSource=admin";

function MqttSubsController(url, topic){
    let client = mqtt.connect("mqtt://"+url);

    client.on("connect", () => {
        client.subscribe(topic);
    });

    client.on("message", (t, msg) => {
        console.log('topic said--->', msg.toString());
        try{
            mongodbClient.connect(mongoUri, (err, db) => {
                
            });
        }catch(error){

        }
    });
}

module.exports = MqttSubsController;