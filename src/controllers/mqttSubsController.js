const mqtt = require('mqtt');
const mongodbClient = require('mongodb').MongoClient;
const mongoUri = "mongodb://mongocaio:m0ng0ldb*@clusteruno-shard-00-01-7t23t.mongodb.net:27017/maquinas?ssl=true&replicaSet=ClusterUno-shard-0&authSource=admin";


function MqttSubsController(url, topic){
    let client = mqtt.connect("mqtt://"+url);

    client.on("connect", () => {
        client.subscribe(topic);
    });

    client.on("message", (t, msg) => {
        console.log('topic said--->', msg.toString());
        console.log(JSON.parse(msg.toString()));
        
        try{
            if( JSON.parse(msg).hasOwnProperty("_id") ){
                //Conecta ao cluster MongoDB
                mongodbClient.connect(mongoUri, (err, db) => {
                    if (err) throw err;
                    //Faz uma query simples
                    db.collection('maquinas').find({_id: JSON.parse(msg.toString())._id}).toArray((error, results) => {
                        if (error) throw error;
                        //Trata o array de resultados
                        results.map( (result, index) => {
                            console.log('->result:', result);
                        });
                        db.close();
                    });
                    
                    mongodbClient.connect(mongoUri, (err, db) => {
                        if (err) throw err;
                        msg = JSON.parse(msg.toString());
                        //Faz update do estado incrementando o tempo total que já passou ligada
                        let promise = db.collection('maquinas').updateOne({"_id": msg._id},{
                            //Operators
                            $inc: {"tempo_total_ligada": msg.tempo_total_ligada},
                            $push: {"atividades": msg.atividades}
                        });
                        //Se Promise foi 'resolvida'
                        promise.then( (resolved) => {
                            console.log('Documentos modificados: ', resolved.result.nModified, 'data-hora', new Date());
                        })
                        
                        db.close();
                    });
                });
            }else{
                console.log("não é JSON", typeof msg._id);
            }
        }catch(error){
            throw error;
        }
    });
}

module.exports = MqttSubsController;