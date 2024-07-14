import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonDetail, setPokemonDetail] = useState([]);
  const [opened, setOpened] = useState(false);
  const [detailSelect, setDetailSelect] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [prevUrl, setPrevUrl] = useState("");
  const [nextUrl, setNextUrl] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios.get(currentUrl)
      .then(function (response) {
        setPokemons(response.data.results);
        setPrevUrl(response.data.previous);
        setNextUrl(response.data.next);
        return Promise.all(response.data.results.map(pokemon => axios.get(pokemon.url)));
      })
      .then(pokemonResponses => {
        setPokemonDetail(pokemonResponses.map(pokeRes => pokeRes.data));
        setIsLoading(false);
      })
      .catch(function (error) {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      });
  }, [currentUrl]);

  const handleOpened = (pokemon) => {
    setDetailSelect(pokemon);
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
    setDetailSelect(null);
  };

  return (
    <>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="container mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pokemonDetail.map((pokemon, index) => (
                <div className="p-5" key={index}>
                  <div className="border-2 px-7">
                    <div>
                      <img
                        src={pokemon.sprites.other.dream_world.front_default}
                        alt={pokemon.name}
                        className="max-w-48 mx-auto max-h-40 p-3"
                      />
                    </div>
                    <h1 className="font-bold mt-3 text-2xl">Name : {pokemon.name}</h1>
                    <button
                      onClick={() => handleOpened(pokemon)}
                      className="py-5 bg-cyan-500 px-7 rounded-md mb-4 mt-3 font-semibold text-white"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {opened && detailSelect && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-white rounded shadow-md p-8 lg:w-[60%] w-[90%] relative">
              <img
                src={detailSelect.sprites.other.dream_world.front_default}
                alt={detailSelect.name}
                className="max-w-full mx-auto p-3"
              />
              <div>
                <div className="flex justify-center items-center">
                  <h1 className="font-bold text-4xl">Ability</h1>
                </div>
                <div className="flex justify-center gap-5 items-center">
                  {detailSelect.abilities.map((item, index) => (
                    <div
                      key={index}
                      className="text-xl mt-5 border cursor-pointer p-5 border-slate-500 font-semibold hover:bg-slate-700 hover:text-white transition duration-300 ease-in-out"
                    >
                      {item.ability.name}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleClose}
                className="bg-red-500 mt-3 px-7 py-5 shadow-lg shadow-slate-700 rounded-md text-white text-2xl font-bold lg:-mx-5"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="absolute">
          {prevUrl && (
            <button
              className="fixed bg-slate-600 text-white px-4 rounded-md left-5 bottom-72 text-5xl"
              onClick={() => setCurrentUrl(prevUrl)}
            >
              &laquo;
            </button>
          )}
          {nextUrl && (
            <button
              className="fixed lg:left-[95%] left-[85%] bg-slate-600 text-white px-4 rounded-md bottom-72 text-5xl"
              onClick={() => setCurrentUrl(nextUrl)}
            >
              &raquo;
            </button>
          )}
        </div>
      </div>
    </>
  );
}
