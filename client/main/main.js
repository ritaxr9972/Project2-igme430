const Header = (props) => {
  return(
    <div className="header">
      <h1 className="title">Pokemon Finder</h1>
      <p>Find your favorite pokemon!</p>
    </div>
  );
};

let loggedIn = {};
let token = {};

const checkLogin = (csrf) => {
  sendAjax('GET', '/loggedIn', null, (data) => {
            console.log(data);
           loggedIn = data.loggedIn;
          setup(csrf);
  });
};

const NavBar = (props) => {
  
    if (loggedIn === 1)
                {
                  return(
                    <div>
                      <nav><a href="/main"><img id="logo" src="/assets/img/Pokeball.png" alt="face logo"/></a>
                        <div className="navlink"><a id="loginButton" href="/profile">Profile</a></div>
                        <div className="navlink"><a id="signupButton" href="/logout">Sign Out</a></div>
                      </nav>
                    </div>
                  );
                }else{
                  return(
                    <div>
                      <nav><a href="/login"><img id="logo" src="/assets/img/Pokeball.png" alt="face logo"/></a>
                        <div className="navlink"><a id="loginButton" href='/login'>Login</a></div>
                      </nav>
                    </div>
                  );
                }
  
  };


const handleSearch = (e) => {
  e.preventDefault();
  
  sendAjax('GET', '/searchCards', $("#searchForm").serialize(), (data) => {
    ReactDOM.render(
      <PokeList pokemon={data.pokemon}/>, document.querySelector("#content")
    );
  });
  
  return false;
}

const Search = (props) => {
  return(
    <form id="searchForm"
          name="searchForm"
          onSubmit={handleSearch}
          action="/searchCards"
          method="GET"
          className="searchForm"
    >
      <label htmlFor="search">Find any cards: </label>
      <input id="search" type="text" name="search" placeholder="Charizard" />
      <input className="searchSubmit" type="submit" value="Search"/>
      <label for="numResults">Number of Results:</label>
      <select id="numResults" name="numResults">
        <option value="10" selected>10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </form>
  );
};

const handleFavorite = (pokeId) => {
  
  sendAjax('POST', '/addFavorite', $(`#${pokeId}`).serialize(), (data) => {
    console.log(data);
  });
  
  return false;
};


const PokeList = (props) => {
  //console.log(props.pokemon);
  if(props.pokemon === null || props.pokemon.length === 0){
    return(
      <div>
        <h3>No Pokemon Found</h3>
      </div>
    );
  }
  
  const pokeNodes = props.pokemon.map((poke) => {
    
      if (loggedIn) {
        return(
          <div>
            <form
               id={poke.id}
               name="cardForm"
               className="cardForm"
               onSubmit={e => {
                                e.preventDefault();
                                handleFavorite(poke.id);
                              }
                        }

             >
              <h3 name="name">{poke.name}</h3>
              <img name="image" src={poke.imageUrl}/>
              <input type="hidden" name="name" value={poke.name}/>
              <input type="hidden" name="imageUrl" value={poke.imageUrl}/>
              <input type="hidden" name="_csrf" value={token}/>
              <input type="submit" value="Favorite"/>
            </form>
          </div>
        );
      } else {
        return(
          <div>
            <form
               id="cardForm"
               name="cardForm"
               className="cardForm"

             >
              <h3 name="name">{poke.name}</h3>
              <img name="image" src={poke.imageUrl}/>
              <input type="hidden" name="_csrf" value={token}/>
            </form>
          </div>
        );
      }
  });
  
  return(
    <div>
      <h1>Pokemon Cards:</h1>
      {pokeNodes}
    </div>
  );
};

const loadPokemonFromServer = () => {
  sendAjax('GET', '/getPokemon', null, (data) => {
    ReactDOM.render(
      <PokeList pokemon={data.pokemon}/>, document.querySelector("#content")
    );
  });
};

/*const requestBearerToken = () => {
  sendAjax('GET', '/getBearer', null, (data) => {
    console.log(data.userName);
  });
};*/

const setup = function(csrf) {
  
  //requestBearerToken();
  
  ReactDOM.render(
    <Header />, document.querySelector("#header")
  );
  
  ReactDOM.render(
    <NavBar />, document.querySelector("#navbar")
  );
  
  ReactDOM.render(
    <Search />, document.querySelector("#search")
  );
  
  ReactDOM.render(
    <PokeList pokemon={[]} />, document.querySelector("#content")
  );
  
  loadPokemonFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    token = result.csrfToken;
    checkLogin(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});