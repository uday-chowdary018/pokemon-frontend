
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddPokemon = () => {
  const { userId, pokemonId } = useParams();
  const navigate = useNavigate(); 
  const [pokemonNames, setPokemonNames] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState('');
  const [pokemonAbilities, setPokemonAbilities] = useState([]);
  const [formData, setFormData] = useState({
    pokemonOwnerName: '',
    pokemonName: '',
    pokemonAbility: '',
    initialPositionX: '',
    initialPositionY: '',
    speed: '',
    direction: ''
  });

  useEffect(() => {
    const fetchPokemonNames = async () => {
      try {
     const response = await fetch('http://localhost:8080/api/pokemons');
    //  const response = await fetch('https://pokemon-backend-production-b16f.up.railway.app/api/pokemons');

      const data = await response.json();
        if (Array.isArray(data)) {
          setPokemonNames(data.map(pokemon => pokemon.pokemonName.trim()));
        } else {
          console.error('Unexpected API response format for Pokémon names:', data);
        }
      } catch (error) {
        console.error('Error fetching Pokémon names:', error);
      }
    };

    fetchPokemonNames();
  }, []);

  useEffect(() => {
    const fetchPokemonAbilities = async () => {
      if (selectedPokemon) {
        try {
          const response = await fetch(`http://localhost:8080/api/pokemons/name/${selectedPokemon}`);
       //  const response = await fetch(`https://pokemon-backend-production-b16f.up.railway.app/api/pokemons/name/${selectedPokemon}`);

         const data = await response.json();
          if (data && data.pokemonAbility) {
            setPokemonAbilities([data.pokemonAbility]); 
          } else {
            console.error('Unexpected API response format for Pokémon abilities:', data);
          }
        } catch (error) {
          console.error('Error fetching Pokémon abilities:', error);
        }
      }
    };

    fetchPokemonAbilities();
  }, [selectedPokemon]);

  useEffect(() => {
    const fetchExistingPokemonData = async () => {
      if (pokemonId) {
        try {
         const response = await fetch(`http://localhost:8080/api/pokemons/${pokemonId}`);
      // const response = await fetch(`https://pokemon-backend-production-b16f.up.railway.app/api/pokemons/${pokemonId}`);

       const data = await response.json();
          setFormData(data);
          setSelectedPokemon(data.pokemonName);
        } catch (error) {
          console.error('Error fetching Pokémon data:', error);
        }
      }
    };

    fetchExistingPokemonData();
  }, [pokemonId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //url changed
      const url = pokemonId
        ? `http://localhost:8080/api/pokemons/${pokemonId}`
        : `http://localhost:8080/api/pokemons`;
      const method = pokemonId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Success:', data);
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting Pokémon data:', error);
    }
  };

  return (
    <div className='PokenonUser-container'>
      <h1>{pokemonId ? 'Edit' : 'Add'} Pokemon</h1>
      <form onSubmit={handleSubmit}>
        <div>
       
        <label>Pokemon Owner Name:</label> <input
            type="text"
            name="pokemonOwnerName"
            value={formData.pokemonOwnerName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Pokemon Name:</label>
          <select
            name="pokemonName"
            value={formData.pokemonName}
            onChange={(e) => {
              setSelectedPokemon(e.target.value);
              handleChange(e);
            }}
          >
            <option value="">Select a Pokemon</option>
            {pokemonNames.length > 0 ? (
              pokemonNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))
            ) : (
              <option disabled>Loading...</option>
            )}
          </select>
        </div>
        <div>
          <label>Pokemon Ability:</label>
          <select
            name="pokemonAbility"
            value={formData.pokemonAbility}
            onChange={handleChange}
          >
            <option value="">Select an Ability</option>
            {pokemonAbilities.length > 0 ? (
              pokemonAbilities.map((ability, index) => (
                <option key={index} value={ability}>
                  {ability}
                </option>
              ))
            ) : (
              <option disabled>Loading...</option>
            )}
          </select>
        </div>
        <div>
          <label>Initial Position X:</label>
          <input
            type="number"
            name="initialPositionX"
            value={formData.initialPositionX}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Initial Position Y:</label>
          <input
            type="number"
            name="initialPositionY"
            value={formData.initialPositionY}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Speed:</label>
          <input
            type="number"
            name="speed"
            value={formData.speed}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Direction:</label>
          <input
            type="text"
            name="direction"
            value={formData.direction}
            onChange={handleChange}
          />
        </div>
        <button className='add-button' type="submit">{pokemonId ? 'Update' : 'Add'} Pokémon</button>
      </form>
    </div>
  );
};

export default AddPokemon;


