let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;
let CalculoReceita = require('../models/CalculoReceita');

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
            res.status(400).json({response: 'Busca possível apenas por _id.'});
        }
    }catch(exception){
        throw exception;
    }
});

router.get('/receitaTotal', (req, res) => {
    try{
        let queryObj = req.query;

        console.log('query', queryObj)

        if( queryObj.hasOwnProperty("valor_hora") && queryObj.hasOwnProperty("tempo_total_ligada") ){
            let calculate = new CalculoReceita();
            const receita = calculate.receitaTotal(queryObj.valor_hora, queryObj.tempo_total_ligada);
            console.log(calculate.receitaTotal(Number(queryObj.valor_hora), Number(queryObj.tempo_total_ligada)))

            res.status(200).json({response:"success", data: receita});
        }else{
            res.status(400).json({response:"error", data: "Passar valor/hora e tempo total ligada."});
        }
    }catch(exception){
        throw exception;
    }
});

module.exports = router;