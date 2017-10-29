
const mongoDBClient = require('mongodb').MongoClient;
const mongoUrl = require('../config/hosts.json');
const Maquina = require('../models/Maquina');

function CalculoReceita(){

}

CalculoReceita.prototype.receitaUtilizacao = function(x, y){
    return x*y;
}

CalculoReceita.prototype.receitaTotal = function(x, z){
    return x*z;
}

CalculoReceita.prototype.getMaquinas = function(clienteId){
    const maquina = new Maquina();

    maquina.list(clienteId, function(status, maquinas){
        maquinas.map( (maquina, index) => {
            console.log(maquina);
            //this.receitaTotal(maquina.);

        });
    });
}

module.exports = CalculoReceita;