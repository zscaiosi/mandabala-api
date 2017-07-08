let config = require('./config/config');
let app = config();
let MqttSubsController = require('./controllers/mqttSubsController');

const mqttSubs1 = new MqttSubsController('localhost', 'maquina/bichinho/atividade/report/m1');
const mqttSubs2 = new MqttSubsController('localhost', 'maquina/bichinho/atividade/report/m2');


app.listen("8585", () => {
    console.log('Listening to 8585...');
});