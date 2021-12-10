"use strict";

var token = {};

var deleteFavorite = function deleteFavorite(poke) {
  sendAjax('POST', "/deleteFav", $("#".concat(poke)).serialize(), null);
  console.dir("Favorite Deleted");
};

var FavoritesList = function FavoritesList(props) {
  if (props.pokes.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "pokeList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyPoke"
      }, "No Favorites yet"))
    );
  }

  var favoriteNodes = props.pokes.map(function (poke) {
    return (/*#__PURE__*/React.createElement("form", {
        id: poke._id,
        className: "card",
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          deleteFavorite(poke._id);
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: poke.image,
        alt: "poke image",
        "class": "card-img-top"
      }), /*#__PURE__*/React.createElement("div", {
        "class": "card-body"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "pokeName"
      }, "Name: ", poke.name, " "), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: token
      }), /*#__PURE__*/React.createElement("input", {
        className: "deleteSubmit",
        type: "submit",
        value: "Remove Favorite"
      })))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "pokeList"
    }, /*#__PURE__*/React.createElement("h3", null, "Favorites:"), favoriteNodes)
  );
};

var loadFavoritesFromServer = function loadFavoritesFromServer() {
  sendAjax('GET', '/getFavorites', null, function (data) {
    console.log(data);
    ReactDOM.render( /*#__PURE__*/React.createElement(FavoritesList, {
      pokes: data.pokes
    }), document.querySelector("#favorites"));
  });
};

var setup = function setup() {
  ReactDOM.render( /*#__PURE__*/React.createElement(FavoritesList, {
    pokes: []
  }), document.querySelector("#favorites"));
  loadFavoritesFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    token = result.csrfToken;
    setup(result.csrfToken);
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
