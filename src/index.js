let config = require('./config/config');
const {mqttAws} = require("./config/hosts.json");
let app = config();
let MqttSubsController = require('./controllers/mqttSubsController');

const mqttSubs1 = new MqttSubsController("54.197.172.138", 'maquina/bichinho/atividade/+');
const mqttSubs3 = new MqttSubsController(mqttAws, 'teste/maquinas/atividades');

app.listen("8585", () => {
    console.log('Listening to 8585...');
});