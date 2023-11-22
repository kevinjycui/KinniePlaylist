import React, { useState, useEffect } from 'react';

import CharacterButton from './CharacterButton'
import SearchBar from './SearchBar'
import './Home.css';
import { apiJson } from '../api/apiUtil';

function Home() {

  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);

  useEffect(() => {

    async function getCharacters() {
      const charactersData = await apiJson('/api/characters');
      if (charactersData.status === 200) {
        setCharacters([...charactersData.response.characters.map((data) => JSON.parse(data))]);
      }
    }

    getCharacters();

  }, []);

  return (
    <>
      <>
        <SearchBar characters={characters} setFilteredCharacters={setFilteredCharacters} />
        <div className='Home-container'>
          {filteredCharacters.length === 0 ? <div className="empty">Nobody here... Try changing your search?</div> : filteredCharacters.sort((a, b) => {
            var nameA = a.name.toUpperCase();
            var nameB = b.name.toUpperCase();
            return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
          }).map(character => (
            <div className='Home-characterModule' key={character.character_id}>
              <CharacterButton
                key={character.character_id}
                data={character}
              />
            </div>
          ))}
        </div>
      </>
      <div className="buffer"></div>
    </>
  );
}

export default Home;