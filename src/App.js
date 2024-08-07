import React from "react";

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PokemonUserList from './pages/PokemonUserList';
import AddPokemon from './pages/PokemonUser';
import AddPokemonPage from "./pages/AddPokemon";
import HomePage from "./pages/HomePage";


const App = ()=>{
  return (
    <Router>
      <Routes>
        <Route path="/HomePage" element={<HomePage/>}/>
        <Route path="/AddPokemon" element={<AddPokemon/>}/>
        <Route path="/" element={<PokemonUserList/>}/>
        <Route path="/add-pokemon/:userId" element={<AddPokemonPage/>}/>
        <Route path="/edit-user/:userId"  element={<AddPokemon/>}/>
      </Routes>
    </Router>
  )
}

export default App;
