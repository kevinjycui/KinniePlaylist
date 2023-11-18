import React, { useState, useEffect } from 'react';

import Character from './Character'

import './Home.css';

function Home() {

  const [characters, setCharacters] = useState([]);

  useEffect(() => {

    async function getCharacters() {
      const response = await fetch('/api/characters');
      const json = await response.json();
      setCharacters([...json.characters]);
    }

    getCharacters();

  }, []);

  return (
    <>
      {
        characters.sort((a, b) => {
          var nameA = JSON.parse(a).name.toUpperCase();
          var nameB = JSON.parse(b).name.toUpperCase();
          return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
        }).map(character => (
          <div className='Home-characterModule'>
            <Character 
                key={JSON.parse(character).character_id} 
                data={JSON.parse(character)}
                />
          </div>
        ))
      }
    </>
  );
}

export default Home;