const pokemonCards = require('pokemontcgsdk');
const fetch = require('node-fetch');


const requestBearerToken = (res) => {
  const url = 'https://api.tcgplayer.com/token';

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: 'grant_type=client_credentials&client_id=80f4290e-727a-4b81-b467-0e764bfb6c5d&client_secret=41df591c-f37e-41ad-8863-cb0c581ac230',
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((json) => function () {
      // token = json.access_token;
      res.json({ status: json.status });
    });
};

const getPokemon = (req, res) => {
  let pokelist = [{}];

  pokemonCards.card.where({ page: 1, pageSize: 20 })
    .then((cards) => {
      pokelist = cards;
      res.json({ pokemon: pokelist });
    });
};

const searchCards = (req, res) => {
  const searchList = [{}];
  const { numResults } = req.query;

  const term = `name:${req.query.search}`;

  pokemonCards.card.all({ q: term })
    .then('data',(card) => {
      if (searchList.length < numResults) {
        searchList.push(card);
      }
    });

  setTimeout(() => {
    res.json({ pokemon: searchList });
  }, 4000);
};

const pokePage = (req, res) => {
  res.render('pokemon', { csrfToken: req.csrfToken() });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.getPokemon = getPokemon;
module.exports.pokePage = pokePage;
module.exports.getToken = getToken;
module.exports.searchCards = searchCards;
module.exports.requestBearerToken = requestBearerToken;
