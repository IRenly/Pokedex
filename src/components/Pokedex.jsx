"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import PokemonDetail from "./PokemonDetail"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

const TYPE_COLORS = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
}

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([])
  const [search, setSearch] = useState("")
  const [filteredPokemons, setFilteredPokemons] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [pokemonDetails, setPokemonDetails] = useState([])
  const pokemonsPerPage = 20

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setLoading(true)
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1000")
        setPokemonList(response.data.results)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching Pokémon list", error)
        setLoading(false)
      }
    }
    fetchPokemonList()
  }, [])

  useEffect(() => {
    if (search) {
      setFilteredPokemons(pokemonList.filter((pokemon) => pokemon.name.includes(search.toLowerCase())))
    } else {
      setFilteredPokemons([])
    }
  }, [search, pokemonList])

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (pokemonList.length === 0) return

      const start = page * pokemonsPerPage
      const end = start + pokemonsPerPage
      const currentPagePokemons = pokemonList.slice(start, end)

      setLoading(true)

      try {
        const detailsPromises = currentPagePokemons.map((pokemon) => axios.get(pokemon.url))

        const detailsResponses = await Promise.all(detailsPromises)
        const details = detailsResponses.map((response) => response.data)

        setPokemonDetails(details)
      } catch (error) {
        console.error("Error fetching Pokémon details", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemonDetails()
  }, [pokemonList, page])

  const handleSearch = async (name) => {
    if (!name) return
    try {
      setLoading(true)
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      setSelectedPokemon(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Pokémon no encontrado")
      setSelectedPokemon(null)
      setLoading(false)
    }
  }

  const handleNextPage = () => {
    if ((page + 1) * pokemonsPerPage < pokemonList.length) {
      setPage(page + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 rounded p-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Decorative Pokedex elements */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-blue-400 border-4 border-white shadow-inner flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-300 shadow-inner"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-inner"></div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-2 rounded-full bg-black bg-opacity-20"></div>
            <div className="w-12 h-2 rounded-full bg-black bg-opacity-20"></div>
          </div>
        </div>
          {/* Header with GameBoy Advance style screen */}
          <div className="relative mb-8">
          {/* Screen outer case */}
          <div className="bg-gray-800 rounded-lg p-1.5 border-2 border-gray-900 shadow-lg">
            {/* Screen inner frame */}
            <div className="bg-gray-700 rounded p-2 border border-gray-600">
              {/* Screen with scanlines effect */}
              <div className="bg-green-500 rounded relative overflow-hidden p-6 border border-green-600">
                {/* Scanlines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent bg-repeat-y" 
                     style={{ backgroundSize: '100% 2px' }}></div>
                {/* Content */}
                <div className="relative">
                  <h1 className="text-white text-5xl font-bold mb-2 drop-shadow-lg">Pokédex</h1>
                  <p className="text-white text-lg">Encuentra información sobre tus Pokémon favoritos</p>
                </div>
                
                {/* Pixel noise effect */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full" 
                       style={{ 
                         backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFISURBVGhD7ZixTsMwFEV/CQYGJFbEwMoHMDMxs7KzsbAx8wl8AxJfwMJaJEYWJBYGBgSHPMlWnDZ28kzTu9TnSFf1a5zE8X3PbXJnEqk4p/T8OApsxTyQmgPpOZCeA+k5kJ4D6TmQngPpOZCeA+k5kJ4D6f0ZyPLmMZxfX4XZ4jJM54vw8vwUO3/PwYGsHu7D+eIqnC1X7Xq7eYud/XMQIKvlfZjMl6E5abbrzdtL7ByGvQNpIeZXoTldxPXb63PsHI69Atle3rQQzA/r9ePd0RAw7BVIuqyaZh7WH+9hd4wQMOwNSIKYzC7aWYHLKkHwfHcsCBj2AiRBMPDp0mLQ0+XFNTYIGHYOJEFwaTHoCeKQEDDsFAgDz6AnCBh2BiQNeoJgdkogMOwECIOeZoVBT5dVCQSG4kAIgdlJl9X+n+kRKA4kVXEgNYfQC+ELqpk5JLVrfQoAAAAASUVORK5CYII=")',
                         backgroundRepeat: 'repeat'
                       }}></div>
                
                {/* Screen glare */}
                
                <div className="absolute top-0 left-0 w-full h-8 bg-white opacity-10 rounded-t"></div>
                
                {/* Red LED indicator */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-inner animate-pulse"></div>
                </div>
                

              </div>
            </div>
          </div>
          
          {/* Power button */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-6 bg-gray-900 rounded-r"></div>
        </div>
        </div>
        {/* Search Bar with Pokedex style */}
        <div className="relative w-full max-w-md mx-auto mb-8 z-10">
          <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
            <Search className="ml-3 text-gray-400" size={20} />
            <input
              type="text"
              className="w-full p-3 outline-none text-gray-700"
              placeholder="Buscar Pokémon por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredPokemons.length > 0 && (
            <ul className="absolute w-full bg-white text-gray-700 border rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
              {filteredPokemons.map((pokemon, index) => (
                <li
                  key={index}
                  className="p-3 cursor-pointer hover:bg-gray-200 capitalize border-b last:border-b-0 flex items-center"
                  onClick={() => {
                    handleSearch(pokemon.name)
                    setSearch("")
                  }}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split("/")[6]}.png`}
                    alt={pokemon.name}
                    className="w-10 h-10 mr-3 "
                  />
                  <span className="font-medium">{pokemon.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex gap-4">
            <button className="w-12 h-12 bg-green-500 rounded-lg shadow-inner border-2 border-green-600"></button>
            <button className="w-12 h-12 bg-blue-500 rounded-lg shadow-inner border-2 border-blue-600"></button>
          </div>
          <div className="relative w-20 h-20">
            <button className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-800 rounded"></button>
            <button className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-800 rounded"></button>
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800 rounded"></button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-800 rounded"></button>
            <div className="absolute inset-2 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-6 px-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 0}
            className={`flex items-center bg-white bg-opacity-20 text-gray-700 font-semibold  px-4 py-2 rounded-full transition-all ${page === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-30"}`}
          >
            <ChevronLeft size={20} className="mr-1" /> Anterior
          </button>

          <span className="text-white font-medium">
            Página {page + 1} de {Math.ceil(pokemonList.length / pokemonsPerPage)}
          </span>

          <button
            onClick={handleNextPage}
            disabled={(page + 1) * pokemonsPerPage >= pokemonList.length}
            className={`flex items-center bg-white bg-opacity-20 text-gray-700 font-semibold px-4 py-2 rounded-full transition-all ${(page + 1) * pokemonsPerPage >= pokemonList.length ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-30"}`}
          >
            Siguiente <ChevronRight size={20} className="ml-1" />
          </button>
        </div>

        {/* Pokemon Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-bounce bg-white p-2 w-16 h-16 ring-1 ring-white shadow-lg rounded-full flex items-center justify-center">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Loading"
                className="w-10 h-10"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {pokemonDetails.map((pokemon) => (
              <div
                key={pokemon.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                onClick={() => handleSearch(pokemon.name)}
              >
                <div className="relative pt-4 px-4">
                  <span className="absolute top-2 right-2 bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">
                    #{String(pokemon.id).padStart(3, "0")}
                  </span>
                  <div className="bg-gray-100 rounded-lg p-4 flex justify-center items-center">
                    <img
                      src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="capitalize text-gray-800 font-bold text-lg mb-1">{pokemon.name}</h3>
                  <div className="flex gap-2 justify-center">
                    {pokemon.types.map((type, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-white px-2 py-1 rounded capitalize"
                        style={{ backgroundColor: TYPE_COLORS[type.type.name] }}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPokemon && <PokemonDetail pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />}
    </div>
  )
}

export default Pokedex

