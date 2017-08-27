let express = require('express');
let router = express.Router();
let mongoClient = require('mongodb').MongoClient;

const mongoUrl = "mongodb://mongocaio:m0ng0ldb*@clusteruno-shard-00-01-7t23t.mongodb.net:27017/maquinas?ssl=true&replicaSet=ClusterUno-shard-0&authSource=admin";

router.post('/cadastrar', (req, res) => {
  try {
    let body = req.body;

    console.log(body);

    if (body.hasOwnProperty("_id") && body.hasOwnProperty("nome")) {
      mongoClient.connect(mongoUrl, (dbErr, db) => {
        //Faz insert apenas se existe um campo _id
        body._id ? db.collection('admin').insert(body, null, (insertErr, result) => {
          result.result.ok === 1 ? res.status(200).json({ response: 'Adicionado com sucesso', data: result.ops[0] }) : res.status(500).send(insertErr);
        }) : res.status(400).send('Não inseriu um _id!');

        db.close();

      });
    } else {
      res.status(400).json({ response: 'Faltam informações sobre o cliente!' });
    }
  } catch (exception) {
    console.log(exception);
    throw exception;
  }
});

router.post('/login', (req, res) => {
  const body = req.body;
  
  console.log(body)
  try{
    if( body.hasOwnProperty("email") && body.hasOwnProperty("password") ){
      mongoClient.connect(mongoUrl, (dbErr, db) => {
        
        db.collection('admins').findOne(body, (findErr, findResult) => {
          if(findErr) {throw findErr; console.log(findErr)}
          console.log('eer', findErr, 'result', findResult)

          if(findErr){
            res.status(500).json({response: 'Usuário não encontrado!', error: findErr});
          }else if( findResult === null ){
            res.status(500).json({response: 'não encontrado', authenticated: false});
          }else{
            res.status(200).json({ response: 'ok', authenticated: true, data: findResult });
          }
          db.close();
        });

      });
    }

  }catch(exception){
    if(exception) {throw exception; console.log(exception);}
  }
});

router.get('/encontrar', (req, res) => {
  try {
    let queryObj = req.query;

    console.log('query', queryObj)

    if (queryObj.hasOwnProperty("_id")) {
      mongoClient.connect(mongoUrl, (dbErr, db) => {

        db.collection('admin').findOne(queryObj, (findErr, result) => {

          if (findErr) throw findErr;

          res.status(200).json(result);
        });
        db.close();
      });
    } else {
      res.status(400).json({ response: 'Busca possível apenas por _id.' });
    }
  } catch (exception) {
    throw exception;
  }
});

router.get('/listar', (req, res) => {
  try {
    mongoClient.connect(mongoUrl, (dbErr, db) => {

      db.collection('admin').find().toArray((findErr, results) => {
        if (findErr) throw findErr;

        res.status(200).json({ response: 'ok', data: results });
      });
      db.close();
    });

  } catch (exception) {
    throw exception;
  }
});

router.put('/atualizar', (req, res) => {
  try {
    let putBody = req.body;

    mongoClient.connect(mongoUrl, (dbErr, db) => {

      db.collection('admin').findOneAndUpdate({ _id: putBody._id },
        { $set: putBody }, null,
        (updateErr, result) => {
          console.log('r:', result);
          console.log('err:', updateErr);
          if (!updateErr && result.lastErrorObject.updatedExisting === true) {
            res.status(200).json({ response: "atualizado", data: { antigo: result.value, novo: putBody } });
          } else {
            res.status(400).json({ response: "erro", data: updateErr });
          }
        });
      db.close();
    });

  } catch (exception) {
    throw exception;
  }
});

module.exports = router;