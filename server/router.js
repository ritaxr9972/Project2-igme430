const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getDomos', mid.requiresLogin, controllers.Poke.getPokemons);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  // app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Poke.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Poke.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
