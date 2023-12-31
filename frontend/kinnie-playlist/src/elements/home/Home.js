import React, { useState, useEffect, Suspense, lazy } from 'react';

import SearchBar from './SearchBar';
import './Home.css';
import { apiJson } from '../../api/apiUtil';

const CharacterButton = lazy(() => import('../CharacterButton'));

function Home() {

    const [characters, setCharacters] = useState([]);
    const [filteredCharacters, setFilteredCharacters] = useState([]);

    useEffect(() => {
        document.title = "Kinnie Playlist";

        async function getCharacters() {
            const charactersData = await apiJson('/api/characters');
            if (charactersData.status === 200) {
                setCharacters(charactersData.response.characters.map((data) => JSON.parse(data)));
            }
        }

        getCharacters();

    }, []);

    return (
        <>
            <>
                <SearchBar characters={characters} setFilteredCharacters={setFilteredCharacters} />
                <div className='Home'>
                    <div className='Home-container'>
                        {filteredCharacters.length === 0 ? <div className="empty">Nobody here... Try changing your search?</div> :
                            filteredCharacters.sort((a, b) => {
                                var nameA = a.name.toUpperCase().replace(/[^a-z0-9 ]/gi, '');
                                var nameB = b.name.toUpperCase().replace(/[^a-z0-9 ]/gi, '');
                                return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
                            }).map(character => (
                                <div className='Home-characterModule' key={character.character_id}>
                                    <Suspense fallback={<></>}>
                                        <CharacterButton
                                            data={character}
                                        />
                                    </Suspense>
                                </div>
                            ))}
                    </div>
                </div>
            </>
            <div className="buffer"></div>
        </>
    );
}

export default Home;