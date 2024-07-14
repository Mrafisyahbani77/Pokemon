import { useEffect, useState } from "react";
import axios from "axios";
import { FaSun, FaMoon } from "react-icons/fa";

export default function App() {
  const [pokemon, setPokemons] = useState([]);
  const [isShifted, setIsShifted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pokemonDetail, setPokemonDetail] = useState([]);
  const [opened, setOpened] = useState(false);
  const [detailSelect, setDetailSelect] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );
  const [prevUrl, setPrevUrl] = useState("");
  const [nextUrl, setNextUrl] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setIsShifted(!isShifted);
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(currentUrl)
      .then(function (response) {
        setPokemons(response.data.results);
        setPrevUrl(response.data.previous);
        setNextUrl(response.data.next);
        return Promise.all(
          response.data.results.map((pokemon) => axios.get(pokemon.url))
        );
      })
      .then((pokemonResponses) => {
        setPokemonDetail(pokemonResponses.map((pokeRes) => pokeRes.data));
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
      <div className="relative hover:shadow-purple-400 hover:shadow-md mt-2 p-4 mx-3 max-w-[7%] rounded-full border-slate-700 border">
        <button
          className={`absolute top-0 left-0 px-4 py-2 bg-gradient-to-l to-purple-400 from-cyan-500  text-white rounded-full transform transition-transform duration-300 ${isShifted ? 'translate-x-10' : 'translate-x-0'}`}
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <FaSun className="text-yellow-30" />
          ) : (
            <FaMoon className="text-black" />
          )}
        </button>
      </div>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="container mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pokemonDetail.map((pokemon, index) => (
                <div
                  className="p-5"
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="border-2 cursor-pointer border-purple-400 hover:shadow-purple-400 hover:shadow-full hover:shadow-gradient-to-l hover:from-purple-400 hover:to-yellow-400 bg-gradient-to-br from-yellow-400 to-purple-500 rounded-md px-7">
                    <div className="relative ">
                      <img
                        src={pokemon.sprites.other.dream_world.front_default}
                        alt={pokemon.name}
                        className={`max-w-48 mx-auto max-h-40 p-3  transition-transform duration-500 ${
                          hoveredIndex === index ? "transform scale-75" : ""
                        }`}
                      />
                      {hoveredIndex === index && (
                        <>
                          <h1 className="font-semibold mt-3 text-2xl">
                            Name : {pokemon.name}
                          </h1>
                          <button
                            onClick={() => handleOpened(pokemon)}
                            className="py-5 bg-gradient-to-l to-purple-400 from-cyan-500 hover:shadow-purple-400 hover:shadow-lg hover:shadow-gradient-to-l hover:from-purple-400 hover:to-cyan-500 px-7 rounded-md mb-4 mt-3 font-semibold text-white"
                          >
                            Detail
                          </button>
                        </>
                      )}
                    </div>
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
                className="max-w-full float-animation  mx-auto p-3"
              />
              <div>
                <div className="flex justify-center items-center">
                  <h1 className="font-bold text-4xl">Ability</h1>
                </div>
                <div className="flex justify-center gap-5 items-center">
                  {detailSelect.abilities.map((item, index) => (
                    <div
                      key={index}
                      className="text-xl mt-5 border cursor-pointer p-5 bg-gradient-to-l rounded-xl font-semibold to-purple-400 from-cyan-500 hover:shadow-purple-400 hover:shadow-xl hover:shadow-gradient-to-l hover:from-purple-400 hover:to-cyan-500 hover:text-white transition duration-300 ease-in-out"
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
              className="fixed bg-yellow-400 hover:bg-gradient-to-r from-yellow-500 to-yellow-800 text-white px-4 rounded-lg left-4 bottom-72 text-5xl"
              onClick={() => setCurrentUrl(prevUrl)}
            >
              &laquo;
            </button>
          )}
          {nextUrl && (
            <button
              className="fixed lg:left-[95%] left-[85%] bg-yellow-400 hover:bg-gradient-to-r from-yellow-500 to-yellow-800 text-white px-4 rounded-lg bottom-72 text-5xl"
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
