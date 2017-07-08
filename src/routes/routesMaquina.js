let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;

const mongoUrl = "mongodb://mongocaio:m0ng0ldb*@clusteruno-shard-00-01-7t23t.mongodb.net:27017/maquinas?ssl=true&replicaSet=ClusterUno-shard-0&authSource=admin";

router.post('/cadastrar', (req, res) => {
    try{
        let body = req.body;

        console.log(body);

        if( body ){
            mongoClient.connect(mongoUrl, (dbErr, db) => {
                //Faz insert apenas se existe um campo _id
                body._id ? db.collection('maquinas').insert(body, null, (insertErr, result) => {
                    result.result.ok === 1 ? res.status(200).json({response: 'Adicionado com sucesso', data: result.ops[0]}) : res.status(500).send(insertErr);
                }) : res.status(400).send('Não inseriu um _id!');
                
                db.close();
                
            });
        }else{
            res.status(400).json({response: 'Payload não encontrado'});
        }
    }catch(exception){
        throw exception;
    }
});

router.get('/encontrar', (req, res) => {
    try{
        let queryObj = req.query;

        console.log('query', queryObj)
        
        if( queryObj.hasOwnProperty("_id") ){
            mongoClient.connect(mongoUrl, (dbErr, db) => {
               
                db.collection('maquinas').findOne(queryObj, (findErr, result) => {
                   
                    if (findErr) throw findErr;

                    res.status(200).json(result);
                });
                db.close();
            });
        }else{
            res.status(200).json({response: 'Ainda nada'});
        }
    }catch(exception){
        throw exception;
    }
});

module.exports = router;