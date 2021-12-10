"use strict";

var Header = function Header(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "title"
  }, "Pokemon Finder"), /*#__PURE__*/React.createElement("p", null, "Find your favorite pokemon!"));
};

var loggedIn = {};
var token = {};

var checkLogin = function checkLogin(csrf) {
  sendAjax('GET', '/loggedIn', null, function (data) {
    console.log(data);
    loggedIn = data.loggedIn;
    setup(csrf);
  });
};

var NavBar = function NavBar(props) {
  if (loggedIn === 1) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("a", {
      href: "/main"
    }, /*#__PURE__*/React.createElement("img", {
      id: "logo",
      src: "/assets/img/Pokeball.png",
      alt: "face logo"
    })), /*#__PURE__*/React.createElement("div", {
      className: "navlink"
    }, /*#__PURE__*/React.createElement("a", {
      id: "loginButton",
      href: "/profile"
    }, "Profile")), /*#__PURE__*/React.createElement("div", {
      className: "navlink"
    }, /*#__PURE__*/React.createElement("a", {
      id: "signupButton",
      href: "/logout"
    }, "Sign Out"))));
  } else {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("a", {
      href: "/login"
    }, /*#__PURE__*/React.createElement("img", {
      id: "logo",
      src: "/assets/img/Pokeball.png",
      alt: "face logo"
    })), /*#__PURE__*/React.createElement("div", {
      className: "navlink"
    }, /*#__PURE__*/React.createElement("a", {
      id: "loginButton",
      href: "/login"
    }, "Login"))));
  }
};

var handleSearch = function handleSearch(e) {
  e.preventDefault();
  sendAjax('GET', '/searchCards', $("#searchForm").serialize(), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PokeList, {
      pokemon: data.pokemon
    }), document.querySelector("#content"));
  });
  return false;
};

var Search = function Search(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    name: "searchForm",
    onSubmit: handleSearch,
    action: "/searchCards",
    method: "GET",
    className: "searchForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "search"
  }, "Find any cards: "), /*#__PURE__*/React.createElement("input", {
    id: "search",
    type: "text",
    name: "search",
    placeholder: "Charizard"
  }), /*#__PURE__*/React.createElement("input", {
    className: "searchSubmit",
    type: "submit",
    value: "Search"
  }), /*#__PURE__*/React.createElement("label", {
    "for": "numResults"
  }, "Number of Results:"), /*#__PURE__*/React.createElement("select", {
    id: "numResults",
    name: "numResults"
  }, /*#__PURE__*/React.createElement("option", {
    value: "10",
    selected: true
  }, "10"), /*#__PURE__*/React.createElement("option", {
    value: "25"
  }, "25"), /*#__PURE__*/React.createElement("option", {
    value: "50"
  }, "50"), /*#__PURE__*/React.createElement("option", {
    value: "100"
  }, "100")));
};

var handleFavorite = function handleFavorite(pokeId) {
  sendAjax('POST', '/addFavorite', $("#".concat(pokeId)).serialize(), function (data) {
    console.log(data);
  });
  return false;
};

var PokeList = function PokeList(props) {
  //console.log(props.pokemon);
  if (props.pokemon === null || props.pokemon.length === 0) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "No Pokemon Found"));
  }

  var pokeNodes = props.pokemon.map(function (poke) {
    if (loggedIn) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
        id: poke.id,
        name: "cardForm",
        className: "cardForm",
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          handleFavorite(poke.id);
        }
      }, /*#__PURE__*/React.createElement("h3", {
        name: "name"
      }, poke.name), /*#__PURE__*/React.createElement("img", {
        name: "image",
        src: poke.imageUrl
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "name",
        value: poke.name
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "imageUrl",
        value: poke.imageUrl
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: token
      }), /*#__PURE__*/React.createElement("input", {
        type: "submit",
        value: "Favorite"
      })));
    } else {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
        id: "cardForm",
        name: "cardForm",
        className: "cardForm"
      }, /*#__PURE__*/React.createElement("h3", {
        name: "name"
      }, poke.name), /*#__PURE__*/React.createElement("img", {
        name: "image",
        src: poke.imageUrl
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: token
      })));
    }
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Pokemon Cards:"), pokeNodes);
};

var loadPokemonFromServer = function loadPokemonFromServer() {
  sendAjax('GET', '/getPokemon', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PokeList, {
      pokemon: data.pokemon
    }), document.querySelector("#content"));
  });
};
/*const requestBearerToken = () => {
  sendAjax('GET', '/getBearer', null, (data) => {
    console.log(data.userName);
  });
};*/


var setup = function setup(csrf) {
  //requestBearerToken();
  ReactDOM.render( /*#__PURE__*/React.createElement(Header, null), document.querySelector("#header"));
  ReactDOM.render( /*#__PURE__*/React.createElement(NavBar, null), document.querySelector("#navbar"));
  ReactDOM.render( /*#__PURE__*/React.createElement(Search, null), document.querySelector("#search"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PokeList, {
    pokemon: []
  }), document.querySelector("#content"));
  loadPokemonFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    token = result.csrfToken;
    checkLogin(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#pokeMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("pokeMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
