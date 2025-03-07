"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { X, ChevronLeft, Camera, ChevronRight, Heart, Award, Zap, Shield, Swords, Gauge } from "lucide-react"

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

const STAT_ICONS = {
  hp: <Heart size={16} />,
  attack: <Swords size={16} />,
  defense: <Shield size={16} />,
  "special-attack": <Zap size={16} />,
  "special-defense": <Shield size={16} />,
  speed: <Gauge size={16} />,
}

const PokemonDetail = ({ pokemon, onClose }) => {
  const [pokemonSpecies, setPokemonSpecies] = useState(null)
  const [evolutionChain, setEvolutionChain] = useState(null)
  const [activeTab, setActiveTab] = useState("info")
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)

  const images = [
    pokemon.sprites.other["official-artwork"].front_default,
    pokemon.sprites.front_default,
    pokemon.sprites.back_default,
    pokemon.sprites.front_shiny,
    pokemon.sprites.back_shiny,
  ].filter(Boolean)

  useEffect(() => {
    const fetchPokemonSpecies = async () => {
      try {
        setLoading(true)
        const speciesResponse = await axios.get(pokemon.species.url)
        setPokemonSpecies(speciesResponse.data)

        const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url)
        setEvolutionChain(evolutionResponse.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching additional Pokémon data", error)
        setLoading(false)
      }
    }

    fetchPokemonSpecies()
  }, [pokemon])

  const handleNextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length)
  }

  const handlePrevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const getFlavorText = () => {
    if (!pokemonSpecies) return "Cargando..."

    const spanishEntries = pokemonSpecies.flavor_text_entries.filter((entry) => entry.language.name === "es")

    return spanishEntries.length > 0
      ? spanishEntries[0].flavor_text.replace(/\f/g, " ")
      : pokemonSpecies.flavor_text_entries[0].flavor_text.replace(/\f/g, " ")
  }

  return (
    <div className="fixed inset-0  bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 transition-all"
          onClick={onClose}
        >
          <X size={16} className="text-black" />
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-bounce bg-gray-200 p-2 w-16 h-16 ring-1 ring-gray-300 shadow-lg rounded-full flex items-center justify-center">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Loading"
                className="w-10 h-10"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className="p-6 rounded-t-xl flex flex-col md:flex-row items-center gap-6"
              style={{ backgroundColor: TYPE_COLORS[pokemon.types[0].type.name] }}
            >
              {/* Pokemon image carousel */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <div className="bg-white bg-opacity-30 rounded-full p-4 w-full h-full flex items-center justify-center">
                  <img
                    src={images[activeImage] || "/placeholder.svg"}
                    alt={pokemon.name}
                    className="w-36 h-36 object-contain"
                  />
                </div>

                {images.length > 1 && (
                    <>
                        <button
                        onClick={handlePrevImage}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                        >
                        <ChevronLeft size={30} color="black"/>
                        </button>
                        <button
                        onClick={handleNextImage}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2  bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                        >
                        <ChevronRight size={30} color="black" />
                        </button>
                    </>
                )}
              </div>

              {/* Pokemon info */}
              <div className="text-white text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h2 className="capitalize text-3xl font-bold">{pokemon.name}</h2>
                  <span className="bg-white bg-opacity-20 text-sm font-bold px-2 py-1 rounded-full text-gray-500">
                    #{String(pokemon.id).padStart(3, "0")}
                  </span>
                </div>

                <div className="flex gap-2 mb-4 justify-center md:justify-start flex-wrap">
                  {pokemon.types.map((type, idx) => (
                    <span key={idx} className="text-sm px-3 py-1 rounded-full capitalize bg-white text-gray-500 font-semibold bg-opacity-20">
                      {type.type.name}
                    </span>
                  ))}
                </div>

                <div className="text-sm bg-white text-gray-500 font-semibold bg-opacity-10 p-3 rounded-lg">
                  {pokemonSpecies ? getFlavorText() : "Cargando información..."}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              {["info", "stats", "moves"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "info" ? "Información" : tab === "stats" ? "Estadísticas" : "Movimientos"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6">
              {activeTab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Physical characteristics */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3 text-gray-800">Características</h3>
                    <div className="grid grid-cols-2 gap-4 text-gray-700">
                      <div>
                        <p className="text-sm text-gray-500">Altura</p>
                        <p className="font-medium">{pokemon.height / 10} m</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Peso</p>
                        <p className="font-medium">{pokemon.weight / 10} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Experiencia Base</p>
                        <p className="font-medium">{pokemon.base_experience}</p>
                      </div>
                      {pokemonSpecies && (
                        <div>
                          <p className="text-sm text-gray-500">Tasa de captura</p>
                          <p className="font-medium">{pokemonSpecies.capture_rate}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Abilities */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3 text-gray-800">Habilidades</h3>
                    <div className="space-y-2">
                      {pokemon.abilities.map((ability, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-700">
                          <Award size={16} className="text-yellow-500" />
                          <span className="capitalize">{ability.ability.name.replace("-", " ")}</span>
                          {ability.is_hidden && (
                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">Oculta</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Estadísticas base</h3>
                  {pokemon.stats.map((stat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="w-6">{STAT_ICONS[stat.stat.name]}</span>
                        <span className="capitalize">{stat.stat.name.replace("-", " ")}</span>
                        <span className="ml-auto font-bold">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (stat.base_stat / 255) * 100)}%`,
                            backgroundColor: TYPE_COLORS[pokemon.types[0].type.name],
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "moves" && (
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Movimientos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {pokemon.moves.slice(0, 15).map((move, idx) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded capitalize text-sm text-gray-700">
                        {move.move.name.replace("-", " ")}
                      </div>
                    ))}
                    {pokemon.moves.length > 15 && (
                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-500">
                        Y {pokemon.moves.length - 15} más...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PokemonDetail

