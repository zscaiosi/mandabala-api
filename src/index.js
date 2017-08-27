let config = require('./config/config');
const {mqttAws} = require("./config/hosts.json");
let app = config();
let MqttSubsController = require('./controllers/mqttSubsController');

const mqttSubs1 = new MqttSubsController(mqttAws, 'maquina/bichinho/atividade/report/+');
const mqttSubs3 = new MqttSubsController(mqttAws, 'teste/maquinas/atividades');

app.listen("8585", () => {
    console.log('Listening to 8585...');
});