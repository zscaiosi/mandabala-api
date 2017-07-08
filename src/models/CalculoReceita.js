
function CalculoReceita(){

}

CalculoReceita.prototype.receitaUtilizacao = function(x, y){
    return this._x*this._y;
}

CalculoReceita.prototype.receitaTotal = function(x, z){
    return this.receitaUtilizacao()*z;
}

module.exports = CalculoReceita;