
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPokemonPage = () => {
  const [pokemonOwners, setPokemonOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState('');
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonAbility, setPokemonAbility] = useState('');
  const [numberOfPokemon, setNumberOfPokemon] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemonOwners = async () => {
      try {
       const response = await fetch('http://localhost:8080/api/pokemon-owners');
   //  const response = await fetch('https://pokemon-backend-production-b16f.up.railway.app/api/pokemon-owners');

     const data = await response.json();
        if (Array.isArray(data)) {
          setPokemonOwners(data);
        } else {
          console.error('Unexpected API response format for Pokémon owners:', data);
        }
      } catch (error) {
        console.error('Error fetching Pokémon owners:', error);
      }
    };

    fetchPokemonOwners();
  }, []);
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Find the owner name based on the selectedOwner ID
    const selectedOwnerName = pokemonOwners.find(owner => owner.id === parseInt(selectedOwner)).name;

    const newPokemon = {
      pokemonName,
      pokemonAbility,
      numberOfPokemon: parseInt(numberOfPokemon, 10), 
    };

    const response = await fetch('http://localhost:8080/api/pokemons', {
   // const response = await fetch('https://pokemon-backend-production-b16f.up.railway.app/api/pokemons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pokemonOwnerName: selectedOwnerName, 
        pokemonName,
        pokemonAbility,
        initialPositionX: 0,
        initialPositionY: 0, 
        speed: 0,
        direction: 'NORTH',
        numberOfPokemon: parseInt(numberOfPokemon, 10),
      }),
    });

    if (response.ok) {
      console.log('Successfully added Pokémon');
      navigate('/'); 
    } else {
      console.error('Failed to add Pokémon');
    }
  } catch (error) {
    console.error('Error submitting Pokémon data:', error);
  }
};


  return (
    <div className='add-pokemon-container'>
      <h1>Add Pokemon</h1>
      <form onSubmit={handleSubmit}>
        <div>
          Pokemon Owner:
          <select value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)} required>
            <option value="">Select a Pokemon Owner</option>
            {pokemonOwners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}  
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Pokemon Name:</label>
          <input
            type="text"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Pokemon Ability:</label>
          <input
            type="text"
            value={pokemonAbility}
            onChange={(e) => setPokemonAbility(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Number of Pokemon:</label>
          <input
            type="number"
            value={numberOfPokemon}
            onChange={(e) => setNumberOfPokemon(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Pokemon</button>
      </form>
    </div>
  );
};

export default AddPokemonPage;
