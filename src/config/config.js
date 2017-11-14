let express = require("express");
let bodyParser = require("body-parser");
let maquinas = require("../routes/routesMaquina");
let clientes = require("../routes/routesCliente");
let operadores = require("../routes/routesOperadores");
const admins = require("../routes/routesAdmin");
const cors = require("cors");


module.exports = function() {
  let app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
  app.use("/maquinas", maquinas);
  app.use("/clientes", clientes);
  app.use("/operadores", operadores);
  app.use("/admins", admins);

  return app;
};
