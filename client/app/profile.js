let token = {};

const deleteFavorite = (poke) => {
  
  sendAjax('POST', "/deleteFav", $(`#${poke}`).serialize(), null);
  
  console.dir("Favorite Deleted");
};

const FavoritesList = function(props) {
  if(props.pokes.length === 0) {
    return(
      <div className="pokeList">
        <h3 className="emptyPoke">No Favorites yet</h3>
      </div>
    );
  }
  
  const favoriteNodes = props.pokes.map(function(poke) {
    return(
      <form 
        id={poke._id}
       className="card"
       onSubmit={e => {
              e.preventDefault();
              deleteFavorite(poke._id);
            }
          }
       
       >
        <img src={poke.image} alt="poke image" class="card-img-top" />
        <div class="card-body">
          <h3 className="pokeName">Name: {poke.name} </h3>
          <input type="hidden" name="_csrf" value={token}/>
          <input className="deleteSubmit" type="submit" value="Remove Favorite"/>
        </div>
      </form>
    );
  });
  
  return (
    <div className="pokeList">
      <h3>Favorites:</h3>
      {favoriteNodes}
    </div>
  );
};

const loadFavoritesFromServer = () => {
  sendAjax('GET', '/getFavorites', null, (data) => {
    console.log(data);
    ReactDOM.render(
      <FavoritesList pokes={data.pokes}/>, document.querySelector("#favorites")
    );
  });
};

const setup = function() {
  
  ReactDOM.render(
    <FavoritesList pokes={[]} />, document.querySelector("#favorites")
  );
  
  loadFavoritesFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    token = result.csrfToken;
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});