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
            //Conecta ao cluster MongoDB
            mongodbClient.connect(mongoUri, (err, db) => {
                if (err) throw err;
                //Faz uma query simples
                db.collection('maquinas').find({modelo: msg.toString()}).toArray((error, results) => {
                    if (error) throw error;
                    //Trata o array de resultados
                    results.map( (result, index) => {
                        console.log('data:', result);
                    });

                    db.close();
                });
            });
        }catch(error){
            throw error;
        }
    });
}

module.exports = MqttSubsController;