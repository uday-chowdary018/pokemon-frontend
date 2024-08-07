
import React, { useState, useEffect, useRef } from 'react';

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetching Pokémon owners
    const fetchUsers = async () => {
      try {
       const response = await fetch('http://localhost:8080/api/pokemon-owners');
     //  const response = await fetch('https://pokemon-backend-production-b16f.up.railway.app/api/pokemon-owners');

       const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching Pokémon owners:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetching Pokémon based on selected user
    const fetchPokemons = async () => {
      if (selectedUser) {
        try {
         const response = await fetch(`http://localhost:8080/api/pokemons/owner/${selectedUser}`);
     //   const response = await fetch(`https://pokemon-backend-production-b16f.up.railway.app/api/pokemons/owner/${selectedUser}`);

        const data = await response.json();
          setPokemons(data);
          
        //  const detailsResponse = await fetch(`https://pokemon-backend-production-b16f.up.railway.app/api/pokemons/owner/${selectedUser}`);
        const detailsResponse = await fetch(`http://localhost:8080/api/pokemons/owner/${selectedUser}`);
        const detailsData = await detailsResponse.json();
          setPokemonDetails(detailsData);
        } catch (error) {
          console.error('Error fetching Pokémon:', error);
        }
      }
    };
    fetchPokemons();
  }, [selectedUser]);

  const handleSelectPokemon = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleGo = () => {
    console.log("Pokemon Go button clicked");
    if (selectedPokemon) {
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const newPokemons = pokemons.map(p => {
          if (p.pokemonName === selectedPokemon.pokemonName && !p.isFrozen) {
            let directionInRadians;
            switch (p.direction) {
              case 'east': directionInRadians = 0; break;
              case 'north': directionInRadians = Math.PI / 2; break;
              case 'west': directionInRadians = Math.PI; break;
              case 'south': directionInRadians = 3 * Math.PI / 2; break;
              default:
                console.warn('Unknown direction:', p.direction);
                directionInRadians = 0;
            }

            const speed = Number(p.speed); 
            const initialPositionX = Number(p.initialPositionX); 
            const initialPositionY = Number(p.initialPositionY); 

            if (isNaN(speed) || isNaN(initialPositionX) || isNaN(initialPositionY)) {
              console.error('Invalid speed or position values:', { speed, initialPositionX, initialPositionY });
              return p;
            }

            const newPositionX = initialPositionX + speed * Math.cos(directionInRadians);
            const newPositionY = initialPositionY + speed * Math.sin(directionInRadians);

            
            const isOutOfBounds = newPositionX < 0 || newPositionX > containerWidth ||
                                  newPositionY < 0 || newPositionY > containerHeight;

            if (isOutOfBounds) {
              return { ...p, isVisible: false };
            } else {
              return { ...p, initialPositionX: newPositionX, initialPositionY: newPositionY, isVisible: true };
            }
          }
          return p;
        });

        console.log("Updated Pokémon State:", newPokemons);
        setPokemons(newPokemons);
      }
    }
  };

  const handleFlee = () => {
    if (selectedPokemon) {
      const newPokemons = pokemons.map(p => p.pokemonName === selectedPokemon.pokemonName ? { ...p, isVisible: !p.isVisible } : p);
      setPokemons(newPokemons);
    }
  };

  const handleCease = () => {
    if (selectedPokemon) {
      const newPokemons = pokemons.map(p => p.pokemonName === selectedPokemon.pokemonName ? { ...p, isFrozen: !p.isFrozen } : p);
      setPokemons(newPokemons);
    }
  };

  return (
    <div className='home-page-container'>
      <h1>Pokemon Home Page</h1>
      <div>
        <label><h2>Select User:</h2></label>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select a Pokémon Owner</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        {pokemonDetails && (
          <div>
            <h2>List of Pokémon {pokemonDetails.name}</h2>
            <table className='home-page-table'>
              <thead>
                <tr>
                  <th>Pokémon Name</th>
                  <th>Pokémon Ability</th>
                  <th>Number of Pokémon</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {pokemons.map(pokemon => (
                  <tr key={pokemon.pokemonName}>
                    <td>{pokemon.pokemonName}</td>
                    <td>{pokemon.pokemonAbility}</td>
                    <td>{pokemon.pokemonCount}</td>
                    <td>
                      <button className='select-pokemon' onClick={() => handleSelectPokemon(pokemon)}>Select</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className='disable'>
        <button className='pokemon-go-button' onClick={handleGo} disabled={!selectedPokemon}>Pokemon Go</button>
        <button className='pokemon-flee-button' onClick={handleFlee} disabled={!selectedPokemon}>Pokemon Flee</button>
        <button className='pokemon-cease-button' onClick={handleCease} disabled={!selectedPokemon}>Pokemon Cease</button>
      </div>

      <div ref={containerRef} style={{ position: 'relative', width: '50%', height: '150px', border: '1px solid black', marginTop: '10px' }}>
        {pokemons
          .filter(pokemon => pokemon.pokemonName === selectedPokemon?.pokemonName)
          .map(pokemon => (
            <div
              key={pokemon.pokemonName}
              className='home-pokemon-container'
              style={{
                position: 'absolute',
                top: `${pokemon.initialPositionY}px`,
                left: `${pokemon.initialPositionX}px`,
                display: pokemon.isVisible ? 'block' : 'none',
                backgroundColor: 'lightgreen',
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid darkgreen'
              }}
            >
              <div>{pokemon.pokemonName}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default HomePage;



