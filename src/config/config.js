let express = require("express");
let bodyParser = require("body-parser");
let maquinas = require("../routes/routesMaquina");
let clientes = require("../routes/routesCliente");
let operadores = require("../routes/routesOperadores");
const admins = require("../routes/routesAdmin");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");
const usuario = new User();

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	const user = new User();
	
  use.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
	function(username, password, done) {


		usuario.auth(username, password, function(error, user){

			if(error){return done(error);}

			if(!user){
				done(null, false, {message: 'Não encontrado!'});
			}

			return done(null, user);

		});
	}
));

module.exports = function() {
  let app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(passport.initialize());
	app.use(passport.session());
  app.use("/maquinas", maquinas);
  app.use("/clientes", clientes);
  app.use("/operadores", operadores);
  app.use("/admins", admins);

  return app;
};
