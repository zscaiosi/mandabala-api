let config = require('./config/config');
const {mqttAws} = require("./config/hosts.json");
let app = config();
let MqttSubsController = require('./controllers/mqttSubsController');

const mqttSubsAtividade = new MqttSubsController(mqttAws, 'maquina/bichinho/atividades/+');
const mqttSubsLigada = new MqttSubsController(mqttAws, 'maquina/bichinho/ligada/+');

app.listen("8585", () => {
    console.log('Listening to 8585...');
});