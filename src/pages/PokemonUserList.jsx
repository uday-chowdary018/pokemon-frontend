import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdAddBox } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const PokemonUserList = () => {
  const [pokemonUsers, setPokemonUsers] = useState([]);

  useEffect(() => {
    const fetchPokemonUsers = async () => {
      try {
      //  const response = await fetch('http://localhost:8080/api/pokemons');
      const response = await fetch('https://pokemon-backend-production-bdc0.up.railway.app/api/pokemons');

      const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setPokemonUsers(data);
        } else {
          console.error('Unexpected API response format:', data);
        }
      } catch (error) {
        console.error('Error fetching Pokémon users:', error);
      }
    };

    fetchPokemonUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
    //  await fetch(`http://localhost:8080/api/pokemons/${userId}`, {
      await fetch(`https://pokemon-backend-production-bdc0.up.railway.app/api/pokemons/${userId}`, {
    method: 'DELETE',
      });
      setPokemonUsers(pokemonUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className='pokemon-user-list-container'>
      <h1>List of Pokemon Users</h1>
      <table className='table-container'>
        <thead>
          <tr>
            <th>Pokemon Owner Name</th>
            <th>Pokemon Name</th>
            <th>Pokemon Ability</th>
            <th>No. of Pokemon</th>
            <th>Add Pokemon</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pokemonUsers) ? (
            pokemonUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.pokemonName}</td>
                <td>{user.pokemonAbility}</td>
                <td>{user.pokemonCount}</td>
                <td>
                  <Link to={`/add-pokemon/${user.id}`}><MdAddBox /></Link>
                </td>
                <td>
                  <Link className='' to={`/edit-user/${user.id}`}><FaEdit /></Link>
                </td>
                <td>
                  <button className='delete-button' onClick={() => handleDeleteUser(user.id)}><MdDelete /></button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7">No users available.</td></tr>
          )}
        </tbody>
      </table>
      <button className='delete-all-button' onClick={() => setPokemonUsers([])}>Delete All</button>
    </div>
  );
};

export default PokemonUserList;
