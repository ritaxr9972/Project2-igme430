const models = require('../models');

const { Pokemon } = models;

const makerPage = (req, res) => {
  Pokemon.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makePokemon = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  const pokeData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newPokemon = new Pokemon.PokeModel(pokeData);

  const pokePromise = newPokemon.save();

  pokePromise.then(() => res.json({ redirect: '/maker' }));

  pokePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return pokePromise;
};

const getPokemons = (request, response) => {
  const req = request;
  const res = response;

  return Pokemon.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ Pokemons: docs });
  });
};
/*
const deleteDomos = (request, response) => {
  // const req = request;
  // const res = response;
};
*/
module.exports.makerPage = makerPage;
module.exports.getPokemons = getPokemons;
module.exports.make = makePokemon;
// module.exports.deleteDomos = deleteDomos;
