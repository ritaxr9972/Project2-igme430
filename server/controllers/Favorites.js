const models = require('../models');

const { Pokemon } = models;

const profilePage = (req, res) => {
  Pokemon.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), pokes: docs });
  });
};

const addFavorite = (req, res) => {
  console.log(req.body.name);

  const pokeData = {
    name: req.body.name,
    image: req.body.imageUrl,
    owner: req.session.account._id,
  };

  const newPoke = new Pokemon.PokeModel(pokeData);

  const pokePromise = newPoke.save();

  pokePromise.then(() => console.log('promise saved'));

  pokePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This card is already favorited.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return pokePromise;
};

const getFavorites = (request, response) => {
  const req = request;
  const res = response;

  return Pokemon.PokeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ pokes: docs });
  });
};

const deleteFavorite = (req, res) => {
  console.log(req.body);

  Pokemon.PokeModel.deleteFavorite = (req.body, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ pokes: docs });
  });
};

module.exports.profilePage = profilePage;
module.exports.addFavorite = addFavorite;
module.exports.getFavorites = getFavorites;
module.exports.deleteFavorite = deleteFavorite;
