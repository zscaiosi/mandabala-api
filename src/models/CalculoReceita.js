
function CalculoReceita(){

}

CalculoReceita.prototype.receitaUtilizacao = function(x, y){
    return x*y;
}

CalculoReceita.prototype.receitaTotal = function(x, z){
    return x*z;
}

module.exports = CalculoReceita;